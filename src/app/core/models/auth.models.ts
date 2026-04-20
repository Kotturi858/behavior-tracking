export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  provider: 'password' | 'google' | 'demo';
}
