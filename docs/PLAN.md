# Gnome Life — plan

A cosy storybook garden game for Bryce's iPhone, played as a web page from a Safari Home Screen shortcut. Charm and aliveness over complexity; it must run smoothly on a phone.

_Last updated: 2026-11-15 (v99 live; v100, the round-eleven build, waiting for Bryce's OK). Keep this file short: one page of where we are and what's next. Detail goes in the topic docs listed at the bottom; finished history goes in `docs/archive/`._

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

- **Live:** v99 at https://7hpgypydbd-sudo.github.io/gnome-life/ (repo `7hpgypydbd-sudo/gnome-life`, GitHub Pages, every push to `main` deploys). v99 (PR #132) is the round-ten build plus art day 21 and a reworked worn path.
- **Bryce is playing** v99. Round-ten notes are all "built, waiting for Bryce"; round-eleven notes are collected in the thread "Collect play notes round eleven".
- **Two gardens:** the real one at the plain address; the sandbox at `?sandbox` (own save; tap the title for the test panel). Pretend player: `node tools/progression_sim.js 2 90`.

## 3. What's next (in order)

1. **v100, the round-eleven build (with art day 22), waiting for Bryce's OK.** Previews in `/mnt/project-files/round-eleven-v100/`. Holds round-eleven notes 1 to 14 (tracker has each row): wood comes from the big stump that was in the way (day-one dig) and the old fallen log (new job "Saw up the old log"; Bryce picked both), woodpile on the ground right beside the house, stick pile grows in four painted steps, finished little work corner (`yard-workcorner`); the garden heap is a two-gnome job (`pair:true`: the other joins when free, twice as fast), Hazel carries the good bits to a salvage pile at the work corner, the herb box is that crate, the third job is "Dig out the buried rubbish", four heap paintings (the last two repainted with no junk); flags only for story/patch/neighbour jobs (`flagJob`), bench and doorstep no longer gate anything, Hazel says why the roof wants moss (`sayWhy`); the rabbit's first visit is a slow scene, notes wait during scenes, Hazel always fills the dish. Not in this build: note 15 (seed bed hard to tap, from the play log; Bryce to confirm). v99 (round ten) is live; its notes are still "built, waiting for Bryce".
2. When Bryce has played v100: he closes notes; anything that came back gets a proper look.
3. Next art day: the stand-ins in section 4.
4. Held until Bryce asks: month-two builds 2 to 7 (`docs/MONTH-TWO.md`), then a long robot run.

**Garden patch layout (`docs/GARDEN-LAYOUT.md`):** built in v99. The pond has reeds, NOT a ring of stones (Bryce, 2026-11-14).

**Waiting on Bryce:** his play verdict on v99, with his picks on the greening look, the job-time table, Mabel's helping hand and crop green; is the big spring stump now too big (one number, `KIT_GROW`); stump and spring look rethink (round 9 no. 6). Game length: on hold, feel it out.

**Maybe pile:** automatic concern inbox; a spell for work past bedtime; birdsong returning as the land greens; phone sideways; more bug baths on patches (round 10 no. 27); a use for picked herbs (round 10 no. 35). Held back on purpose: pot seats before the bench (could strand a player).

## 4. Stand-ins still in the game (2026-11-15, after v99)

Month one: none known. `make-bed2` has no slot painting on purpose (the bed uses `seedbed-rect`; its fence rails and crop rows are drawn in code).
Later: none (`make-mousedoor` is empty on purpose: that make is retired). Painted but not placed: frogmouth, owl on a stake, bucket, carrot with legs.
Drawn in code on purpose: paper job flags, growing badge, glows, the green sprig.

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
