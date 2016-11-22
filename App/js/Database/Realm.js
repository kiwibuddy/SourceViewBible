/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
import Emdros from '../API/Emdros';

const RNFS = require('react-native-fs');

import {
  Colors,
  Localizable,
} from '../Common';

function bookNameInText(text: string) {
  const regex = /([1-3]?\s?[A-Z]*)/gi;
  const match = text.match(regex);
  if (match && match.length > 0) {
    return match[0].trim();
  }
  return null;
}

function BookReferencesInText(text: string) {
  return Book.all().filtered('name CONTAINS[c] $0 OR DJHRef BEGINSWITH[c] $0', text).sorted('textOrder');
}

function BCVReferencesInText(text: string) {
  const matches = [];

  const regex = /([1-3]?\s?[A-Z]*)\s?([0-9]{1,3})?(?:\\:([0-9]{1,3}))?/gi;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    matches.push(m);
  }
  if (matches.length < 1) return null;

  const match = matches[0];
  const bookName = match[1].trim();
  const books = BookReferencesInText(bookName);
  if (books.length > 0) {
    const references = [];

    if (match.length > 2 && match[2] !== undefined) {
      const chapterNumber = parseInt(match[2]);
      books.forEach(book => {
        if (!isNaN(chapterNumber) && chapterNumber <= book.chapterCount) {
          const chapter = book.chapters[chapterNumber - 1];

          if (matches.length > 1 && matches[2] !== undefined && matches[2][0] !== undefined) {
            const verseNumber = parseInt(matches[2][0]);
            if (!isNaN(verseNumber)) {
              if (verseNumber > 0 && verseNumber <= chapter.verseCount) {
                references.push({book, chapterNumber, verseNumber});
              }
            } else {
              references.push({book, chapterNumber});
            }
          } else {
            references.push({book, chapterNumber});
          }
        }
      });
    }

    return references;
  }

  return null;
}

function BSOReferencesInText(text: string) {
  const matches = [];

  const regex = /([1-3]?\s?[A-Z]*)\s?([A-Z\D]*)\s?([0-9]{1,3})?/gi;

  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    matches.push(m);
  }
  if (matches.length < 1) return null;

  const match = matches[0];
  const bookName = match[1].trim();
  const books = BookReferencesInText(bookName);
  if (books.length > 0) {
    const references = [];

    if (match.length > 2 && match[2] !== undefined) {
      const sourceName = match[2].trim();
      if (sourceName.length > 0) {
        books.forEach(book => {
          const sourceRelations = book.sourceRelations.filtered('source.name BEGINSWITH[c] $0', sourceName);
          if (sourceRelations.length > 0) {
            const sources = sourceRelations.map(relation => relation.source).sort((a,b) => a.name > b.name ? 1 : -1);

            sources.forEach(source => {
              if (match[3] !== undefined) {
                const occurrenceNumber = parseInt(match[3]);
                if (!isNaN(occurrenceNumber)) {
                  // FIXME: Remove once all statements are in
                  references.push({book, source, occurrenceNumber});
                }
              } else {
                references.push({book, source});
              }
            });
          }
        });
      }

      return references;
    }
  }

  return null;
}

const BibleSchema = {
  name: 'Bible',
  primaryKey: 'id',
  properties: {
    id: 'int',
    wordCount: 'int',
    words: {type: 'list', objectType: 'Count'},
  }
};

export class Bible extends Realm.Object {
  static get wordCount() {
    const bible = realm.objects('Bible')[0];
    return bible.wordCount;
  }

  static get words() {
    const bible = realm.objects('Bible')[0];
    return bible.words;
  }

  static get oldTestamentWordCount() {
    return Book.whereIn(Book.identifiers(0)).reduce((wordCount, book) => wordCount + book.wordCount, 0);
  }

  static get newTestamentWordCount() {
    return Book.whereIn(Book.identifiers(1)).reduce((wordCount, book) => wordCount + book.wordCount, 0);
  }


