import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'lib': path.resolve(__dirname, 'src/lib'),
      'components': path.resolve(__dirname, 'src/components'),
      'types': path.resolve(__dirname, 'src/types'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'date-fns': ['date-fns'],
          'zustand': ['zustand']
        }
      },
      preserveEntrySignatures: 'strict'
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'date-fns']
  }
});
