# Gnome Life — plan

A cosy storybook garden game, made for Bryce's iPhone first and played as a web page from a Safari Home Screen shortcut. It may be released to the public eventually (Bryce, 2026-11-16), and it may be sold (Bryce would probably ask for donations, but might sell it). Charm and aliveness over complexity; it must run smoothly on a phone.

_Last updated: 2026-11-16 (v108 live: no dead wood when land greens). Keep this file short: one page of where we are and what's next. Detail goes in the topic docs listed at the bottom; finished history goes in `docs/archive/`._

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

**Bryce's rules (check every change against them).** `docs/BRYCES-RULES.md` holds the patterns behind all of Bryce's notes, in his own words (full review, 2026-11-16). Before anything that can be seen or read in the game is shown to Bryce: (1) go down that list and fix whatever he would quote back; (2) fix the rule, not the single case (the notes that came back all came back because one case was patched); (3) run the pretend player as a keen player too (`HOURS=every:20:8:21`), because that is how Bryce plays; (4) say in the preview message which rules the change was checked against. A new note that fits no rule adds a rule, with his words, in the same chat.

**Stand-in check.** Before every art day and every release, run `node tools/standin_check.js` (needs a local server, see the file) and look at the list in section 4. Nothing a month-one player meets may be a stand-in. When a painting lands, remove its code stand-in in the same change (a painting that fades in during a job must not have code drawn on top).

**No assumed length.** Never plan to a fixed number of days or a target day for anything (Bryce, 2026-11-14). Pace comes from how it feels in play; the pretend player's day counts are measurements only.

**Finish line.** "Month one, fully finished": every month-one picture painted, words polished, someone has played 30 days at real pace without getting stuck, ready for Bryce's mum. New ideas go to the maybe pile.

## 2. Where we are

