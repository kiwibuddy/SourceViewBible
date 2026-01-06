/**
 * Database Provider for SourceView Bible
 * 
 * Provides access to the encrypted Realm database containing all Bible data.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Realm from 'realm';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import {
  RealmSchema,
  Bible,
  Book,
  Actant,
  Sphere,
  Chapter,
  SourceRelation,
  BookSourceOccurrence,
  Chronology,
  Nature,
  Profession,
} from './schema';

// Encryption key extracted from legacy native module (RCTEmdros.m)
// Decoded from the RCTKeyCString hexadecimal string
function getEncryptionKey(): ArrayBuffer {
  const KEY_STRING = '3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264';
  const keyLength = KEY_STRING.length / 2;
  const buf = new ArrayBuffer(keyLength);
  const bufView = new Uint8Array(buf);

  for (let i = 0; i < keyLength; i++) {
    bufView[i] = parseInt(KEY_STRING.substring(i * 2, i * 2 + 2), 16);
  }
  return buf;
}

interface DatabaseContextType {
  realm: Realm | null;
  isLoading: boolean;
  error: Error | null;
  // Convenience accessors
  bible: Bible | null;
  books: Realm.Results<Book> | null;
  sources: Realm.Results<Actant> | null;
  spheres: Realm.Results<Sphere> | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  realm: null,
  isLoading: true,
  error: null,
  bible: null,
  books: null,
  sources: null,
  spheres: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let realmInstance: Realm | null = null;

    async function initializeDatabase() {
      try {
        // Determine the path for the Realm database
        let realmPath: string;

        if (Platform.OS === 'ios') {
          // On iOS, the database is bundled in the app
          realmPath = `${FileSystem.bundleDirectory}Datasets/en/NLT/SourceView.realm`;
        } else {
          // On Android, we need to copy from assets to document directory
          const destDir = `${FileSystem.documentDirectory}Datasets/en/NLT/`;
          realmPath = `${destDir}SourceView.realm`;

          // Check if directory exists
          const dirInfo = await FileSystem.getInfoAsync(destDir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
          }

          // Check if database exists
          const dbInfo = await FileSystem.getInfoAsync(realmPath);
          if (!dbInfo.exists) {
            // Try to copy from bundled assets
            // Note: This requires the database file to be in assets/Datasets/en/NLT/
            try {
              const asset = Asset.fromModule(require('../../../assets/Datasets/en/NLT/SourceView.realm'));
              await asset.downloadAsync();
              if (asset.localUri) {
                await FileSystem.copyAsync({
                  from: asset.localUri,
                  to: realmPath,
                });
              }
            } catch (copyError) {
              console.warn('Could not copy bundled database:', copyError);
              // Database file may not be available yet
              throw new Error('Database file not found. Please ensure SourceView.realm is in assets/Datasets/en/NLT/');
            }
          }
        }

        // Open the Realm database
        const encryptionKey = getEncryptionKey();
        
        realmInstance = await Realm.open({
          schema: RealmSchema,
          path: realmPath,
          encryptionKey: new Int8Array(encryptionKey),
          schemaVersion: 1,
          readOnly: true,
        });

        setRealm(realmInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    }

    initializeDatabase();

    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, []);

  // Convenience accessors
  const bible = realm?.objects<Bible>('Bible')[0] || null;
  const books = realm?.objects<Book>('Book').sorted('textOrder') || null;
  const sources = realm?.objects<Actant>('Actant').filtered('isSource = true') || null;
  const spheres = realm?.objects<Sphere>('Sphere').filtered('position > 0').sorted('position') || null;

  return (
    <DatabaseContext.Provider
      value={{
        realm,
        isLoading,
        error,
        bible,
        books,
        sources,
        spheres,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook to access the database
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

// Hook to get all books
export function useBooks() {
  const { books, isLoading, error } = useDatabase();
  return { books: books ? Array.from(books) : [], isLoading, error };
}

// Hook to get a specific book by ID
export function useBook(bookId: string) {
  const { realm, isLoading, error } = useDatabase();
  const book = realm?.objectForPrimaryKey<Book>('Book', bookId) || null;
  return { book, isLoading, error };
}

// Hook to get all sources
export function useSources(filters?: { search?: string }) {
  const { sources, isLoading, error } = useDatabase();
  
  let filtered = sources;
  if (filtered && filters?.search) {
    filtered = filtered.filtered('name CONTAINS[c] $0', filters.search);
  }
  
  return { sources: filtered ? Array.from(filtered) : [], isLoading, error };
}

// Hook to get a specific source by ID
export function useSource(sourceId: number) {
  const { realm, isLoading, error } = useDatabase();
  const source = realm?.objectForPrimaryKey<Actant>('Actant', sourceId) || null;
  return { source, isLoading, error };
}

// Hook to get all spheres
export function useSpheres(includeFoundational = false) {
  const { realm, isLoading, error } = useDatabase();
  
  let spheres = realm?.objects<Sphere>('Sphere');
  if (spheres && !includeFoundational) {
    spheres = spheres.filtered('position > 0');
  }
  spheres = spheres?.sorted('position');
  
  return { spheres: spheres ? Array.from(spheres) : [], isLoading, error };
}

// Hook to get a specific sphere by ID
export function useSphere(sphereId: string) {
  const { realm, isLoading, error } = useDatabase();
  const sphere = realm?.objectForPrimaryKey<Sphere>('Sphere', sphereId) || null;
  return { sphere, isLoading, error };
}

// Hook to get Bible statistics
export function useBibleStats() {
  const { bible, isLoading, error } = useDatabase();
  return {
    wordCount: bible?.wordCount || 0,
    words: bible?.words ? Array.from(bible.words) : [],
    isLoading,
    error,
  };
}

// Hook to get chronologies
export function useChronologies() {
  const { realm, isLoading, error } = useDatabase();
  const chronologies = realm?.objects<Chronology>('Chronology').sorted('from') || null;
  return { chronologies: chronologies ? Array.from(chronologies) : [], isLoading, error };
}

// Hook to get natures
export function useNatures() {
  const { realm, isLoading, error } = useDatabase();
  const natures = realm?.objects<Nature>('Nature') || null;
  return { natures: natures ? Array.from(natures) : [], isLoading, error };
}

// Hook to get professions
export function useProfessions() {
  const { realm, isLoading, error } = useDatabase();
  const professions = realm?.objects<Profession>('Profession').filtered('searchable = true').sorted('key') || null;
  return { professions: professions ? Array.from(professions) : [], isLoading, error };
}

export default DatabaseProvider;
