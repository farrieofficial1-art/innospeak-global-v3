import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const VENDOR_GROUPS = [
  { name: 'react-vendor', pattern: /node_modules\/(react|react-dom|react-router|react-router-dom|react-helmet-async|scheduler)\// },
  { name: 'motion-vendor', pattern: /node_modules\/framer-motion\// },
  { name: 'supabase-vendor', pattern: /node_modules\/@supabase\// },
  { name: 'icons-vendor', pattern: /node_modules\/lucide-react\// },
];

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const group = VENDOR_GROUPS.find((g) => g.pattern.test(id));
          return group ? group.name : undefined;
        },
      },
    },
  },
});
