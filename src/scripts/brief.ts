// Controller for the multi-step project brief (src/components/BriefForm.astro)

type UI = Record<string, string>;
type Answers = Record<string, string | string[]>;

const dlg = document.querySelector<HTMLDialogElement>('[data-brief]');
if (dlg) init(dlg);

function init(dlg: HTMLDialogElement) {
  const form = dlg.querySelector<HTMLFormElement>('[data-form]')!;
  const { ui, email: ownerEmail } = JSON.parse(dlg.querySelector('[data-brief-ui]')!.textContent || '{}') as { ui: UI; email: string };
  const calLink = dlg.dataset.cal || '';
  const panels = [...dlg.querySelectorAll<HTMLElement>('[data-panel="welcome"], [data-panel="step"]')];
  const steps = panels.filter((p) => p.dataset.panel === 'step');
  const nav = dlg.querySelector<HTMLElement>('[data-nav]')!;
  const progress = dlg.querySelector<HTMLElement>('[data-progress]')!;
  const bars = [...progress.querySelectorAll('i')];
  const stepLabel = dlg.querySelector<HTMLElement>('[data-step-label]')!;
  const nextBtn = nav.querySelector<HTMLButtonElement>('[data-next]')!;
  const nextLabel = nextBtn.querySelector<HTMLElement>('[data-next-label]')!;
  const backBtn = nav.querySelector<HTMLButtonElement>('[data-back]')!;
  const errorBox = dlg.querySelector<HTMLElement>('[data-error]')!;
  const scroller = dlg.querySelector<HTMLElement>('.panels')!;
  let idx = 0;
  let openedAt = 0;
  let sent = false;

  // ---------- open / close ----------
  const open = () => {
    if (!dlg.open) {
      dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
      document.dispatchEvent(new Event('lenis:stop'));
      if (!openedAt) openedAt = Date.now();
    }
  };
  const close = () => dlg.close();
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    document.dispatchEvent(new Event('lenis:start'));
    if (sent) reset();
  });
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  // Capture phase so smooth-scroll anchor handling doesn't also scroll the page
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('a[href="#start"], [data-open-brief]');
      if (!a || dlg.contains(a)) return;
      e.preventDefault();
      e.stopPropagation();
      open();
    },
    true,
  );
  if (location.hash === '#brief') open();

  // ---------- navigation ----------
  const show = (i: number) => {
    panels.forEach((p, pi) => (p.hidden = pi !== i));
    idx = i;
    const inSteps = i > 0;
    nav.hidden = !inSteps;
    progress.hidden = !inSteps;
    backBtn.disabled = i === 0;
    const n = i; // 1-based step number
    bars.forEach((b, bi) => b.classList.toggle('on', bi < n));
    stepLabel.textContent = `${ui.step} ${n} ${ui.of} ${steps.length}`;
    nextLabel.textContent = i === panels.length - 1 ? ui.submit : ui.next;
    errorBox.hidden = true;
    scroller.scrollTop = 0;
    const panel = panels[i];
    const first = panel.querySelector<HTMLElement>('input:not([type=hidden]):not([hidden]), textarea, select, button');
    if (first && i > 0)
      setTimeout(() => {
        // don't steal focus if the visitor is already typing somewhere in this step
        if (!panel.contains(document.activeElement)) first.focus({ preventScroll: true });
      }, 50);
  };

  const next = async () => {
    if (idx > 0 && !validate(panels[idx])) return;
    if (idx === panels.length - 1) return submit();
    show(idx + 1);
  };
  dlg.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', next));
  backBtn.addEventListener('click', () => idx > 0 && show(idx - 1));
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    next();
  });

  // ---------- question behaviour ----------
  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const q = input.closest<HTMLElement>('[data-q]');
    if (!q) return;
    // "Other" reveals a text field
    const otherInput = q.querySelector<HTMLInputElement>('input.other');
    if (otherInput) {
      const on = !!q.querySelector<HTMLInputElement>('input[value="__other"]:checked');
      otherInput.hidden = !on;
      if (on && input.value === '__other') otherInput.focus();
    }
    // Max selections
    const max = Number(q.dataset.max || 0);
    if (max && input.type === 'checkbox') {
      const checked = q.querySelectorAll('input[type=checkbox]:checked');
      if (checked.length > max) {
        input.checked = false;
        setErr(q, ui.max.replace('{n}', String(max)));
        return;
      }
    }
    clearErr(q);
    // Single-question steps with one choice advance automatically
    const panel = q.closest<HTMLElement>('[data-panel="step"]')!;
    if (input.type === 'radio' && input.value !== '__other' && panel.querySelectorAll('[data-q]').length === 1) {
      setTimeout(() => panels[idx] === panel && next(), 380);
    }
  });
  form.addEventListener('input', (e) => {
    const q = (e.target as HTMLElement).closest<HTMLElement>('[data-q]');
    if (q?.classList.contains('invalid')) clearErr(q);
  });

  function setErr(q: HTMLElement, msg: string) {
    q.classList.add('invalid');
    q.querySelector<HTMLElement>('[data-err]')!.textContent = msg;
  }
  function clearErr(q: HTMLElement) {
    q.classList.remove('invalid');
    q.querySelector<HTMLElement>('[data-err]')!.textContent = '';
  }

  function validate(panel: HTMLElement) {
    let firstBad: HTMLElement | null = null;
    panel.querySelectorAll<HTMLElement>('[data-q]').forEach((q) => {
      clearErr(q);
      const type = q.dataset.type;
      const required = q.hasAttribute('data-required');
      let msg = '';
      if (type === 'single' || type === 'multi') {
        const checked = [...q.querySelectorAll<HTMLInputElement>('input:checked')];
        if (required && !checked.length) msg = ui.required;
        else if (checked.some((c) => c.value === '__other') && !q.querySelector<HTMLInputElement>('input.other')!.value.trim()) msg = ui.requiredField;
      } else if (type === 'select') {
        if (required && !q.querySelector<HTMLSelectElement>('select')!.value) msg = ui.required;
      } else if (type === 'fields') {
        for (const inp of q.querySelectorAll<HTMLInputElement>('input')) {
          if (required && !inp.value.trim()) { msg = ui.requiredField; inp.focus(); break; }
          if (inp.type === 'email' && inp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim())) { msg = ui.invalidEmail; break; }
        }
      } else if (type === 'consent') {
        if (required && !q.querySelector<HTMLInputElement>('input')!.checked) msg = ui.required;
      }
      if (msg) {
        setErr(q, msg);
        firstBad ??= q;
      }
    });
    if (firstBad) (firstBad as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return !firstBad;
  }

  // ---------- collect + send ----------
  function collect(): Answers {
    const data = new FormData(form);
    const out: Answers = {};
    form.querySelectorAll<HTMLElement>('[data-q]').forEach((q) => {
      const id = q.dataset.q!;
      const type = q.dataset.type;
      if (type === 'fields') {
        q.querySelectorAll<HTMLInputElement>('input').forEach((i) => (out[i.name] = i.value.trim()));
        return;
      }
      if (type === 'consent') { out[id] = data.get(id) ? 'yes' : 'no'; return; }
      const vals = data.getAll(id).map(String).filter(Boolean);
      const other = String(data.get(`${id}__other`) || '').trim();
      const mapped = vals.map((v) => (v === '__other' ? `Other: ${other}` : v));
      if (type === 'multi') out[id] = mapped;
      else if (mapped.length || type === 'textarea' || type === 'select') out[id] = mapped[0] ?? String(data.get(id) || '');
    });
    return out;
  }

  const summary = (a: Answers) =>
    Object.entries(a)
      .filter(([k]) => k !== 'consent')
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join('\n');

  async function submit() {
    const answers = collect();
    nextBtn.setAttribute('aria-busy', 'true');
    nextLabel.textContent = ui.sending;
    errorBox.hidden = true;
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          website: (form.elements.namedItem('website') as HTMLInputElement).value,
          lang: document.documentElement.lang,
          elapsed: Date.now() - openedAt,
          page: location.href,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
      sent = true;
      done(answers);
    } catch {
      const subject = encodeURIComponent('Project brief, MNH XMotion');
      const body = encodeURIComponent(summary(answers).slice(0, 1800));
      dlg.querySelector<HTMLAnchorElement>('[data-mailto]')!.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      nextBtn.removeAttribute('aria-busy');
      nextLabel.textContent = ui.submit;
    }
  }
  dlg.querySelector('[data-retry]')!.addEventListener('click', submit);

  function done(a: Answers) {
    panels.forEach((p) => (p.hidden = true));
    nav.hidden = true;
    progress.hidden = true;
    errorBox.hidden = true;
    scroller.scrollTop = 0;
    if (calLink) {
      dlg.querySelector<HTMLElement>('[data-panel="booking"]')!.hidden = false;
      loadCal(calLink, a);
    } else {
      dlg.querySelector<HTMLElement>('[data-panel="done"]')!.hidden = false;
    }
  }

  function showDoneAfterBooking() {
    dlg.querySelector<HTMLElement>('[data-panel="booking"]')!.hidden = true;
    const d = dlg.querySelector<HTMLElement>('[data-panel="done"]')!;
    const t = d.querySelector<HTMLElement>('[data-done-text]')!;
    t.textContent = t.dataset.calText || t.textContent;
    d.hidden = false;
  }

  // Cal.com inline embed, pre-filled with the client's name, email and a short brief summary
  function loadCal(link: string, a: Answers) {
    type CalFn = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; q?: unknown[]; loaded?: boolean };
    const w = window as unknown as { Cal?: CalFn };
    if (!w.Cal) {
      // Official Cal.com embed loader
      (function (C: any, A: string, L: string) {
        const p = function (a: any, ar: any) { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal; const ar = arguments;
          if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
          if (ar[0] === L) {
            const api: any = function () { p(api, arguments); };
            const namespace = ar[1]; api.q = api.q || [];
            if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, 'https://app.cal.com/embed/embed.js', 'init');
    }
    const Cal = w.Cal!;
    Cal('init', 'brief', { origin: 'https://cal.com' });
    const notes = `Service: ${a.service ?? ''}\nBudget: ${a.budget ?? ''}\nTimeline: ${a.timeline ?? ''}\nBrand: ${a.brand ?? ''} (${a.profile ?? ''})`;
    Cal.ns.brief('inline', {
      elementOrSelector: '#cal-inline',
      calLink: link,
      layout: 'month_view',
      config: { name: a.name, email: a.email, notes, theme: 'dark', layout: 'month_view' },
    });
    Cal.ns.brief('ui', { theme: 'dark', hideEventTypeDetails: false, layout: 'month_view', styles: { branding: { brandColor: '#ff7a2f' } } });
    Cal.ns.brief('on', { action: 'bookingSuccessful', callback: showDoneAfterBooking });
  }

  function reset() {
    form.reset();
    form.querySelectorAll<HTMLInputElement>('input.other').forEach((i) => (i.hidden = true));
    form.querySelectorAll<HTMLElement>('[data-q]').forEach(clearErr);
    dlg.querySelectorAll<HTMLElement>('[data-panel="booking"], [data-panel="done"]').forEach((p) => (p.hidden = true));
    sent = false;
    openedAt = 0;
    show(0);
  }

  show(0);
}
