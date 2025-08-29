import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE');

  return {
    server: {
      port: 3500,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:6085',
          changeOrigin: true,
          secure: false
        }
      },
      fs: {
        strict: true,
        allow: ['..']
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'src': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'utils': path.resolve(__dirname, './src/utils')
      },
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    build: {
      sourcemap: true
    }
  };
});
