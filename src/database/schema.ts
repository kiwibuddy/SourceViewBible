/**
 * Database Schema for SourceView Bible
 * 
 * Ported from legacy/App/js/Database/Realm.js
 * These Realm object models define the structure of the encrypted SourceView.realm database.
 */

import Realm from 'realm';
import { Colors } from '../common/colors';

// Count - stores string/count pairs for various statistics
export class Count extends Realm.Object<Count> {
  string!: string;
  count!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Count',
    properties: {
      string: 'string',
      count: { type: 'int', default: 0 },
    },
  };
}

// Content - stores title/body pairs for book overviews, etc.
export class Content extends Realm.Object<Content> {
  title?: string;
  body!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Content',
    properties: {
      title: { type: 'string', optional: true },
      body: 'string',
    },
  };
}

// Nature - divine, human, angelic, demonic
export class Nature extends Realm.Object<Nature> {
  id!: number;
  key!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Nature',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: 'string',
    },
  };

  get name(): string {
    const names: Record<string, string> = {
      angelic: 'Angelic',
      demonic: 'Demonic',
      divine: 'Divine',
      human: 'Human',
    };
    return names[this.key] || this.key;
  }
}

// Profession - king, prophet, priest, etc.
export class Profession extends Realm.Object<Profession> {
  id!: number;
  key!: string;
  searchable!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Profession',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: 'string',
      searchable: { type: 'bool', default: true },
    },
  };

  get name(): string {
    return this.key.charAt(0).toUpperCase() + this.key.slice(1);
  }
}

// Chronology - time periods in biblical history
export class Chronology extends Realm.Object<Chronology> {
  id!: number;
  key!: string;
  from!: number;
  to!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Chronology',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: 'string',
      from: { type: 'int', indexed: true },
      to: 'int',
    },
  };

  get name(): string {
    const names: Record<string, string> = {
      creation: 'Creation',
      patriarchs: 'Patriarchs',
      exodus: 'Exodus',
      conquest: 'Conquest',
      judges: 'Judges',
      united_kingdom: 'United Kingdom',
      divided_kingdom: 'Divided Kingdom',
      exile: 'Exile',
      return: 'Return',
      intertestamental: 'Intertestamental',
      life_of_christ: 'Life of Christ',
      early_church: 'Early Church',
    };
    return names[this.key] || this.key;
  }
}

// Chapter - individual book chapters
export class Chapter extends Realm.Object<Chapter> {
  id!: string;
  chapterNumber!: number;
  firstMonad!: number;
  lastMonad!: number;
  sourceCount!: number;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  verseCount!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    primaryKey: 'id',
    properties: {
      id: 'string',
      chapterNumber: 'int',
      firstMonad: { type: 'int', default: 0 },
      lastMonad: { type: 'int', default: 0 },
      sourceCount: { type: 'int', default: 0 },
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: { type: 'list', objectType: 'Count' },
      principalSourceType: { type: 'string', default: 'narrator' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: { type: 'list', objectType: 'Count' },
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      verseCount: { type: 'int', default: 0 },
    },
  };

  get monadSet() {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }
}

// MonadSet - represents a range of text positions
export class MonadSet extends Realm.Object<MonadSet> {
  firstMonad!: number;
  lastMonad!: number;
  chapter!: number;
  verse!: number;

  static schema: Realm.ObjectSchema = {
    name: 'MonadSet',
    properties: {
      firstMonad: 'int',
      lastMonad: 'int',
      chapter: 'int',
      verse: 'int',
    },
  };

  get monadSet() {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }
}

// SpherePassage - key passages for each sphere
export class SpherePassage extends Realm.Object<SpherePassage> {
  section!: string;
  number!: number;
  title!: string;
  reference!: string;
  monads!: Realm.List<MonadSet>;

  static schema: Realm.ObjectSchema = {
    name: 'SpherePassage',
    properties: {
      section: 'string',
      number: 'int',
      title: 'string',
      reference: 'string',
      monads: { type: 'list', objectType: 'MonadSet' },
    },
  };
}

// Forward declarations for circular references
export class Book extends Realm.Object<Book> {
  id!: string;
  DJHRef!: string;
  name!: string;
  testament!: number;
  textOrder!: number;
  firstMonad!: number;
  lastMonad!: number;
  chapterCount!: number;
  chapters!: Realm.List<Chapter>;
  maxChapterWordCount!: number;
  maxSourceWordCount!: number;
  maxChapterSphereWordCount!: number;
  sourceCount!: number;
  sourceRelations!: Realm.List<any>; // SourceRelation
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  words!: Realm.List<Count>;
  overview!: Realm.List<Content>;

