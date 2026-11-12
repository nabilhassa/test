// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mnhxmotion.com',
  vite: { build: { chunkSizeWarningLimit: 700 } },
});
