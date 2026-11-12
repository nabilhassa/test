// Page background: a far starfield that twinkles + soft ambient light motes drifting in front,
// both with scroll parallax for depth. Plain 2D canvas (cheap), paused when the tab is hidden.

type Star = { x: number; y: number; r: number; seed: number; depth: number; c: string };
type Mote = { x: number; y: number; r: number; seed: number; c: string };

const STAR_COLORS = ['243,241,250', '207,226,255', '255,214,184', '191,246,241'];
const MOTE_COLORS = ['255,178,122', '34,211,197', '214,59,168', '188,214,255'];

export function initStarfield(canvas: HTMLCanvasElement, opts: { mobile: boolean; reduced: boolean }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const STARS = opts.mobile ? 160 : 320;
  const MOTES = opts.mobile ? 18 : 40;
  let W = 0;
  let H = 0;
  let stars: Star[] = [];
  let motes: Mote[] = [];

  const build = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // stars live on a tall virtual field so parallax scrolling keeps revealing new ones
    stars = Array.from({ length: STARS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 3,
      r: (0.5 + Math.random()) * (Math.random() < 0.08 ? 1.6 : 0.9),
      seed: Math.random(),
      depth: 0.04 + Math.random() * 0.16,
      c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));
    motes = Array.from({ length: MOTES }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      r: 14 * (0.4 + Math.random()),
      seed: Math.random(),
      c: MOTE_COLORS[Math.floor(Math.random() * MOTE_COLORS.length)],
    }));
  };
  build();
  window.addEventListener('resize', build);

  const draw = (now: number) => {
    const t = now / 1000;
    const sy = window.scrollY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    // far stars: twinkle (0.4 .. 1.0)
    for (const s of stars) {
      const y = (((s.y - sy * s.depth) % (H * 3)) + H * 3) % (H * 3);
      if (y > H) continue;
      const a = (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.2 + s.seed * 60))) * 0.7;
      ctx.fillStyle = `rgba(${s.c},${a})`;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // near motes: slow warped drift, soft and large, stronger parallax
    const tt = t * 0.08;
    for (const m of motes) {
      const px = m.x + 0.12 * Math.sin(tt + 1.9 * m.y + m.seed * 6) + 0.05 * Math.cos(tt * 1.3 + m.seed * 9);
      const py = m.y + 0.12 * Math.cos(tt + 1.9 * m.x + m.seed * 4);
      const x = ((px + 1) / 2) * W;
      const y = ((((py + 1) / 2) * H - sy * 0.35) % (H * 1.4) + H * 1.4) % (H * 1.4) - H * 0.2;
      const a = 0.16 * (0.6 + 0.4 * Math.sin(t * 0.7 + m.seed * 20));
      const g = ctx.createRadialGradient(x, y, 0, x, y, m.r);
      g.addColorStop(0, `rgba(${m.c},${a})`);
      g.addColorStop(1, `rgba(${m.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!opts.reduced && !document.hidden) raf = requestAnimationFrame(draw);
  };
  let raf = requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(draw);
  });
  // with reduced motion: redraw only on scroll (no constant animation)
  if (opts.reduced) window.addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
}
