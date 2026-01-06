import Realm, { BSON, ObjectSchema } from 'realm';

/**
 * Realm Database Schema for SourceView Bible
 * Migrated from legacy/App/js/Database/Realm.js
 * 
 * The database contains Bible metadata, sources (speakers),
 * spheres (thematic categories), and related statistics.
 */

// Count - stores string/count pairs for various statistics
export class Count extends Realm.Object<Count> {
  string!: string;
  count!: number;

  static schema: ObjectSchema = {
    name: 'Count',
    embedded: true,
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

  static schema: ObjectSchema = {
    name: 'Content',
    embedded: true,
    properties: {
      title: 'string?',
      body: 'string',
    },
  };
}

// MonadSet - represents a range of text positions
export class MonadSet extends Realm.Object<MonadSet> {
  firstMonad!: number;
  lastMonad!: number;
  book?: Book;
  chapter!: number;
  verse!: number;

  static schema: ObjectSchema = {
    name: 'MonadSet',
    embedded: true,
    properties: {
      firstMonad: 'int',
      lastMonad: 'int',
      book: 'Book?',
      chapter: 'int',
      verse: 'int',
    },
  };

  get monadSet(): { first: number; last: number } {
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

  static schema: ObjectSchema = {
    name: 'Bible',
    primaryKey: 'id',
    properties: {
      id: 'int',
      wordCount: 'int',
      words: 'Count[]',
    },
  };
}

// Chronology - time periods in biblical history
export class Chronology extends Realm.Object<Chronology> {
  id!: number;
  key!: string;
  from!: number;
  to!: number;

  static schema: ObjectSchema = {
    name: 'Chronology',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: { type: 'string', indexed: true },
      from: { type: 'int', indexed: true },
      to: 'int',
    },
  };

  get name(): string {
    // TODO: Implement localization
    return this.key;
  }
}

// Nature - divine, human, angelic, demonic
export class Nature extends Realm.Object<Nature> {
  id!: number;
  key!: string;

  static schema: ObjectSchema = {
    name: 'Nature',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: 'string',
    },
  };

  get name(): string {
    // TODO: Implement localization
    return this.key;
  }
}

// Profession - occupations of sources
export class Profession extends Realm.Object<Profession> {
  id!: number;
  key!: string;
  searchable!: boolean;

  static schema: ObjectSchema = {
    name: 'Profession',
    primaryKey: 'id',
    properties: {
      id: 'int',
      key: 'string',
      searchable: { type: 'bool', default: true },
    },
  };

  get name(): string {
    // TODO: Implement localization
    return this.key;
  }
}

// Chapter - book chapter metadata
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

  static schema: ObjectSchema = {
    name: 'Chapter',
    primaryKey: 'id',
    properties: {
      id: 'string',
      chapterNumber: 'int',
      firstMonad: { type: 'int', default: 0 },
      lastMonad: { type: 'int', default: 0 },
      sourceCount: { type: 'int', default: 0 },
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: 'Count[]',
      principalSourceType: { type: 'string', default: 'narrator' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: 'Count[]',
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      verseCount: { type: 'int', default: 0 },
    },
  };

  get monadSet(): { first: number; last: number } {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }
}

// Actant - sources (speakers) in the Bible
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

  static schema: ObjectSchema = {
    name: 'Actant',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: { type: 'string', indexed: true },
      firstInitial: 'string?',
      gender: 'int',
      natures: 'Nature[]',
      actantNumber: 'int?',
      chronologies: 'Chronology[]',
      professions: 'Profession[]',
      isSource: 'bool',
      isRecipient: 'bool',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: 'Count[]',
      principalSourceType: { type: 'string', default: 'other' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: 'Count[]',
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: 'Count[]',
    },
  };

  get isDivine(): boolean {
    return this.natures.some((nature) => nature.id === 3);
  }

  get isHuman(): boolean {
    return this.natures.some((nature) => nature.id === 4);
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
    return this.natures.some((nature) => nature.id === 1);
  }

  get isDemonic(): boolean {
    return this.natures.some((nature) => nature.id === 2);
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
}

// SourceRelation - relationship between sources and books
export class SourceRelation extends Realm.Object<SourceRelation> {
  id!: string;
  book?: Book;
  source?: Actant;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  words!: Realm.List<Count>;

