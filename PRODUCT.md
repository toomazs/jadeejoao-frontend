# Product

<!-- impeccable:product-schema 1 -->

> Provenance: the init interview was answered from the human-approved build brief
> (`_bmad-output/planning-artifacts/architecture/architecture-Jade-e-Joao-2026-08-09/PROMPT-jadeejoao-frontend.md`)
> and architecture spine, as the spec pre-authorized. Facts below come from those
> documents; anything inferred beyond them is marked `[inferred]`.

## Platform

web

## Users

~170 wedding guests of Jade & João, of all ages including elderly relatives.
They arrive from a WhatsApp link, almost always on a phone, often mid-conversation.
Their jobs: feel welcomed into the couple's day, confirm presence (RSVP) in under a
minute, and find the practical facts — how to get there, where to stay, what to wear,
how to gift. Guests have no accounts; they identify themselves by typing their own
full name as written on the invitation.

## Product Purpose

The public wedding invitation of Jade & João — August 7, 2027, 15:00, in the garden
of the couple's own home in Atibaia-SP, Brazil. A one-page PT-BR scroll experience:
the invitation *is* the product. Success means a guest feels the couple's warmth
within the first viewport, RSVPs in under a minute, and leaves knowing the logistics.

## Positioning

Not a template wedding site: a home-garden wedding at the couple's house, under their
seriguela tree, with their own brand identity (palette, three self-hosted typefaces,
leaf motif). Every guest-visible word is authored by the couple through their admin
panel and served by their API — the site renders, never writes copy.

## Operating Context

- Opened from WhatsApp on phones (375px is the primary viewport; fluid to 1440+).
- The API (Railway) may cold-start: the site shows a skeleton, never a white screen,
  and offers a PT-BR retry on failure.
- Event timezone America/Sao_Paulo; RSVP deadline is enforced server-side, displayed
  client-side.
- Ceremony is outdoors on grass — content warns about footwear; elderly guests attend.

## Capabilities and Constraints

- Ten fixed sections in a closed slug order (hero → our_story → big_day → rsvp →
  getting_there → stay → gifts_intro → dress_code → good_practices → messages_intro),
  one route, sticky anchor nav; the couple can disable sections server-side.
- All editorial content from `GET /api/v1/content`; local strings are functional
  microcopy only (`src/lib/ui-strings.ts`).
- RSVP: typeahead → exact-name lookup → group card → one submit answers for the whole
  group. Gifts: external registry links (v1 default) + dormant PIX goals. Messages:
  write-only guestbook.
- Tokens only (AD-13): palette and font stacks live once in `src/styles/tokens.css`;
  raw hex or font-family literals elsewhere are defects.
- No auth, no payment gateway, no i18n, no SSR; single origin (`VITE_API_URL`);
  images only from payload CDN URLs or repo assets.

## Brand Commitments

- Palette (pinned, exact): olive `#50590D` (primary) · deep-olive `#464605` ·
  terracotta `#7F3717` · gold-sand `#D2BE81` · cream `#EFE8D8` (base surface) ·
  dark-gray `#3E3E3E` · ink `#1A1818` (text).
- Type: **Afrah** (display — couple names, section titles), **Arapey / Arapey Italic**
  (body), **Benedict** (sparing accent). Self-hosted from `fonts/`, `font-display: swap`.
- Motif: the **seriguela leaf** (`images/siriguela.png`) — the tree at the ceremony
  site — as the recurring graphic thread (dividers, bullets, watermarks).
  Logos: `images/logo.png`, `images/logo-vertical.png`.
- Mood: warm, Latin, elegant garden wedding at home. The couple: "somos latinos,
  gostamos de fartura de cores" — about the *flowers*; photography carries the color
  exuberance while UI surfaces stay disciplined inside the palette.
- Guest-facing language: PT-BR. Code, commits, docs: English.

## Evidence on Hand

- Brand assets in-repo: `fonts/Afrah_Font/` (web kit woff), `fonts/Arapey/` (ttf),
  `fonts/Benedict Regular/` (otf), `images/logo.png`, `images/logo-vertical.png`,
  `images/siriguela.png`.
- Brand sources: "Dudu - Conceito e ID Casamento" PDF + event PPTX (mockups, nav
  labels, flows) — distilled into the architecture spine.
- No couple photography exists in the repo yet; real images arrive later via the
  couple's admin as CDN URLs in payloads. Future work must not fabricate photos.

## Product Principles

1. The invitation is the product — the interface recedes behind the couple's words
   and warmth; chrome earns its place or disappears.
2. A 70-year-old aunt on WhatsApp is the design target: big type, obvious touch
   targets, one clear action per moment, nothing clever that costs clarity.
3. The couple owns every word — the site owns rhythm, hierarchy, and craft; never
   hardcode what the admin should edit.
4. Discipline inside the palette: exuberance comes from flowers and photos, not from
   UI decoration drifting off-brand.
5. Never dead-end: cold starts show skeletons, failures speak PT-BR and offer retry,
   past-deadline states stay warm.

## Accessibility & Inclusion

Elderly guests are first-class users: body text ≥16px, AA contrast throughout
(verify olive-on-cream for large display type), semantic landmarks and heading
hierarchy, labeled inputs with inline PT-BR errors, focus-visible states, generous
touch targets, and full `prefers-reduced-motion` respect.
