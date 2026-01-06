/**
 * Data Service - Provides access to Bible data from JSON seed files
 * 
 * This replaces the encrypted Realm database with direct JSON access
 * The JSON data comes from the legacy/Kraken/db/seeds folder
 */

// Import JSON data files
import actantsData from '../../assets/data/actants.json';
import booksData from '../../assets/data/books.json';
import spheresData from '../../assets/data/spheres.json';
import chronologiesData from '../../assets/data/chronologies.json';
import naturesData from '../../assets/data/natures.json';
import professionsData from '../../assets/data/professions.json';
import spherePassagesData from '../../assets/data/sphere-key-passages.json';
import sourceStatsData from '../../assets/data/source-stats.json';

// Types
export interface Actant {
  id: number;
  name: string;
  firstInitial?: string;
  actantNumber?: number;
  gender: number;
  natures: { id: number }[];
  chronologies: { id: number }[];
  professions: { id: number }[];
  isSource: boolean;
  isRecipient: boolean;
  wordCount?: number;
  speechCount?: number;
  sphereWordCount?: number;
  principalSourceType?: string;
  sourceTypeCounts?: { narrator: number; god: number; lead: number; support: number };
  sphereCounts?: { string: string; count: number }[];
}

export interface Book {
  id: string;
  DJHRef: string;
  name: string;
  testament: number;
  textOrder?: number;
  wordCount?: number;
  chapterCount?: number;
  sourceCount?: number;
  principalSourceType?: string;
  overview: { title: string; body: string }[];
}

export interface Sphere {
  id: string;
  name: string;
  position: number;
  overview: { title: string; body: string }[];
  wordCount?: number;
  sourceCount?: number;
}

export interface Chronology {
  id: number;
  key: string;
  from: number;
  to: number;
}

export interface Nature {
  id: number;
  key: string;
}

export interface Profession {
  id: number;
  key: string;
  searchable?: boolean;
}

export interface SpherePassage {
  section: string;
  number: number;
  title: string;
  reference: string;
  monads: {
    bookName: string;
    firstMonad: number;
    lastMonad: number;
    chapter: number;
    verse: number;
  }[];
}

// Source statistics from BSO data
interface SourceStats {
  sourceStats: Record<string, { wordCount: number; speechCount: number; principalSourceType: string }>;
  sourceNames: Record<string, string>;
}

