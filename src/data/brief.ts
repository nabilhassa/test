// Project brief: questions, texts and booking settings.
// Phase 4 adds German and Arabic versions.

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

const other = { label: 'Other', other: true } as const;

export const brief = {
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
    {
      id: 'about',
      title: 'About you',
      questions: [
        { id: 'clientType', type: 'single', label: 'What best describes you?', required: true, options: ['Business / Brand', 'Content Creator'] },
      ],
    },
    {
      id: 'service',
      title: 'Service selection',
      questions: [
        {
          id: 'service',
          type: 'single',
          label: 'Which service do you need?',
          required: true,
          options: ['Storytelling Hooks & Trailers', 'Content Management', 'Ads Creation', 'Not sure yet / need guidance'],
        },
      ],
    },
    {
      id: 'project',
      title: 'Project details',
      questions: [
        {
          id: 'purpose',
          type: 'multi',
          label: 'What is the main purpose of this project?',
          required: true,
          options: ['Define or elevate brand identity', 'Edit an existing concept or project', 'Upgrade overall production quality', 'Improve storytelling and script writing', 'Not fully defined yet', other],
        },
        {
          id: 'platforms',
          type: 'multi',
          label: 'Where will the video be published?',
          required: true,
          options: ['Instagram', 'Facebook', 'YouTube', 'Website', 'TikTok', other],
        },
        {
          id: 'timeline',
          type: 'single',
          label: 'What’s your project timeline?',
          required: true,
          options: ['Urgent (needed in 7 days)', 'Standard (14+ days is fine)', 'Flexible (2+ months)', 'Not sure yet'],
        },
      ],
    },
    {
      id: 'creative',
      title: 'Creative direction',
      questions: [
        {
          id: 'style',
          type: 'multi',
          max: 3,
          label: 'What visual style best fits your project?',
          required: true,
          options: ['Cinematic & storytelling-driven', 'Clean & minimal', 'Fast-paced & dynamic', 'Motion graphics focused', 'VFX / 3D heavy', other],
        },
        {
          id: 'assets',
          type: 'single',
          label: 'Do you already have footage or assets available?',
          required: true,
          options: ['Yes, everything is ready', 'Partially (some footage or assets)', 'No, starting from scratch'],
        },
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
        { id: 'engagement', type: 'single', label: 'Will this be a one-time project or ongoing editing support?', required: true, options: ['One project', 'Monthly', 'Undecided', other] },
        { id: 'decision', type: 'multi', label: 'Who will be involved in the decision-making process?', required: true, options: ['Just me', 'Marketing team', other] },
        { id: 'notes', type: 'textarea', label: 'Anything else we should know about?', placeholder: 'Links, references, ideas…' },
        {
          id: 'source',
          type: 'select',
          label: 'How did you hear about us?',
          required: true,
          placeholder: 'Choose an option',
          options: ['Instagram', 'TikTok', 'YouTube', 'Google search', 'Recommendation / friend', 'Other'],
        },
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
