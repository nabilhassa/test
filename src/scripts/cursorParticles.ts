// Site particles in two layers:
//  1. Background (behind all content): particles at different 3D depths, attached to the page. When you scroll,
//     near ones move faster and far ones slower (parallax), so the page gets real depth. They drift gently, and on a
//     computer they shift slightly with the mouse (also by depth).
//  2. Front: a small swarm that follows the mouse on a computer and gathers where you tap on a phone, with sparks.
// Both are 2D canvases, never block clicks, and pause when the tab is hidden.

type Bg = { x: number; y: number; depth: number; r: number; c: number; seed: number };
type P = { x: number; y: number; vx: number; vy: number; r: number; c: number; pull: number; spin: number; seed: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: number };

const COLORS = ['255,178,122', '255,122,47', '34,211,197', '214,59,168', '243,241,250'];

export function initCursorParticles(front: HTMLCanvasElement) {
  const fctx = front.getContext('2d');
  // background canvas: fixed, behind every section (z-index -1)
  const back = document.createElement('canvas');
  back.className = 'fx-particles-bg';
  back.setAttribute('aria-hidden', 'true');
  document.body.prepend(back);
  const bctx = back.getContext('2d');
  if (!fctx || !bctx) return;

  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const BG_COUNT = touch ? 100 : 190;
  const SWARM = touch ? 26 : 50;

  // Pre-rendered glow dots (one per colour)
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
    for (const c of [front, back]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
  };
  resize();
  window.addEventListener('resize', resize);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // ---- 1. background depth field (y on a tall virtual band so scrolling keeps revealing particles) ----
  const BAND = 1.6;
  const bg: Bg[] = Array.from({ length: BG_COUNT }, () => {
    const depth = Math.pow(Math.random(), 1.6) * 0.9 + 0.1; // 0.1 = far … 1 = near (more far ones)
    return { x: Math.random(), y: Math.random(), depth, r: rand(0.8, 1.6), c: Math.floor(Math.random() * COLORS.length), seed: Math.random() * 1000 };
  });
  bg.sort((a, b) => a.depth - b.depth); // draw far ones first

  // ---- 2. pointer swarm ----
  const ps: P[] = Array.from({ length: SWARM }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    vx: 0,
    vy: 0,
    r: rand(1.4, 3.4),
    c: Math.floor(Math.random() * COLORS.length),
    pull: rand(0.4, 1),
    spin: Math.random() < 0.5 ? -1 : 1,
    seed: Math.random() * 1000,
  }));
  const sparks: Spark[] = [];
  const ptr = { x: W / 2, y: H / 2, active: false, until: 0 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }; // -1..1, for the background parallax
  const spawn = (x: number, y: number, n: number, speed: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * rand(0.3, 1);
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rand(30, 66), r: rand(1.4, 3.2), c: Math.floor(Math.random() * COLORS.length) });
    }
    if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
  };
  // swarm members that drifted off screen come back from a random spot when called again
  const gatherFrom = () => {
    for (const p of ps) {
      if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) {
        p.x = rand(0, W);
        p.y = rand(0, H);
      }
    }
  };

  let lastMove = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'mouse') {
        mouse.tx = (e.clientX / W) * 2 - 1;
        mouse.ty = (e.clientY / H) * 2 - 1;
      }
      if (e.pointerType === 'mouse' || e.buttons > 0 || e.pointerType === 'touch') {
        if (!ptr.active) gatherFrom();
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
      if (!ptr.active) gatherFrom();
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.active = true;
      ptr.until = performance.now() + 2600;
      spawn(e.clientX, e.clientY, touch ? 28 : 16, 4.2);
    },
    { passive: true },
  );
  document.addEventListener('mouseleave', () => (ptr.until = 0));

  let swarmAlpha = 0; // the swarm fades in when called and out when idle
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(2, (now - last) / 16.67);
    last = now;
    const t = now / 1000;
    if (ptr.active && now > ptr.until) ptr.active = false;
    mouse.x += (mouse.tx - mouse.x) * 0.04 * dt;
    mouse.y += (mouse.ty - mouse.y) * 0.04 * dt;
    const sy = window.scrollY;

    // ---- background: depth parallax, attached to the page ----
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, W, H);
    bctx.globalCompositeOperation = 'lighter';
    const span = H * BAND;
    for (const b of bg) {
      const k = b.depth;
      // scroll: near particles move almost with the page, far ones lag behind
      const baseY = b.y * span + Math.sin(t * 0.25 + b.seed) * 10 * k;
      const y = ((((baseY - sy * (0.15 + 0.85 * k)) % span) + span) % span) - (span - H) / 2;
      if (y < -30 || y > H + 30) continue;
      const x = b.x * W + Math.cos(t * 0.2 + b.seed) * 12 * k - mouse.x * 26 * k;
      const yy = y - mouse.y * 18 * k;
      const tw = 0.6 + 0.4 * Math.sin(t * 1.4 + b.seed);
      const size = b.r * 6 * (0.45 + k * 1.15);
      bctx.globalAlpha = Math.min(1, (0.3 + 0.75 * k) * tw);
      bctx.drawImage(sprites[b.c], x - size / 2, yy - size / 2, size, size);
    }
    bctx.globalAlpha = 1;

    // ---- front: pointer swarm + sparks ----
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.clearRect(0, 0, W, H);
    fctx.globalCompositeOperation = 'lighter';
    swarmAlpha += ((ptr.active ? 1 : 0) - swarmAlpha) * (ptr.active ? 0.12 : 0.03) * dt;
    if (swarmAlpha > 0.01) {
      for (const p of ps) {
        if (ptr.active) {
          const dx = ptr.x - p.x;
          const dy = ptr.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const pull = 0.0028 * p.pull * Math.min(1, d / 140);
          p.vx += dx * pull * dt;
          p.vy += dy * pull * dt;
          const swirl = 0.35 * p.pull * Math.max(0, 1 - d / 260);
          p.vx += (-dy / d) * swirl * p.spin * dt;
          p.vy += (dx / d) * swirl * p.spin * dt;
          if (d < 26) {
            p.vx -= (dx / d) * 0.6 * dt;
            p.vy -= (dy / d) * 0.6 * dt;
          }
        } else {
          p.vx += Math.cos(t * 0.6 + p.seed) * 0.02 * dt;
          p.vy += Math.sin(t * 0.5 + p.seed * 1.3) * 0.02 * dt;
        }
        const damp = Math.pow(ptr.active ? 0.9 : 0.96, dt);
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + p.seed);
        const size = p.r * 6.5;
        fctx.globalAlpha = 0.85 * tw * swarmAlpha;
        fctx.drawImage(sprites[p.c], p.x - size / 2, p.y - size / 2, size, size);
      }
    }
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
      fctx.globalAlpha = k * 0.9;
      fctx.drawImage(sprites[s.c], s.x - size / 2, s.y - size / 2, size, size);
    }
    fctx.globalAlpha = 1;

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
