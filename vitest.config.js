import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for faster tests (jsdom for more accuracy)
    environment: 'happy-dom',
    
    // Test file patterns - only unit tests
    include: ['tests/unit/**/*.test.js'],
    
    // Exclude patterns - especially e2e tests which use Playwright
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
    
    // Global test setup
    setupFiles: ['./tests/setup.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['demos/**/*.js', 'js/**/*.js'],
      exclude: ['node_modules', 'tests']
    },
    
    // Globals
    globals: true,
    
    // Reporter
    reporter: ['verbose'],
    
    // Timeout
    testTimeout: 10000
  }
});
