export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  bio?: string;
  avatar_url?: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
} 