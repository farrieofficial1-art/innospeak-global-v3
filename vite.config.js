import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/node_modules/lucide-react/')) return 'vendor-icons';
          if (id.includes('/node_modules/framer-motion/')) return 'vendor-motion';
          if (id.includes('/node_modules/@supabase/')) return 'vendor-supabase';
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
});
