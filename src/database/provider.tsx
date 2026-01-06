/**
 * Database Provider
 * 
 * Provides access to app data through React context
 * Uses JSON data files from the Kraken seed data
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dataService, Book, Actant, Sphere } from '../data';

interface DatabaseContextType {
  isLoading: boolean;
  error: Error | null;
  // Books
  books: Book[];
  getBook: (id: string) => Book | undefined;
  getBooksByTestament: (testament: number) => Book[];
  // Sources
  sources: Actant[];
  getSource: (id: number) => Actant | undefined;
  searchSources: (query: string) => Actant[];
  getTopSources: (limit?: number) => Actant[];
  // Spheres
  spheres: Sphere[];
  getSphere: (id: string) => Sphere | undefined;
  getSpherePassages: (sphereId: string) => any[];
  // Stats
  totalWordCount: number;
  oldTestamentWordCount: number;
  newTestamentWordCount: number;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await dataService.initialize();
        setInitialized(true);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to initialize data service:', e);
        setError(e as Error);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const value: DatabaseContextType = {
    isLoading,
    error,
    // Books
    books: initialized ? dataService.getAllBooks() : [],
    getBook: (id: string) => dataService.getBookById(id),
    getBooksByTestament: (testament: number) => dataService.getBooksByTestament(testament),
    // Sources
    sources: initialized ? dataService.getAllSources() : [],
    getSource: (id: number) => dataService.getSourceById(id),
    searchSources: (query: string) => dataService.searchSources(query),
    getTopSources: (limit?: number) => dataService.getTopSources(limit),
    // Spheres
    spheres: initialized ? dataService.getAllSpheres() : [],
    getSphere: (id: string) => dataService.getSphereById(id),
    getSpherePassages: (sphereId: string) => dataService.getSpherePassages(sphereId),
    // Stats
    totalWordCount: initialized ? dataService.getTotalWordCount() : 0,
    oldTestamentWordCount: initialized ? dataService.getOldTestamentWordCount() : 0,
    newTestamentWordCount: initialized ? dataService.getNewTestamentWordCount() : 0,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

// Convenience hooks
export function useBooks() {
  const { books, getBook, getBooksByTestament, isLoading } = useDatabase();
  return { books, getBook, getBooksByTestament, isLoading };
}

export function useSources() {
  const { sources, getSource, searchSources, getTopSources, isLoading } = useDatabase();
  return { sources, getSource, searchSources, getTopSources, isLoading };
}

export function useSpheres() {
  const { spheres, getSphere, getSpherePassages, isLoading } = useDatabase();
  return { spheres, getSphere, getSpherePassages, isLoading };
}
