// Central place for contact details and site content in English, German and Arabic.
import type { Lang } from '../i18n';

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

const en = {
  meta: {
    title: 'MNH XMotion: Cinematic Video Editing, 3D & VFX',
    description: 'MNH XMotion creates cinematic content and ads with storytelling, 3D animation and VFX for brands and content creators.',
  },
  a11y: {
    main: 'Main',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    backToTop: 'MNH XMotion, back to top',
    scrollDown: 'Scroll down',
    toolkit: 'Our toolkit',
    filter: 'Filter by category',
    player: 'Video player',
    model: '3D MNH XMotion monogram',
    legal: 'Legal',
  },
  nav: { services: 'Services', work: 'Work', why: 'Why us', process: 'Process', contact: 'Contact', cta: 'Start Project' },
  hero: {
    eyebrow: 'Cinematic video agency',
    title: ['MNH', 'XMotion'],
    lead: 'We make content and ads that mix cinematic edits, 3D, and VFX.',
    sub: 'For brands & creators who want to differentiate their content from others.',
    cta: 'Start Project',
    secondary: 'See our work',
    tags: ['FX', 'VFX', '3D', 'COLOR'],
  },
  strips: [
    ['XMOTION', 'VFX', '3D ANIMATION', 'COLOR', 'STORYTELLING', 'ADS'],
    ['HOOKS', 'TRAILERS', 'CONTENT', 'MOTION GRAPHICS', 'AI CREATIVITY', 'CINEMATIC EDITS'],
  ],
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
    statement: [{ t: 'Your visuals ' }, { t: 'instantly level up.', hl: true }],
    text: 'Your videos gain stronger storytelling, cleaner pacing, and the kind of detail that keeps viewers watching instead of scrolling. Your brand starts to look premium — sharper, more intentional, and clearly above your competitors. Whether you’re a business or a creator, your content feels like it belongs to someone operating at the top, not in the middle of the pack.',
    pillars: [
      { k: '01', t: 'Stronger storytelling' },
      { k: '02', t: 'Cleaner pacing' },
      { k: '03', t: 'Watching, not scrolling' },
      { k: '04', t: 'A premium brand look' },
    ],
    hint: 'Move your mouse',
  },
  process: {
    kicker: 'Our work process',
    title: 'From first idea to final cut',
    step: 'Step',
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
  footer: { rights: 'All rights reserved.', imprint: 'Imprint', privacy: 'Privacy' },
  whatsapp: 'Chat on WhatsApp',
};

export type Content = typeof en;

