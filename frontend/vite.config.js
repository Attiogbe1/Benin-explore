import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3001';

  return {
    plugins: [sveltekit()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          proxyTimeout: 30000,
          timeout: 30000,
        },
        '/socket.io': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        }
      }
    }
  };
});
