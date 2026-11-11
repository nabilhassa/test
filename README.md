# MNH XMotion: Landing Page

Cinematic landing page for MNH XMotion, built with [Astro](https://astro.build). See `PLAN.md` for the full plan.

## Run locally
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Where to change things
- Texts, contact details, portfolio videos: `src/data/site.ts`
- Sections: `src/components/`
- Colors & fonts: `src/styles/global.css`
- Project brief questions & Cal.com link: `src/data/brief.ts`
- Email sending (Netlify Function): `netlify/functions/brief.mts`
- Account setup (Netlify, Resend, Cal.com): `SETUP.md`
