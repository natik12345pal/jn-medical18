'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { createUser, getUserByUid, User } from '@/lib/firestore';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const data = await getUserByUid(uid);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await createUser({
        uid: credential.user.uid,
        name,
        email,
        role: 'user'
      });
      
      // Fetch the user data to update state
      await fetchUserData(credential.user.uid);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        
        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists. Please sign in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          default:
            errorMessage = `Signup failed: ${errorCode}`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch the user data to update state
      await fetchUserData(credential.user.uid);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Signin error:', error);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        
        switch (errorCode) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up first.';
            break;
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Incorrect email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = `Sign in failed: ${errorCode}`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      isAdmin,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
