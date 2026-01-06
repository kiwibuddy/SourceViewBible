/**
 * Database Schema Types for SourceView Bible
 * 
 * TypeScript interfaces for the database schema.
 * In production, these will be backed by Realm models.
 * For development, these are used with mock data.
 */

// Count - stores string/count pairs for various statistics
export interface Count {
  string: string;
  count: number;
}

// Content - stores title/body pairs for book overviews, etc.
export interface Content {
  title?: string;
  body: string;
}

// MonadSet - represents a range of text positions
export interface MonadSet {
  firstMonad: number;
  lastMonad: number;
  chapter: number;
  verse: number;
}

// Bible - top-level Bible metadata
export interface Bible {
  id: number;
  wordCount: number;
  words: Count[];
}

// Chronology - time periods in biblical history
export interface Chronology {
  id: number;
  key: string;
  from: number;
  to: number;
  name?: string;
}

// Nature - divine, human, angelic, demonic
export interface Nature {
  id: number;
  key: string;
  name?: string;
}

// Profession - occupations of sources
export interface Profession {
  id: number;
  key: string;
  searchable: boolean;
  name?: string;
}

// Chapter - book chapter metadata
export interface Chapter {
  id: string;
  chapterNumber: number;
  firstMonad: number;
  lastMonad: number;
  sourceCount: number;
  sourceTypeCount: number;
  sourceTypeCounts: Count[];
  principalSourceType: string;
  sphereCount: number;
  sphereCounts: Count[];
  sphereWordCount: number;
  wordCount: number;
  verseCount: number;
}

// Actant - sources (speakers) in the Bible
export interface Actant {
  id: number;
  name: string;
  firstInitial?: string;
  gender: number;
  natures: Nature[];
  actantNumber?: number;
  chronologies: Chronology[];
  professions: Profession[];
  isSource: boolean;
  isRecipient: boolean;
  sourceTypeCount: number;
  sourceTypeCounts: Count[];
  principalSourceType: string;
  sphereCount: number;
  sphereCounts: Count[];
  sphereWordCount: number;
  wordCount: number;
  words: Count[];
}

// SourceRelation - relationship between sources and books
export interface SourceRelation {
  id: string;
  book?: Book;
  source?: Actant;
  sourceTypeCount: number;
  sourceTypeCounts: Count[];
  principalSourceType: string;
  sphereCount: number;
  sphereCounts: Count[];
  sphereWordCount: number;
  wordCount: number;
  words: Count[];
}

// Book - Bible book metadata
export interface Book {
  id: string;
  DJHRef: string;
  name: string;
  testament: number;
  textOrder: number;
  firstMonad: number;
  lastMonad: number;
  chapterCount: number;
  chapters: Chapter[];
  maxChapterWordCount: number;
  maxSourceWordCount: number;
  maxChapterSphereWordCount: number;
  sourceCount: number;
  sourceRelations: SourceRelation[];
  sourceTypeCount: number;
  sourceTypeCounts: Count[];
  principalSourceType: string;
  sphereCount: number;
  sphereCounts: Count[];
  sphereWordCount: number;
  wordCount: number;
  words: Count[];
  overview: Content[];
}

// BookSourceOccurrence - specific speaking occurrences in books
export interface BookSourceOccurrence {
  id: number;
  book?: Book;
  name: string;
  number: number;
  roleID: number;
  firstMonad: number;
  lastMonad: number;
  reference: string;
}

// SpherePassage - passages related to a sphere
export interface SpherePassage {
  section: string;
  number: number;
  title: string;
  reference: string;
  monads: MonadSet[];
}

// Sphere - thematic categories (7 spheres of society)
export interface Sphere {
  id: string;
  name: string;
  position: number;
  bookCount: number;
  bookCounts: Count[];
  sourceCount: number;
  sourceCounts: Count[];
  sourceTypeCount: number;
  sourceTypeCounts: Count[];
  wordCount: number;
  words: Count[];
  passages: SpherePassage[];
  overview: Content[];
}

// Sphere constants
export const SPHERES = [
  'family',
  'economics',
  'government',
  'religion',
  'education',
  'communication',
  'celebration',
] as const;

export const SPHERE_FEATURE_MAP: Record<string, string> = {
  family: 'Family',
  economics: 'Economics',
  government: 'Government',
  religion: 'Religion',
  education: 'Education',
  communication: 'MediaCom',
  celebration: 'Celebration',
};

// Role helper class
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
    return this.key.charAt(0).toUpperCase() + this.key.slice(1);
  }
}

// Helper functions
export function getMonadSet(obj: { firstMonad: number; lastMonad: number }): { first: number; last: number } {
  return {
    first: obj.firstMonad,
    last: obj.lastMonad,
  };
}

export function isOldTestament(book: Book): boolean {
  return book.testament === 0;
}

export function isNewTestament(book: Book): boolean {
  return book.testament === 1;
}

export function isDivine(actant: Actant): boolean {
  return actant.natures.some((nature) => nature.id === 3);
}

export function isHuman(actant: Actant): boolean {
  return actant.natures.some((nature) => nature.id === 4);
}

export function isAngelic(actant: Actant): boolean {
  return actant.natures.some((nature) => nature.id === 1);
}

export function isDemonic(actant: Actant): boolean {
  return actant.natures.some((nature) => nature.id === 2);
}

export function getActantIconName(actant: Actant): string {
  if (isDivine(actant)) return 'avatar-divine';
  if (isHuman(actant)) {
    const isIndividual = actant.actantNumber === 2;
    const hasGender = actant.gender === 1 || actant.gender === 2;
    const isFemale = actant.gender === 1;
    if (isIndividual && hasGender) {
      return isFemale ? 'avatar-human-female' : 'avatar-human-male';
    }
    return 'avatar-human-group';
  }
  if (isAngelic(actant)) return 'avatar-angelic';
  if (isDemonic(actant)) return 'avatar-demonic';
  if (actant.principalSourceType === 'narrator') return 'avatar-narrator';
  return 'avatar-other';
}
