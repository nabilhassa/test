# Setup guide: go-live accounts

Three free accounts make the project brief send emails and book real calls.
Do them in this order. Each one takes about 5 minutes.

---

## 1. Netlify: puts the website online

1. Go to **netlify.com** and choose **Sign up → with GitHub** (use the `nabilhassa` account).
2. Click **Add new site → Import an existing project → GitHub**.
3. Choose the repository **nabilhassa/test**.
4. **Branch to deploy:** `claude/website-creation-help-n3g79p`
5. Leave everything else as it is (the settings come from `netlify.toml`), then click **Deploy**.
6. After about 1 minute the site is live at an address like `something.netlify.app`.
   You can rename it under **Site configuration → Change site name**, e.g. `mnhxmotion`.

From now on, every change saved to GitHub goes live automatically.

---

## 2. Resend: sends the brief to your inbox

1. Go to **resend.com** and sign up **with mnhxmotion@gmail.com**.
   (Until you own a domain, Resend can only send emails to the address you signed up with.)
2. Open **API Keys → Create API Key**, name it `website`, permission **Sending access**, and copy the key (it starts with `re_`).
3. In **Netlify → Site configuration → Environment variables → Add a variable**:
   - Key: `RESEND_API_KEY`
   - Value: the key you copied (mark it as a **secret**)
4. In Netlify open **Deploys → Trigger deploy → Deploy site**.
5. Test it: open your site, fill in the brief, and check mnhxmotion@gmail.com (also look in Spam the first time).

**Later, once you own a domain (e.g. mnhxmotion.com):**
- In Resend open **Domains → Add domain** and add the DNS records it shows at your domain provider.
- Then add these two variables in Netlify:
  - `BRIEF_FROM` = `MNH XMotion <brief@mnhxmotion.com>`
  - `CONFIRM_FROM` = `MNH XMotion <hello@mnhxmotion.com>` (this turns on the automatic confirmation email to clients)

---

## 3. Cal.com: live call booking

1. Go to **cal.com** and sign up (with mnhxmotion@gmail.com, username e.g. `mnhxmotion`).
2. Connect your **Google Calendar** when asked, so busy times are blocked automatically.
3. Create an event type:
   - Name: **Strategy Call**, duration **30 min**
   - Location: **Google Meet** or **Cal Video** (the call link is sent automatically)
   - Optionally add a second event type, **Phone Call**
4. Set your **Availability** (the days and hours clients can book).
5. Send Claude the link, e.g. `cal.com/mnhxmotion/strategy-call`. It goes into `src/data/brief.ts` (`calLink`), and after
   sending the brief, clients see your calendar with their name and email already filled in.

Until then, the form asks for preferred days and a time window, and you confirm the call by email.

---

## Variables overview

| Variable | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | `re_…` |
| `BRIEF_TO` | no (default mnhxmotion@gmail.com) | `mnhxmotion@gmail.com` |
| `BRIEF_FROM` | after domain is verified | `MNH XMotion <brief@mnhxmotion.com>` |
| `CONFIRM_FROM` | after domain is verified | `MNH XMotion <hello@mnhxmotion.com>` |
