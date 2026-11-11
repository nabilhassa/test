// Central place for contact details and site content.
// Phase 4 adds German and Arabic versions of `content`.

export const contact = {
  email: 'mnhxmotion@gmail.com',
  phoneDisplay: '+49 15566 920370',
  phoneHref: 'tel:+4915566920370',
  whatsappHref: 'https://wa.me/4915566920370',
  instagramHandle: '@mnhxmotion',
  instagramHref: 'https://www.instagram.com/mnhxmotion/',
};

export type Category = 'vfx' | 'cinematic' | 'motion';

export const portfolio: { id: string; title: string; category: Category }[] = [
  { id: '14pnOhSx3rHIYcbGD_VM4oMK6meZf7EQT', title: 'Project 01', category: 'vfx' },
  { id: '1Hq7kyRMaP65MyYWHzvWUA6D2kaoFgYBv', title: 'Project 02', category: 'cinematic' },
  { id: '1fRhCTF7WAAvuTV26DklBP1dLjK6EqQna', title: 'Project 03', category: 'motion' },
  { id: '1hSVQLBo1BGQez0R5ZzYjoLiaM_PGhgOI', title: 'Project 04', category: 'cinematic' },
];

export const content = {
  nav: {
    services: 'Services',
    work: 'Work',
    why: 'Why us',
    process: 'Process',
    contact: 'Contact',
    cta: 'Start Project',
  },
  hero: {
    eyebrow: 'Cinematic video agency',
    title: ['MNH', 'XMotion'],
    lead: 'We make content and ads that mix cinematic edits, 3D, and VFX.',
    sub: 'For brands & creators who want to differentiate their content from others.',
    cta: 'Start Project',
    secondary: 'See our work',
    tags: ['FX', 'VFX', '3D', 'COLOR'],
  },
  services: {
    kicker: 'What we do',
    title: 'Three ways to level up your content',
    items: [
      {
        icon: 'hooks',
        title: 'Storytelling Hooks & Trailers',
        text: 'We create storytelling-style hooks and cinematic trailers, as well as dynamic edits up to 5 minutes. Each project can include motion graphics, cinematic editing, 3D animation, AI prompt engineering, and VFX — combined in the way you prefer. You’re in control of how simple or complex the final result is.',
        chips: ['Hooks', 'Trailers', 'Edits ≤ 5 min'],
      },
      {
        icon: 'content',
        title: 'Content Management',
        text: 'We manage the full process for creators and businesses: planning, writing, producing, editing (short- and long-form), and posting across all social platforms. Each piece can be customized with 3D animation, cinematic editing, motion graphics, AI prompt engineering, and VFX — you decide which elements fit your content best.',
        chips: ['Planning', 'Production', 'Posting'],
      },
      {
        icon: 'ads',
        title: 'Ads Creation',
        text: 'We produce ads for physical products, services, and digital products. The ads can be tailored with cinematic editing, motion graphics, 3D animation, VFX, and AI-driven creativity — fully adjustable to your preferences and style. You’re in control of how simple or complex the final result is.',
        chips: ['Products', 'Services', 'Digital'],
      },
    ],
  },
  work: {
    kicker: 'Selected work',
    title: 'Our work in motion',
    all: 'All',
    categories: { vfx: 'VFX', cinematic: 'Cinematic Storytelling', motion: 'Motion Graphic' },
    play: 'Play video',
    close: 'Close',
  },
  why: {
    kicker: 'Why work with us?',
    statement: [
      { t: 'Your visuals ' },
      { t: 'instantly level up.', hl: true },
    ],
    text: 'Your videos gain stronger storytelling, cleaner pacing, and the kind of detail that keeps viewers watching instead of scrolling. Your brand starts to look premium — sharper, more intentional, and clearly above your competitors. Whether you’re a business or a creator, your content feels like it belongs to someone operating at the top, not in the middle of the pack.',
    pillars: [
      { k: '01', t: 'Stronger storytelling' },
      { k: '02', t: 'Cleaner pacing' },
      { k: '03', t: 'Watching, not scrolling' },
      { k: '04', t: 'A premium brand look' },
    ],
  },
  process: {
    kicker: 'Our work process',
    title: 'From first idea to final cut',
    steps: [
      { t: 'Fill the Form', d: 'You answer the project questions and book a free video call whenever it suits you.' },
      { t: 'Strategy Call', d: 'We go through your answers, clarify your vision, and confirm exactly what you want. Then we sign the contract and start the project.' },
      { t: 'Creative Planning', d: 'You upload your footage. We study it, build the structure, define the style, and prepare a clear plan.' },
      { t: 'Editing', d: 'We create the main cut, build the storytelling, then add motion graphics, 3D, and VFX where needed.' },
      { t: 'Final Polish', d: 'Color correction, color matching, sound design, and music.' },
      { t: 'Review & Delivery', d: 'You give feedback, we revise, and deliver your final video in all required formats.' },
    ],
    cta: 'Start Project',
  },
  start: {
    kicker: 'Project brief',
    title: 'Start your project with MNH XMotion.',
    text: 'Answer a few questions about your project and creative direction. This helps us understand what you’re aiming for and how to elevate your visuals. The form takes around 2–3 minutes, and you can book a video call at the end to discuss your project whenever it suits you.',
    cta: 'Let’s start',
    time: '≈ 2–3 minutes · free strategy call',
  },
  contact: {
    kicker: 'Contact',
    title: 'Have questions? Get in touch.',
    text: 'If you have questions or want to discuss your project before filling the form, reach out anytime.',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    instagram: 'Instagram',
  },
  footer: {
    rights: 'All rights reserved.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  whatsapp: 'Chat on WhatsApp',
};
