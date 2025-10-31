// jest.setup.ts

// Ensure NODE_ENV is set during tests
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Optional: mock Vite's import.meta.env for compatibility
(globalThis as any).import = {
  meta: {
    env: {
      DEV: false,
      PROD: true,
      VITE_API_URL: 'http://localhost:3000', // or whatever your API URL is
    },
  },
};
