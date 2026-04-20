import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, deleteDoc, collection, getDocs, writeBatch } from '@angular/fire/firestore';
import { UserProfile } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  private readonly firebaseUser = signal<UserProfile | null>(null);
  private readonly demoUser = signal<UserProfile | null>({
    uid: 'demo-user',
    email: 'demo@productive.app',
    displayName: 'Demo user',
    provider: 'demo'
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly profile = computed(() => this.firebaseUser() ?? this.demoUser());
  readonly isAuthenticated = computed(() => !!this.profile());

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email ?? 'unknown@email.app',
          displayName: user.displayName ?? 'Personal best builder',
          photoUrl: user.photoURL ?? undefined,
          provider: user.providerData[0]?.providerId === 'google.com' ? 'google' : 'password'
        };
        
        this.firebaseUser.set(userProfile);
        
        // Create user profile in Firestore if it doesn't exist
        await this.createUserProfile(userProfile);
      } else {
        this.firebaseUser.set(null);
      }
    });
  }
  
  private async createUserProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(this.firestore, 'users', profile.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // New user - create fresh profile with empty data
      await setDoc(userRef, {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoUrl: profile.photoUrl,
        provider: profile.provider,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isNewUser: true
      });
    } else {
      // Existing user - update last login
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
        isNewUser: false
      }, { merge: true });
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.demoUser.set(null);
    } catch (error) {
      this.error.set('Google sign-in is ready once Firebase keys are connected.');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  async signInWithEmail(email: string, password: string, mode: 'login' | 'register'): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      if (mode === 'register') {
        console.log('Creating account with email and password');
        await createUserWithEmailAndPassword(this.auth, email, password);
      } else {
        await signInWithEmailAndPassword(this.auth, email, password);
      }

      this.demoUser.set(null);
    } catch (error) {
      this.error.set('Email authentication is scaffolded and will work after Firebase setup.');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  continueWithDemo(): void {
    this.error.set(null);
    this.demoUser.set({
      uid: 'demo-user',
      email: 'demo@productive.app',
      displayName: 'Demo user',
      provider: 'demo'
    });
  }

  async logout(): Promise<void> {
    this.loading.set(true);

    try {
      await signOut(this.auth);
    } catch (error) {
      console.error(error);
    } finally {
      this.demoUser.set({
        uid: 'demo-user',
        email: 'demo@productive.app',
        displayName: 'Demo user',
        provider: 'demo'
      });
      this.loading.set(false);
    }
  }

  async deleteAccount(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const user = this.auth.currentUser;
    if (!user) {
      this.error.set('No authenticated user found');
      this.loading.set(false);
      return;
    }

    try {
      // Delete all user data from Firestore first
      await this.deleteUserData(user.uid);
      
      // Delete the Firebase Auth user
      await deleteUser(user);
      
      // Reset to demo mode
      this.demoUser.set({
        uid: 'demo-user',
        email: 'demo@productive.app',
        displayName: 'Demo user',
        provider: 'demo'
      });
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        this.error.set('For security, please sign out and sign back in before deleting your account.');
      } else if (error.code === 'auth/too-many-requests') {
        this.error.set('Too many attempts. Please try again later.');
      } else {
        this.error.set('Failed to delete account. Please try again.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async deleteUserData(userId: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    // Delete user profile
    const userRef = doc(this.firestore, 'users', userId);
    batch.delete(userRef);
    
    // Delete all user collections
    const collections = ['habits', 'tasks', 'moneyRecords', 'reflections', 'habitLogs', 'dailySummaries', 'weeklySummaries'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(this.firestore, `users/${userId}/${collectionName}`);
      const snapshot = await getDocs(collectionRef);
      
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
    }
    
    await batch.commit();
  }
}
