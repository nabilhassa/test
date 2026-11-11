// POST /api/brief: receives the project brief and emails it via Resend.
//
// Environment variables (Netlify → Site configuration → Environment variables):
//   RESEND_API_KEY   required. API key from resend.com
//   BRIEF_TO         where briefs are sent (default: mnhxmotion@gmail.com)
//   BRIEF_FROM       sender, e.g. "MNH XMotion <brief@mnhxmotion.com>"
//                    (default: Resend's test sender, which can only email the Resend account owner)
//   CONFIRM_FROM     optional. When set (needs a verified domain in Resend), the client also
//                    receives a confirmation email from this address.

type Answers = Record<string, string | string[]>;

const LABELS: Record<string, string> = {
  clientType: 'Client type',
  service: 'Service',
  purpose: 'Main purpose',
  platforms: 'Published on',
  timeline: 'Timeline',
  style: 'Visual style',
  assets: 'Footage / assets',
  complexity: 'Complexity',
  budget: 'Budget',
  engagement: 'One-time / ongoing',
  decision: 'Decision makers',
  notes: 'Notes',
  source: 'Heard about us via',
  callType: 'Call type',
  days: 'Preferred days',
  timeWindow: 'Preferred time',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  brand: 'Creator / brand',
  mainPlatform: 'Main platform',
  profile: 'Profile',
  consent: 'Consent to be contacted',
};

const REQUIRED = ['clientType', 'service', 'name', 'email', 'phone', 'consent'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const val = (v: unknown) => (Array.isArray(v) ? v.map(String).join(', ') : String(v ?? ''));

export function clean(raw: unknown): Answers | null {
  if (!raw || typeof raw !== 'object') return null;
  const out: Answers = {};
  for (const key of Object.keys(LABELS)) {
    const v = (raw as Record<string, unknown>)[key];
    if (v == null || v === '') continue;
    if (Array.isArray(v)) out[key] = v.slice(0, 12).map((x) => String(x).slice(0, 300));
    else out[key] = String(v).slice(0, key === 'notes' ? 4000 : 300);
  }
  return out;
}

export function validate(a: Answers): string | null {
  for (const k of REQUIRED) if (!a[k] || (Array.isArray(a[k]) && !a[k].length)) return `missing ${k}`;
  if (a.consent !== 'yes') return 'consent required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(a.email))) return 'invalid email';
  return null;
}

export function renderOwnerEmail(a: Answers) {
  const rows = Object.keys(LABELS)
    .filter((k) => a[k] !== undefined)
    .map(
      (k) =>
        `<tr><td style="padding:8px 14px;color:#9a98b5;vertical-align:top;white-space:nowrap">${esc(LABELS[k])}</td><td style="padding:8px 14px;color:#f3f1fa">${esc(val(a[k])).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');
  const html = `<div style="background:#06060f;padding:28px;font-family:Arial,Helvetica,sans-serif">
  <h1 style="color:#ffb27a;font-size:20px;margin:0 0 6px">New project brief</h1>
  <p style="color:#9a98b5;margin:0 0 18px">${esc(val(a.name))} · ${esc(val(a.service))} · ${esc(val(a.budget))}</p>
  <table style="border-collapse:collapse;background:#0e0f1e;border:1px solid #2a2030;border-radius:10px;font-size:14px">${rows}</table>
  <p style="color:#9a98b5;font-size:12px;margin-top:18px">Reply to this email to answer ${esc(val(a.name))} directly.</p>
</div>`;
  const text = Object.keys(LABELS)
    .filter((k) => a[k] !== undefined)
    .map((k) => `${LABELS[k]}: ${val(a[k])}`)
    .join('\n');
  return { html, text };
}

const CONFIRM: Record<string, { subject: string; hi: string; body: string; sign: string }> = {
  en: {
    subject: 'We received your project brief, MNH XMotion',
    hi: 'Hi',
    body: 'thank you for your project brief! We’re reviewing your answers and will get back to you shortly. If you booked a call, you’ll find the details in a separate email.',
    sign: 'MNH XMotion',
  },
};

export function renderConfirmEmail(a: Answers, lang: string) {
  const t = CONFIRM[lang] ?? CONFIRM.en;
  const name = val(a.name).split(' ')[0];
  const html = `<div style="background:#06060f;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#f3f1fa">
  <p style="font-size:16px">${esc(t.hi)} ${esc(name)},</p>
  <p style="font-size:16px;line-height:1.6">${esc(t.body)}</p>
  <p style="color:#ffb27a;font-size:16px;margin-top:24px">${esc(t.sign)}</p>
</div>`;
  return { subject: t.subject, html, text: `${t.hi} ${name},\n\n${t.body}\n\n${t.sign}` };
}

async function sendEmail(key: string, payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const env = (k: string) => (globalThis as { Netlify?: { env: { get(k: string): string | undefined } } }).Netlify?.env.get(k) ?? process.env[k];

  let body: { answers?: unknown; website?: string; lang?: string; elapsed?: number };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  // Spam protection: hidden honeypot field filled, or form completed impossibly fast → pretend success
  if (body.website || (typeof body.elapsed === 'number' && body.elapsed < 4000)) return json({ ok: true });

  const answers = clean(body.answers);
  if (!answers) return json({ ok: false, error: 'invalid answers' }, 400);
  const problem = validate(answers);
  if (problem) return json({ ok: false, error: problem }, 400);

  const key = env('RESEND_API_KEY');
  if (!key) {
    console.error('RESEND_API_KEY is not set');
    return json({ ok: false, error: 'email not configured' }, 500);
  }

  const owner = renderOwnerEmail(answers);
  try {
    await sendEmail(key, {
      from: env('BRIEF_FROM') || 'MNH XMotion <onboarding@resend.dev>',
      to: [env('BRIEF_TO') || 'mnhxmotion@gmail.com'],
      reply_to: String(answers.email),
      subject: `New brief: ${val(answers.name)} · ${val(answers.service)}`,
      html: owner.html,
      text: owner.text,
    });
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: 'send failed' }, 502);
  }

  const confirmFrom = env('CONFIRM_FROM');
  if (confirmFrom) {
    const c = renderConfirmEmail(answers, String(body.lang || 'en'));
    // A failed confirmation must not fail the whole request: the brief already reached you
    await sendEmail(key, { from: confirmFrom, to: [String(answers.email)], subject: c.subject, html: c.html, text: c.text }).catch((e) => console.error(e));
  }

  return json({ ok: true });
};

export const config = { path: '/api/brief' };