  static schema: Realm.ObjectSchema = {
    name: 'Book',
    primaryKey: 'id',
    properties: {
      id: 'string',
      DJHRef: 'string',
      name: { type: 'string', indexed: true },
      testament: 'int',
      textOrder: { type: 'int', indexed: true },
      firstMonad: { type: 'int', default: 0 },
      lastMonad: { type: 'int', default: 0 },
      chapterCount: { type: 'int', default: 0 },
      chapters: { type: 'list', objectType: 'Chapter' },
      maxChapterWordCount: { type: 'int', default: 0 },
      maxSourceWordCount: { type: 'int', default: 0 },
      maxChapterSphereWordCount: { type: 'int', default: 0 },
      sourceCount: { type: 'int', default: 0 },
      sourceRelations: { type: 'list', objectType: 'SourceRelation' },
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: { type: 'list', objectType: 'Count' },
      principalSourceType: { type: 'string', default: 'narrator' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: { type: 'list', objectType: 'Count' },
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: { type: 'list', objectType: 'Count' },
      overview: { type: 'list', objectType: 'Content' },
    },
  };

  get monadSet() {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(c => c.string === sourceType);
    return count?.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(c => c.string === sphereType);
    return count?.count || 0;
  }
}

// Actant - people/characters in the Bible (sources and recipients)
export class Actant extends Realm.Object<Actant> {
  id!: number;
  name!: string;
  firstInitial?: string;
  gender!: number;
  natures!: Realm.List<Nature>;
  actantNumber?: number;
  chronologies!: Realm.List<Chronology>;
  professions!: Realm.List<Profession>;
  isSource!: boolean;
  isRecipient!: boolean;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  words!: Realm.List<Count>;

  static schema: Realm.ObjectSchema = {
    name: 'Actant',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: { type: 'string', indexed: true },
      firstInitial: { type: 'string', optional: true },
      gender: 'int',
      natures: { type: 'list', objectType: 'Nature' },
      actantNumber: { type: 'int', optional: true },
      chronologies: { type: 'list', objectType: 'Chronology' },
      professions: { type: 'list', objectType: 'Profession' },
      isSource: 'bool',
      isRecipient: 'bool',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: { type: 'list', objectType: 'Count' },
      principalSourceType: { type: 'string', default: 'other' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: { type: 'list', objectType: 'Count' },
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: { type: 'list', objectType: 'Count' },
    },
  };

  get isDivine(): boolean {
    return this.natures.some(nature => nature.id === 3);
  }

  get isHuman(): boolean {
    return this.natures.some(nature => nature.id === 4);
  }

  get isIndividual(): boolean {
    return this.actantNumber === 2;
  }

  get hasGender(): boolean {
    return this.gender === 1 || this.gender === 2;
  }

  get isFemale(): boolean {
    return this.gender === 1;
  }

  get isAngelic(): boolean {
    return this.natures.some(nature => nature.id === 1);
  }

  get isDemonic(): boolean {
    return this.natures.some(nature => nature.id === 2);
  }

  get iconName(): string {
    if (this.isDivine) return 'avatar-divine';
    if (this.isHuman) {
      if (this.isIndividual && this.hasGender) {
        return this.isFemale ? 'avatar-human-female' : 'avatar-human-male';
      }
      return 'avatar-human-group';
    }
    if (this.isAngelic) return 'avatar-angelic';
    if (this.isDemonic) return 'avatar-demonic';
    if (this.principalSourceType === 'narrator') return 'avatar-narrator';
    return 'avatar-other';
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(c => c.string === sourceType);
    return count?.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(c => c.string === sphereType);
    return count?.count || 0;
  }
}

// SourceRelation - relationship between a source (actant) and a book
export class SourceRelation extends Realm.Object<SourceRelation> {
  id!: string;
  book!: Book;
  source!: Actant;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  words!: Realm.List<Count>;

