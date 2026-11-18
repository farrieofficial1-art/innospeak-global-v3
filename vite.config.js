import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ACADEMY_COURSES } from './src/lib/data/academy.js';
import { LAB_COURSES } from './src/lib/data/labs.js';
import { CBE_BUNDLES } from './src/lib/data/cbe.js';
import { SITE_ORIGIN } from './src/config/site.js';

const VENDOR_GROUPS = [
  { name: 'react-vendor', pattern: /node_modules\/(react|react-dom|react-router|react-router-dom|react-helmet-async|scheduler)\// },
  { name: 'motion-vendor', pattern: /node_modules\/framer-motion\// },
  { name: 'supabase-vendor', pattern: /node_modules\/@supabase\// },
  { name: 'icons-vendor', pattern: /node_modules\/lucide-react\// },
];

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'innospeak-sitemap',
      async buildStart() {
        const publicDir = resolve('public');
        await mkdir(publicDir, { recursive: true });

        const staticPaths = [
          '/',
          '/about',
          '/academy',
          '/academy/cbe',
          '/labs',
          '/programs',
          '/foundation',
          '/foundation/events',
          '/founder',
          '/impact',
          '/contact',
          '/apply',
          '/become-tutor',
          '/research',
          '/tutor',
          '/news',
          '/events',
          '/community',
          '/partnerships',
          '/careers',
          '/career-hub',
          '/career-hub/opportunities',
          '/for-employers',
          '/faq',
          '/privacy',
          '/terms',
          '/refund-policy',
          '/accessibility',
        ];
        const paths = [
          ...staticPaths,
          ...ACADEMY_COURSES.map((course) => `/academy/${course.slug}`),
          ...LAB_COURSES.map((course) => `/labs/${course.slug}`),
          ...CBE_BUNDLES.map((bundle) => `/academy/cbe/${bundle.slug}`),
        ];
        const uniquePaths = [...new Set(paths)];
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          uniquePaths
            .map((path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`)
            .join('\n') +
          '\n</urlset>\n';

        await writeFile(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8');
      },
    },
  ],
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
