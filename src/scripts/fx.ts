// Page-wide cinematic effects: smooth scroll, movie-title text reveals,
// cursor spotlight on cards, 3D tilt and magnetic buttons.
import Lenis from 'lenis';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- Smooth scrolling ----
if (!reduced) {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -70 } });
  const raf = (t: number) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  document.addEventListener('lenis:stop', () => lenis.stop());
  document.addEventListener('lenis:start', () => lenis.start());
}

// ---- Split headings into words for a cinematic mask reveal ----
document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
  const walk = (node: Node, out: Node[]) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) out.push(document.createTextNode(' '));
          else {
            const outer = document.createElement('span');
            outer.className = 'w';
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.textContent = part;
            outer.appendChild(inner);
            out.push(outer);
          }
        });
      } else if (child instanceof HTMLElement) {
        const clone = child.cloneNode(false) as HTMLElement;
        const inner: Node[] = [];
        walk(child, inner);
        inner.forEach((n) => clone.appendChild(n));
        out.push(clone);
      }
    });
  };
  const nodes: Node[] = [];
  walk(el, nodes);
  el.replaceChildren(...nodes);
  el.querySelectorAll<HTMLElement>('.wi').forEach((w, i) => w.style.setProperty('--wi', String(i)));
  el.classList.add('split');
});

// ---- Cursor spotlight + tilt on cards ----
if (finePointer && !reduced) {
  document.querySelectorAll<HTMLElement>('[data-spot]').forEach((el) => {
    const tilt = el.hasAttribute('data-tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      if (tilt) el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-6px)`;
    });
    el.addEventListener('pointerleave', () => {
      if (tilt) el.style.transform = '';
    });
  });

  // ---- Magnetic primary buttons ----
  document.querySelectorAll<HTMLElement>('.btn-primary').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.translate = `${x * 0.18}px ${y * 0.3}px`;
    });
    btn.addEventListener('pointerleave', () => (btn.style.translate = ''));
  });
}

// ---- Lazy-load the 3D monogram when its section approaches ----
const mono = document.querySelector<HTMLCanvasElement>('[data-mono3d]');
if (mono) {
  const io = new IntersectionObserver(
    async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const { initMonogram } = await import('./monogram3d');
      const ok = initMonogram(mono, {
        bg: getComputedStyle(document.documentElement).getPropertyValue('--bg-2').trim() || '#0b0c19',
        mobile: window.innerWidth < 760,
        reduced,
      });
      mono.closest('[data-mono-wrap]')?.classList.add(ok ? 'ready' : 'fallback');
    },
    { rootMargin: '400px 0px' },
  );
  io.observe(mono);
}

// ---- Iris particles in the hero ----
const irisCanvas = document.querySelector<HTMLCanvasElement>('[data-iris]');
const irisImg = document.querySelector<HTMLImageElement>('[data-parallax]');
if (irisCanvas && irisImg) {
  import('./irisParticles').then(({ initIris }) => initIris(irisCanvas, irisImg, { mobile: window.innerWidth < 760, reduced }));
}