  // {"bcv": [], "bso": [], "books": []}
  static searchReferences(text: string): Object {
    const references = {};
    if (!text) return references;

    const bookName = bookNameInText(text);
    if (!bookName) return references;

    const bcvReferences = BCVReferencesInText(text);
    if (bcvReferences && bcvReferences.length > 0) {
      references["bcv"] = bcvReferences;
    }

    const bsoReferences = BSOReferencesInText(text);
    if (bsoReferences && bsoReferences.length > 0) {
      references["bso"] = bsoReferences;
    }

    const books = BookReferencesInText(bookName).map(book => ({book}));
    if (books.length > 0) {
      references["books"] = books;
    }

    return references;
  }
}
Bible.schema = BibleSchema;

const ActantSchema = {
  name: 'Actant',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: {type: 'string', indexed: true},
    firstInitial: {type: 'string', optional: true},
    gender: 'int',
    natures: {type: 'list', objectType: 'Nature'},
    actantNumber: {type: 'int', optional: true},
    chronologies: {type: 'list', objectType: 'Chronology'},
    professions: {type: 'list', objectType: 'Profession'},
    isSource: 'bool',
    isRecipient: 'bool',
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'other'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export class Actant extends Realm.Object {
  static all() {
    return realm.objects('Actant');
  }

  static findByID(id: number) {
    return realm.objectForPrimaryKey('Actant', id ? parseInt(id) : 0);
  }

  static recipients(search: ?string) {
    const recipients = realm.objects('Actant').filtered('isRecipient = $0', true);
    if (search) return recipients.filtered('name CONTAINS[c] $0', search);
    return recipients;
  }

  static sources(search: ?string, filters?: Object) {
    let sources = realm.objects('Actant').filtered('isSource = $0', true);
    if (search) sources = sources.filtered('name CONTAINS[c] $0', search);

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        switch (filter.type) {
          case 'chronology':
            sources = sources.filtered('chronologies.id = $0', filter.chronologyID);
            break;

          case 'gender':
            sources = sources.filtered('gender = $0', filter.genderID);
            break;

          case 'nature':
            sources = sources.filtered('natures.id = $0', filter.natureID);
            break;

          case 'profession':
            sources = sources.filtered('professions.id = $0', filter.professionID);
            break;

          case 'role':
            const role = Role.findByID(filter.roleID);
            sources = sources.filtered('principalSourceType = $0', role.key);
            break;
        }
      });
    }

    return sources;
  }

  relationForBook(book: ?Object) {
    return (book ? book.sourceRelations.find(relation => relation.source.id === this.id) : null);
  }

  colorsForBook(book: ?Object) {
    const sourceRelation = this.relationForBook(book);
    if (sourceRelation) return sourceRelation.colors;
    return Colors.sources.other;
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }

  get books(): Array<Object> {
    return SourceRelation.whereSource(this).map(relation => relation.book);
  }

  get bookCount(): number {
    return this.books.length;
  }

  get isDivine(): boolean {
    return this.natures.find(nature => nature.id == 3) !== undefined;
  }

  get isHuman(): boolean {
    return this.natures.find(nature => nature.id == 4) !== undefined;
  }

  get isIndividual(): boolean {
    return this.actantNumber == 2;
  }

  get hasGender(): boolean {
    return this.gender == 1 || this.gender == 2;
  }

  get isFemale(): boolean {
    return this.gender == 1;
  }

  get isAngelic(): boolean {
    return this.natures.find(nature => nature.id == 1) !== undefined;
  }

  get isDemonic(): boolean {
    return this.natures.find(nature => nature.id == 2) !== undefined;
  }

  get iconName(): string {
    let iconName = null;
    if (this.isDivine) {
      iconName = 'avatar-divine';
    } else if (this.isHuman) {
      if (this.isIndividual && this.hasGender) {
        iconName = this.isFemale ? 'avatar-human-female' : 'avatar-human-male';
      } else {
        iconName = 'avatar-human-group';
      }
    } else if (this.isAngelic) {
      iconName = 'avatar-angelic';
    } else if (this.isDemonic) {
      iconName = 'avatar-demonic';
    } else if (this.principalSourceType === 'narrator') {
      iconName = 'avatar-narrator';
    }

    return iconName || 'avatar-other';
  }

  get actantNumberDescription(): ?string {
    switch(this.actantNumber) {
      case 1:
        return Localizable.t('actant-number.Group');

      case 2:
        return Localizable.t('actant-number.Individual');

      default:
        return null;
    }
  }

  get chronologyDescription(): ?string {
    if (this.chronologies.length > 4) return '∞';
    return this.chronologies.sorted('from').map(chronology => chronology.name).join(', ');
  }

  get genderDescription(): ?string {
    switch(this.gender) {
      case 1:
        return Localizable.t('gender-female');

      case 2:
        return Localizable.t('gender-male');

      default:
        return null;
    }
  }

  get natureDescription(): ?string {
    return this.natures.map(nature => nature.name).join(', ');
  }

  get professionDescription(): ?string {
    return this.professions.filtered('searchable = $0', true).map(profession => profession.name).sort((a,b) => a > b ? 1 : -1).join(', ');
  }

  get roles(): any {
    return this.sourceTypeCounts.filtered('count > 0').map(sourceTypeCount => Role.findByID(sourceTypeCount.string));
  }

  get roleDescription(): ?string {
    const roles = this.roles;
    return (roles && roles.length > 0 ? roles.map(role => role.name).join(', ') : null);
  }
}
Actant.schema = ActantSchema;

