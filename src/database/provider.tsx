import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Realm from 'realm';
import { realmSchema, Book, Actant, Sphere, Bible } from './schema';

interface DatabaseContextType {
  realm: Realm | null;
  isLoading: boolean;
  error: Error | null;
  // Convenience query methods
  books: Realm.Results<Book> | null;
  sources: Realm.Results<Actant> | null;
  spheres: Realm.Results<Sphere> | null;
  bible: Bible | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  realm: null,
  isLoading: true,
  error: null,
  books: null,
  sources: null,
  spheres: null,
  bible: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
  encryptionKey?: ArrayBuffer;
}

/**
 * DatabaseProvider
 * 
 * Provides Realm database access throughout the app.
 * The database file is bundled with the app and copied to the document directory on first run.
 */
export function DatabaseProvider({ children, encryptionKey }: DatabaseProviderProps) {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let realmInstance: Realm | null = null;

    const initDatabase = async () => {
      try {
        // Open Realm with schema
        // In development, this creates an in-memory database
        // In production, we'll configure the path and encryption
        const config: Realm.Configuration = {
          schema: realmSchema,
          schemaVersion: 1,
          // For production with bundled database:
          // path: `${FileSystem.documentDirectory}SourceView.realm`,
          // encryptionKey: encryptionKey,
        };

        realmInstance = await Realm.open(config);
        setRealm(realmInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to open Realm database:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initDatabase();

    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, [encryptionKey]);

  // Compute derived values
  const books = realm?.objects<Book>('Book').sorted('textOrder') ?? null;
  const sources = realm?.objects<Actant>('Actant').filtered('isSource == true') ?? null;
  const spheres = realm?.objects<Sphere>('Sphere').filtered('position > 0').sorted('position') ?? null;
  const bible = realm?.objects<Bible>('Bible')[0] ?? null;

  const value: DatabaseContextType = {
    realm,
    isLoading,
    error,
    books,
    sources,
    spheres,
    bible,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * useDatabase hook
 * 
 * Provides access to the Realm database and common queries.
 */
export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

/**
 * useBooks hook
 * 
 * Returns all Bible books sorted by text order.
 */
export function useBooks() {
  const { books, isLoading, error } = useDatabase();
  return { books, isLoading, error };
}

/**
 * useBook hook
 * 
 * Returns a specific book by ID.
 */
export function useBook(bookId: string) {
  const { realm, isLoading, error } = useDatabase();
  const book = realm?.objectForPrimaryKey<Book>('Book', bookId) ?? null;
  return { book, isLoading, error };
}

/**
 * useSources hook
 * 
 * Returns all sources (speakers) in the Bible.
 */
export function useSources(search?: string) {
  const { realm, isLoading, error } = useDatabase();
  let sources = realm?.objects<Actant>('Actant').filtered('isSource == true') ?? null;
  if (sources && search) {
    sources = sources.filtered('name CONTAINS[c] $0', search);
  }
  return { sources, isLoading, error };
}

/**
 * useSpheres hook
 * 
 * Returns all 7 spheres (excluding foundational).
 */
export function useSpheres() {
  const { spheres, isLoading, error } = useDatabase();
  return { spheres, isLoading, error };
}

/**
 * useSphere hook
 * 
 * Returns a specific sphere by ID.
 */
export function useSphere(sphereId: string) {
  const { realm, isLoading, error } = useDatabase();
  const sphere = realm?.objectForPrimaryKey<Sphere>('Sphere', sphereId) ?? null;
  return { sphere, isLoading, error };
}

