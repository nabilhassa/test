import type { APIRoute } from 'astro';
import { pieces, order, SIZE, toPath } from '../data/monogram';

// Favicon built from the same monogram geometry (solid gold on a dark tile)
export const GET: APIRoute = () => {
  const pad = 170;
  const box = Math.max(SIZE.w, SIZE.h) + pad * 2;
  const ox = (box - SIZE.w) / 2;
  const oy = (box - SIZE.h) / 2;
  const paths = order
    .map((k) => `<path d="${toPath(pieces[k])}" fill="url(#g)"${k === 'inner' ? ' stroke="#06060f" stroke-width="40" paint-order="stroke"' : ''}/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe3a8"/><stop offset=".45" stop-color="#ffb04a"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient></defs><rect width="${box}" height="${box}" rx="${box * 0.22}" fill="#06060f"/><g transform="translate(${ox} ${oy})">${paths}</g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