  static schema: Realm.ObjectSchema = {
    name: 'SourceRelation',
    primaryKey: 'id',
    properties: {
      id: 'string',
      book: 'Book',
      source: 'Actant',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: { type: 'list', objectType: 'Count' },
      principalSourceType: { type: 'string', default: 'support' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: { type: 'list', objectType: 'Count' },
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: { type: 'list', objectType: 'Count' },
    },
  };

  get colors() {
    return Colors.sources[this.principalSourceType as keyof typeof Colors.sources] || Colors.sources.other;
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(c => c.string === sourceType);
    return count?.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(c => c.string === sphereType);
    return count?.count || 0;
  }
}

// BookSourceOccurrence - individual occurrences of a source speaking in a book
export class BookSourceOccurrence extends Realm.Object<BookSourceOccurrence> {
  id!: number;
  book!: Book;
  name!: string;
  number!: number;
  roleID!: number;
  firstMonad!: number;
  lastMonad!: number;
  reference!: string;

  static schema: Realm.ObjectSchema = {
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
    },
  };

  get monadSet() {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }
}

// Bible - top-level Bible metadata
export class Bible extends Realm.Object<Bible> {
  id!: number;
  wordCount!: number;
  words!: Realm.List<Count>;

  static schema: Realm.ObjectSchema = {
    name: 'Bible',
    primaryKey: 'id',
    properties: {
      id: 'int',
      wordCount: 'int',
      words: { type: 'list', objectType: 'Count' },
    },
  };
}

// Sphere - the 7 spheres of life (+ foundational)
export class Sphere extends Realm.Object<Sphere> {
  id!: string;
  name!: string;
  position!: number;
  bookCount!: number;
  bookCounts!: Realm.List<Count>;
  sourceCount!: number;
  sourceCounts!: Realm.List<Count>;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  wordCount!: number;
  words!: Realm.List<Count>;
  passages!: Realm.List<SpherePassage>;
  overview!: Realm.List<Content>;

  static schema: Realm.ObjectSchema = {
    name: 'Sphere',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      position: 'int',
      bookCount: { type: 'int', default: 0 },
      bookCounts: { type: 'list', objectType: 'Count' },
      sourceCount: { type: 'int', default: 0 },
      sourceCounts: { type: 'list', objectType: 'Count' },
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: { type: 'list', objectType: 'Count' },
      wordCount: { type: 'int', default: 0 },
      words: { type: 'list', objectType: 'Count' },
      passages: { type: 'list', objectType: 'SpherePassage' },
      overview: { type: 'list', objectType: 'Content' },
    },
  };

  static SPHERES = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'];

  get isFoundational(): boolean {
    return this.position === 0;
  }

  color(variant: 'tint' | 'lightTint' | 'chromeTint' | 'highlightTint' = 'tint'): string {
    const sphereColors = Colors.spheres[this.id as keyof typeof Colors.spheres];
    return sphereColors?.[variant] || '#000000';
  }

  countOfBook(bookID: string): number {
    const count = this.bookCounts.find(c => c.string === bookID);
    return count?.count || 0;
  }

  countOfSource(actantID: number): number {
    const count = this.sourceCounts.find(c => c.string === actantID.toString());
    return count?.count || 0;
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(c => c.string === sourceType);
    return count?.count || 0;
  }
}

// All schemas for Realm configuration
export const RealmSchema = [
  Count,
  Content,
  Nature,
  Profession,
  Chronology,
  Chapter,
  MonadSet,
  SpherePassage,
  Book,
  Actant,
  SourceRelation,
  BookSourceOccurrence,
  Bible,
  Sphere,
];

// Role utility class (not stored in Realm)
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

  static findByID(id: number | string): Role {
    const key = typeof id === 'number' ? Role.ROLES[id - 1] : id;
    return new Role(typeof id === 'number' ? id : Role.ROLES.indexOf(id) + 1, key);
  }

  static findByKey(key: string): Role {
    const id = Role.ROLES.indexOf(key) + 1;
    return new Role(id, key);
  }

  get name(): string {
    const names: Record<string, string> = {
      narrator: 'Narrator',
      god: 'God',
      lead: 'Lead Character',
      support: 'Supporting Character',
    };
    return names[this.key] || this.key;
  }

  color(variant: 'tint' | 'lightTint' = 'tint'): string {
    const colors = Colors.sources[this.key as keyof typeof Colors.sources];
    return colors?.[variant] || '#000000';
  }
}

// Gender utility class (not stored in Realm)
export class Gender {
  static Female = 1;
  static Male = 2;

  id: number;
  key: string;

  constructor(id: number, key: string) {
    this.id = id;
    this.key = key;
  }

  static findByID(id: number): Gender {
    const keys = ['female', 'male'];
    return new Gender(id, keys[id - 1] || 'unknown');
  }

  get name(): string {
    const names: Record<string, string> = {
      female: 'Female',
      male: 'Male',
    };
    return names[this.key] || 'Unknown';
  }
}
