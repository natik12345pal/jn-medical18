'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchContext } from '@/contexts/SearchContext';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery: handleSearch }}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header onSearch={handleSearch} searchQuery={searchQuery} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </SearchContext.Provider>
  );
}
