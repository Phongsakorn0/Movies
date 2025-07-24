import '@testing-library/jest-dom'

process.env.JWT_SECRET = 'test-secret-key'
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
  configurable: true
})

expect.extend(require('@testing-library/jest-dom/matchers'))
