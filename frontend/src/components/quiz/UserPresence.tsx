import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserPresenceProps {
    users: string[];
}

export const UserPresence: React.FC<UserPresenceProps> = ({ users }) => {
    return (
        <div className="flex items-center space-x-2 p-2 bg-background border rounded-lg">
            <div className="flex -space-x-2">
                {users.map((username, index) => (
                    <Avatar key={username} className="border-2 border-background">
                        <AvatarImage src={`/api/users/${username}/avatar`} alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <Badge variant="secondary" className="ml-2">
                {users.length} active
            </Badge>
        </div>
    );
}; 