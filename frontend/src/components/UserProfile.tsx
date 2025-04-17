import { useState, useEffect } from 'react';
import { UserProfile as UserProfileType } from '@/types';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileEdit } from './UserProfileEdit';

export const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProfile: UserProfileType) => {
    try {
      setLoading(true);
      const data = await userService.updateCurrentUser(updatedProfile);
      setProfile(data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {isEditing ? (
        <UserProfileEdit
          profile={profile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <div className="mb-4">
            <img
              src={profile?.avatarUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Username</h3>
            <p>{profile?.username}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Bio</h3>
            <p>{profile?.bio || 'No bio yet'}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}; 