const de: Content = {
  meta: {
    title: 'MNH XMotion: Cinematischer Videoschnitt, 3D & VFX',
    description: 'MNH XMotion erstellt cinematischen Content und Werbung mit Storytelling, 3D-Animation und VFX für Marken und Content Creator.',
  },
  a11y: {
    main: 'Hauptmenü',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    language: 'Sprache',
    backToTop: 'MNH XMotion, zurück nach oben',
    scrollDown: 'Nach unten scrollen',
    toolkit: 'Unsere Werkzeuge',
    filter: 'Nach Kategorie filtern',
    player: 'Videoplayer',
    model: '3D-Monogramm von MNH XMotion',
    legal: 'Rechtliches',
  },
  nav: { services: 'Leistungen', work: 'Arbeiten', why: 'Warum wir', process: 'Ablauf', contact: 'Kontakt', cta: 'Projekt starten' },
  hero: {
    eyebrow: 'Agentur für cinematische Videos',
    title: ['MNH', 'XMotion'],
    lead: 'Wir erstellen Content und Werbung, die cinematischen Schnitt, 3D und VFX vereinen.',
    sub: 'Für Marken & Creator, die sich mit ihrem Content von anderen abheben wollen.',
    cta: 'Projekt starten',
    secondary: 'Unsere Arbeiten',
    tags: ['FX', 'VFX', '3D', 'COLOR'],
  },
  strips: [
    ['XMOTION', 'VFX', '3D ANIMATION', 'COLOR', 'STORYTELLING', 'ADS'],
    ['HOOKS', 'TRAILER', 'CONTENT', 'MOTION GRAPHICS', 'KI-KREATIVITÄT', 'CINEMATIC EDITS'],
  ],
  services: {
    kicker: 'Was wir machen',
    title: 'Drei Wege, deinen Content aufzuwerten',
    items: [
      {
        icon: 'hooks',
        title: 'Storytelling-Hooks & Trailer',
        text: 'Wir erstellen Hooks im Storytelling-Stil und cinematische Trailer sowie dynamische Edits mit bis zu 5 Minuten Länge. Jedes Projekt kann Motion Graphics, cinematischen Schnitt, 3D-Animation, KI-Prompt-Engineering und VFX enthalten – kombiniert, wie du es möchtest. Du bestimmst, wie schlicht oder aufwendig das Ergebnis wird.',
        chips: ['Hooks', 'Trailer', 'Edits ≤ 5 Min.'],
      },
      {
        icon: 'content',
        title: 'Content-Management',
        text: 'Wir übernehmen den gesamten Prozess für Creator und Unternehmen: Planung, Text, Produktion, Schnitt (Short- und Long-Form) und Veröffentlichung auf allen Social-Media-Plattformen. Jeder Beitrag lässt sich mit 3D-Animation, cinematischem Schnitt, Motion Graphics, KI-Prompt-Engineering und VFX individuell gestalten – du entscheidest, welche Elemente am besten zu deinem Content passen.',
        chips: ['Planung', 'Produktion', 'Veröffentlichung'],
      },
      {
        icon: 'ads',
        title: 'Werbeanzeigen',
        text: 'Wir produzieren Werbung für physische Produkte, Dienstleistungen und digitale Produkte. Die Anzeigen lassen sich mit cinematischem Schnitt, Motion Graphics, 3D-Animation, VFX und KI-gestützter Kreativität ganz an deine Vorlieben und deinen Stil anpassen. Du bestimmst, wie schlicht oder aufwendig das Ergebnis wird.',
        chips: ['Produkte', 'Dienstleistungen', 'Digital'],
      },
    ],
  },
  work: {
    kicker: 'Ausgewählte Arbeiten',
    title: 'Unsere Arbeiten in Bewegung',
    all: 'Alle',
    categories: { vfx: 'VFX', cinematic: 'Cinematic Storytelling', motion: 'Motion Graphics' },
    play: 'Video abspielen',
    close: 'Schließen',
  },
  why: {
    kicker: 'Warum mit uns arbeiten?',
    statement: [{ t: 'Deine Visuals – ' }, { t: 'sofort auf dem nächsten Level.', hl: true }],
    text: 'Deine Videos bekommen stärkeres Storytelling, saubereres Pacing und genau die Details, die Zuschauer dranbleiben lassen, statt weiterzuscrollen. Deine Marke wirkt hochwertig – schärfer, durchdachter und klar über deiner Konkurrenz. Ob Unternehmen oder Creator: Dein Content wirkt, als käme er von jemandem an der Spitze, nicht aus dem Mittelfeld.',
    pillars: [
      { k: '01', t: 'Stärkeres Storytelling' },
      { k: '02', t: 'Saubereres Pacing' },
      { k: '03', t: 'Zuschauen statt scrollen' },
      { k: '04', t: 'Ein hochwertiger Markenauftritt' },
    ],
    hint: 'Bewege die Maus',
  },
  process: {
    kicker: 'Unser Ablauf',
    title: 'Von der ersten Idee bis zum finalen Schnitt',
    step: 'Schritt',
    steps: [
      { t: 'Formular ausfüllen', d: 'Du beantwortest die Projektfragen und buchst ein kostenloses Videogespräch, wann es dir passt.' },
      { t: 'Strategie-Call', d: 'Wir gehen deine Antworten durch, schärfen deine Vision und legen genau fest, was du willst. Dann unterschreiben wir den Vertrag und starten das Projekt.' },
      { t: 'Kreative Planung', d: 'Du lädst dein Material hoch. Wir sichten es, bauen die Struktur, definieren den Stil und erstellen einen klaren Plan.' },
      { t: 'Schnitt', d: 'Wir erstellen den Hauptschnitt, bauen das Storytelling auf und ergänzen Motion Graphics, 3D und VFX, wo es passt.' },
      { t: 'Feinschliff', d: 'Farbkorrektur, Color Matching, Sounddesign und Musik.' },
      { t: 'Review & Lieferung', d: 'Du gibst Feedback, wir überarbeiten und liefern dein finales Video in allen benötigten Formaten.' },
    ],
    cta: 'Projekt starten',
  },
  start: {
    kicker: 'Projekt-Briefing',
    title: 'Starte dein Projekt mit MNH XMotion.',
    text: 'Beantworte ein paar Fragen zu deinem Projekt und deiner kreativen Richtung. So verstehen wir, was du erreichen willst und wie wir deine Visuals aufwerten können. Das Formular dauert etwa 2–3 Minuten, und am Ende kannst du ein Videogespräch buchen, wann es dir passt.',
    cta: 'Los geht’s',
    time: '≈ 2–3 Minuten · kostenloser Strategie-Call',
  },
  contact: {
    kicker: 'Kontakt',
    title: 'Fragen? Melde dich.',
    text: 'Wenn du Fragen hast oder dein Projekt vorab besprechen möchtest, melde dich jederzeit.',
    email: 'E-Mail',
    phone: 'Telefon / WhatsApp',
    instagram: 'Instagram',
  },
  footer: { rights: 'Alle Rechte vorbehalten.', imprint: 'Impressum', privacy: 'Datenschutz' },
  whatsapp: 'Auf WhatsApp schreiben',
};

