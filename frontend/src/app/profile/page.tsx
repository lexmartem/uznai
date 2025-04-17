'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProfileView } from '@/components/profile/ProfileView';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { PasswordChange } from '@/components/profile/PasswordChange';
import { userApi } from '@/lib/api/user';
import { UserProfile } from '@/types/user';

function ProfileContent() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await userApi.getCurrentUser();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error || 'Profile not found'}</div>
      </div>
    );
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {isEditing ? (
            <ProfileEdit
              profile={profile}
              onSave={handleProfileUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
          )}
          <PasswordChange />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ProfileContent />
      </div>
    </AuthProvider>
  );
} 