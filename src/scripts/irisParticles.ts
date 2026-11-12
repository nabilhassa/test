// Swirling star dust that orbits the iris of the eye key visual (2D canvas, additive glow).
// The orbit centre is computed from where the eye image is actually drawn (object-fit: cover).

const IRIS = { x: 0.505, y: 0.495, r: 0.2 }; // iris centre + radius as fractions of the image

export function initIris(canvas: HTMLCanvasElement, img: HTMLImageElement, opts: { mobile: boolean; reduced: boolean }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2);
  const COUNT = opts.mobile ? 260 : 620;
  const colors = ['255,150,80', '255,190,140', '34,211,197', '214,59,168', '255,255,255'];

  type P = { a: number; r: number; s: number; size: number; c: string; tw: number; drift: number };
  const ps: P[] = Array.from({ length: COUNT }, () => {
    const r = Math.pow(Math.random(), 0.7) * 1.9 + 0.35; // in iris radii
    return {
      a: Math.random() * Math.PI * 2,
      r,
      s: (0.08 + Math.random() * 0.18) / r, // inner particles orbit faster
      size: Math.random() * 1.9 + 0.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      tw: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.02,
    };
  });

  let W = 0, H = 0, cx = 0, cy = 0, R = 0;
  const layout = () => {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ir = img.getBoundingClientRect();
    const iw = img.naturalWidth || 1792;
    const ih = img.naturalHeight || 2400;
    const scale = Math.max(ir.width / iw, ir.height / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const ox = (ir.width - rw) * (isNaN(px) ? 0.5 : px);
    const oy = (ir.height - rh) * (isNaN(py) ? 0.5 : py);
    cx = ir.left - rect.left + ox + rw * IRIS.x;
    cy = ir.top - rect.top + oy + rh * IRIS.y;
    R = rw * IRIS.r;
  };
  layout();
  const ro = new ResizeObserver(layout);
  ro.observe(canvas);
  img.addEventListener('load', layout);

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('pointermove', (e) => {
    tmx = e.clientX / window.innerWidth - 0.5;
    tmy = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  let last = performance.now();
  let visible = true;
  let raf = 0;
  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const tiltX = mx * 0.5;
    for (const p of ps) {
      p.a += p.s * dt * (opts.reduced ? 0 : 1);
      p.r += p.drift * dt;
      if (p.r > 2.3) p.r = 0.35;
      if (p.r < 0.3) p.r = 2.2;
      const ca = Math.cos(p.a), sa = Math.sin(p.a);
      // orbit on a slightly tilted disc: flatten y, depth from sin(a)
      const depth = sa; // -1 back, 1 front
      const x = cx + (ca * p.r * R) + depth * tiltX * 20 + mx * 30 * p.r;
      const y = cy + (sa * p.r * R * 0.62) + my * 24 * p.r;
      const twinkle = 0.55 + 0.45 * Math.sin(now * 0.002 + p.tw);
      const fade = Math.min(1, (2.3 - p.r) * 1.4) * Math.min(1, (p.r - 0.3) * 3);
      const alpha = Math.min(1, Math.max(0, twinkle * fade * (0.7 + 0.5 * (depth + 1) / 2)));
      const size = p.size * (0.8 + 0.5 * (depth + 1) / 2) * Math.min(1, Math.max(0.45, R / 150));
      ctx.fillStyle = `rgba(${p.c},${alpha * 0.18})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${p.c},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    if (visible && !stopped && !opts.reduced) raf = requestAnimationFrame(draw);
  };

  let stopped = false;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !stopped;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); raf = requestAnimationFrame(draw); }
  }).observe(canvas);
  raf = requestAnimationFrame(draw);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