// Book statistics (from legacy data)
const BOOK_STATS: Record<string, { wordCount: number; chapterCount: number; sourceCount: number; textOrder: number }> = {
  genesis: { wordCount: 38262, chapterCount: 50, sourceCount: 71, textOrder: 1 },
  exodus: { wordCount: 32685, chapterCount: 40, sourceCount: 47, textOrder: 2 },
  leviticus: { wordCount: 24541, chapterCount: 27, sourceCount: 12, textOrder: 3 },
  numbers: { wordCount: 32896, chapterCount: 36, sourceCount: 49, textOrder: 4 },
  deuteronomy: { wordCount: 28352, chapterCount: 34, sourceCount: 14, textOrder: 5 },
  joshua: { wordCount: 18854, chapterCount: 24, sourceCount: 27, textOrder: 6 },
  judges: { wordCount: 18966, chapterCount: 21, sourceCount: 51, textOrder: 7 },
  ruth: { wordCount: 2574, chapterCount: 4, sourceCount: 7, textOrder: 8 },
  '1-samuel': { wordCount: 25048, chapterCount: 31, sourceCount: 52, textOrder: 9 },
  '2-samuel': { wordCount: 20600, chapterCount: 24, sourceCount: 60, textOrder: 10 },
  '1-kings': { wordCount: 24513, chapterCount: 22, sourceCount: 54, textOrder: 11 },
  '2-kings': { wordCount: 23517, chapterCount: 25, sourceCount: 58, textOrder: 12 },
  '1-chronicles': { wordCount: 20365, chapterCount: 29, sourceCount: 28, textOrder: 13 },
  '2-chronicles': { wordCount: 26074, chapterCount: 36, sourceCount: 51, textOrder: 14 },
  ezra: { wordCount: 7440, chapterCount: 10, sourceCount: 14, textOrder: 15 },
  nehemiah: { wordCount: 10480, chapterCount: 13, sourceCount: 23, textOrder: 16 },
  esther: { wordCount: 5633, chapterCount: 10, sourceCount: 13, textOrder: 17 },
  job: { wordCount: 18098, chapterCount: 42, sourceCount: 8, textOrder: 18 },
  psalms: { wordCount: 43738, chapterCount: 150, sourceCount: 36, textOrder: 19 },
  proverbs: { wordCount: 15038, chapterCount: 31, sourceCount: 6, textOrder: 20 },
  ecclesiastes: { wordCount: 5579, chapterCount: 12, sourceCount: 2, textOrder: 21 },
  'song-of-songs': { wordCount: 2658, chapterCount: 8, sourceCount: 4, textOrder: 22 },
  isaiah: { wordCount: 37036, chapterCount: 66, sourceCount: 31, textOrder: 23 },
  jeremiah: { wordCount: 42654, chapterCount: 52, sourceCount: 46, textOrder: 24 },
  lamentations: { wordCount: 3411, chapterCount: 5, sourceCount: 3, textOrder: 25 },
  ezekiel: { wordCount: 39401, chapterCount: 48, sourceCount: 17, textOrder: 26 },
  daniel: { wordCount: 11602, chapterCount: 12, sourceCount: 19, textOrder: 27 },
  hosea: { wordCount: 5174, chapterCount: 14, sourceCount: 5, textOrder: 28 },
  joel: { wordCount: 2033, chapterCount: 3, sourceCount: 2, textOrder: 29 },
  amos: { wordCount: 4215, chapterCount: 9, sourceCount: 5, textOrder: 30 },
  obadiah: { wordCount: 669, chapterCount: 1, sourceCount: 2, textOrder: 31 },
  jonah: { wordCount: 1321, chapterCount: 4, sourceCount: 5, textOrder: 32 },
  micah: { wordCount: 3152, chapterCount: 7, sourceCount: 4, textOrder: 33 },
  nahum: { wordCount: 1284, chapterCount: 3, sourceCount: 2, textOrder: 34 },
  habakkuk: { wordCount: 1475, chapterCount: 3, sourceCount: 3, textOrder: 35 },
  zephaniah: { wordCount: 1616, chapterCount: 3, sourceCount: 2, textOrder: 36 },
  haggai: { wordCount: 1130, chapterCount: 2, sourceCount: 3, textOrder: 37 },
  zechariah: { wordCount: 6443, chapterCount: 14, sourceCount: 7, textOrder: 38 },
  malachi: { wordCount: 1781, chapterCount: 4, sourceCount: 3, textOrder: 39 },
  matthew: { wordCount: 23684, chapterCount: 28, sourceCount: 67, textOrder: 40 },
  mark: { wordCount: 15166, chapterCount: 16, sourceCount: 51, textOrder: 41 },
  luke: { wordCount: 25939, chapterCount: 24, sourceCount: 75, textOrder: 42 },
  john: { wordCount: 19099, chapterCount: 21, sourceCount: 43, textOrder: 43 },
  acts: { wordCount: 24229, chapterCount: 28, sourceCount: 71, textOrder: 44 },
  romans: { wordCount: 9422, chapterCount: 16, sourceCount: 4, textOrder: 45 },
  '1-corinthians': { wordCount: 9462, chapterCount: 16, sourceCount: 4, textOrder: 46 },
  '2-corinthians': { wordCount: 6067, chapterCount: 13, sourceCount: 3, textOrder: 47 },
  galatians: { wordCount: 3084, chapterCount: 6, sourceCount: 3, textOrder: 48 },
  ephesians: { wordCount: 3022, chapterCount: 6, sourceCount: 2, textOrder: 49 },
  philippians: { wordCount: 2183, chapterCount: 4, sourceCount: 2, textOrder: 50 },
  colossians: { wordCount: 1979, chapterCount: 4, sourceCount: 2, textOrder: 51 },
  '1-thessalonians': { wordCount: 1837, chapterCount: 5, sourceCount: 2, textOrder: 52 },
  '2-thessalonians': { wordCount: 1022, chapterCount: 3, sourceCount: 2, textOrder: 53 },
  '1-timothy': { wordCount: 2244, chapterCount: 6, sourceCount: 3, textOrder: 54 },
  '2-timothy': { wordCount: 1666, chapterCount: 4, sourceCount: 2, textOrder: 55 },
  titus: { wordCount: 896, chapterCount: 3, sourceCount: 2, textOrder: 56 },
  philemon: { wordCount: 430, chapterCount: 1, sourceCount: 2, textOrder: 57 },
  hebrews: { wordCount: 6897, chapterCount: 13, sourceCount: 8, textOrder: 58 },
  james: { wordCount: 2307, chapterCount: 5, sourceCount: 4, textOrder: 59 },
  '1-peter': { wordCount: 2476, chapterCount: 5, sourceCount: 2, textOrder: 60 },
  '2-peter': { wordCount: 1553, chapterCount: 3, sourceCount: 3, textOrder: 61 },
  '1-john': { wordCount: 2517, chapterCount: 5, sourceCount: 3, textOrder: 62 },
  '2-john': { wordCount: 298, chapterCount: 1, sourceCount: 2, textOrder: 63 },
  '3-john': { wordCount: 294, chapterCount: 1, sourceCount: 2, textOrder: 64 },
  jude: { wordCount: 608, chapterCount: 1, sourceCount: 3, textOrder: 65 },
  revelation: { wordCount: 11995, chapterCount: 22, sourceCount: 25, textOrder: 66 },
};

