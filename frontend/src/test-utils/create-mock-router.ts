export function createMockRouter(options: {
  push?: (url: string) => void;
  back?: () => void;
  pathname?: string;
  query?: Record<string, string>;
}) {
  return {
    push: options.push || jest.fn(),
    back: options.back || jest.fn(),
    pathname: options.pathname || '/',
    query: options.query || {},
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    prefetch: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    cache: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    },
  };
} 