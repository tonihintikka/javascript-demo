import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    // localhost is treated as secure context for most Web APIs
    https: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Ensure MediaPipe WASM files are served correctly
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  }
});