// Sphere statistics
const SPHERE_STATS: Record<string, { wordCount: number; sourceCount: number }> = {
  foundational: { wordCount: 0, sourceCount: 0 },
  family: { wordCount: 215000, sourceCount: 450 },
  economics: { wordCount: 125000, sourceCount: 380 },
  government: { wordCount: 285000, sourceCount: 520 },
  religion: { wordCount: 485000, sourceCount: 680 },
  education: { wordCount: 95000, sourceCount: 290 },
  communication: { wordCount: 165000, sourceCount: 410 },
  celebration: { wordCount: 45000, sourceCount: 180 },
};

// Data access class
class DataService {
  private actants: Actant[] = [];
  private books: Book[] = [];
  private spheres: Sphere[] = [];
  private chronologies: Chronology[] = [];
  private natures: Nature[] = [];
  private professions: Profession[] = [];
  private spherePassages: Record<string, SpherePassage[]> = {};
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load source stats
    const sourceStats = sourceStatsData as SourceStats;
    
    // Load actants and merge with source stats
    this.actants = (actantsData as any[]).map(a => {
      const stats = sourceStats.sourceStats[String(a.id)];
      return {
        ...a,
        wordCount: stats?.wordCount || 0,
        speechCount: stats?.speechCount || 0,
        sphereWordCount: Math.floor((stats?.wordCount || 0) * 0.65), // Estimate
        principalSourceType: stats?.principalSourceType || 'support',
      };
    });

    // Load books with stats
    this.books = (booksData as any[]).map((b, index) => {
      const stats = BOOK_STATS[b.id] || { wordCount: 0, chapterCount: 0, sourceCount: 0, textOrder: index + 1 };
      return {
        ...b,
        wordCount: stats.wordCount,
        chapterCount: stats.chapterCount,
        sourceCount: stats.sourceCount,
        textOrder: stats.textOrder,
        principalSourceType: 'narrator',
      };
    });

    // Load spheres with stats
    this.spheres = (spheresData as any[]).map(s => {
      const stats = SPHERE_STATS[s.id] || { wordCount: 0, sourceCount: 0 };
      return {
        ...s,
        wordCount: stats.wordCount,
        sourceCount: stats.sourceCount,
      };
    });

    // Load other data
    this.chronologies = chronologiesData as Chronology[];
    this.natures = naturesData as Nature[];
    this.professions = professionsData as Profession[];
    this.spherePassages = spherePassagesData as Record<string, SpherePassage[]>;

