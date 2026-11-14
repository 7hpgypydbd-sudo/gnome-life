# Gnome Life — plan

A cosy storybook garden game for Bryce's iPhone, played as a web page from a Safari Home Screen shortcut. Charm and aliveness over complexity; it must run smoothly on a phone.

_Last updated: 2026-11-14 (v98 live). Keep this file short: one page of where we are and what's next. Detail goes in the topic docs listed at the bottom; finished history goes in `docs/archive/`._

## 1. Rules for every chat (read first)

**Bryce.** Not a programmer: plain words, no jargon, never ask him to run commands or press GitHub buttons. Australia (southern seasons, AEDT). Warm tone; never imply wasted work. Tappable choice cards, pictures shown in the chat. Suggest a new chat or a different model when it fits (suggest only).

**Merging.** Claude merges. Anything you can see in the game: preview pictures, Bryce's OK, then merge. Docs and behind-the-scenes: merge without asking. Every release bumps the version: `BUILD` in index.html, `build.txt`, the `vNN` label by the title and every `?v=` must match. A second merger rebases and bumps again.

**Play notes (the new rules, Bryce chose 2026-11-14, thread "Review how we keep track of the work").**
1. ONE tracker for every note from every round: `/mnt/project-files/play-notes-tracker.md`. Full wording stays in each round's `notes.md`.
2. Write down the real problem. Each note gets one line saying what Bryce actually needs (e.g. "neither gnome stands idle", not "move some jobs to Wendel"). Build to that line.
3. Only Bryce closes a note. After a build a note is "built, waiting for Bryce". It becomes "fixed" only when he has played it and says so. Claude's own sandbox check is recorded but never closes a note.
4. Replay the moment. Check each fix by playing to the exact moment Bryce described (day one, mid-job, first time), from a fresh sandbox garden, in motion. A still of the finished state is not a check.
5. Repeats get flagged. A note that comes back is marked "came back" on its old row and gets a proper look at why the first fix missed, not a second quick patch.
6. A build plan names EVERY open note, either in the build or in a "not in this build, because" list. Before saying "all done", go down the whole tracker; the closing message names everything not done.
7. When a notes round ends (or a new one starts), offer a build for it straight away. Never let a collected round sit.
8. Play observations Bryce posts in the project chat are notes: forward them to the notes thread.

**Stand-in check.** Before every art day and every release, run `node tools/standin_check.js` (needs a local server, see the file) and look at the list in section 4. Nothing a month-one player meets may be a stand-in. When a painting lands, remove its code stand-in in the same change (a painting that fades in during a job must not have code drawn on top).

**No assumed length.** Never plan to a fixed number of days or a target day for anything (Bryce, 2026-11-14). Pace comes from how it feels in play; the pretend player's day counts are measurements only.

**Finish line.** "Month one, fully finished": every month-one picture painted, words polished, someone has played 30 days at real pace without getting stuck, ready for Bryce's mum. New ideas go to the maybe pile.

## 2. Where we are

- **Live:** v98 at https://7hpgypydbd-sudo.github.io/gnome-life/ (repo `7hpgypydbd-sudo/gnome-life`, GitHub Pages, every push to `main` deploys). v98 (PR #127): house jobs show only their paintings while they run (round ten note 11), and this one-page plan.
- **Bryce is playing** a fresh real garden started 2026-11-14 on v96. Round-ten notes are being collected in the thread "Collect play notes round ten" (`/mnt/project-files/play-notes-round-ten/notes.md`).
- **Two gardens:** the real one at the plain address; the sandbox at `?sandbox` (own save; tap the title for the test panel). Pretend player: `node tools/progression_sim.js 2 90`.

## 3. What's next (in order)

1. When round ten ends: one build of every round-ten note under the new rules. Big items already flagged in it: when Mabel arrives and the pace of the early game (note 1; no fixed game length, feel it out); jobs go to whichever gnome is free and day one shared fairly (notes 4, 12, repeat of round 8 no. 1); the barrel and spout only after the roof, with rain for the herb box as the reason (note 2, agreed); redesign the green sprig meter (note 8, show looks first); rename "Hazel's list" to a shared list (note 9); a one-line reason on every new job card (notes 3, 5, 7, 10).
2. Next art day: the stand-ins in section 4, plus anything round ten asks for.
3. Held until Bryce asks: month-two builds 2 to 7 (`docs/MONTH-TWO.md`), then a long robot run.