  static schema: ObjectSchema = {
    name: 'SourceRelation',
    primaryKey: 'id',
    properties: {
      id: 'string',
      book: 'Book?',
      source: 'Actant?',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: 'Count[]',
      principalSourceType: { type: 'string', default: 'support' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: 'Count[]',
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: 'Count[]',
    },
  };
}

// Book - Bible book metadata
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
  sourceRelations!: Realm.List<SourceRelation>;
  sourceTypeCount!: number;
  sourceTypeCounts!: Realm.List<Count>;
  principalSourceType!: string;
  sphereCount!: number;
  sphereCounts!: Realm.List<Count>;
  sphereWordCount!: number;
  wordCount!: number;
  words!: Realm.List<Count>;
  overview!: Realm.List<Content>;

  static schema: ObjectSchema = {
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
      chapters: 'Chapter[]',
      maxChapterWordCount: { type: 'int', default: 0 },
      maxSourceWordCount: { type: 'int', default: 0 },
      maxChapterSphereWordCount: { type: 'int', default: 0 },
      sourceCount: { type: 'int', default: 0 },
      sourceRelations: 'SourceRelation[]',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: 'Count[]',
      principalSourceType: { type: 'string', default: 'narrator' },
      sphereCount: { type: 'int', default: 0 },
      sphereCounts: 'Count[]',
      sphereWordCount: { type: 'int', default: 0 },
      wordCount: { type: 'int', default: 0 },
      words: 'Count[]',
      overview: 'Content[]',
    },
  };

  get monadSet(): { first: number; last: number } {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }

  get isOldTestament(): boolean {
    return this.testament === 0;
  }

  get isNewTestament(): boolean {
    return this.testament === 1;
  }
}

// BookSourceOccurrence - specific speaking occurrences in books
export class BookSourceOccurrence extends Realm.Object<BookSourceOccurrence> {
  id!: number;
  book?: Book;
  name!: string;
  number!: number;
  roleID!: number;
  firstMonad!: number;
  lastMonad!: number;
  reference!: string;

  static schema: ObjectSchema = {
    name: 'BookSourceOccurrence',
    primaryKey: 'id',
    properties: {
      id: 'int',
      book: 'Book?',
      name: 'string',
      number: 'int',
      roleID: 'int',
      firstMonad: 'int',
      lastMonad: 'int',
      reference: 'string',
    },
  };

  get monadSet(): { first: number; last: number } {
    return {
      first: this.firstMonad,
      last: this.lastMonad,
    };
  }
}

// SpherePassage - passages related to a sphere
export class SpherePassage extends Realm.Object<SpherePassage> {
  section!: string;
  number!: number;
  title!: string;
  reference!: string;
  monads!: Realm.List<MonadSet>;

  static schema: ObjectSchema = {
    name: 'SpherePassage',
    embedded: true,
    properties: {
      section: 'string',
      number: 'int',
      title: 'string',
      reference: 'string',
      monads: 'MonadSet[]',
    },
  };
}

// Sphere - thematic categories (7 spheres of society)
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

  static schema: ObjectSchema = {
    name: 'Sphere',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      position: 'int',
      bookCount: { type: 'int', default: 0 },
      bookCounts: 'Count[]',
      sourceCount: { type: 'int', default: 0 },
      sourceCounts: 'Count[]',
      sourceTypeCount: { type: 'int', default: 0 },
      sourceTypeCounts: 'Count[]',
      wordCount: { type: 'int', default: 0 },
      words: 'Count[]',
      passages: 'SpherePassage[]',
      overview: 'Content[]',
    },
  };

  static readonly SPHERES = [
    'family',
    'economics',
    'government',
    'religion',
    'education',
    'communication',
    'celebration',
  ];

  static readonly SPHERE_FEATURE_MAP: Record<string, string> = {
    family: 'Family',
    economics: 'Economics',
    government: 'Government',
    religion: 'Religion',
    education: 'Education',
    communication: 'MediaCom',
    celebration: 'Celebration',
  };

  get isFoundational(): boolean {
    return this.position === 0;
  }

  get feature(): string {
    return Sphere.SPHERE_FEATURE_MAP[this.id] || '';
  }
}

// Export all schemas for Realm configuration
export const realmSchema = [
  Bible,
  Actant,
  Book,
  BookSourceOccurrence,
  Chapter,
  Chronology,
  Nature,
  Profession,
  SourceRelation,
  Sphere,
  // Embedded objects don't need to be listed separately in Realm JS 12+
];

// Role helper class (not a Realm object, just a utility)
export class Role {
  static readonly ROLES = ['narrator', 'god', 'lead', 'support'];
  static readonly Narrator = 1;
  static readonly God = 2;
  static readonly Lead = 3;
  static readonly Support = 4;

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

  get name(): string {
    // TODO: Implement localization
    return this.key.charAt(0).toUpperCase() + this.key.slice(1);
  }
}

