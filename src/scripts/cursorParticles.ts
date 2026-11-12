// Particles floating over the whole site that follow the pointer.
//  - Computer: the swarm follows the mouse and swirls around it; small sparks trail the cursor.
//  - Phone: every tap pulls the particles to that spot (with a small burst); they follow the finger while it moves.
// When the pointer is idle, the particles drift freely again. 2D canvas, paused when the tab is hidden.

type P = { x: number; y: number; vx: number; vy: number; r: number; c: number; pull: number; spin: number; seed: number; follow: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: number };

const COLORS = ['255,178,122', '255,122,47', '34,211,197', '214,59,168', '243,241,250'];
const FOLLOW_SHARE = 0.32; // only about a third of the particles gather at the mouse / tap, the rest keep drifting

export function initCursorParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const COUNT = touch ? 70 : 140;

  // Pre-rendered glow dots (one per colour) – much faster than gradients every frame
  const sprites = COLORS.map((rgb) => {
    const s = document.createElement('canvas');
    s.width = s.height = 64;
    const g = s.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.18, `rgba(${rgb},.85)`);
    grad.addColorStop(0.45, `rgba(${rgb},.22)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return s;
  });

  let W = 0;
  let H = 0;
  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  };
  resize();
  window.addEventListener('resize', resize);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const ps: P[] = Array.from({ length: COUNT }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    vx: rand(-0.2, 0.2),
    vy: rand(-0.2, 0.2),
    r: rand(1.4, 3.6),
    c: Math.floor(Math.random() * COLORS.length),
    pull: rand(0.35, 1), // how strongly this particle follows the pointer
    spin: Math.random() < 0.5 ? -1 : 1, // swirl direction around the pointer
    seed: Math.random() * 1000,
    follow: Math.random() < FOLLOW_SHARE,
  }));
  const sparks: Spark[] = [];

  // Pointer state
  const ptr = { x: W / 2, y: H / 2, active: false, until: 0 };
  const spawn = (x: number, y: number, n: number, speed: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * rand(0.3, 1);
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rand(30, 66), r: rand(1.4, 3.2), c: Math.floor(Math.random() * COLORS.length) });
    }
    if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
  };

  let lastMove = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      // mouse: always follow; touch: follow the finger while it is down
      if (e.pointerType === 'mouse' || e.buttons > 0 || e.pointerType === 'touch') {
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        ptr.active = true;
        ptr.until = performance.now() + (e.pointerType === 'mouse' ? 1800 : 2500);
        const now = performance.now();
        if (now - lastMove > 16) {
          spawn(e.clientX, e.clientY, e.pointerType === 'mouse' ? 1 : 2, 0.8);
          lastMove = now;
        }
      }
    },
    { passive: true },
  );
  window.addEventListener(
    'pointerdown',
    (e) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.active = true;
      ptr.until = performance.now() + 2600;
      spawn(e.clientX, e.clientY, touch ? 28 : 16, 4.2); // tap / click burst
    },
    { passive: true },
  );
  document.addEventListener('mouseleave', () => (ptr.until = 0));

  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(2, (now - last) / 16.67); // 1 = one 60fps frame
    last = now;
    const t = now / 1000;
    if (ptr.active && now > ptr.until) ptr.active = false;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (const p of ps) {
      // gentle free drift (smooth wandering)
      p.vx += Math.cos(t * 0.6 + p.seed) * 0.012 * dt;
      p.vy += Math.sin(t * 0.5 + p.seed * 1.3) * 0.012 * dt;

      const chasing = ptr.active && p.follow;
      if (chasing) {
        const dx = ptr.x - p.x;
        const dy = ptr.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        // pull toward the pointer, stronger when far; swirl around it when close
        const pull = 0.0028 * p.pull * Math.min(1, d / 140);
        p.vx += dx * pull * dt;
        p.vy += dy * pull * dt;
        const swirl = 0.35 * p.pull * Math.max(0, 1 - d / 260);
        p.vx += (-dy / d) * swirl * p.spin * dt;
        p.vy += (dx / d) * swirl * p.spin * dt;
        // keep a small ring free right under the cursor
        if (d < 26) {
          p.vx -= (dx / d) * 0.6 * dt;
          p.vy -= (dy / d) * 0.6 * dt;
        }
      }

      const damp = Math.pow(chasing ? 0.9 : 0.975, dt);
      p.vx *= damp;
      p.vy *= damp;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // wrap around the screen edges while drifting
      if (!chasing) {
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
      }

      const tw = 0.55 + 0.45 * Math.sin(t * 2 + p.seed);
      const size = p.r * 6 * (chasing ? 1.15 : 1);
      ctx.globalAlpha = 0.55 * tw + (chasing ? 0.25 : 0);
      ctx.drawImage(sprites[p.c], p.x - size / 2, p.y - size / 2, size, size);
    }

    // short-lived sparks (cursor trail + tap bursts)
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life += dt;
      if (s.life >= s.max) {
        sparks.splice(i, 1);
        continue;
      }
      s.vx *= Math.pow(0.95, dt);
      s.vy *= Math.pow(0.95, dt);
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = 1 - s.life / s.max;
      const size = s.r * 6 * (0.5 + k);
      ctx.globalAlpha = k * 0.9;
      ctx.drawImage(sprites[s.c], s.x - size / 2, s.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;

    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
}
