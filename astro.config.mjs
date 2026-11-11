// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mnhxmotion.netlify.app',
  vite: { build: { chunkSizeWarningLimit: 700 } },
});