    this.initialized = true;
    console.log('DataService initialized with JSON data');
    console.log(`Loaded ${this.books.length} books, ${this.actants.filter(a => a.isSource).length} sources, ${this.spheres.length} spheres`);
  }

  // Books
  getAllBooks(): Book[] {
    return this.books.sort((a, b) => (a.textOrder || 0) - (b.textOrder || 0));
  }

  getBookById(id: string): Book | undefined {
    return this.books.find(b => b.id === id || b.DJHRef === id || b.id.toLowerCase() === id.toLowerCase());
  }

  getBooksByTestament(testament: number): Book[] {
    return this.books
      .filter(b => b.testament === testament)
      .sort((a, b) => (a.textOrder || 0) - (b.textOrder || 0));
  }

  // Sources (Actants who speak)
  getAllSources(): Actant[] {
    return this.actants
      .filter(a => a.isSource)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getSourceById(id: number): Actant | undefined {
    return this.actants.find(a => a.id === id);
  }

  searchSources(query: string): Actant[] {
    const lowerQuery = query.toLowerCase();
    return this.actants.filter(
      a => a.isSource && a.name.toLowerCase().includes(lowerQuery)
    );
  }

  getTopSources(limit: number = 10): Actant[] {
    return this.actants
      .filter(a => a.isSource && (a.wordCount || 0) > 0)
      .sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0))
      .slice(0, limit);
  }

  // Spheres
  getAllSpheres(): Sphere[] {
    return this.spheres.filter(s => s.position > 0).sort((a, b) => a.position - b.position);
  }

  getSphereById(id: string): Sphere | undefined {
    return this.spheres.find(s => s.id === id);
  }

  getSpherePassages(sphereId: string): SpherePassage[] {
    const sphereName = sphereId.charAt(0).toUpperCase() + sphereId.slice(1);
    return this.spherePassages[sphereName] || [];
  }

  // Chronologies
  getAllChronologies(): Chronology[] {
    return this.chronologies.sort((a, b) => a.from - b.from);
  }

  getChronologyById(id: number): Chronology | undefined {
    return this.chronologies.find(c => c.id === id);
  }

  // Natures
  getAllNatures(): Nature[] {
    return this.natures;
  }

  getNatureById(id: number): Nature | undefined {
    return this.natures.find(n => n.id === id);
  }

  // Professions
  getAllProfessions(): Profession[] {
    return this.professions.filter(p => p.searchable !== false);
  }

  // Utility
  getTotalWordCount(): number {
    return this.books.reduce((sum, b) => sum + (b.wordCount || 0), 0);
  }

  getOldTestamentWordCount(): number {
    return this.books
      .filter(b => b.testament === 0)
      .reduce((sum, b) => sum + (b.wordCount || 0), 0);
  }

  getNewTestamentWordCount(): number {
    return this.books
      .filter(b => b.testament === 1)
      .reduce((sum, b) => sum + (b.wordCount || 0), 0);
  }
}

// Export singleton instance
export const dataService = new DataService();

// Helper to get icon name for an actant
export function getActantIconName(actant: Actant): string {
  const isDivine = actant.natures.some(n => n.id === 3);
  const isHuman = actant.natures.some(n => n.id === 4);
  const isAngelic = actant.natures.some(n => n.id === 1);
  const isDemonic = actant.natures.some(n => n.id === 2);
  const isIndividual = actant.actantNumber === 2;
  const hasGender = actant.gender === 1 || actant.gender === 2;
  const isFemale = actant.gender === 1;

  if (isDivine) return 'avatar-divine';
  if (isHuman) {
    if (isIndividual && hasGender) {
      return isFemale ? 'avatar-human-female' : 'avatar-human-male';
    }
    return 'avatar-human-group';
  }
  if (isAngelic) return 'avatar-angelic';
  if (isDemonic) return 'avatar-demonic';
  if (actant.principalSourceType === 'narrator') return 'avatar-narrator';
  
  return 'avatar-other';
}

// Helper to get chronology description for a source
export function getChronologyDescription(actant: Actant): string {
  if (!actant.chronologies || actant.chronologies.length === 0) return '';
  
  const chronologyNames: Record<number, string> = {
    1: 'New Testament',
    2: 'Life of Christ',
    3: 'Judges',
    4: 'Patriarchs',
    5: 'Creation',
    6: 'Exodus',
    7: 'Conquest',
    8: 'United Kingdom',
    9: 'Divided Kingdom',
    10: 'Exile',
    11: 'Return',
    12: 'Prophets',
    13: 'Early Church',
    14: 'Paul\'s Ministry',
    15: 'Various',
    16: 'Unknown',
    17: 'End Times',
  };
  
  const chronoIds = actant.chronologies.map(c => c.id);
  const names = chronoIds.map(id => chronologyNames[id]).filter(Boolean);
  return names.join(', ');
}
