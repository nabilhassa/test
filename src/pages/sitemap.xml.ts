import type { APIRoute } from 'astro';
import { locales, langMeta } from '../i18n';

// Sitemap for search engines: every language version, linked to each other (hreflang)
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://mnhxmotion.com');
  const today = new Date().toISOString().slice(0, 10);
  const alt = locales
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${new URL(langMeta[l].path, base).href}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL('/', base).href}"/>`)
    .join('\n');
  const urls = locales
    .map((l) => `  <url>\n    <loc>${new URL(langMeta[l].path, base).href}</loc>\n    <lastmod>${today}</lastmod>\n${alt}\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
