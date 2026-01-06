/**
 * Emdros Module
 * 
 * TypeScript interface for the Emdros Bible text query engine.
 * 
 * This module interfaces with a native module that wraps the Emdros C++ library.
 * The native module provides methods to query the Bible text database (.bpt file)
 * and render formatted HTML for display.
 * 
 * In development builds, the native module will be compiled in.
 * For now, this provides a stub implementation with sample data for testing.
 */

// Types for Emdros queries
export interface MonadSet {
  first: number;
  last: number;
}

export interface EmdrosOpenOptions {
  name: string;
}

export interface EmdrosQueryOptions {
  name: string;
  query: string;
}

export interface EmdrosStringOptions {
  name: string;
  from: number;
  to: number;
  stylesheet?: string;
}

export interface EmdrosWordsOptions {
  name: string;
  monadSet?: MonadSet;
}

export interface WordOccurrence {
  id: number;
  book: string;
  DJHRef: string;
  name: string;
  number: number;
  roleID: number;
  monad: number;
  monadSet: MonadSet;
  chapter: number;
  verse: number;
}

export interface ScriptureOptions {
  book?: {
    chapters: Array<{
      monadSet: MonadSet;
    }>;
  };
  chapterNumber?: number;
  monadSet?: MonadSet;
  spheres?: string[];
  highlights?: Array<{
    references: Array<{
      firstMonad: number;
      lastMonad: number;
    }>;
  }>;
  stylesheet?: 'occurrence' | 'default';
}

// Singleton database instance
let dbInstance: EmdrosInstance | null = null;

/**
 * EmdrosInstance - represents an open Emdros database
 */
class EmdrosInstance {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Query the database with an MQL query
   */
  async query(queryString: string, options: Record<string, unknown> = {}): Promise<unknown> {
    // TODO: Implement native bridge call
    console.log('Emdros query:', queryString);
    return [];
  }

  /**
   * Get words in a monad range
   */
  async words(options: EmdrosWordsOptions): Promise<string[]> {
    // TODO: Implement native bridge call
    return [];
  }

  /**
   * Get word counts for a context (book, chapter, etc.)
   */
  async wordCountsForContext(context: string, options?: Record<string, unknown>): Promise<Record<string, number>> {
    // TODO: Implement native bridge call
    return {};
  }

  /**
   * Get occurrences of a word
   */
  async wordOccurrences(word: string, options?: {
    monadSet?: MonadSet;
    context?: string;
    sphere?: string;
  }): Promise<WordOccurrence[]> {
    // TODO: Implement native bridge call
    return [];
  }

  /**
   * Get rendered HTML string for a monad range
   */
  async string(from: number, to: number, options: { stylesheet?: string } = {}): Promise<string> {
    // TODO: Implement native bridge call
    // For now, return placeholder text
    return `<p>Bible text from monad ${from} to ${to} will be rendered here.</p>`;
  }

  /**
   * Close the database
   */
  close(): void {
    dbInstance = null;
  }
}

// Encryption keys extracted from legacy/Libraries/Emdros/ios/RCTEmdros/RCTEmdros/RCTEmdros.m
// These are stored as ASCII character codes in the original native module
const REALM_KEY_STRING = '3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264';
const PREFERENCES_KEY_STRING = 'b52e731250ce81e843229f40ffd72e1e19604043622e18a452915544dcabafb9';

/**
 * Convert a string to an ArrayBuffer where each byte is the ASCII code of the character
 * This matches how the original native module passed the key to JavaScript
 */
function stringToKeyBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Int8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * Emdros - main API class
 */
export class Emdros {
  /**
   * Get the encryption key for Realm database
   * This is a 64-byte key where each byte is the ASCII code of the hex string characters
   */
  static get key(): ArrayBuffer {
    return stringToKeyBuffer(REALM_KEY_STRING);
  }

  /**
   * Get the encryption key for preferences
   */
  static get preferencesKey(): ArrayBuffer {
    return stringToKeyBuffer(PREFERENCES_KEY_STRING);
  }
  
  /**
   * Get the Realm encryption key as Int8Array (for Realm.Configuration)
   */
  static get realmEncryptionKey(): Int8Array {
    return new Int8Array(Emdros.key);
  }

  /**
   * Open an Emdros database
   */
  static async open(options: EmdrosOpenOptions): Promise<EmdrosInstance> {
    if (dbInstance) {
      return dbInstance;
    }

    // TODO: Implement native bridge call
    console.log('Opening Emdros database:', options.name);
    dbInstance = new EmdrosInstance(options.name);
    return dbInstance;
  }

  /**
   * Open the default Bible database
   */
  static async openDatabase(): Promise<EmdrosInstance> {
    return Emdros.open({ name: 'datasets/SourceView.bpt' });
  }
}

/**
 * Scripture renderer - formats Bible text with highlighting
 * 
 * This is a high-level API that uses Emdros.string() with appropriate stylesheets
 */
export async function renderScripture(options: ScriptureOptions): Promise<string> {
  if (!dbInstance) {
    await Emdros.openDatabase();
  }

  let monadSet = options.monadSet;
  if (!monadSet && options.book && options.chapterNumber) {
    const chapter = options.book.chapters[options.chapterNumber - 1];
    monadSet = chapter.monadSet;
  }

  if (!monadSet) {
    return '<p>No text available</p>';
  }

  // TODO: Build stylesheet with sphere highlighting, source colors, etc.
  const result = await dbInstance!.string(monadSet.first, monadSet.last, {});
  return result;
}

export default Emdros;

