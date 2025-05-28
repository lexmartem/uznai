import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { websocketService } from '@/services/websocket-service';

interface ChatMessage {
    username: string;
    message: string;
    timestamp: Date;
}

interface QuizChatProps {
    quizId: string;
}

export const QuizChat: React.FC<QuizChatProps> = ({ quizId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = websocketService.subscribeToQuiz(quizId, (data) => {
            if (data.type === 'CHAT_MESSAGE') {
                setMessages(prev => [...prev, {
                    username: data.username,
                    message: data.message,
                    timestamp: new Date(data.timestamp)
                }]);
            }
        });

        return () => unsubscribe();
    }, [quizId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        websocketService.sendQuizChange(quizId, {
            changeType: 'CHAT_MESSAGE',
            changeData: JSON.stringify({
                message: newMessage,
                timestamp: new Date().toISOString()
            }),
            version: 0 // Chat messages don't need version control
        });

        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[300px] border rounded-lg">
            <div className="p-2 border-b">
                <h3 className="font-semibold">Chat</h3>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-1 p-2">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex items-baseline">
                            <span className="font-semibold mr-2">{msg.username}</span>
                            <span className="text-xs text-muted-foreground">
                                {msg.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                    </div>
                ))}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-2 border-t">
                <div className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    );
}; 