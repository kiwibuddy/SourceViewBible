import React, { createContext, useContext, ReactNode } from 'react';

// Mock types for development without Realm
interface Book {
  id: string;
  name: string;
  abbreviation: string;
  testament: string;
  textOrder: number;
}

interface Actant {
  id: string;
  name: string;
  isSource: boolean;
}

interface Sphere {
  id: string;
  name: string;
  position: number;
  color: string;
}

interface Bible {
  id: string;
  name: string;
  version: string;
}

interface DatabaseContextType {
  isLoading: boolean;
  error: Error | null;
  // Convenience query methods
  books: Book[];
  sources: Actant[];
  spheres: Sphere[];
  bible: Bible | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: false,
  error: null,
  books: [],
  sources: [],
  spheres: [],
  bible: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
}

// Mock data for development
const mockBooks: Book[] = [
  { id: 'genesis', name: 'Genesis', abbreviation: 'Gen', testament: 'OT', textOrder: 1 },
  { id: 'exodus', name: 'Exodus', abbreviation: 'Exod', testament: 'OT', textOrder: 2 },
  { id: 'matthew', name: 'Matthew', abbreviation: 'Matt', testament: 'NT', textOrder: 40 },
  { id: 'john', name: 'John', abbreviation: 'John', testament: 'NT', textOrder: 43 },
  { id: 'revelation', name: 'Revelation', abbreviation: 'Rev', testament: 'NT', textOrder: 66 },
];

const mockSpheres: Sphere[] = [
  { id: 'divine', name: 'Divine', position: 1, color: '#FFD700' },
  { id: 'angelic', name: 'Angelic', position: 2, color: '#C0C0C0' },
  { id: 'human', name: 'Human', position: 3, color: '#FFA500' },
  { id: 'demonic', name: 'Demonic', position: 4, color: '#8B0000' },
  { id: 'narrator', name: 'Narrator', position: 5, color: '#4169E1' },
  { id: 'uncertain', name: 'Uncertain', position: 6, color: '#808080' },
  { id: 'mixed', name: 'Mixed', position: 7, color: '#9932CC' },
];

const mockSources: Actant[] = [
  { id: 'god', name: 'God', isSource: true },
  { id: 'jesus', name: 'Jesus', isSource: true },
  { id: 'moses', name: 'Moses', isSource: true },
  { id: 'paul', name: 'Paul', isSource: true },
];

const mockBible: Bible = {
  id: 'nlt',
  name: 'New Living Translation',
  version: 'NLT',
};

/**
 * DatabaseProvider
 * 
 * Provides mock database access throughout the app for development.
 * In production, this will be replaced with Realm integration.
 */
export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const value: DatabaseContextType = {
    isLoading: false,
    error: null,
    books: mockBooks,
    sources: mockSources,
    spheres: mockSpheres,
    bible: mockBible,
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
 * Provides access to the database and common queries.
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
  const { books, isLoading, error } = useDatabase();
  const book = books.find(b => b.id === bookId) ?? null;
  return { book, isLoading, error };
}

/**
 * useSources hook
 * 
 * Returns all sources (speakers) in the Bible.
 */
export function useSources(search?: string) {
  const { sources, isLoading, error } = useDatabase();
  let filteredSources = sources;
  if (search) {
    filteredSources = sources.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return { sources: filteredSources, isLoading, error };
}

/**
 * useSpheres hook
 * 
 * Returns all 7 spheres.
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
  const { spheres, isLoading, error } = useDatabase();
  const sphere = spheres.find(s => s.id === sphereId) ?? null;
  return { sphere, isLoading, error };
}
