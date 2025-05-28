// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Add TextEncoder/TextDecoder polyfills
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock zod
jest.mock('zod', () => ({
  z: {
    object: () => ({
      parse: jest.fn(),
      safeParse: jest.fn(),
    }),
    string: () => ({
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
      url: jest.fn().mockReturnThis(),
    }),
    boolean: () => ({
      default: jest.fn().mockReturnThis(),
    }),
    array: () => ({
      default: jest.fn().mockReturnThis(),
    }),
    number: () => ({
      min: jest.fn().mockReturnThis(),
    }),
    enum: () => jest.fn().mockReturnThis(),
  },
}));

// Mock @hookform/resolvers/zod
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    register: (name) => ({
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
      name
    }),
    handleSubmit: (fn) => (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      // Convert checkbox values to boolean
      Object.keys(data).forEach(key => {
        if (data[key] === 'on') {
          data[key] = true;
        }
      });
      fn(data);
    },
    watch: jest.fn().mockReturnValue(undefined),
    formState: { errors: {} },
    setValue: jest.fn(),
    getValues: jest.fn(),
    trigger: jest.fn(),
  })
}));

// Mock form submission
HTMLFormElement.prototype.requestSubmit = function() {
  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  this.dispatchEvent(submitEvent);
};
// Mock WebSocket service globally for all tests
jest.mock('./src/services/websocket-service', () => ({
  websocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribeToQuiz: jest.fn().mockReturnValue(() => {}),
    sendQuizChange: jest.fn(),
  },
}));

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 