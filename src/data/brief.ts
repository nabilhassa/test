// Project brief: questions, texts and booking settings in English, German and Arabic.
import type { Lang } from '../i18n';

export type Option = string | { label: string; other: true };
export type Question =
  | { id: string; type: 'single' | 'multi'; label: string; hint?: string; required?: boolean; max?: number; options: Option[] }
  | { id: string; type: 'textarea'; label: string; hint?: string; required?: boolean; placeholder?: string }
  | { id: string; type: 'select'; label: string; required?: boolean; placeholder: string; options: string[] }
  | { id: string; type: 'fields'; label: string; required?: boolean; fields: { id: string; label: string; type: 'text' | 'email' | 'tel'; autocomplete?: string }[] }
  | { id: string; type: 'consent'; label: string; required?: boolean };

export type Step = { id: string; title: string; questions: Question[]; when?: 'no-calendar' };

export const booking = {
  // Cal.com booking link, e.g. 'mnhxmotion/strategy-call'.
  // While empty, the form asks for preferred days/time instead and you confirm the call by email.
  calLink: '',
};

const o = (label: string) => ({ label, other: true }) as const;

const en = {
  welcome: {
    kicker: 'Project brief',
    title: 'Start your project with MNH XMotion.',
    text: 'Answer a few questions about your project and creative direction. This helps us understand what you’re aiming for and how to elevate your visuals. The form takes around 2–3 minutes, and you can book a video call at the end to discuss your project whenever it suits you.',
    cta: 'Let’s start',
    time: '≈ 2–3 minutes',
  },
  ui: {
    next: 'Next',
    back: 'Back',
    submit: 'Send brief',
    sending: 'Sending…',
    close: 'Close',
    step: 'Step',
    of: 'of',
    required: 'Please answer this question.',
    requiredField: 'Please fill in this field.',
    invalidEmail: 'Please enter a valid email address.',
    max: 'Please choose up to {n} options.',
    selectAll: 'Select all that apply.',
    upTo: 'Select up to {n} options.',
    otherPlaceholder: 'Please specify…',
    pressEnter: 'press Enter ↵',
  },
  steps: [
    { id: 'about', title: 'About you', questions: [{ id: 'clientType', type: 'single', label: 'What best describes you?', required: true, options: ['Business / Brand', 'Content Creator'] }] },
    {
      id: 'service',
      title: 'Service selection',
      questions: [{ id: 'service', type: 'single', label: 'Which service do you need?', required: true, options: ['Storytelling Hooks & Trailers', 'Content Management', 'Ads Creation', 'Not sure yet / need guidance'] }],
    },
    {
      id: 'project',
      title: 'Project details',
      questions: [
        { id: 'purpose', type: 'multi', label: 'What is the main purpose of this project?', required: true, options: ['Define or elevate brand identity', 'Edit an existing concept or project', 'Upgrade overall production quality', 'Improve storytelling and script writing', 'Not fully defined yet', o('Other')] },
        { id: 'platforms', type: 'multi', label: 'Where will the video be published?', required: true, options: ['Instagram', 'Facebook', 'YouTube', 'Website', 'TikTok', o('Other')] },
        { id: 'timeline', type: 'single', label: 'What’s your project timeline?', required: true, options: ['Urgent (needed in 7 days)', 'Standard (14+ days is fine)', 'Flexible (2+ months)', 'Not sure yet'] },
      ],
    },
    {
      id: 'creative',
      title: 'Creative direction',
      questions: [
        { id: 'style', type: 'multi', max: 3, label: 'What visual style best fits your project?', required: true, options: ['Cinematic & storytelling-driven', 'Clean & minimal', 'Fast-paced & dynamic', 'Motion graphics focused', 'VFX / 3D heavy', o('Other')] },
        { id: 'assets', type: 'single', label: 'Do you already have footage or assets available?', required: true, options: ['Yes, everything is ready', 'Partially (some footage or assets)', 'No, starting from scratch'] },
        {
          id: 'complexity',
          type: 'single',
          label: 'How complex should the visuals be?',
          hint: 'Higher complexity usually requires more production time and budget.',
          required: true,
          options: [
            'Essential: clean cuts, strong pacing, basic motion graphics',
            'Enhanced: cinematic edits, layered motion graphics, light VFX',
            'Advanced: custom motion design, 3D elements, detailed VFX',
            'High-End: fully cinematic, 3D-heavy, VFX-driven production',
          ],
        },
      ],
    },
    {
      id: 'scope',
      title: 'Budget, scope & logistics',
      questions: [
        { id: 'budget', type: 'single', label: 'What’s your budget range for this project?', required: true, options: ['€500 – €1,000', '€1,000 – €3,000', '€3,000 – €10,000', '€10,000+', 'Not sure yet'] },
        { id: 'engagement', type: 'single', label: 'Will this be a one-time project or ongoing editing support?', required: true, options: ['One project', 'Monthly', 'Undecided', o('Other')] },
        { id: 'decision', type: 'multi', label: 'Who will be involved in the decision-making process?', required: true, options: ['Just me', 'Marketing team', o('Other')] },
        { id: 'notes', type: 'textarea', label: 'Anything else we should know about?', placeholder: 'Links, references, ideas…' },
        { id: 'source', type: 'select', label: 'How did you hear about us?', required: true, placeholder: 'Choose an option', options: ['Instagram', 'TikTok', 'YouTube', 'Google search', 'Recommendation / friend', 'Other'] },
      ],
    },
    {
      id: 'schedule',
      title: 'Schedule your call',
      when: 'no-calendar',
      questions: [
        { id: 'callType', type: 'single', label: 'How would you prefer to have this call?', hint: 'Video calls help us review visuals and align faster.', required: true, options: ['🎥 Video call (recommended)', '📞 Phone call'] },
        { id: 'days', type: 'multi', label: 'Which day(s) work best for you?', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        { id: 'timeWindow', type: 'single', label: 'What time window do you prefer?', required: true, options: ['Morning (9:00 – 12:00)', 'Early afternoon (12:00 – 15:00)', 'Late afternoon (15:00 – 18:00)', 'Flexible'] },
      ],
    },
    {
      id: 'contact',
      title: 'Personal information',
      questions: [
        {
          id: 'you',
          type: 'fields',
          label: 'About you',
          required: true,
          fields: [
            { id: 'name', label: 'Full name', type: 'text', autocomplete: 'name' },
            { id: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
            { id: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
          ],
        },
        {
          id: 'social',
          type: 'fields',
          label: 'About your social media',
          required: true,
          fields: [
            { id: 'brand', label: 'Creator name or brand name', type: 'text', autocomplete: 'organization' },
            { id: 'mainPlatform', label: 'Main platform', type: 'text' },
            { id: 'profile', label: 'Profile link or @handle', type: 'text' },
          ],
        },
        { id: 'consent', type: 'consent', label: 'I agree that MNH XMotion may use my information to contact me about this project.', required: true },
      ],
    },
  ] as Step[],
  booking: {
    title: 'Book your strategy call',
    text: 'Your brief is in. Pick a time that suits you; the call link is sent to you automatically.',
  },
  done: {
    title: 'Thank you, your brief is in!',
    textCalendar: 'We’ve received your project brief. See you on the call!',
    textNoCalendar: 'We’ll review your project brief and confirm the exact call time by email. Calls are usually scheduled within 1–2 business days.',
    close: 'Back to the website',
  },
  error: {
    title: 'Something went wrong while sending.',
    text: 'Your answers are still here. Please try again, or send them to us by email or WhatsApp.',
    retry: 'Try again',
    email: 'Send by email',
    whatsapp: 'WhatsApp',
  },
};

export type Brief = typeof en;

const de: Brief = {
  welcome: {
    kicker: 'Projekt-Briefing',
    title: 'Starte dein Projekt mit MNH XMotion.',
    text: 'Beantworte ein paar Fragen zu deinem Projekt und deiner kreativen Richtung. So verstehen wir, was du erreichen willst und wie wir deine Visuals aufwerten können. Das Formular dauert etwa 2–3 Minuten, und am Ende kannst du ein Videogespräch buchen, wann es dir passt.',
    cta: 'Los geht’s',
    time: '≈ 2–3 Minuten',
  },
  ui: {
    next: 'Weiter',
    back: 'Zurück',
    submit: 'Briefing senden',
    sending: 'Wird gesendet…',
    close: 'Schließen',
    step: 'Schritt',
    of: 'von',
    required: 'Bitte beantworte diese Frage.',
    requiredField: 'Bitte fülle dieses Feld aus.',
    invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    max: 'Bitte wähle bis zu {n} Optionen.',
    selectAll: 'Mehrfachauswahl möglich.',
    upTo: 'Wähle bis zu {n} Optionen.',
    otherPlaceholder: 'Bitte angeben…',
    pressEnter: 'Enter drücken ↵',
  },
  steps: [
    { id: 'about', title: 'Über dich', questions: [{ id: 'clientType', type: 'single', label: 'Was beschreibt dich am besten?', required: true, options: ['Unternehmen / Marke', 'Content Creator'] }] },
    {
      id: 'service',
      title: 'Leistung',
      questions: [{ id: 'service', type: 'single', label: 'Welche Leistung brauchst du?', required: true, options: ['Storytelling-Hooks & Trailer', 'Content-Management', 'Werbeanzeigen', 'Noch unsicher / brauche Beratung'] }],
    },
    {
      id: 'project',
      title: 'Projektdetails',
      questions: [
        { id: 'purpose', type: 'multi', label: 'Was ist das Hauptziel dieses Projekts?', required: true, options: ['Markenidentität definieren oder aufwerten', 'Ein bestehendes Konzept oder Projekt schneiden', 'Die gesamte Produktionsqualität verbessern', 'Storytelling und Skript verbessern', 'Noch nicht ganz festgelegt', o('Sonstiges')] },
        { id: 'platforms', type: 'multi', label: 'Wo wird das Video veröffentlicht?', required: true, options: ['Instagram', 'Facebook', 'YouTube', 'Website', 'TikTok', o('Sonstiges')] },
        { id: 'timeline', type: 'single', label: 'Wie sieht dein Zeitplan aus?', required: true, options: ['Dringend (in 7 Tagen benötigt)', 'Standard (14+ Tage sind okay)', 'Flexibel (2+ Monate)', 'Noch unsicher'] },
      ],
    },
    {
      id: 'creative',
      title: 'Kreative Richtung',
      questions: [
        { id: 'style', type: 'multi', max: 3, label: 'Welcher visuelle Stil passt am besten zu deinem Projekt?', required: true, options: ['Cinematisch & storytelling-getrieben', 'Clean & minimalistisch', 'Schnell & dynamisch', 'Fokus auf Motion Graphics', 'VFX- / 3D-lastig', o('Sonstiges')] },
        { id: 'assets', type: 'single', label: 'Hast du bereits Material oder Assets?', required: true, options: ['Ja, alles ist bereit', 'Teilweise (etwas Material oder Assets)', 'Nein, wir starten bei null'] },
        {
          id: 'complexity',
          type: 'single',
          label: 'Wie aufwendig sollen die Visuals sein?',
          hint: 'Mehr Aufwand bedeutet meist mehr Produktionszeit und Budget.',
          required: true,
          options: [
            'Essential: saubere Schnitte, starkes Pacing, einfache Motion Graphics',
            'Enhanced: cinematische Edits, mehrschichtige Motion Graphics, leichte VFX',
            'Advanced: individuelles Motion Design, 3D-Elemente, detaillierte VFX',
            'High-End: voll cinematisch, 3D-lastig, VFX-getriebene Produktion',
          ],
        },
      ],
    },
    {
      id: 'scope',
      title: 'Budget, Umfang & Organisation',
      questions: [
        { id: 'budget', type: 'single', label: 'Welches Budget hast du für dieses Projekt?', required: true, options: ['500 – 1.000 €', '1.000 – 3.000 €', '3.000 – 10.000 €', '10.000 € +', 'Noch unsicher'] },
        { id: 'engagement', type: 'single', label: 'Ist es ein einmaliges Projekt oder laufende Unterstützung beim Schnitt?', required: true, options: ['Ein Projekt', 'Monatlich', 'Noch offen', o('Sonstiges')] },
        { id: 'decision', type: 'multi', label: 'Wer ist an der Entscheidung beteiligt?', required: true, options: ['Nur ich', 'Marketing-Team', o('Sonstiges')] },
        { id: 'notes', type: 'textarea', label: 'Gibt es noch etwas, das wir wissen sollten?', placeholder: 'Links, Referenzen, Ideen…' },
        { id: 'source', type: 'select', label: 'Wie hast du von uns erfahren?', required: true, placeholder: 'Option wählen', options: ['Instagram', 'TikTok', 'YouTube', 'Google-Suche', 'Empfehlung / Freunde', 'Sonstiges'] },
      ],
    },
    {
      id: 'schedule',
      title: 'Plane dein Gespräch',
      when: 'no-calendar',
      questions: [
        { id: 'callType', type: 'single', label: 'Wie möchtest du das Gespräch führen?', hint: 'Videogespräche helfen uns, Visuals gemeinsam anzusehen und schneller abzustimmen.', required: true, options: ['🎥 Videogespräch (empfohlen)', '📞 Telefonat'] },
        { id: 'days', type: 'multi', label: 'Welche Tage passen dir am besten?', required: true, options: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] },
        { id: 'timeWindow', type: 'single', label: 'Welches Zeitfenster bevorzugst du?', required: true, options: ['Vormittag (9:00 – 12:00)', 'Früher Nachmittag (12:00 – 15:00)', 'Später Nachmittag (15:00 – 18:00)', 'Flexibel'] },
      ],
    },
    {
      id: 'contact',
      title: 'Persönliche Angaben',
      questions: [
        {
          id: 'you',
          type: 'fields',
          label: 'Über dich',
          required: true,
          fields: [
            { id: 'name', label: 'Vollständiger Name', type: 'text', autocomplete: 'name' },
            { id: 'email', label: 'E-Mail', type: 'email', autocomplete: 'email' },
            { id: 'phone', label: 'Telefon', type: 'tel', autocomplete: 'tel' },
          ],
        },
        {
          id: 'social',
          type: 'fields',
          label: 'Über deine Social Media',
          required: true,
          fields: [
            { id: 'brand', label: 'Creator- oder Markenname', type: 'text', autocomplete: 'organization' },
            { id: 'mainPlatform', label: 'Hauptplattform', type: 'text' },
            { id: 'profile', label: 'Profil-Link oder @Handle', type: 'text' },
          ],
        },
        { id: 'consent', type: 'consent', label: 'Ich bin einverstanden, dass MNH XMotion meine Angaben nutzt, um mich zu diesem Projekt zu kontaktieren.', required: true },
      ],
    },
  ] as Step[],
  booking: {
    title: 'Buche deinen Strategie-Call',
    text: 'Dein Briefing ist angekommen. Wähle einen passenden Termin – den Link zum Gespräch bekommst du automatisch.',
  },
  done: {
    title: 'Danke, dein Briefing ist angekommen!',
    textCalendar: 'Wir haben dein Projekt-Briefing erhalten. Bis bald im Call!',
    textNoCalendar: 'Wir sehen uns dein Briefing an und bestätigen dir den genauen Termin per E-Mail. Gespräche finden in der Regel innerhalb von 1–2 Werktagen statt.',
    close: 'Zurück zur Website',
  },
  error: {
    title: 'Beim Senden ist etwas schiefgelaufen.',
    text: 'Deine Antworten sind noch da. Bitte versuche es erneut oder schick sie uns per E-Mail oder WhatsApp.',
    retry: 'Erneut versuchen',
    email: 'Per E-Mail senden',
    whatsapp: 'WhatsApp',
  },
};

const ar: Brief = {
  welcome: {
    kicker: 'ملخّص المشروع',
    title: 'ابدأ مشروعك مع MNH XMotion.',
    text: 'أجب عن بضعة أسئلة حول مشروعك وتوجّهك الإبداعي. يساعدنا ذلك على فهم ما تطمح إليه وكيف نرتقي بمرئياتك. يستغرق النموذج نحو 2–3 دقائق، ويمكنك في النهاية حجز مكالمة فيديو لمناقشة مشروعك في الوقت الذي يناسبك.',
    cta: 'لنبدأ',
    time: '≈ 2–3 دقائق',
  },
  ui: {
    next: 'التالي',
    back: 'رجوع',
    submit: 'إرسال الملخّص',
    sending: 'جارٍ الإرسال…',
    close: 'إغلاق',
    step: 'الخطوة',
    of: 'من',
    required: 'يرجى الإجابة عن هذا السؤال.',
    requiredField: 'يرجى ملء هذا الحقل.',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    max: 'يرجى اختيار {n} خيارات كحدّ أقصى.',
    selectAll: 'يمكنك اختيار أكثر من خيار.',
    upTo: 'اختر حتى {n} خيارات.',
    otherPlaceholder: 'يرجى التحديد…',
    pressEnter: 'اضغط Enter ↵',
  },
  steps: [
    { id: 'about', title: 'عنك', questions: [{ id: 'clientType', type: 'single', label: 'ما الذي يصفك بشكل أفضل؟', required: true, options: ['شركة / علامة تجارية', 'صانع محتوى'] }] },
    {
      id: 'service',
      title: 'اختيار الخدمة',
      questions: [{ id: 'service', type: 'single', label: 'ما الخدمة التي تحتاجها؟', required: true, options: ['مقدّمات قصصية وتريلرات', 'إدارة المحتوى', 'صناعة الإعلانات', 'لست متأكدًا بعد / أحتاج إلى استشارة'] }],
    },
    {
      id: 'project',
      title: 'تفاصيل المشروع',
      questions: [
        { id: 'purpose', type: 'multi', label: 'ما الهدف الرئيسي من هذا المشروع؟', required: true, options: ['تحديد هوية العلامة التجارية أو الارتقاء بها', 'مونتاج فكرة أو مشروع قائم', 'رفع جودة الإنتاج بشكل عام', 'تحسين السرد القصصي وكتابة النص', 'لم يتحدّد بالكامل بعد', o('أخرى')] },
        { id: 'platforms', type: 'multi', label: 'أين سيُنشر الفيديو؟', required: true, options: ['إنستغرام', 'فيسبوك', 'يوتيوب', 'موقع إلكتروني', 'تيك توك', o('أخرى')] },
        { id: 'timeline', type: 'single', label: 'ما الجدول الزمني لمشروعك؟', required: true, options: ['عاجل (مطلوب خلال 7 أيام)', 'عادي (14 يومًا أو أكثر مناسب)', 'مرن (شهران أو أكثر)', 'لست متأكدًا بعد'] },
      ],
    },
    {
      id: 'creative',
      title: 'التوجّه الإبداعي',
      questions: [
        { id: 'style', type: 'multi', max: 3, label: 'ما الأسلوب البصري الأنسب لمشروعك؟', required: true, options: ['سينمائي يعتمد على السرد القصصي', 'بسيط ونظيف', 'سريع وديناميكي', 'يركّز على الموشن جرافيك', 'يعتمد بكثافة على المؤثرات البصرية / 3D', o('أخرى')] },
        { id: 'assets', type: 'single', label: 'هل لديك مواد مصوّرة أو عناصر جاهزة؟', required: true, options: ['نعم، كل شيء جاهز', 'جزئيًا (بعض المواد أو العناصر)', 'لا، سنبدأ من الصفر'] },
        {
          id: 'complexity',
          type: 'single',
          label: 'ما مستوى التعقيد المطلوب في المرئيات؟',
          hint: 'كلما زاد التعقيد احتاج الإنتاج عادةً إلى وقت وميزانية أكبر.',
          required: true,
          options: [
            'أساسي: قطعات نظيفة وإيقاع قوي وموشن جرافيك بسيط',
            'مُحسَّن: مونتاج سينمائي وموشن جرافيك متعدد الطبقات ومؤثرات بصرية خفيفة',
            'متقدّم: تصميم حركة مخصّص وعناصر 3D ومؤثرات بصرية مفصّلة',
            'احترافي: إنتاج سينمائي بالكامل يعتمد بكثافة على الـ 3D والمؤثرات البصرية',
          ],
        },
      ],
    },
    {
      id: 'scope',
      title: 'الميزانية والنطاق والتنظيم',
      questions: [
        { id: 'budget', type: 'single', label: 'ما نطاق ميزانيتك لهذا المشروع؟', required: true, options: ['€500 – €1,000', '€1,000 – €3,000', '€3,000 – €10,000', '€10,000+', 'لست متأكدًا بعد'] },
        { id: 'engagement', type: 'single', label: 'هل سيكون مشروعًا لمرة واحدة أم دعمًا مستمرًا في المونتاج؟', required: true, options: ['مشروع واحد', 'شهري', 'لم أقرّر بعد', o('أخرى')] },
        { id: 'decision', type: 'multi', label: 'من سيشارك في اتخاذ القرار؟', required: true, options: ['أنا فقط', 'فريق التسويق', o('أخرى')] },
        { id: 'notes', type: 'textarea', label: 'هل هناك أي شيء آخر يجب أن نعرفه؟', placeholder: 'روابط، مراجع، أفكار…' },
        { id: 'source', type: 'select', label: 'كيف سمعت عنّا؟', required: true, placeholder: 'اختر خيارًا', options: ['إنستغرام', 'تيك توك', 'يوتيوب', 'بحث جوجل', 'توصية / صديق', 'أخرى'] },
      ],
    },
    {
      id: 'schedule',
      title: 'حدّد موعد مكالمتك',
      when: 'no-calendar',
      questions: [
        { id: 'callType', type: 'single', label: 'كيف تفضّل إجراء هذه المكالمة؟', hint: 'تساعدنا مكالمات الفيديو على مراجعة المرئيات معًا والتنسيق بشكل أسرع.', required: true, options: ['🎥 مكالمة فيديو (موصى بها)', '📞 مكالمة هاتفية'] },
        { id: 'days', type: 'multi', label: 'ما الأيام الأنسب لك؟', required: true, options: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'] },
        { id: 'timeWindow', type: 'single', label: 'ما الفترة الزمنية التي تفضّلها؟', required: true, options: ['صباحًا (9:00 – 12:00)', 'بعد الظهر مبكرًا (12:00 – 15:00)', 'بعد الظهر متأخرًا (15:00 – 18:00)', 'مرن'] },
      ],
    },
    {
      id: 'contact',
      title: 'معلوماتك الشخصية',
      questions: [
        {
          id: 'you',
          type: 'fields',
          label: 'عنك',
          required: true,
          fields: [
            { id: 'name', label: 'الاسم الكامل', type: 'text', autocomplete: 'name' },
            { id: 'email', label: 'البريد الإلكتروني', type: 'email', autocomplete: 'email' },
            { id: 'phone', label: 'رقم الهاتف', type: 'tel', autocomplete: 'tel' },
          ],
        },
        {
          id: 'social',
          type: 'fields',
          label: 'عن حساباتك على وسائل التواصل',
          required: true,
          fields: [
            { id: 'brand', label: 'اسم صانع المحتوى أو العلامة التجارية', type: 'text', autocomplete: 'organization' },
            { id: 'mainPlatform', label: 'المنصة الرئيسية', type: 'text' },
            { id: 'profile', label: 'رابط الحساب أو ‎@المعرّف', type: 'text' },
          ],
        },
        { id: 'consent', type: 'consent', label: 'أوافق على أن تستخدم MNH XMotion معلوماتي للتواصل معي بخصوص هذا المشروع.', required: true },
      ],
    },
  ] as Step[],
  booking: {
    title: 'احجز مكالمة الاستراتيجية',
    text: 'وصلنا ملخّص مشروعك. اختر الوقت الذي يناسبك، وسيصلك رابط المكالمة تلقائيًا.',
  },
  done: {
    title: 'شكرًا لك، وصلنا ملخّص مشروعك!',
    textCalendar: 'استلمنا ملخّص مشروعك. نراك في المكالمة!',
    textNoCalendar: 'سنراجع ملخّص مشروعك ونؤكّد لك موعد المكالمة بالضبط عبر البريد الإلكتروني. عادةً ما تُجدول المكالمات خلال 1–2 يوم عمل.',
    close: 'العودة إلى الموقع',
  },
  error: {
    title: 'حدث خطأ أثناء الإرسال.',
    text: 'إجاباتك ما زالت محفوظة هنا. يرجى المحاولة مرة أخرى، أو أرسلها إلينا عبر البريد الإلكتروني أو واتساب.',
    retry: 'حاول مرة أخرى',
    email: 'أرسل عبر البريد',
    whatsapp: 'واتساب',
  },
};

export const brief: Record<Lang, Brief> = { en, de, ar };
