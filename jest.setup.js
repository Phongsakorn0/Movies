import '@testing-library/jest-dom'

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'
process.env.NODE_ENV = 'test'

// Setup Jest DOM matchers
expect.extend(require('@testing-library/jest-dom/matchers'));
