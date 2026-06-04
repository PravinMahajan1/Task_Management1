import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/tasks': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/members': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});
