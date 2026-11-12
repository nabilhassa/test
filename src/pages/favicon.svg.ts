import type { APIRoute } from 'astro';
import { squarePieces as pieces, order, SQUARE as SIZE, toPath } from '../data/monogram';

// Favicon built from the same monogram geometry (copper, like the original icon, on a dark tile)
export const GET: APIRoute = () => {
  const pad = 170;
  const box = Math.max(SIZE.w, SIZE.h) + pad * 2;
  const ox = (box - SIZE.w) / 2;
  const oy = (box - SIZE.h) / 2;
  const paths = order
    .map((k) => `<path d="${toPath(pieces[k])}" fill="url(#g)" stroke="url(#g)" stroke-width="24" stroke-linejoin="round"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB27A"/><stop offset="1" stop-color="#FF7A2F"/></linearGradient></defs><rect width="${box}" height="${box}" rx="${box * 0.22}" fill="#06060f"/><g transform="translate(${ox} ${oy})">${paths}</g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
