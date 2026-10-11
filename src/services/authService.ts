import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { PartnerName } from '../types';

export interface AuthPartnerUser {
  uid: string;
  email: string;
  partnerName: PartnerName;
  role: 'cashier' | 'partner';
  isDemo: boolean;
}

const STORAGE_AUTH_USER = 'lt_auth_user';

export const PARTNER_ACCOUNTS: Record<
  string,
  { email: string; partnerName: PartnerName; role: 'cashier' | 'partner' }
> = {
  sandeep: {
    email: 'sandeep@lightingtree.lk',
    partnerName: 'Sandeep',
    role: 'partner',
  },
  fab: {
    email: 'fab@lightingtree.lk',
    partnerName: 'Fab',
    role: 'partner',
  },
  madhawa: {
    email: 'madhawa@lightingtree.lk',
    partnerName: 'Madhawa',
    role: 'cashier',
  },
};

export const authService = {
  async signIn(email: string, password: string): Promise<AuthPartnerUser> {
    if (isFirebaseConfigured && auth) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const partnerName = resolvePartnerNameFromEmail(res.user.email || '');
      const user: AuthPartnerUser = {
        uid: res.user.uid,
        email: res.user.email || email,
        partnerName,
        role: partnerName === 'Madhawa' ? 'cashier' : 'partner',
        isDemo: false,
      };
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
      return user;
    }

    // Demo Mode sign-in (accept demo credentials or standard demo password)
    const normalized = email.toLowerCase().trim();
    let partnerName: PartnerName = 'Madhawa';
    if (normalized.includes('sandeep')) partnerName = 'Sandeep';
    else if (normalized.includes('fab')) partnerName = 'Fab';
    else partnerName = 'Madhawa';

    const user: AuthPartnerUser = {
      uid: `demo-${partnerName.toLowerCase()}`,
      email: `${partnerName.toLowerCase()}@lightingtree.lk`,
      partnerName,
      role: partnerName === 'Madhawa' ? 'cashier' : 'partner',
      isDemo: true,
    };
    localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    return user;
  },

  async switchDemoPartner(partnerName: PartnerName): Promise<AuthPartnerUser> {
    const user: AuthPartnerUser = {
      uid: `demo-${partnerName.toLowerCase()}`,
      email: `${partnerName.toLowerCase()}@lightingtree.lk`,
      partnerName,
      role: partnerName === 'Madhawa' ? 'cashier' : 'partner',
      isDemo: true,
    };
    localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    return user;
  },

  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    localStorage.removeItem(STORAGE_AUTH_USER);
    window.dispatchEvent(new Event('storage'));
  },

  getCurrentUser(): AuthPartnerUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  subscribeAuthState(callback: (user: AuthPartnerUser | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const partnerName = resolvePartnerNameFromEmail(fbUser.email || '');
          const user: AuthPartnerUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            partnerName,
            role: partnerName === 'Madhawa' ? 'cashier' : 'partner',
            isDemo: false,
          };
          localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
          callback(user);
        } else {
          localStorage.removeItem(STORAGE_AUTH_USER);
          callback(null);
        }
      });
    }

    callback(this.getCurrentUser());
    const handler = () => callback(this.getCurrentUser());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
};

function resolvePartnerNameFromEmail(email: string): PartnerName {
  const lower = email.toLowerCase();
  if (lower.includes('sandeep')) return 'Sandeep';
  if (lower.includes('fab')) return 'Fab';
  return 'Madhawa';
}
