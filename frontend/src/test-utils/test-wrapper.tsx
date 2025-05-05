import React from 'react';
import { createMockRouter } from './create-mock-router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function TestWrapper({ children }: { children: React.ReactNode }) {
  const mockRouter = createMockRouter({});

  return (
    <AppRouterContext.Provider value={mockRouter}>
      {children}
    </AppRouterContext.Provider>
  );
} 