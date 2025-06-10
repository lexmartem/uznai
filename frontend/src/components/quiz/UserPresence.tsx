import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserPresenceProps {
    users: string[];
}

export const UserPresence: React.FC<UserPresenceProps> = ({ users }) => {
    return (
        <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-xl shadow-md">
            <div className="flex -space-x-2">
                {users.map((username, index) => (
                    <Avatar key={username} className="ring-2 ring-white">
                        <AvatarImage src={`/api/users/${username}/avatar`} alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <Badge variant="secondary" className="ml-2 bg-purple-200 text-purple-700 font-bold">
                {users.length} active
            </Badge>
        </div>
    );
}; 