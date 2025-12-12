import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    // localhost is treated as secure context for most Web APIs
    https: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        legacy: resolve(__dirname, 'legacy.html'),
        glassmorphism: resolve(__dirname, 'demos/glassmorphism.html'),
        fluidMotion: resolve(__dirname, 'demos/fluid-motion.html'),
        scrollytelling: resolve(__dirname, 'demos/scrollytelling.html'),
        microInteractions: resolve(__dirname, 'demos/micro-interactions.html'),
        viewTransitions: resolve(__dirname, 'demos/view-transitions.html'),
        textAnimations: resolve(__dirname, 'demos/text-animations.html'),
        webgpu3d: resolve(__dirname, 'demos/webgpu-3d.html')
      }
    }
  },
  // Ensure MediaPipe WASM files are served correctly
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  }
});
