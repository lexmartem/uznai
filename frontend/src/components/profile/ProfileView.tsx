import { useState } from 'react';
import { UserProfile } from '@/types/user';
import { userApi } from '@/lib/api/user';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt={profile.username}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="text-gray-700">{profile.bio || 'No bio yet'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Roles</h3>
          <div className="flex gap-2">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Member Since</h3>
          <p className="text-gray-700">
            {new Date(profile.created_at || '').toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 