const BookSchema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: 'string',
    DJHRef: 'string',
    name: {type: 'string', indexed: true},
    testament: 'int',
    textOrder: {type: 'int', indexed: true},
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    maxChapterWordCount: {type: 'int', default: 0},
    maxSourceWordCount: {type: 'int', default: 0},
    maxChapterSphereWordCount: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceRelations: {type: 'list', objectType: 'SourceRelation'},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    overview: {type: 'list', objectType: 'Content'},
  }
};

export class Book extends Realm.Object {
  static all() {
    return realm.objects('Book');
  }

  static findByID(id: any) {
    if (Number.isInteger(id)) {
      return realm.objects('Book').find(book => book.textOrder == id);
    }

    return realm.objectForPrimaryKey('Book', id || '');
  }

  static findByDJHRef(DJHRef: string) {
    return realm.objects('Book').find(book => book.DJHRef === DJHRef);
  }

  static whereIn(ids: any, options: ?Object) {
    if (ids.length == 0) return [];
    const filter = ids.map((id, index) => `id = $${index}`).join(' OR ');
    let books = realm.objects('Book').filtered(filter, ...ids);
    if (options && options.sorted) {
      books = books.sorted('textOrder');
    }
    return books;
  }

  static identifiers(testament: ?number): Array<string> {
    let books = Book.all();
    if (testament != null) {
      books = books.filtered('testament = $0', testament);
    }
    return books.map(book => book.id);
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }

  get monadSet(): Object {
    return {
      first: this.firstMonad,
      last: this.lastMonad
    };
  }
}
Book.schema = BookSchema;

const BookSourceOccurrenceSchema = {
  name: 'BookSourceOccurrence',
  primaryKey: 'id',
  properties: {
    id: 'int',
    book: 'Book',
    name: 'string',
    number: 'int',
    roleID: 'int',
    firstMonad: 'int',
    lastMonad: 'int',
    reference: 'string',
  }
};

export class BookSourceOccurrence extends Realm.Object {
  static MAXIMUM_NUMBER_OF_DISPLAYABLE_OCCURRENCES = 500;

  static findByID(id: number) {
    return realm.objectForPrimaryKey('BookSourceOccurrence', id || 0);
  }

  get monadSet(): Object {
    return {
      first: this.firstMonad,
      last: this.lastMonad
    };
  }

  get role(): Role {
    return Role.findByID(this.roleID);
  }
}
BookSourceOccurrence.schema = BookSourceOccurrenceSchema;

const ChapterSchema = {
  name: 'Chapter',
  primaryKey: 'id',
  properties: {
    id: 'string',
    chapterNumber: 'int',
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    verseCount: {type: 'int', default: 0},
  }
};

export class Chapter extends Realm.Object {
  get monadSet(): Object {
    return {
      first: this.firstMonad,
      last: this.lastMonad
    };
  }
}
Chapter.schema = ChapterSchema;

const ChronologySchema = {
  name: 'Chronology',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
    from: {type: 'int', indexed: true},
    to: 'int',
  }
};

export class Chronology extends Realm.Object {
  static all() {
    return realm.objects('Chronology').sorted('from');
  }

