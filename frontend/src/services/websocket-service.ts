import { Client } from '@stomp/stompjs';
import { QuizChangeRequest } from '../types/quiz';

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, (data: any) => void> = new Map();

    connect() {
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('Connected to WebSocket');
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
    }

    subscribeToQuiz(quizId: string, onUpdate: (data: any) => void) {
        if (!this.client) {
            throw new Error('WebSocket client not connected');
        }

        // Subscribe to quiz changes
        const changeSubscription = this.client.subscribe(
            `/topic/quiz/${quizId}/changes`,
            (message) => {
                const data = JSON.parse(message.body);
                onUpdate(data);
            }
        );

        // Subscribe to user presence
        const userSubscription = this.client.subscribe(
            `/topic/quiz/${quizId}/users`,
            (message) => {
                const users = JSON.parse(message.body);
                onUpdate({ type: 'USERS_UPDATE', users });
            }
        );

        // Store subscriptions for cleanup
        this.subscriptions.set(quizId, onUpdate);

        // Join the quiz room
        this.client.publish({
            destination: `/app/quiz/${quizId}/join`,
            body: ''
        });

        return () => {
            changeSubscription.unsubscribe();
            userSubscription.unsubscribe();
            this.subscriptions.delete(quizId);
            
            // Leave the quiz room
            if (this.client) {
                this.client.publish({
                    destination: `/app/quiz/${quizId}/leave`,
                    body: ''
                });
            }
        };
    }

    sendQuizChange(quizId: string, change: QuizChangeRequest) {
        if (!this.client) {
            throw new Error('WebSocket client not connected');
        }

        this.client.publish({
            destination: `/app/quiz/${quizId}/changes`,
            body: JSON.stringify(change)
        });
    }
}

export const websocketService = new WebSocketService(); 