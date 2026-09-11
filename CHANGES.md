# What changed in this update

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `JWT_SECRET`
   (generate with `openssl rand -hex 32`), and Google OAuth credentials.
3. `npm run db:migrate` — applies `migrations/0001_peaceful_dagger.sql`, which adds
   the new `categoryAssignments` table and a uniqueness constraint on cart items.
4. `npm run dev`

## Backend — real logic where there used to be TODOs
- **Auth**: real Google OAuth (state-based CSRF, code exchange, session cookie),
  httpOnly JWT sessions, guest checkout that lazily creates a real account from
  the email typed at checkout.
- **Cart**: moved off localStorage to a server-persisted cart (`/api/cart`), keyed
  by user or an anonymous cookie for guests, with real stock checks and
  guest-to-user cart merging on login.
- **Orders**: `/api/orders` places an order inside a DB transaction — row-locks
  products, re-validates stock server-side, decrements inventory, writes
  orders/orderItems/addresses, notifies admins and the buyer.
- **Enquiries**: routes to the staff assigned to a product's category via the new
  `categoryAssignments` table, falling back to admins, with notifications.
- **Reviews**: verified-purchase enforcement + moderation queue (reviews are
  `pending` until approved — there's no moderation UI yet, see Gaps below).
- **Categories & Products**: real reads/writes, admin-role gated.

## Frontend
- Catalogue and product-detail pages now actually fetch from the API (they were
  stuck on empty mock data before).
- Home page pulls real categories/products instead of hardcoded fake ones.
- **Catalogue is enquiry-driven, not cart-driven**: product cards show name,
  description and a "Send Enquiry" button — no price, no Add to Cart. Clicking
  the button opens a form (subject/message/email/phone) that submits to
  `/api/enquiries`. The product detail page still has price + Add to Cart if
  you want to keep the cart/checkout flow available there — say the word if you
  want that removed too for consistency.
- Every enquiry is emailed to `georgemutinda@saleskadcontrols.co.ke` (configurable
  via `ENQUIRY_NOTIFICATION_EMAIL`) using Resend — see the Email section below.
- New `/admin/products/new` page (admin-only) to add products with photos via
  image URL, since there's no file-upload/storage provider wired up yet.
- New pages mirroring kadcontrols.co.ke's real structure: `/about`, `/what-we-do`,
  `/projects`, `/our-values`, `/partners` (using their real content/partners —
  COELMO, Schneider Electric Systems, Mavili Fire Alarm Systems).
- Navbar/Footer rebranded, theme colors moved to CSS variables
  (`src/app/globals.css`) — currently a placeholder navy/amber palette pending
  Kad Controls' real hex colors. Swap the `--primary`/`--accent` values once
  you have them; everything else references those variables.

## Email (new)
Enquiries are emailed via [Resend](https://resend.com) (`src/backend/email.ts`).
Without `RESEND_API_KEY`/`EMAIL_FROM` set, sending is skipped and a warning is
logged — the enquiry still saves to the database either way, so nothing breaks
if you haven't set this up yet. To enable it:
1. Create a Resend account, verify a sending domain (e.g. a subdomain of
   kadcontrols.co.ke).
2. Set `RESEND_API_KEY` and `EMAIL_FROM` (an address on that verified domain)
   in `.env.local`.
3. Optionally override `ENQUIRY_NOTIFICATION_EMAIL` (defaults to
   georgemutinda@saleskadcontrols.co.ke).


## Known gaps (deliberately out of scope this round)
- **No real payment processor.** Checkout collects a payment method choice
  (cash on delivery / M-Pesa / card) but doesn't charge anything — orders are
  confirmed by a human follow-up. Wiring M-Pesa Daraja or a card processor is a
  separate task once you pick a provider.
- **No file upload for product photos** — only paste-a-URL. Needs a storage
  provider (Vercel Blob, Cloudinary, S3) and credentials.
- **No staff/admin dashboard** — enquiries, orders, and review moderation have
  working backend logic and notifications, but no UI to act on them yet
  (Phase 2 in the original roadmap).
- **Footer links** to `/contact`, `/faq`, `/shipping`, `/returns`, `/privacy`
  are not yet built (404 for now).

## Round 3 — marketing site pivot: no pricing, RFQ instead of checkout, admin CMS
This was a bigger shift: the site is now purely a marketing/lead-gen site, not
a store that takes payment.

**Pricing removed from every public page.** Products keep an optional internal
`price` field (admin-only, never rendered publicly) in case it's useful for
your own reference later — nothing public reads it.

**Cart → Quote List → RFQ email.** `/cart` is now framed as a quote list, no
prices or totals shown. A short form (name/email/phone/company/notes) builds a
`mailto:` link listing every item and quantity, addressed to
georgemutinda@saleskadcontrols.co.ke, and opens the visitor's own email client
to send it — so it comes from *their* inbox, not a server. `/checkout` was
removed entirely (no payment/shipping flow anymore). The old `/api/orders`
transactional-order backend is untouched but unused by the UI — it's there if
you ever want real online ordering back.

**New admin CMS — deliberately not linked anywhere on the public site.**
Reachable only by knowing the URL, and gated to `role: admin` either way:
- `/admin` — dashboard linking to each section
- `/admin/projects` — publish case studies with any number of photos AND short
  videos (paste a direct .mp4 link, or a YouTube/Vimeo link — both render
  correctly on the public Projects page)
- `/admin/partners` — manage the Partners page
- `/admin/clients` — manage the "Trusted by" client-logo strip on the home page
- `/admin/jobs` — post/manage Careers listings
- `/admin/products/new` — unchanged from before

**New public pages reading from the admin content above:**
- `/projects` now renders real published projects with image/video galleries
- `/partners` now renders real partners from the database
- `/careers` (new) — lists open job postings; each has an "Apply via email"
  mailto link
- Home page — added a "Trusted by" client-logo strip

To make an account an admin: it has to be done directly in the database for
now (`UPDATE users SET role = 'admin' WHERE email = '...'`) — there's no UI
for granting roles yet.

## Round 4 — turn-key positioning, full real content from kadcontrols.co.ke, SEO
Went back to kadcontrols.co.ke and pulled the actual content instead of approximating it.

**Turn-key solution positioning** — now the lead message site-wide: home page hero,
About page, and a dedicated "Design → Supply → Install → Commission" process
section on both the home page and `/what-we-do`. The point: one accountable
team for the whole project, not a designer + supplier + installer handoff.

**`/what-we-do` rewritten with the complete real service list** pulled directly
from their site: all 12 core services (LV distribution panels, MCCs, UPS/inverters,
power quality analysis, power factor banks, VSD panels, solar PV, HVAC, automatic
change-overs, PLC/HMI/SCADA, CCTV/access control/alarms, diesel gensets) plus the
three lighting categories in full (industrial/warehouse, commercial/office,
exterior) — previously I only had a short paraphrased list.

**New `/contact` page** with their real address (WoodQuip Godowns – No 4,
off Mombasa Road), phone, email, social links and an embedded Google Map — this
was a 404 before. Footer now carries the same real contact details instead of
placeholder support links.

**SEO** (this is a marketing site, so this matters): added `metadataBase`, Open
Graph + Twitter card tags, and a JSON-LD `ElectricalContractor` structured-data
block in the root layout with real name/address/phone/geo/social links — this is
what lets Google show a proper business card in search results and local pack.
Title/description now lead with "turn-key" and the real service keywords.

**Note on per-page SEO**: most pages are client components (`'use client'`) for
interactivity, which means they can't export their own `generateMetadata` — only
the root layout's metadata applies site-wide right now. Giving each page (e.g.
`/what-we-do`, `/projects`) its own title/description for better per-page SEO
would mean splitting a few of them into server + client parts — flag if you want
that next, it's a solid next SEO step.

## Round 5 — real brand colors + full brochure content mapped in
You sent the actual company profile brochure (PDF) — this replaces guesswork
with the real thing.

**Colors fixed**: the site now uses Kad Controls' actual brand palette — burnt
orange primary + near-black accent, matched from the brochure/logo. This
replaces the navy/amber placeholder from earlier rounds. Still in
`src/app/globals.css` as CSS variables if you want to fine-tune the exact hex.

**Real tagline** — "For All Your Electrical Needs" — added to the About page
hero and footer.

**16-year track record** — added as a stat row on the About page (16+ years,
12+ major clients, 14+ technology partners, 24/7 on-call support).

**Full real partner list (14, not 3)** — seeded into the `partners` table:
Siemens, Schneider Electric Systems, Danfoss, Festo, Mavili Fire Alarm
Systems, Endress+Hauser, ifm electronic, Portwest, DEHN, LEDVANCE, Unitronics,
CNC Electric, Rock Fall, STD Transformator — each with the real description
from the brochure where one was given. Renders automatically on `/partners`.

**Full real client list (12, not 5)** — Unilever Kenya, Unilever Tea Kenya,
BAT Kenya, Kenya Wine Agencies, Bamburi Cement, Tetra Pak, Pembe Flour Mills,
Mama Millers, Komaza Forestry, Burundi Cement Company, Browns Plantation,
Unilever Ethiopia. Seeded into `clients`, renders on the home page "Trusted
by" strip.

**9 real completed projects with actual scope** — seeded into `projects`
with the real technical detail from the brochure (RMU/transformer/mill
installs for Mama Millers, fire-alarm/generator/CCTV work for Komaza
Forestry, the BAT GMES/SCADA integration, Unilever's PLC and EMS upgrades,
Kenya Wine Agencies' Siemens S5→S7 migration, etc.) — this is a real
credibility upgrade over the placeholder one-liners from before.

**Uganda office added** — Kad Controls Uganda Ltd (Regency Plaza, Lugogo
Bypass, Kampala) now appears on `/contact` and in the footer alongside the
Kenya head office.

**New service line surfaced**: your PLC/SCADA training courses (Siemens
S7-1200/1500 and WinCC, 5 days each) weren't on the site at all — added a
dedicated section to `/what-we-do`.

**Address discrepancy — needs your confirmation**: the live kadcontrols.co.ke
contact page says "WoodQuip Godowns – No 4, Opposite Kenya Coach Industries,
National Park East Gate Road, Off Mombasa Road", but the brochure says "Bumat
Complex, Godown Number 4, National Park East Gate Road, Off Mombasa Road" — I
went with the brochure version since it's your own official document, but
flagging this in case the website is actually the current one and the
brochure is outdated (or vice versa).

**How to get this data into your database**: run `npm run db:seed` fresh
(after migrating) — it now seeds the partners/clients/projects above in
addition to the demo products. If you've already seeded once, the script
doesn't dedupe partners/clients/projects the way it does categories, so
either wipe those three tables first or add these manually via
`/admin/partners`, `/admin/clients`, `/admin/projects`.

**Still needed from you**: actual project photos — the brochure has real
site photos but they're only in the PDF, not hosted anywhere I can link to.
Once you upload them somewhere (even a Google Drive share link works), add
them to each project via `/admin/projects`.

## Round 6 — merged your Copilot-edited version back in, fixed a few integration issues
You sent back a repomix of your own edits (some done via Copilot). I merged the good
parts into the branch that already had the full brochure content (partners/clients/
projects/colors from Round 5), since your copy branched off an earlier round and was
missing that. Here's what happened:

**Adopted from your version:**
- Full-rounded buttons everywhere (`rounded-full` instead of `rounded-2xl`), and a
  proper "black border, fills with brand color on hover" outline button style — this
  is now the shared `outline` variant on `src/frontend/components/ui/button.tsx`, so
  any new button using that component gets it automatically instead of every
  component hardcoding its own border/hover classes.
- White navbar background with the logo, pill-style nav links with an active-page
  highlight, "Home" added back to the nav.
- Removed "Shop" from the nav (redundant with the cart icon) — kept as you'd already
  decided.
- Your color pick (`#b8653d`) — converted to the theme's `--primary` CSS variable
  precisely (was `oklch(0.594 0.12 45.3)`), so it's consistent everywhere instead of
  only where it was hardcoded.

**Fixed two real bugs your Copilot session introduced:**
1. Two parallel, duplicate "Get a Quote" implementations existed —
   `GetQuoteButton`/`QuoteRequestModal`/`/api/quote-request` (correctly wired into
   About and What We Do) **and** an unused, dead second copy —
   `QuoteCta`/`QuoteModal`/`/api/quotes` — with a wrong hardcoded fallback email
   (`kkc124@outlook.com` instead of your real sales address). It was never called
   from anywhere, so harmless today, but a landmine if someone wires it in later
   without noticing. Only the first (working, correct-email) version is in this zip.
2. Your navbar's colors were hardcoded as `#b8653d` directly in the component, while
   `globals.css` still had the old placeholder navy `--primary`. That meant the rest
   of the site (buttons, other pages) was still navy while only the navbar was
   orange. Fixed by making the navbar reference `text-primary`/`bg-primary` like
   everything else, and updating the actual CSS variable to your color.

**Address updated again** — you gave me the real one directly this time: Prabhaki
Industrial Park, Godown C3, Babadogo, Nairobi. This replaces both the brochure
address and the live-site address from earlier rounds. Updated on `/contact`, the
footer, and the JSON-LD structured data. I couldn't verify exact GPS coordinates for
this address, so I removed the (now-wrong) hardcoded map pin from the JSON-LD, and
switched the embedded map on `/contact` to a text-search embed instead of hardcoded
coordinates — Google will geocode it, but you should double-check the pin lands on
the right building and refine if needed.

**Logo**: your repomix export doesn't include `logo.png` — repomix strips binary
files, text-only export. The code already references `/logo.png` (that part came
through fine), you just need to drop the actual image file into `public/logo.png`
yourself, or send it to me directly as an image upload (not inside a repomix) and
I'll place it.

### On your question — Copilot vs. me for future edits
Both have a place, and this round is a good example why: Copilot moved fast on the
button styling and even the quote-form request, but two integration bugs slipped
through (the dead duplicate quote flow, the CSS-variable/hardcoded-color mismatch)
because nothing forced a full rebuild+typecheck across the whole app before calling
it done — that's a hazard whenever changes land piecemeal across sessions without a
single source of truth checking them all at once.

My suggestion: keep using Copilot (or Cursor, whatever's in your IDE) for fast,
contained visual tweaks — button colors, spacing, copy edits, single-component
changes. Send it back to me when you want something merged/validated end-to-end, or
when a change touches multiple files/the database/API routes, since I can actually
spin up a real Postgres, run the migrations, run the seed script, and do a full
production build before handing it back — which is exactly how I caught both bugs
above. That combination (Copilot for fast local iteration, me for integration and
bigger features) is a reasonable way to keep moving without the two branches
silently drifting apart the way this one did.

## Round 7 — real logo file, and fixed the wordmark/tagline fonts properly
You sent the actual logo PNG and a screenshot of the real site's navbar text styling.

**Logo**: `public/logo.png` now has your real logo (the file itself, not a
reference to one) — placed and wired into the navbar.

**Fonts were wrong, now fixed properly**: zoomed into your screenshot and the
"KAD CONTROLS LIMITED" wordmark is a geometric sans-serif (not the serif I'd
guessed earlier), and the tagline is a proper flourished script font, not an
italic sans. Also found and fixed a real bug while I was in there: the site's
main font setup (`next/font/google` imports for Inter/Geist Mono in
`layout.tsx`) had gone missing somewhere in an earlier round's edits and never
got restored — `globals.css` was referencing font CSS variables that didn't
exist, so the whole site was silently falling back to browser-default fonts
instead of the intended typography.

Fixed both at once in `layout.tsx`:
- Re-added Inter (body text) and Geist Mono (monospace) properly.
- Added Poppins (medium weight) for the "KAD CONTROLS LIMITED" wordmark —
  matches the geometric sans in your screenshot much better than the serif
  guess.
- Added Herr Von Muellerhoff (a flourished script Google Font) for the "For
  All Your Electrical Needs" tagline — used consistently now on the navbar,
  footer, and About page hero, wherever that tagline appears.
- Previously the tagline relied on `"Segoe Print", "Bradley Hand"` — real
  fonts, but Windows/Mac-only system fonts that don't exist on Linux or most
  Android devices, so it would've rendered as a generic fallback cursive for
  a lot of visitors. A proper web font fixes that for everyone regardless of
  device.

Both new fonts are exposed as `font-wordmark` / `font-tagline` Tailwind
utilities (via `globals.css`), so any component can use them the same way
`font-sans` works already.

**Sandbox note**: I couldn't fully build-test this round's zip end-to-end
in my sandbox, since it doesn't have network access to fonts.googleapis.com
(same restriction that's applied throughout this whole project — see earlier
rounds' notes). I isolated the failure by temporarily stripping just the font
imports and confirming everything else compiles clean (all 34 routes), so the
only untested part is Next.js's actual font-fetch step, which will run fine
in your environment or any real CI/deploy pipeline with normal internet
access.

## Round 8 — animated service gallery in the hero, contact page address fix
**Hero gallery**: the hero section grid was actually already built for two
columns (`lg:grid-cols-[1.1fr_0.9fr]`) but the right column was never given
content, which is why it looked empty. Added `HeroGallery`
(`src/frontend/components/common/HeroGallery.tsx`) — a crossfading photo
slideshow (5 service photos, auto-advances every ~3.8s, click the dots to jump
to one directly) with a smaller floating accent photo layered behind it, both
gently bobbing via a CSS keyframe animation. Each slide is captioned with the
service it represents (Solar PV, Automation & Control Panels, BMS, On-Site
Installation, Fire Alarm Systems). Hidden below the `lg` breakpoint so it
doesn't crowd the hero on mobile.

Photos are hotlinked from Unsplash as placeholders, same as the product photos
— swap the `src` values in `HeroGallery.tsx` for real project photography
once you have some hosted (this is the same gap noted in earlier rounds: the
brochure has real project photos but they're only in the PDF).

I rendered this with a real headless Chrome in my sandbox to confirm the
layout, positioning, animation, and caption overlay all work — the images
themselves showed as broken there only because my sandbox has no outbound
network access to images.unsplash.com, not because of a code issue. They'll
load normally in your environment.

**Contact page**: confirmed already up to date with the Babadogo/Prabhaki
address and Uganda office from Round 6 — if your working copy still shows the
old WoodQuip Godowns address, replace `src/app/contact/page.tsx` with the
version from this zip.

## Round 9 — button rounding sweep + the real Get Quote fix (this time actually applied)
Two real issues from your feedback, both fixed and verified by actually clicking
through the rendered site in my sandbox (Playwright + real Chrome), not just a
build pass.

**"Get a Quote" still went to /contact** — this is on me. Back in an earlier round
I diagnosed this bug and wrote you a Copilot prompt to fix it, but never actually
applied the fix in my own working branch. When I merged your Copilot-edited
version back in later, I only pulled specific pieces (navbar, colors, buttons) and
missed that this fix wasn't among them. It's genuinely fixed now:
- `src/frontend/components/common/GetQuoteButton.tsx` — renders as a real
  `<button>`, not a link to `/contact`
- `src/frontend/components/common/QuoteRequestModal.tsx` — the actual form
  (name, company, email, phone, message)
- `src/app/api/quote-request/route.ts` — emails the sales inbox
  (`ENQUIRY_NOTIFICATION_EMAIL`, same fallback as the product-enquiry flow)
- Wired into both `about/page.tsx` and `what-we-do/page.tsx`, replacing the
  plain `<a href="/contact">` / `<Link href="/contact">` links

I verified this by actually launching the built site in a headless browser,
clicking the button, and confirming (a) the URL never changes and (b) the quote
form is genuinely on screen afterward — see the two screenshots earlier in this
conversation.

**Buttons not rounded** — went through every page and found several CTAs that
were still `rounded-lg` or had no rounding at all (the button.tsx component fix
from a couple rounds ago only affects components using that shared component;
plenty of buttons across the site use hardcoded classes instead). Fixed all of
them to `rounded-full`: home page hero CTAs, the bottom-page CTA, Careers'
"Apply via email", the cart page's "Browse Catalogue" and "Request Quotation"
buttons, product detail page's "Add to Quote List" and "Send Enquiry", and every
admin form's submit button. Left the admin dashboard's nav tiles as `rounded-lg`
since those are cards, not buttons.

## Round 10 — hero gallery layout bug fixed (verified with screenshots)
Root cause of the overlapping/inconsistent photos: the gallery had two conflicting
aspect-ratio boxes nested inside each other (an outer `aspect-square` wrapper
capped at `max-w-md`, with the actual photo card inside forcing `aspect-[4/5]` —
a taller ratio that doesn't fit inside a square). The photo card was absolutely
positioned, so it just overflowed past its own container's bottom edge instead of
respecting it — that's the overlap. The `max-w-md` cap is also why there was
leftover space on the sides — it stopped the gallery from ever reaching the full
width of its grid column.

Fixed by using a single sized box instead of two conflicting ones (`w-full
aspect-[4/5]`, no width cap), and giving the wrapper bottom padding so the
floating accent thumbnail has real room to overflow into without the hero
section's `overflow-hidden` clipping it. Verified with actual screenshots this
time (both a normal viewport and a taller one to see the full card, accent
thumbnail, and dot indicators together) — everything sits where it should, no
overlap, no clipping, fills the full column width.

## Round 11 — admin auth rebuilt: single password, no more Google sign-in anywhere
Per your call: kept `/admin` as the path (no rename), one shared password instead
of per-admin accounts, and Google sign-in removed from the entire site, not just
admin.

**New admin login** (`/admin/login`): a plain password form. The password lives
in `ADMIN_PASSWORD` (env var) — there's no accounts table for admins, just that
one shared secret. On success it sets an httpOnly session cookie (30 days).

**`src/proxy.ts`** (Next 16 renamed `middleware.ts` → `proxy.ts` mid-cycle — this
project was already on it, so I moved with it) gates every `/admin/*` route
server-side: an unauthenticated request is redirected to `/admin/login` *before*
the page's HTML/JS is ever sent, not after. Every `/api/*` write route
independently re-checks the same session cookie server-side before touching the
database — that's the authoritative check, the proxy is defense in depth on top
of it, not a replacement.

**Verified this properly, not just build-passing** — I ran the actual login flow
end-to-end with curl: confirmed unauthenticated `/admin` redirects (307), wrong
password is rejected (401), correct password sets the cookie and grants access
(200), and a real write (`POST /api/categories`) is rejected without the cookie
and succeeds with it. Screenshot of the login page is in this conversation.

**Google sign-in removed entirely** — `/api/auth/*`, `AuthContext`, the
Navbar's Sign In/Out, all gone. Knock-on effects, all intentional:
- The quote-list (cart) now always works anonymously via the existing cookie —
  it already worked this way for guests, so nothing about the user-facing
  behavior actually changes.
- `/api/orders` removed — it was already orphaned since Round 3's pivot to the
  RFQ-via-email flow and had no working path to it.
- Review *submission* removed (`POST /api/reviews`) — it required a signed-in
  customer with a completed order, and neither exists anymore. Reading
  already-approved reviews (`GET /api/reviews`) still works fine; a future
  "admin enters testimonials directly" feature would be the natural replacement
  if you want reviews back.
- `/api/enquiries` GET is now admin-only (lists all submitted enquiries) instead
  of "a customer's own enquiries", since there's no more customer identity to
  scope it to.

**Update your `.env.local`**: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and
`ADMIN_EMAILS` are gone from `.env.example` — replaced by a single
`ADMIN_PASSWORD`. Set that before you deploy; without it, admin login always
fails (loudly, in the server logs, not silently).

## Round 12 — partner logos: edit capability added, real Siemens logo wired in
You asked to add partner logos (Schneider, Siemens, Ledvance) through the admin —
surfaced a real gap: there was no way to edit a partner that already existed,
only create brand-new ones. Since Siemens/Schneider/Ledvance were already seeded
(Round 5) without logos, that meant no path to adding one without creating an
ugly duplicate entry.

**Fixed**: `/admin/partners` — click any partner in the list to edit it in place
(name, role, description, logo URL), not just add new ones. Backed by a new
`PATCH /api/partners/:id` route, admin-gated the same way as everything else.
Verified this actually works end-to-end (not just build-passing): logged in,
found the seeded Siemens record via the API, PATCHed a logo URL onto it,
confirmed it persisted on the public-facing `GET /api/partners`, and confirmed
the same request is rejected with a 403 when it's not sent with a valid admin
session. Screenshot of the working edit UI is earlier in this conversation.

**On the logos themselves — being straight about what I could and couldn't
verify**: I spent real effort trying to find exact, correct logo URLs for
Schneider, Siemens, and Ledvance, and most of what came back were logo-
aggregator sites and stripped search results I couldn't independently confirm
were current/correct. I only wired in one I could verify solidly — Siemens'
wordmark, confirmed via Wikipedia's own file history (stable since 2007,
tagged as their official simple text logo) — using Wikipedia's
`Special:FilePath` redirect, which resolves by filename without needing a
guessed internal hash:
`https://en.wikipedia.org/wiki/Special:FilePath/Siemens_AG_logo.svg`

For Schneider Electric, LEDVANCE, and the rest: rather than guess and risk the
wrong or an outdated logo showing up in front of your director, grab them
yourself — visit the company's own site or Wikipedia page, right-click the
logo, "Copy image address", and paste that straight into the Logo URL field on
the edit screen. Takes about 30 seconds each and guarantees it's the real,
current logo.