  static findByID(id: number) {
    return realm.objectForPrimaryKey('Chronology', id ? parseInt(id) : 0);
  }

  static whereInRange(from: Chronology, to: Chronology) {
    return realm.objects('Chronology').filtered('from >= $0 AND to <= $1', from.from, to.to);
  }

  static whereIn(ids: any) {
    if (ids.length == 0) return [];
    const filter = ids.map((id, index) => `id = $${index}`).join(' OR ');
    return realm.objects('Chronology').filtered(filter, ...ids).sorted('from');
  }

  get name(): string {
    return Localizable.t('chronologies.' + this.key);
  }
}
Chronology.schema = ChronologySchema;

const ContentSchema = {
  name: 'Content',
  properties: {
    title: {type: 'string', optional: true},
    body: 'string',
  }
};

export class Content extends Realm.Object {

}
Content.schema = ContentSchema;

const CountSchema = {
  name: 'Count',
  properties: {
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

export class Count extends Realm.Object {

}
Count.schema = CountSchema;

export class Gender {
  static GENDER = ['female', 'male'];
  static MALE_AND_FEMALE = [2,1];

  id: number;
  key: string;

  constructor(id: number, key: string) {
    this.id = id;
    this.key = key;
  }

  static findByID(id: number) {
    const key = Gender.GENDER[id - 1];
    return new Gender(id, key);
  }

  get name(): string {
    return Localizable.t('gender-' + this.key);
  }
}

const MonadSetSchema = {
  name: 'MonadSet',
  properties: {
    firstMonad: 'int',
    lastMonad: 'int',
    book: 'Book',
    chapter: 'int',
    verse: 'int',
  }
}
export class MonadSet extends Realm.Object {
  get monadSet(): Object {
    return {
      first: this.firstMonad,
      last: this.lastMonad
    };
  }
}
MonadSet.schema = MonadSetSchema;

const NatureSchema = {
  name: 'Nature',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
};

export class Nature extends Realm.Object {
  static findByID(id: number) {
    return realm.objectForPrimaryKey('Nature', id ? parseInt(id) : 0);
  }

  static findByKey(key: string) {
    return realm.objects('Nature').filtered('key = $0', key)[0];
  }

  get name(): string {
    return Localizable.t('natures.' + this.key);
  }
}
Nature.schema = NatureSchema;

const ProfessionSchema = {
  name: 'Profession',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
    searchable: {type: 'bool', default: true}
  }
}

export class Profession extends Realm.Object {
  static all() {
    return realm.objects('Profession').filtered('searchable = $0', true).sorted('key');
  }

  static findByID(id: number) {
    return realm.objectForPrimaryKey('Profession', id ? parseInt(id) : 0);
  }

  get name(): string {
    return Localizable.t('professions.' + this.key);
  }
}
Profession.schema = ProfessionSchema;

export class Role {
  static ROLES = ['narrator', 'god', 'lead', 'support'];
  static Narrator = 1;
  static God = 2;
  static Lead = 3;
  static Support = 4;

  id: number;
  key: string;

  constructor(id: number, key: string) {
    this.id = id;
    this.key = key;
  }

  static findByID(id: any) {
    const key = (Number.isInteger(id) ? Role.ROLES[id - 1] : id);
    return new Role(id, key);
  }

  static findByKey(key: string) {
    const id = Role.ROLES.indexOf(key) + 1;
    return new Role(id, key);
  }

  static IDForKey(key: string) {
    let roleID = null;
    switch (key) {
      case 'narrator':
        roleID = 1;
        break;

      case 'god':
        roleID = 2;
        break;

      case 'lead':
        roleID = 3;
        break;

      case 'support':
        roleID = 4;
        break;
    }
    return roleID;
  }

  get name(): string {
    return Localizable.t('roles.' + this.key);
  }

  color(color?: string): string {
    return Colors.sources[this.key][color || 'tint'];
  }
}

const SourceRelationSchema = {
  name: 'SourceRelation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    book: 'Book',
    source: 'Actant',
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'support'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export class SourceRelation extends Realm.Object {
  static whereSource(source: Actant) {
    return realm.objects('SourceRelation').filtered('source.id = $0', source.id);
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }

  get colors(): Object {
    return Colors.sources[this.principalSourceType];
  }

  get roles(): any {
    return this.sourceTypeCounts.filtered('count > 0').map(sourceTypeCount => Role.findByID(sourceTypeCount.string));
  }

  get roleDescription(): ?string {
    const roles = this.roles;
    return (roles && roles.length > 0 ? roles.map(role => role.name).join(', ') : null);
  }
}
SourceRelation.schema = SourceRelationSchema;

const SphereSchema = {
  name: 'Sphere',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    position: 'int',
    bookCount: {type: 'int', default: 0},
    bookCounts: {type: 'list', objectType: 'Count'},
    sourceCount: {type: 'int', default: 0},
    sourceCounts: {type: 'list', objectType: 'Count'},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    passages: {type: 'list', objectType: 'SpherePassage'},
    overview: {type: 'list', objectType: 'Content'},
  }
};

export class Sphere extends Realm.Object {
  static SPHERES = [
    'family',
    'economics',
    'government',
    'religion',
    'education',
    'communication',
    'celebration',
  ];

  static all(options: ?Object) {
    let spheres = realm.objects('Sphere');
    if (!options || options.foundational !== true) spheres = spheres.filtered('position > 0');
    return spheres.sorted('position');
  }

  static findByID(id: any) {
    const primaryKey = (Number.isInteger(id) ? Sphere.SPHERES[id - 1] : id) || '';
    return realm.objectForPrimaryKey('Sphere', primaryKey);
  }

  static whereIn(ids: any) {
    if (ids.length == 0) return [];
    const filter = ids.map((id, index) => `id = $${index}`).join(' OR ');
    return realm.objects('Sphere').filtered(filter, ...ids).sorted('position');
  }

  countOfBook(bookID: string): number {
    const count = this.bookCounts.find(count => count.string === bookID);
    return count && count.count || 0;
  }

  countOfBible(testament: ?number): number {
    const books = Book.identifiers(testament);
    const filter = books.map((book, index) => `string = $${index}`).join(' OR ');
    return this.bookCounts.filtered(filter, ...books).reduce((count, book) => count + book.count, 0);
  }

  countOfSource(actantID: number): number {
    const string = actantID.toString();
    const count = this.sourceCounts.find(count => count.string === string);
    return count && count.count || 0;
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  color(color?: string): string {
    return Colors.spheres[this.id][color || 'tint'];
  }

  get isFoundational(): boolean {
    return this.position == 0;
  }
}
Sphere.schema = SphereSchema;

const SpherePassageSchema = {
  name: 'SpherePassage',
  properties: {
    section: 'string',
    number: 'int',
    title: 'string',
    reference: 'string',
    monads: {type: 'list', objectType: 'MonadSet'},
  }
}

export class SpherePassage extends Realm.Object {

}
SpherePassage.schema = SpherePassageSchema;

export class WordOccurrence {
  static async occurrences(word: string, options: Object) {
    return new Promise((resolve, reject) => {
      Emdros.wordOccurrences(word, options).then((result, error) => {
        if (result) {
          const occurrences = result.map(occurrence => {
            const book = Book.findByDJHRef(occurrence.DJHRef);
            const role = Role.findByID(occurrence.roleID);
            return (
              {
                id: occurrence.monad,
                book,
                name: occurrence.name,
                number: occurrence.number,
                roleID: occurrence.roleID,
                firstMonad: occurrence.monad,
                lastMonad: occurrence.monad,
                monadSet: occurrence.monadSet,
                reference: `${occurrence.chapter}:${occurrence.verse}`,
                role,
              }
            );
          });
          resolve(occurrences);
        } else {
          reject(error);
        }
      });
    });
  }
}

const Schema = [Actant, Bible, Book, BookSourceOccurrence, Chapter, Chronology, MonadSet, Nature, Profession, SourceRelation, Sphere, SpherePassage, Count, Content];

const realm = new Realm({
  schema: Schema,
  readOnly: true,
  encryptionKey: Emdros.key,
  ...Platform.select({
    ios: {
      path: RNFS.MainBundlePath + '/Datasets/en/NLT/SourceView.realm',
    },
    android: {
      path: RNFS.DocumentDirectoryPath + '/Datasets/en/NLT/SourceView.realm',
    }
  })
});
