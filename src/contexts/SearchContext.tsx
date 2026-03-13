'use client';

import { createContext, useContext } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchContext Provider');
  }
  return context;
}
