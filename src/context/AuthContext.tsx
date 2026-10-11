import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthPartnerUser, authService } from '../services/authService';
import { PartnerName } from '../types';
import { isFirebaseConfigured } from '../config/firebase';

interface AuthContextType {
  currentUser: AuthPartnerUser | null;
  loading: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<AuthPartnerUser>;
  logout: () => Promise<void>;
  switchDemoUser: (partner: PartnerName) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthPartnerUser | null>(() =>
    authService.getCurrentUser()
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // If no user is logged in, default to Madhawa for instant cashier usability in demo mode
    const stored = authService.getCurrentUser();
    if (!stored && !isFirebaseConfigured) {
      authService.switchDemoPartner('Madhawa').then((u) => {
        setCurrentUser(u);
        setLoading(false);
      });
    } else {
      setCurrentUser(stored);
      setLoading(false);
    }

    const unsub = authService.subscribeAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await authService.signIn(email, pass);
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  const switchDemoUser = async (partner: PartnerName) => {
    const user = await authService.switchDemoPartner(partner);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        login,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
