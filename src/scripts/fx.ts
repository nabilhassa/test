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
const rtl = document.documentElement.dir === 'rtl';
const isLatin = (w: string) => /[A-Za-z0-9]/.test(w) && !/[\u0600-\u06FF]/.test(w);
const wordSpan = (text: string) => {
  const outer = document.createElement('span');
  outer.className = 'w';
  const inner = document.createElement('span');
  inner.className = 'wi';
  inner.textContent = text;
  outer.appendChild(inner);
  return outer;
};
document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
  const walk = (node: Node, out: Node[]) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        // tokens: words, with trailing punctuation split off so it stays at the sentence end
        const tokens: string[] = [];
        (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          const m = part.match(/^(.*?)([.,!?؟،:;]+)$/);
          if (m && m[1] && !/^\s+$/.test(part)) tokens.push(m[1], m[2]);
          else tokens.push(part);
        });
        let run: HTMLElement | null = null; // left-to-right group in Arabic text
        tokens.forEach((part) => {
          if (/^\s+$/.test(part)) {
            if (run) run.appendChild(document.createTextNode(' '));
            else out.push(document.createTextNode(' '));
            return;
          }
          if (rtl && isLatin(part)) {
            if (!run) {
              run = document.createElement('span');
              run.dir = 'ltr';
              run.className = 'ltr-run';
              out.push(run);
            }
            run.appendChild(wordSpan(part));
            return;
          }
          if (run && run.lastChild?.nodeType === Node.TEXT_NODE) {
            run.removeChild(run.lastChild);
            out.push(document.createTextNode(' '));
          }
          run = null;
          out.push(wordSpan(part));
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

// ---- Particles all over the site that follow the mouse / taps ----
const particles = document.querySelector<HTMLCanvasElement>('[data-particles]');
if (particles && !reduced) import('./cursorParticles').then(({ initCursorParticles }) => initCursorParticles(particles));

// ---- Hero: light 2D iris particles first, then the WebGL vortex takes over once the page has loaded ----
const irisCanvas = document.querySelector<HTMLCanvasElement>('[data-iris]');
const vortexCanvas = document.querySelector<HTMLCanvasElement>('[data-vortex]');
const irisImg = document.querySelector<HTMLImageElement>('[data-parallax]');
if (irisCanvas && irisImg) {
  const mobile = window.innerWidth < 760;
  const stopIris = import('./irisParticles').then(({ initIris }) => initIris(irisCanvas, irisImg, { mobile, reduced }));
  if (vortexCanvas && !reduced) {
    const start = () => {
      import('./vortex').then(async ({ initVortex }) => {
        const introDelay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intro-delay')) || 0;
        const ok = initVortex(vortexCanvas, irisImg, { mobile, startDelay: introDelay * 1000 });
        if (!ok) return;
        vortexCanvas.classList.add('on');
        // let the vortex fade in, then retire the 2D particles
        setTimeout(async () => {
          irisCanvas.classList.add('off');
          (await stopIris)?.();
        }, 2200);
      });
    };
    if (document.readyState === 'complete') setTimeout(start, 200);
    else window.addEventListener('load', () => setTimeout(start, 200), { once: true });
  }
}
