---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/sections","src/components/ui","index.html"]
---

# Surface: public one-page invitation (src/App.tsx and everything it renders)

Mode: Experience (the invitation is the artifact; interface recedes), with one
Persuade duty — the RSVP action must be unmissable and completable in under a minute.

Audience & job: ~170 guests, all ages incl. elderly, arriving from WhatsApp on
phones (375px primary). Jobs: feel the couple's warmth, RSVP fast, find logistics
(getting there, stay, dress code, gifts, good practices).

Content & proof: every guest-visible word from `GET /api/v1/content` payloads
(dev fixtures mirror them). No couple photography exists yet — the design must
stand on typography, the seriguela motif, and the frame grammar alone; payload
images are enhancements when they arrive.

Chosen direction (seed f519f651, grounded candidate 6/7): **the arrival at the
couple's home** — the page is the walk in. Hero = the gate/threshold: a tall
framed plaque with monogram, couple names at full Afrah scale, spelled date,
city, live countdown. Each section = a garden room: a hairline double-rule
framed panel on cream with an ordinal plaque (echoing the couple's own 01–10
deck numbering), leaf finial details, seriguela dividers between rooms.
Deep-olive farewell close (footer) anchors the page end. Terracotta is reserved
for warmth/action; gold-sand is frame material; olive is structure and display
text.

Memorable moment: the gate viewport — names, spelled-out date and the ticking
countdown plaque inside one engraved frame, leaf shadow falling across cream.

Constraints: tokens-only styling; fixed slug order behind sticky anchor nav;
body ≥16px; AA contrast; reduced-motion respected (no reveal pass yet — that is
a later task); RSVP/Gifts/Messages get room-shell coherence only, flows later.

Unresolved: real photography treatment (arrives via admin later); motion pass;
RSVP/gifts/messages flow design (later tasks).
