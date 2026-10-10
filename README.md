# Saurabh & Neha · Wedding Invite

A mobile-first Indian wedding invitation website, built with Claude and hosted free on GitHub Pages.

**Live:** https://devrathi46.github.io/neha-saurabh-wedding/

It's a single `index.html` with no framework and no build step. The illustrations are inline SVG, so the page weighs about 30 KB gzipped plus images and music.

Features:
- Tap-to-open envelope with a wax seal, 3D flap, marigold petal burst and music
- Ganesha-Om with the Vakratunda mantra between flickering diyas
- Invitation card with a staggered fade-in
- Live countdown and an "Add to Calendar" file
- Parallax city skyline
- Four illustrated event cards, each with its own animation
- Venue with a lazy-loaded map
- Night-lake closing section with a share button
- RSVP form built into the page, saved to a Google Sheet (no Google cookie or sign-in prompts)
- A WhatsApp preview image

---

## What's in this repo

| Path | What it is |
|---|---|
| `index.html` | The whole invite: markup, styles and script. The `CONFIG` block at the top of the `<script>` holds the settings. |
| `assets/` | Logo (display copy), WhatsApp preview image, favicons, Ganesha-Om, horse and elephant art, music |
| `wedding.ics` | Calendar file behind the "Add to Calendar" button |
| `PROMPT.md` | **The prompt to rebuild this site with Claude**, plus the original prompt |
| `tools/google-form.gs` | Google Apps Script that creates the RSVP form and its responses Sheet |
| `tools/rsvp-endpoint.gs` | Google Apps Script web app that receives the on-page RSVP form and adds rows to the Sheet |
| `tools/build-assets.sh`, `tools/og.html` | Regenerate the WhatsApp preview image and favicons from your logo |
| `tools/logo-neha-saurabh.html` | The N & S monogram logo (SVG in HTML). Render it with headless Chrome to `assets/logo.png` |

---

## Option A: build your own with Claude (recommended)

### 1. Gather these first

| You need | Notes |
|---|---|
| Couple's names, parents' names, dates, city, venue | Venue name and address as they appear on Google Maps |
| Each event's name, date, time and dress code | The prompt has four; add or remove as needed |
| **Logo** | PNG with a transparent background, about 1000 px or larger |
| **Ganesha image** | Transparent PNG or WebP (the opening image) |
| **Horse and elephant images** | Transparent, for the baraat scene. Optional; Claude can draw them. |
| **Music** | A royalty-free, loopable shehnai or santoor track, about 1–5 MB MP3 |

### 2. Run the prompt

1. Use **[Claude Code](https://claude.com/claude-code)**, in the desktop app, a terminal or VS Code. It can write the files, preview the site at phone size, render the preview image and publish it for you. The chat app on claude.ai also works, but you'll copy files and host the site yourself.
2. Open an **empty folder** and start a session.
3. Copy **prompt 1** from [`PROMPT.md`](PROMPT.md). Replace every `[…]` placeholder with your details and send it. Attach your logo and images, or put them in the folder and say where they are.
4. Claude builds the site, starts a local preview, and shows it at phone size.

### 3. Refine it by chatting

Make changes one small request at a time, and check each one in the local preview. Examples from building this invite:
- "Replace the horse and elephant with these images, reduce the size if needed"
- "The tap to open is not intuitive, show some animation. Show me in local first."
- "Once I reload the page and tap again, the page should start from the top"
- "Remove venue from the event cards"
- "Change the example arrival time to 10 Dec, around 9 AM"

### 4. Publish

Ask: *"Publish it on GitHub Pages with an appropriate link."* Claude Code uses the GitHub CLI (`gh`), which you must be signed in to, to create a public repo, turn on Pages and check the live link. Other free hosts work too, such as Netlify Drop, Vercel or Cloudflare Pages.

---

## Option B: reuse this code directly

1. **Fork** this repo, or download it.
2. **Edit `index.html`:**
   - Search for and replace the names, parents' names, dates, venue and event text.
   - In the `CONFIG` block at the top of the `<script>`, set `WEDDING_START` (the countdown target, with timezone) and `WHATSAPP_NUMBER`.
   - Update every `https://devrathi46.github.io/neha-saurabh-wedding` URL in the `<head>` to your own site's URL. WhatsApp needs absolute URLs for the preview.
3. **Swap the art:** replace the files in `assets/` using the same file names, or update the references. Put your full-size logo at `assets/logo.png` and run:
   ```bash
   bash tools/build-assets.sh
   ```
   This rebuilds `assets/og-image.jpg` and the favicons. It needs Google Chrome and Python with Pillow.
4. **Calendar:** edit the events and times in `wedding.ics`. Times are UTC; IST is UTC+5:30.
5. **RSVP form:**
   1. Open [script.google.com](https://script.google.com), click **New project**, and paste in `tools/google-form.gs`.
   2. Edit the event names, then run `createWeddingRsvpForm` and approve the permissions.
   3. The **Execution log** prints the form's links. In `index.html`, find `id="gformBtn"` and replace its form URL with yours. This link is the fallback "RSVP Now" button. Keep it a plain `…/viewform` link: embedding the form in an iframe makes mobile browsers show Google's cookie/sign-in error.
   4. **On-page form:** open the responses Sheet → **Extensions → Apps Script**, paste in `tools/rsvp-endpoint.gs`, set `SHEET_ID` to your Sheet's ID (the long code in its URL), then **Deploy → New deployment → Web app** with *Execute as: Me* and *Who has access: Anyone*. Paste the `/exec` URL into `RSVP_ENDPOINT` in the `CONFIG` block. The form then appears on the page, and its answers land in a **Website RSVPs** tab. If the questions change, update both the form in `index.html` and `COLUMNS` in the script.
6. **Host it:** enable **GitHub Pages** in the repo settings (branch `main`, root folder), or use any static host.

---

## Tips

- **WhatsApp caches link previews.** Send the link to yourself before sharing it widely.
- **Test on a real phone.** Open the preview over the same Wi-Fi, for example `http://<your-computer-ip>:8765`.
- **Music** starts only when the guest taps the envelope, since browsers block audio before that.
- **Motion:** guests who have turned on "Reduce motion" get simple fades instead of animations.
- **Cache:** GitHub Pages can serve the old version for up to about 10 minutes after you publish. Reload after a few minutes.

## Credits & licence

The code, the SVG illustrations and the prompts are free to reuse. **The names, logo, Ganesha, horse and elephant artwork and the music belong to the couples they were made for.** Please replace them with your own. Fonts are from Google Fonts (SIL Open Font License).

Built with Claude.
