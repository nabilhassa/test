// Languages of the site. English lives at "/", German at "/de/", Arabic at "/ar/".

export const locales = ['en', 'de', 'ar'] as const;
export type Lang = (typeof locales)[number];

export const langMeta: Record<Lang, { label: string; name: string; path: string; dir: 'ltr' | 'rtl'; og: string }> = {
  en: { label: 'EN', name: 'English', path: '/', dir: 'ltr', og: 'en_US' },
  de: { label: 'DE', name: 'Deutsch', path: '/de/', dir: 'ltr', og: 'de_DE' },
  ar: { label: 'AR', name: 'العربية', path: '/ar/', dir: 'rtl', og: 'ar_AR' },
};

/** Language of the current page, from its URL */
export function getLang(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return (locales as readonly string[]).includes(seg) ? (seg as Lang) : 'en';
}
