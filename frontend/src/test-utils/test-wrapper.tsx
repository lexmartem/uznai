import React from 'react';
import { createMockRouter } from './create-mock-router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { websocketService } from '../services/websocket-service';

// Mock WebSocket service
jest.mock('../services/websocket-service', () => ({
  websocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribeToQuiz: jest.fn().mockReturnValue(() => {}),
    sendQuizChange: jest.fn(),
  },
}));

export function TestWrapper({ children }: { children: React.ReactNode }) {
  const mockRouter = createMockRouter({});

  return (
    <AppRouterContext.Provider value={mockRouter}>
      {children}
    </AppRouterContext.Provider>
  );
} 