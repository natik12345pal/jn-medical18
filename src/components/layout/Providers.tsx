'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { AlertCircle } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { isConfigured, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error if Firebase is not configured
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
            <p className="text-gray-600 mb-4">
              Firebase is not properly configured. Please set the required environment variables in Vercel:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-left text-sm font-mono overflow-x-auto">
              <p>NEXT_PUBLIC_FIREBASE_API_KEY</p>
              <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</p>
              <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID</p>
              <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</p>
              <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</p>
              <p>NEXT_PUBLIC_FIREBASE_APP_ID</p>
              <p>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              After adding the variables, redeploy your project.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
      <Toaster />
    </AuthProvider>
  );
}