**Garden patch layout (decided 2026-11-14, `docs/GARDEN-LAYOUT.md`):** large pond in the middle (about three times today's), filled by rain in the hollow left by the cleared rubbish heap; a second rectangle bed by the yard; mouse house far corner, rabbit corner at the far end. Build it with the round-ten build. Art day: repaint the busy final "moss" ground on every patch and the home yard, drop the orange pine-needle mats. No fixed game length any more: plan without day numbers.

**Waiting on Bryce:** game length / Mabel timing (card open in the notes thread); is the big spring stump now too big (one number, `KIT_GROW`); stump and spring look rethink (round 9 no. 6); should Mabel help a job a day while camping.

**Maybe pile:** automatic concern inbox; a spell for work past bedtime; birdsong returning as the land greens; phone sideways; Wendel hollowing the stump with an inside view (round 7 no. 56). Held back on purpose: pot seats before the bench (could strand a player).

## 4. Stand-ins still in the game (2026-11-14)

Month one: stepping-stone path (grey ovals; `stepping-stones` never painted); flat stones round the spring (grey ovals); the green sprig meter (code-drawn; redesign asked); the "Mabel moved in" page (shows her portrait; `story-mabel-home` missing). Fixed in v98: the moss roof and the three house steps.
Later: the other seven neighbours' moved-in pages and portraits, `bld-juniper`, `make-owlbox`, `gift-lyrebird`. Painted but not placed: frogmouth, owl on a stake, bucket, carrot with legs.
Drawn in code on purpose: paper job flags, growing badge, glows.

## 5. The game in brief (Bryce's decisions)

- Wendel (dreamer) and Hazel (practical, never sceptical or hen-pecking), newlyweds regrowing a logged Australian clearing into a cosy 5x5 village. The player is the heart of the wood, a bodiless forest spirit; the gnomes do every physical job. 2 to 5 minute visits; jobs take real time; no gnome work 22:30 to 06:00.
- Art: "Secret World of the Gnomes" storybook paintings, never clay or toy. Parchment menus, nothing glows, contact shadows. Less text, more visual cues.
- The land is the menu: paper flags where a job can start, tap for a job card; Jobs lists everything. Unopened land is pencil on paper. Only growing things bring green.
- No fixed game length (Bryce, 2026-11-14). Pace is felt out through play, not planned to a number of days. Today's build happens to bring Mabel about day 15 and the festival about day 56; those are measurements, not targets. Never monetised.

## 6. Where things live

- **Code:** `index.html` (drawing, UI, art slots `ART_SLOTS`), `game.js` (save, jobs, story ticks), `content.js` (all words, jobs, story), `walk.js` (collision), `concerns.js`, `playlog.js`. Sprites in `sprites/`; `index.html` inlines `GNOMES` from `sprites/gnomes.json` (re-paste after `tools/pack_*.py`).
- **Art days:** on Bryce's Mac with Gemini in Chrome (skill `nano-banana-art`), Remote Control in `/Users/Talisman/Claude/gnome-life/` (never Downloads). Paint lit things unlit. About 22 pictures per 5-hour Gemini window. Each art day has `docs/ART-DAY-NN.md`.
- **Project files** (`/mnt/project-files/`): the notes tracker, each round's notes, previews. Mac sessions can't write there: the coordinator updates the tracker for them.
- **Project memory** holds Bryce's preferences and decisions; keep it in step with this file.

## 7. Docs

| Doc | What's in it |
| --- | --- |
| `VISION.md` | The locked game vision |
| `STORY.md` | The first month's story, chapters and pages |
| `ANIMALS.md` | Animals and their side stories |
| `DECORATIONS.md` | Makes, wishes and the item economy |
| `GARDEN-LAYOUT.md` | The garden patch's planned final layout and the calm-ground art item |
| `MONTH-TWO.md` | Month two to the festival (held) |
| `STYLE-GUIDE.md` | Art rules; read before any art |
| `ART-DAY-PLAN.md`, `ART-DAY-*.md`, `ART-BATCH-*.md` | Art prompts and what each art day made |
| `archive/PLAN-history-to-2026-11-14.md` | The old full plan: every decision and build from v1 to v97, with reasons. Search it when you need the why behind something; don't add to it |