const ar: Content = {
  meta: {
    title: 'MNH XMotion: مونتاج فيديو سينمائي و3D ومؤثرات بصرية',
    description: 'تصنع MNH XMotion محتوى وإعلانات سينمائية بالسرد القصصي والرسوم المتحركة ثلاثية الأبعاد والمؤثرات البصرية للعلامات التجارية وصنّاع المحتوى.',
  },
  a11y: {
    main: 'القائمة الرئيسية',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    language: 'اللغة',
    backToTop: 'MNH XMotion، العودة إلى الأعلى',
    scrollDown: 'التمرير للأسفل',
    toolkit: 'أدواتنا',
    filter: 'التصفية حسب الفئة',
    player: 'مشغّل الفيديو',
    model: 'شعار MNH XMotion ثلاثي الأبعاد',
    legal: 'معلومات قانونية',
  },
  nav: { services: 'الخدمات', work: 'أعمالنا', why: 'لماذا نحن', process: 'آلية العمل', contact: 'تواصل معنا', cta: 'ابدأ مشروعك' },
  hero: {
    eyebrow: 'وكالة فيديو سينمائي',
    title: ['MNH', 'XMotion'],
    lead: 'نصنع محتوى وإعلانات تمزج بين المونتاج السينمائي والـ 3D والمؤثرات البصرية.',
    sub: 'للعلامات التجارية وصنّاع المحتوى الذين يريدون أن يتميّز محتواهم عن الآخرين.',
    cta: 'ابدأ مشروعك',
    secondary: 'شاهد أعمالنا',
    tags: ['FX', 'VFX', '3D', 'COLOR'],
  },
  strips: [
    ['XMOTION', 'VFX', '3D ANIMATION', 'COLOR', 'STORYTELLING', 'ADS'],
    ['HOOKS', 'TRAILERS', 'CONTENT', 'MOTION GRAPHICS', 'AI CREATIVITY', 'CINEMATIC EDITS'],
  ],
  services: {
    kicker: 'ماذا نقدّم',
    title: 'ثلاث طرق للارتقاء بمحتواك',
    items: [
      {
        icon: 'hooks',
        title: 'مقدّمات قصصية وتريلرات',
        text: 'نصنع مقدّمات جاذبة بأسلوب قصصي وتريلرات سينمائية، إضافةً إلى مونتاج ديناميكي حتى 5 دقائق. يمكن أن يتضمن كل مشروع موشن جرافيك ومونتاجًا سينمائيًا ورسومًا متحركة ثلاثية الأبعاد وهندسة أوامر الذكاء الاصطناعي ومؤثرات بصرية، مدمجة بالطريقة التي تفضّلها. أنت من يحدّد مدى بساطة النتيجة النهائية أو تعقيدها.',
        chips: ['مقدّمات جاذبة', 'تريلرات', 'مونتاج حتى 5 دقائق'],
      },
      {
        icon: 'content',
        title: 'إدارة المحتوى',
        text: 'ندير العملية كاملةً لصنّاع المحتوى والشركات: التخطيط والكتابة والإنتاج والمونتاج (القصير والطويل) والنشر على جميع منصات التواصل الاجتماعي. يمكن تخصيص كل عمل برسوم متحركة ثلاثية الأبعاد ومونتاج سينمائي وموشن جرافيك وهندسة أوامر الذكاء الاصطناعي ومؤثرات بصرية، وأنت تقرّر العناصر الأنسب لمحتواك.',
        chips: ['التخطيط', 'الإنتاج', 'النشر'],
      },
      {
        icon: 'ads',
        title: 'صناعة الإعلانات',
        text: 'ننتج إعلانات للمنتجات المادية والخدمات والمنتجات الرقمية. يمكن تصميم الإعلانات بمونتاج سينمائي وموشن جرافيك ورسوم متحركة ثلاثية الأبعاد ومؤثرات بصرية وإبداع مدعوم بالذكاء الاصطناعي، بما يتوافق تمامًا مع ذوقك وأسلوبك. أنت من يحدّد مدى بساطة النتيجة النهائية أو تعقيدها.',
        chips: ['منتجات', 'خدمات', 'منتجات رقمية'],
      },
    ],
  },
  work: {
    kicker: 'أعمال مختارة',
    title: 'أعمالنا في حركة',
    all: 'الكل',
    categories: { vfx: 'مؤثرات بصرية', cinematic: 'سرد سينمائي', motion: 'موشن جرافيك' },
    play: 'تشغيل الفيديو',
    close: 'إغلاق',
  },
  why: {
    kicker: 'لماذا تعمل معنا؟',
    statement: [{ t: 'مرئياتك ' }, { t: 'ترتقي فورًا.', hl: true }],
    text: 'تكتسب فيديوهاتك سردًا أقوى وإيقاعًا أنظف، وتفاصيل تجعل المشاهد يتابع بدل أن يمرّر. تبدو علامتك التجارية فاخرة: أوضح وأكثر إتقانًا ومتفوّقة بوضوح على منافسيك. سواء كنت شركة أو صانع محتوى، سيبدو محتواك وكأنه صادر عن جهة في القمّة، لا في منتصف الطريق.',
    pillars: [
      { k: '01', t: 'سرد قصصي أقوى' },
      { k: '02', t: 'إيقاع أنظف' },
      { k: '03', t: 'مشاهدة لا تمرير' },
      { k: '04', t: 'مظهر فاخر لعلامتك' },
    ],
    hint: 'حرّك الماوس',
  },
  process: {
    kicker: 'آلية عملنا',
    title: 'من الفكرة الأولى حتى النسخة النهائية',
    step: 'الخطوة',
    steps: [
      { t: 'املأ النموذج', d: 'تجيب عن أسئلة المشروع وتحجز مكالمة فيديو مجانية في الوقت الذي يناسبك.' },
      { t: 'مكالمة الاستراتيجية', d: 'نراجع إجاباتك ونوضّح رؤيتك ونؤكّد بدقّة ما تريده، ثم نوقّع العقد ونبدأ المشروع.' },
      { t: 'التخطيط الإبداعي', d: 'ترفع موادك المصوّرة، فندرسها ونبني الهيكل ونحدّد الأسلوب ونُعدّ خطة واضحة.' },
      { t: 'المونتاج', d: 'ننشئ النسخة الأساسية ونبني السرد القصصي، ثم نضيف الموشن جرافيك والـ 3D والمؤثرات البصرية حيث يلزم.' },
      { t: 'اللمسات الأخيرة', d: 'تصحيح الألوان ومطابقتها، وتصميم الصوت والموسيقى.' },
      { t: 'المراجعة والتسليم', d: 'تقدّم ملاحظاتك، فنعدّل ونسلّم الفيديو النهائي بجميع الصيغ المطلوبة.' },
    ],
    cta: 'ابدأ مشروعك',
  },
  start: {
    kicker: 'ملخّص المشروع',
    title: 'ابدأ مشروعك مع MNH XMotion.',
    text: 'أجب عن بضعة أسئلة حول مشروعك وتوجّهك الإبداعي. يساعدنا ذلك على فهم ما تطمح إليه وكيف نرتقي بمرئياتك. يستغرق النموذج نحو 2–3 دقائق، ويمكنك في النهاية حجز مكالمة فيديو لمناقشة مشروعك في الوقت الذي يناسبك.',
    cta: 'لنبدأ',
    time: '≈ 2–3 دقائق · مكالمة استراتيجية مجانية',
  },
  contact: {
    kicker: 'تواصل معنا',
    title: 'لديك أسئلة؟ تواصل معنا.',
    text: 'إذا كانت لديك أسئلة أو أردت مناقشة مشروعك قبل ملء النموذج، تواصل معنا في أي وقت.',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف / واتساب',
    instagram: 'إنستغرام',
  },
  footer: { rights: 'جميع الحقوق محفوظة.', imprint: 'بيانات الناشر', privacy: 'سياسة الخصوصية' },
  whatsapp: 'تواصل عبر واتساب',
};

export const content: Record<Lang, Content> = { en, de, ar };