- **Live:** v108 (2026-11-16, PR #144: no more logs, roots or dead trunks appear as land greens; each kind of patch grows its own plants, Bryce picked "each patch its own way"; young gums and wattles at woodland; story wood untouched; pictures `/mnt/project-files/dead-wood-v108/`). v107 (PR #142, the five review changes; v106 was the clear fixes from the full review, PR #141; v105 was the round-thirteen build, PR #139) at https://7hpgypydbd-sudo.github.io/gnome-life/ (repo `7hpgypydbd-sudo/gnome-life`, GitHub Pages, every push to `main` deploys). v99 (PR #132) is the round-ten build plus art day 21 and a reworked worn path.
- **Bryce is playing** v99. Round-ten notes are all "built, waiting for Bryce"; round-eleven notes are collected in the thread "Collect play notes round eleven".
- **Two gardens:** the real one at the plain address; the sandbox at `?sandbox` (own save; tap the title for the test panel). Pretend player: `node tools/progression_sim.js 2 90`.

## 3. What's next (in order)

0. **v105, the round-thirteen build (thread "Build the round thirteen notes"), LIVE 2026-11-16 (Bryce: "Yes, put it live"); its notes are "built, waiting for Bryce".** Previews in `/mnt/project-files/round-thirteen-v105/`. Holds round-thirteen notes 1 to 25 (tracker has each row). Bryce picked (2026-11-16):
   - *Rubbish heap, new order (note 13):* one gnome starts by hand and gives up halfway ("far too much to carry by hand"), the fence is the break, then **Make a wheelbarrow** (a garden step with its own flag in the yard; the old yard make `barrow` is retired, `alsoDone` keeps one already made), then both cart off the rest with the barrow (`rubbish2`, pair), then dig out the buried rubbish. Pictures: heap, half (shown through the fence and barrow), bare mound, hollow. Gnomes on barrow work push the yard's own wheelbarrow (`carryWalk` `barrowE`/`barrowL`; art day 23 strips `barrowwalk`, `barrowwalk-empty`; parked: `wheelbarrow-loaded`).
   - *Reeds and wildflowers (notes 15, 18, 19, 21):* Hazel's mother's seed tin is a whole collection (said on the seed bed card and page 1.5). Reed seed balls pressed in round the pond (`reeds`), then your Coax wakes them (`reedsup`, cast step; the pond's flags stand on the bank). Wildflowers go to three open spots away from the pond, seed from the tin (no cost).
   - *Magic page (notes 1, 5, 22): one jar of light.* No daily count; the wood tops the jar up each morning (`G.morningLight`, 2 + magic level, up to `C.lightJar` 10). Each spell shows its cost in drops and Ready or why not. Every spell shows on the land (`spellFx`: rain shower, wind gust, coax sparkles).
   - *Patch card (note 24):* two rows, Jobs (dots, "4 of 10" or "all done") and Green (the four leaves and the stage).
   - *End of the heap (note 25):* the last garden job brings the patch up to young meadow at once (`flags.gardenRush`), then a ring of green, the two of them at the pond's edge and a frog hopping onto a lily pad (`flags.gardenMoment`, `FROG_MOMENT`).
   - Older gardens move onto the new garden chain by step id (`chainRemap105`); jobs done stay done.
   - Also: taps that miss try a finger's width round about (note 16); a roof leak with a bucket before the moss job (note 9); gnomes walk round the pond (note 20); painted-land look as a sandbox-only trial (note 23, test panel).
1. **v104, the round-twelve build, LIVE 2026-11-15.** Previews in `/mnt/project-files/round-twelve-v104/`. Holds round-twelve notes 2 to 12, 15 to 17 and the pop-up review (`/mnt/project-files/popup-review/popup-review-v101.md`):
   - *Pop-ups:* `TOAST_HUSH` in index.html drops every note the land or a gnome already shows (Set to work, Finished, Something new in Jobs, new wishes and favours, sow/water/pick chore lines, "brought in", patch "is waking", spell names); the play log still records them as `quiet:`. Notes carry a small portrait of who is talking (`toastFace`). One voice at a time: a gnome waits for a note to finish; tapping a busy gnome gives the job in their own bubble, no note. The idle Jobs reminder is a bob of the button, no words; the "lying in the ring" words come once only.
   - *Jobs match their words:* Water the seeds in waits for `flags.sowDone` (set when the sowing walk ends, or 90 s after sowing). Pebbles and the meadow strip wait for the fence, the scarecrow for the rabbit.
   - *Never idle:* little chores from the moment the spring is found; a free gnome always gets at least one chore; the work corner goes to whoever is free.
   - *Water:* once the spring is found, water is free (`G.springFree()`: never short, never spent, hidden in costs and the store); the jug chore is gone; no water dewdrops after the spring.
   - *Magic option C:* see docs/VISION.md (Magic) and docs/STORY.md (lessons). `G.magicLevel()` comes from the home yard's land stage; `G.spellUses()` 1/1/2/3 a day. Patch steps marked `auto` (the old Wake the worms) finish by themselves. `magicRemap104` moves older gardens over.
   - *Yard:* the saved-junk pile is never drawn; the fence panel shows only once the second bed is offered (and is gone from the meadow heaps); the wind spinner stands in open ground left of the work corner; the doorstep is centred under the door; the washing line and tub moved right, clear of the woodpile and barrel; the woodpile is back in its v99 spot behind the barrel, next to the house (Bryce).
   - *Animals and gnomes:* the rabbit hops into the bed to nibble (`Walk` option `intoBed`); a two-gnome job's helper joins the moment their own job ends, even while the phone is away (`pairTick`); a watering-can badge while watering (`icon-wateringcan.webp`, cut from Wendel's can sprite: a painted icon would be nicer on an art day).
   Not in this build: note 1 (v101), note 13 (v102), note 14 (no such note).
1. **v100, the round-eleven build (with art day 22), LIVE 2026-11-15 (Bryce: "Yes, put it live"); its notes are "built, waiting for Bryce".** Previews in `/mnt/project-files/round-eleven-v100/`. Holds round-eleven notes 1 to 14 (tracker has each row): wood comes from the big stump that was in the way (day-one dig) and the old fallen log (new job "Saw up the old log"; Bryce picked both), woodpile on the ground right beside the house, stick pile grows in four painted steps, finished little work corner (`yard-workcorner`); the garden heap is a two-gnome job (`pair:true`: the other joins when free, twice as fast), Hazel carries the good bits to a salvage pile at the work corner, the herb box is that crate, the third job is "Dig out the buried rubbish", four heap paintings (the last two repainted with no junk); flags only for story/patch/neighbour jobs (`flagJob`), bench and doorstep no longer gate anything, Hazel says why the roof wants moss (`sayWhy`); the rabbit's first visit is a slow scene, notes wait during scenes, Hazel always fills the dish. Not in this build: note 15 (seed bed hard to tap, from the play log; Bryce to confirm). v99 (round ten) is live; its notes are still "built, waiting for Bryce".
2. When Bryce has played v100: he closes notes; anything that came back gets a proper look.
3. Next art day: the stand-ins in section 4.
4. Held until Bryce asks: month-two builds 2 to 7 (`docs/MONTH-TWO.md`), then a long robot run.

**The Journal book and the land measure (v102, thread "Make the Journal look like a real book"; design `/mnt/project-files/journal-book/PLAN.md`):** the Journal is a leather-bound book with cloth tabs down the side, opening on a Contents page (Bryce picked looks A and B together). Sections: Our land, Hazel's diary (the old "Lately" list is its "Little news"), Our story, Friends, Little treasures; How to play at the back. The oak sprig, its "Something grew" note and "The valley's green" window are gone (round twelve note 13); tapping the grown little oak opens Our land.
*How the land measure works* (the magic build ties "stronger as the land greens" to it): each awake patch keeps its own green points (`G.s.tiles[k].green`; the rules that earn them are unchanged). `C.landStages` turns points into four stages: bare ground (0), first green (4), young meadow (12), young woodland (26). `landLeaves(k)` in `index.html` gives `n`, how many of the four leaves are out (1 to 4; bare ground already counts its first), and `part`, how far the next leaf has grown (0 to 1). `landTotal()` adds every patch: `{ leaves, of, patches }`, where `of` is 4 per awake patch. Use `landTotal().leaves` (or the per-patch `n`) for anything that should grow with the land.

**Garden patch layout (`docs/GARDEN-LAYOUT.md`):** built in v99. The pond has reeds, NOT a ring of stones (Bryce, 2026-11-14).

**Waiting on Bryce:** his play verdict on v99, with his picks on the greening look, the job-time table, Mabel's helping hand and crop green; is the big spring stump now too big (one number, `KIT_GROW`); stump and spring look rethink (round 9 no. 6). Game length: on hold, feel it out.

**Maybe pile:** automatic concern inbox; a spell for work past bedtime; birdsong returning as the land greens; phone sideways; more bug baths on patches (round 10 no. 27); a use for picked herbs (round 10 no. 35). Held back on purpose: pot seats before the bench (could strand a player).

## 3a. From the full review (2026-11-16; detail in `docs/REVIEW-2026-11.md`)

**The five taste calls: Bryce said "yes to all five" (2026-11-16). Built as v107, LIVE 2026-11-16 (Bryce: "Yes, put it live"; previews in `/mnt/project-files/review-v107/`):**
1. *The story catches up.* With two or more pages whose moment has come, the next may open four hours after the last, the same day (`C.story.catchUpMins`, `G.pageCanOpen`). Otherwise still one page a morning. Measured: a keen player reads four pages a day and starts the house on day three or four (was day nine or ten).
2. *The yard greens more slowly.* The home yard has its own marks for meadow and woodland (`homeAt` 40 and 140; other patches keep 12 and 26). A yard never goes back a stage (`flags.yardStage`). Measured: normal player meadow about day 6, woodland about day 15; keen player day 2 and day 5.
3. *No day counts in the words.* "Our first week" is now "What we have"; "a week ago", "the first in weeks", "their first whole day" and "tomorrow's page" reworded.
4. *Neighbour stories.* Mabel's is "The lost recipe" (Wendel plans the cake; he no longer forgets a date). Tobias's is "Something important" (a surprise Hazel has guessed; no silent supper). Both mind the twins; both cook for Juniper.
5. *The garden's safe copy.* Bryce does not want to save a file by hand, so the game keeps a second copy by itself (`Backup` in game.js: IndexedDB, today's and an earlier day's) and puts it back at start-up if the main save is missing or unreadable. Garden tools also has "save my garden to a file" and "bring a garden back" for a new phone.

**Next after v107 (Bryce asked 2026-11-16, agreed to do it second): back the garden up to his Google Drive by itself.** Needs a one-off registration on Google's side, done for him in a Mac chat with Chrome (he follows no steps), then a try on his real iPhone, because Google sign-in from a Home Screen game can be fiddly. For a public release Google also wants the app verified.

**Later (the day it starts to matter is a measurement from the pretend player, never a target):**
- Day 2 to 3, keen player: an empty week before the house, because every job waits for one story page a morning. (Question 1.)
- Day 2 keen, day 5 to 7 normal: the home yard is already at its last stage. (Question 2.)
- Day 14: the Jobs page is two screens long; "shelf full" tags cover item names; the name board is spoken of before it is made.
- Day 20, once-a-day player: light piles up far past what the jar holds.
- Day 30: 37 wish-list makes waiting at once; twigs run short until about day 45; many white flames with haloes on a big garden (check against "nothing glows").
- Day 60: nearly every shelf at its limit of 40; counters that only go up start to look silly ("501 grown so far").
- Day 77: nothing new at all. The held month-two builds are the answer.
- Any time: the greening meter rethink (round seven note 14) is still open.

**Before release (the stranger check; leave alone unless cheap):** watch one stranger play the first five minutes; test a real iPhone, an older iPhone and an Android phone; small-phone Journal page is cut off; menu text size as a setting and page zoom back on; a backup for the garden; works with no signal, with a proper Home Screen icon; pack the lettering inside the game instead of fetching it from Google; turn the play log and concern button off or explain them; a privacy note and credits; stop naming "The Secret World of the Gnomes" in art prompts and get a human view on how close the look is; decide how to say the paintings were made with an AI tool; a proper name and trademark check for "Gnome Life".

## 4. Stand-ins still in the game (2026-11-16, v105)

Art day 23 (2026-11-16) painted the barrow push strips and the brimming pond; wired in v105 (`docs/ART-DAY-23.md`).

Month one: none known. `make-bed2` has no slot painting on purpose (the bed uses `seedbed-rect`; its fence rails and crop rows are drawn in code).
Later: none (`make-mousedoor` is empty on purpose: that make is retired). Painted but not placed: frogmouth, owl on a stake, carrot with legs (the bucket is now the roof-leak bucket, `yard-bucket`).
Drawn in code on purpose: paper job flags, growing badge, glows, the Journal's cover, tabs and leaves (v102; the green sprig is gone).

## 5. The game in brief (Bryce's decisions)

- Wendel (dreamer) and Hazel (practical, never sceptical or hen-pecking), newlyweds regrowing a logged Australian clearing into a cosy 5x5 village. The player is the heart of the wood, a bodiless forest spirit; the gnomes do every physical job. 2 to 5 minute visits; jobs take real time; no gnome work 22:30 to 06:00.
- Art: "Secret World of the Gnomes" storybook paintings, never clay or toy. Parchment menus, nothing glows, contact shadows. Less text, more visual cues.
- The land is the menu: paper flags where a job can start, tap for a job card; Jobs lists everything. Unopened land is pencil on paper. Only growing things bring green.
- No fixed game length (Bryce, 2026-11-14). Pace is felt out through play, not planned to a number of days. Today's build happens to bring Mabel about day 15 and the festival about day 56; those are measurements, not targets. Selling is allowed: donations likely, a sale possible (Bryce, 2026-11-16).

## 6. Where things live

- **Code:** `index.html` (drawing, UI, art slots `ART_SLOTS`), `game.js` (save, jobs, story ticks), `content.js` (all words, jobs, story), `walk.js` (collision), `concerns.js`, `playlog.js`. Sprites in `sprites/`; `index.html` inlines `GNOMES` from `sprites/gnomes.json` (re-paste after `tools/pack_*.py`).
- **Art days:** on Bryce's Mac with Gemini in Chrome (skill `nano-banana-art`), Remote Control in `/Users/Talisman/Claude/gnome-life/` (never Downloads). Paint lit things unlit. About 22 pictures per 5-hour Gemini window. Each art day has `docs/ART-DAY-NN.md`.
- **Project files** (`/mnt/project-files/`): the notes tracker, each round's notes, previews. Mac sessions can't write there: the coordinator updates the tracker for them.
- **Project memory** holds Bryce's preferences and decisions; keep it in step with this file.

## 7. Docs

| Doc | What's in it |
| --- | --- |
| `BRYCES-RULES.md` | The patterns behind Bryce's notes; check every change against it |
| `REVIEW-2026-11.md` | The full review and forecast of 2026-11-16: findings, the day 1 to 100 forecast, the four piles |
| `VISION.md` | The locked game vision |
| `STORY.md` | The first month's story, chapters and pages |
| `ANIMALS.md` | Animals and their side stories |
| `DECORATIONS.md` | Makes, wishes and the item economy |
| `GARDEN-LAYOUT.md` | The garden patch's planned final layout and the calm-ground art item |
| `MONTH-TWO.md` | Month two to the festival (held) |
| `STYLE-GUIDE.md` | Art rules; read before any art |
| `ART-DAY-PLAN.md`, `ART-DAY-*.md`, `ART-BATCH-*.md` | Art prompts and what each art day made |
| `archive/PLAN-history-to-2026-11-14.md` | The old full plan: every decision and build from v1 to v97, with reasons. Search it when you need the why behind something; don't add to it |
