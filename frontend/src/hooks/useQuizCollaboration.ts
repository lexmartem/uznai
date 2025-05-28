import { useEffect, useState } from 'react';
import { websocketService } from '@/services/websocket-service';
import { QuizChangeRequest, ChangeType } from '@/types/quiz';

interface UseQuizCollaborationProps {
    quizId: string;
    onQuizUpdate?: (data: any) => void;
}

export const useQuizCollaboration = ({ quizId, onQuizUpdate }: UseQuizCollaborationProps) => {
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to WebSocket when the component mounts
        websocketService.connect();
        setIsConnected(true);

        // Subscribe to quiz updates
        const unsubscribe = websocketService.subscribeToQuiz(quizId, (data) => {
            if (data.type === 'USERS_UPDATE') {
                setActiveUsers(data.users);
            } else if (onQuizUpdate) {
                onQuizUpdate(data);
            }
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            websocketService.disconnect();
            setIsConnected(false);
        };
    }, [quizId, onQuizUpdate]);

    const sendChange = (changeType: ChangeType, changeData: any, version: number) => {
        const change: QuizChangeRequest = {
            changeType,
            changeData: JSON.stringify(changeData),
            version
        };
        websocketService.sendQuizChange(quizId, change);
    };

    return {
        activeUsers,
        isConnected,
        sendChange
    };
}; 