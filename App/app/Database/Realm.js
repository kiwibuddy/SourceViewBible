/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
import Emdros from '../API/Emdros';
import SQLite from './SQLite';

const RNFS = require('react-native-fs');

import Predicate from './Predicate';
import ComparisonPredicate from './ComparisonPredicate';
import CompoundPredicate from './CompoundPredicate';
import WordPredicate from './WordPredicate';

import { Localizable } from '../Common';

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

                  const statements = source.statements.filtered('book.id = $0', book.id).sorted('sourceOccurrence', true);
                  if (false && statements.length > 0) {
                    const occurrence = statements[0];
                    if (occurrenceNumber > 0 && occurrenceNumber <= occurrence.sourceOccurrence) {
                      references.push({book, source, occurrenceNumber});
                    }
                  }
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

async function rowsWithSQL(sql: string, params?: any) {
  return new Promise((resolve, reject) => {
    SQLite.transaction((tx) => {
      tx.executeSql(sql, params, (tx, results) => {
          let rows = results.rows.raw();
          resolve(rows);
      });
    });
  });
}

const BibleSchema = {
  name: 'Bible',
  properties: {
    wordCount: 'int',
  }
};

export class Bible extends Realm.Object {
  static get wordCount() {
    const bible = realm.objects('Bible')[0];
    return bible.wordCount;
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
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
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

  static recipients(search?: string) {
    const recipients = realm.objects('Actant').filtered('isSource = $0', true);
    if (search) return recipients.filtered('name CONTAINS[c] $0', search);
    return recipients;
  }

  static sources(search?: string) {
    const sources = realm.objects('Actant').filtered('isSource = $0', true);
    if (search) return sources.filtered('name CONTAINS[c] $0', search);
    return sources;
  }

  static async valuesByWordCount(type: string, predicate: Predicate) {
    const options = {
      columns: [`${type}_statements.id AS actantID`],
      tables: [`${type}_statements`]
    };
    const statements = await Statement.identifiersMatchingPredicate(predicate, options);
    if (statements.count == 0) return [];

    const wordCounts = {};
    statements.reduce((wordCounts, statement) => {
      const actantID = statement.actantID;
      const wordCount = wordCounts[actantID] || 0;
      wordCounts[actantID] = wordCount + statement.wordCount;
      return wordCounts;
    }, wordCounts);

    return Object.keys(wordCounts).sort((a,b) => wordCounts[a] > wordCounts[b] ? -1 : 1).map(actantID => {
      const actant = Actant.findByID(actantID);
      return {object: actant, label: actant.name, value: wordCounts[actantID]};
    });
  }

  get actantNumberDescription(): ?String {
    switch(this.actantNumber) {
      case 1:
        return Localizable.t('actant-number.Group');

      case 2:
        return Localizable.t('actant-number.Individual');

      default:
        return null;
    }
  }

  get genderDescription(): ?String {
    switch(this.gender) {
      case 1:
        return Localizable.t('gender-female');

      case 2:
        return Localizable.t('gender-male');

      default:
        return null;
    }
  }

  get statements(): Realm.ResultList {
    return realm.objects('Statement').filtered('source.id = $0', this.id);
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

  static findByID(id: string) {
    return realm.objectForPrimaryKey('Book', id || '');
  }

  static async valuesByWordCount(predicate: Predicate) {
    const options = {
      columns: ['book_statements.id AS bookID'],
      tables: ['book_statements']
    };
    const statements = await Statement.identifiersMatchingPredicate(predicate, options);
    if (statements.count == 0) return [];

    const wordCounts = {};
    statements.reduce((wordCounts, statement) => {
      const bookID = statement.bookID;
      const wordCount = wordCounts[bookID] || 0;
      wordCounts[bookID] = wordCount + statement.wordCount;
      return wordCounts;
    }, wordCounts);

    return Object.keys(wordCounts).sort((a,b) => wordCounts[a] > wordCounts[b] ? -1 : 1).map(bookID => {
      const book = Book.findByID(bookID);
      return {object: book, label: book.name, value: wordCounts[bookID]};
    });
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

  get sources(): Realm.List {
    return this.sourceRelations.map(relation => relation.source);
  }
}
Book.schema = BookSchema;

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

  static async valuesByWordCount(predicate: Predicate) {
    const options = {
      columns: ['chronology_statements.id AS chronologyID'],
      tables: ['chronology_statements']
    };
    const statements = await Statement.identifiersMatchingPredicate(predicate, options);
    if (statements.count == 0) return [];

    const wordCounts = {};
    statements.reduce((wordCounts, statement) => {
      const chronologyID = statement.chronologyID;
      const wordCount = wordCounts[chronologyID] || 0;
      wordCounts[chronologyID] = wordCount + statement.wordCount;
      return wordCounts;
    }, wordCounts);

    return Object.keys(wordCounts).sort((a,b) => wordCounts[a] > wordCounts[b] ? -1 : 1).map(chronologyID => {
      const chronology = Chronology.findByID(chronologyID);
      return {object: chronology, label: chronology.name, value: wordCounts[chronologyID]};
    });
  }

  get name() {
    return Localizable.t('chronologies.' + this.key);
  }
}
Chronology.schema = ChronologySchema;

const ContentSchema = {
  name: 'Content',
  properties: {
    title: 'string',
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

const NatureSchema = {
  name: 'Nature',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
};

export class Nature extends Realm.Object {
  static findByKey(key: string) {
    return realm.objects('Nature').filtered('key = $0', key)[0];
  }

  get name() {
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
  }
}

export class Profession extends Realm.Object {
  static all() {
    return realm.objects('Profession').sorted('key');
  }

  get name() {
    return Localizable.t('professions.' + this.key);
  }
}
Profession.schema = ProfessionSchema;

const SourceRelationSchema = {
  name: 'SourceRelation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    source: 'Actant',
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export class SourceRelation extends Realm.Object {

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
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export class Sphere extends Realm.Object {
  static all() {
    return realm.objects('Sphere').sorted('position');
  }

  static findByID(id: string) {
    return realm.objectForPrimaryKey('Sphere', id || '');
  }

  countOfBook(bookID: string): number {
    const count = this.bookCounts.find(count => count.string === bookID);
    return count && count.count || 0;
  }
}
Sphere.schema = SphereSchema;

const StatementSchema = {
  name: 'Statement',
  primaryKey: 'id',
  properties: {
    id: 'int',
    firstMonad: {type: 'int', indexed: true},
    lastMonad: {type: 'int', indexed: true},
    book: 'Book',
    sourceOccurrence:  {type: 'int', default: 0},
    source: 'Actant',
    recipients: {type: 'list', objectType: 'Actant'},
    sphereCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
  }
};

export class Statement extends Realm.Object {
  static all() {
    return realm.objects('Statement');
  }

  static findByID(id: number) {
    return realm.objectForPrimaryKey('Statement', id ? parseInt(id) : 0);
  }

  static async identifiersMatchingPredicate(predicate: CompoundPredicate, options?: Object) {
    if (!predicate) {
      return Statement.all().map(statement => ({id: statement.id}));
    }

    let columns = [
      'statements.id',
      'statements.first AS firstMonad',
      'statements.last AS lastMonad',
      'statements.word_count AS wordCount'
    ];
    if (options && options.columns) {
      columns = [...new Set(columns.concat(options.columns))];
    }

    let tables = predicate.tables.filter(table => table !== 'statements');
    if (options && options.tables) {
      tables = [...new Set(tables.concat(options.tables))];
    }
    const fromSQL = tables.map(table => `INNER JOIN ${table} ON statements.id = ${table}.statement_id`).join(' ');

    const where = predicate.predicateFormat;
    const whereSQL = (where.length > 0 ? `WHERE ${where}` : '');

    const sql = `SELECT ${columns.join(', ')} FROM statements ${fromSQL} ${whereSQL}`
    console.log(sql);
    const statementRows = await rowsWithSQL(sql);

    const wordPredicates = predicate.subpredicates.filter(predicate => (predicate instanceof WordPredicate));
    if (wordPredicates.length > 0) {
      const wordPredicate = wordPredicates[0];
      const word = wordPredicate.word.toLowerCase();

      let options = {}
      if (statementRows.length > 0) {
        const monads = statementRows.map(statementRow => [statementRow["firstMonad"], statementRow["lastMonad"]]);
        options = {monads, tokenFeatureComparison: `surface_fts="${word}"`}
      } else {
        options = {tokenFeatureComparison: `surface_fts="${word}"`};
      }

      const wordCounts = await Emdros.wordCountsForContext('Statement', options);
      return Object.keys(wordCounts).map(statementID => {
        const statement = statementRows.find(statementRow => statementRow.id === parseInt(statementID));

        const counts = wordCounts[statementID];
        const sphereCounts = Object.keys(counts).map(key => ({string: key, count: counts[key]}));
        return {...statement, wordCount: counts.wordCount, sphereCounts: sphereCounts};
      });
    } else {
      return statementRows;
    }

    return [];
  }

  async words(options?: Object) {
    return await Emdros.words({from: this.firstMonad, to: this.lastMonad, useStopWords: true, ...options});
  }
}
Statement.schema = StatementSchema;

const Schema = [Actant, Bible, Book, Chapter, Chronology, Nature, Profession, SourceRelation, Sphere, Count, Content, Statement];

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
