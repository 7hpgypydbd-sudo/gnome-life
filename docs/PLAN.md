# Gnome Life — running plan

A cosy virtual-pet game for Bryce's iPhone, played as a web page from a Safari Home Screen shortcut. Charm and aliveness over complexity; must run smoothly on a phone. (Earlier working title: "Fairy Garden".)

_Last updated: 2026-10-25 (art batch 1 cut and wired in; art-day folder added the day before)_

## Start here, next chat

1. **Play it:** https://7hpgypydbd-sudo.github.io/gnome-life/ (GitHub Pages, redeploys on every push to `main`). Code: https://github.com/7hpgypydbd-sudo/gnome-life (public, Bryce's choice).
2. **Masters:** the repo is the master for code and this file. Bryce's Mac working copy is `~/Downloads/gnome-life` (signed in to GitHub via `gh`); run `git pull` there to sync. Untracked working art (`cut/`, `preview/`, `iso1/`) lives in `~/Downloads/fairy-garden/`. **Art day for Bryce lives in `~/Downloads/Gnome Art Day/`** (made 2026-10-24): `1 - Reference pictures` (plot-barren.jpg + pre-cropped him/her side/front/back), `2 - Put finished pictures here` (THE inbox; replaces the old `fairy-garden/inbox/`), `3 - Steps.txt` (all 13 prompts written out in plain words with the style paragraph). A cloud copy of this file is at `/mnt/project-files/fairy-garden/PLAN.md`; keep it equal to the repo copy.
3. **Before any art, read `docs/STYLE-GUIDE.md`.** Before changing gameplay, read the "Gameplay loop v2" section below. Content changes should only touch `content.js`.
4. **ART-BATCH-1 is DONE and wired in (2026-10-25):** 7 painted ground tiles (`sprites/tile-*.webp`, same 1225x728 diamond as `plot-barren.webp`) and the young couple's 8-frame walk strips (side/front/back for him and her). `drawTile` now swaps painted tiles per land stage (home: plot-barren -> tile-green -> tile-meadow -> tile-woodland; neighbours: tile-barren-plain -> fades to tile-green while regrowing). `tile-stream` and `tile-path` are loaded but not placed yet (for the map/town pass). Known nit: the woodland tile's painted sapling sits under the barrel/campfire props on the home tile. **Immediate next step:** the paused playability fix (pick-ups at start, bigger starting kit, glowing rings on tappables, welcome note), then Bryce plays for a day or two.
5. **Ask Bryce before assuming** gameplay, art style, creatures or goals. He likes tappable quiz-style decision cards, wants images shown in the chat, and is usage-conscious.

## Concept (decided)
Bryce's original brief (paraphrased): start with gnomes in a barren landscape, like the aftermath of logging or a bare highway verge; humans implied gone. Visit once or several times a day; resource/time limits like mobile games but used to delay gratification (not to take money), not too much. Rebuild the landscape, then the home, then expand to a town. Random events, surprises, magic. Themes of environmentalism and wholesomeness. Others might play one day. Main game is FarmVille-esque.

A cosy **virtual pet** with a David-the-Gnome feel, using original characters (no copied names, designs or story). A young newlywed gnome couple (about 25; they could age over the game) arrive in a barren, human-scarred landscape (a logged clearing; humans implied gone). With Bryce's help, and magic that grows each real day, they regrow the land, then their home, then a whole gnome town. Themes: environmental regrowth, wholesomeness, patience, craft and care.

Side mystery (placeholder): a magic staff one gnome finds. **Bryce writes this plot himself; do not invent it.** The save has a `story` hook ready (see below).

## Decisions (all from Bryce, 2026-10-24)
- **Art style:** the look of "The Secret World of the Gnomes" book illustrations (Poortvliet): painterly, naturalistic, muted earthy palette, weathered faces, real clothes (red cap, blue tunic, brown trousers, clogs), tiny gnomes in a full-scale woodland. **Never clay or toy-like** (rejected as "for preschoolers").
- **View:** isometric, fixed three-quarter painted world, FarmVille-style layout with the gnome-book look. Pinch-zoom and drag only, no orbit. Modular ground tiles join into a big map that spreads as land regrows. (The orbiting 3D diorama was judged "wonky"; gnomes looked like cut-outs.)
- **Assets must be fully owned:** Nano Banana (Gemini) only. No Meshy/Tripo or other free tiers that keep ownership; Bryce may sell the game one day. Characters are 2D painted sprites with multi-frame walk cycles.
- **Approved young gnome refs:** `ref-him-young-v1.jpg` and `ref-her-young-v1.jpg` (in `/mnt/project-files/fairy-garden/art/refs/` and `~/Downloads/fairy-garden/iso1/`). The elderly walk sheets currently in the game are placeholders to be replaced. Names confirmed 2026-10-25: Wendel and Hazel (the old working names Ferdinand and Rosalind are retired).
- **Seasons and clock:** day/night follows the phone clock. Bryce lives in Australia, so seasons are southern hemisphere (Sep–Nov spring, Dec–Feb summer, Mar–May autumn, Jun–Aug winter).
- **Timers:** gentle real-time waits, typically 2-6 h, never monetised, never frustrating. Always leave something to do now, something soon, something slow.
- **Resources:** a few real items (acorns, moss, twigs, stones, seeds, dew) plus one magical resource (collected light) that fuels spells.
- **Setbacks:** gentle and fixable (storm, hungry rabbit, wilting patch); never lost progress.
- **Story:** a light scripted quest line with a few named characters (ideas: an old wise gnome, a spirit of the land) guiding big milestones; emergent events fill gaps.
- **Catch-up:** the world keeps growing gently while away; timers finish, nothing new starts without the player. Return to a pleasant surprise, never a backlog.
- **Goal/journal:** a gentle creature journal; tap visitors to note them down. Roster should keep growing; add anything on theme.
- **Built for other players later:** one JSON save blob behind a small adapter, data-driven content, absolute-timestamp timers.

## Workflow (decided, to save usage)
- **Project default model** was switched to Fable 5.1 (most capable) on 2026-10-24; Bryce is usage-conscious, so use Sonnet for routine jobs.
- **Repo is public** (Bryce's choice, for free GitHub Pages hosting). The coordinator flagged that anyone can then copy the art and code, which matters if Bryce sells the game; moving to a private repo plus Cloudflare Pages/Netlify is an easy later change if he wants it.
- **If a Mac session is used for art again:** Chrome's download "Save" box blocked downloads (now disabled), Mac low power mode slows things (now off), and Gemini sometimes answers with text instead of an image or fails to paste references.
- **Claude does NOT drive Chrome for art.** Claude writes numbered prompt batches from `STYLE-GUIDE.md` (saying which reference image to paste for each); Bryce pastes them into Gemini and saves downloads to `~/Downloads/Gnome Art Day/2 - Put finished pictures here/` (for future batches: also write a plain Steps.txt into that folder, Bryce finds the markdown prompt files confusing); Claude then cuts, cleans, packs and places them.
- **Models:** Sonnet for routine work (sprite processing, content tuning, small tweaks); Fable for design and tricky code. Suggest model switches to Bryce; never switch without his say-so.
- **Gemini lesson:** long chats drift in style. Start a fresh chat with one small cropped reference of the exact pose/angle wanted. Gemini ignores "isometric three-quarter" for characters and gives side/front/back, which is fine (side is mirrored for left).
- Close Mac Remote Control sessions when a thread finishes. Do not move files in the shared project folder that a thread has already linked. Suggest a new chat when a thread gets long or a phase finishes, after updating this file and memory.
- Sprite tools in `tools/`: `cut_blobs.py` (gap split for regular sheets), `cut_cc.py` (flood fill for irregular prop sheets), `pack_walks.py` (packs strips + `sprites/gnomes.json`), `contact.py` (contact sheets). They need the untracked `cut/` working art on the Mac.

## What's built (live game, repo root)
Files: `index.html` (canvas scene, tile map, DOM sheets), `game.js` (state, rules, timers, save), `content.js` (all data tables: resources, offers, crops, tasks, land stages, magic levels, spells, visitors, lines, events, story hook), `sprites/` (webp props, plot, gnome strips, `gnomes.json`, `props.json`), `docs/` (this plan, style guide, art batch, source art), `tools/`.

### Gameplay loop v2
- **Save:** one JSON blob in localStorage key `gnomelife.save` behind a `Store` adapter (load/write/clear). Autosaves every second if dirty and on page hide. Old saves gain new fields on boot (shallow migrate), `v:1`.
- **Timers:** absolute `endsAt`/`readyAt`, resolved lazily in `G.tick()`. `#fast` makes a content "minute" 0.1 s for testing. Each magic level trims task time 8%.
- **Loop:** (1) Look: "While you were away" sheet on return. (2) Gather: the land leaves an offering every 35 min, capped at 6; twigs, moss, stones, acorns, seeds, dew, berries (day), feathers, wisps of light at night. (3) Help: Tasks sheet; give materials, a gnome walks over and works 1-6 h. (4) Plant: seed bed plant -> water -> 3 h -> pick. (5) Journal: visitors appear by hour, land stage, season; tap to note.
- **Land:** home tile earns "green" points from tasks and harvests; stages bare -> first green (4) -> young meadow (12) -> young woodland (26), so woodland lands around day 8-10. First green reveals up to 2 misty neighbour tiles; each has a "Coax the land next door" task (3 seeds, 3 moss, 2 dew, 6 h, needs magic 2) that greens it and reveals its neighbours, out to 2 tiles. Tiles are still the barren plot image repeated with a green-wash placeholder. Geometry: east step (609,346), south step (-609,345); `toWorld(gx,gy,tile)` and `fromWorld`.
- **Magic:** level = distinct days visited (1, 2, 3, 5, 8 days -> levels 1-5). Unlocks L2 Coax a sprout (2 light), L3 Call soft rain (3 light), L4 Wake the land (4 light).
- **Story hook:** save has `story: { chapter, flags, found }`, `G.flag()/hasFlag()`, `CONTENT.story.beats` (empty). Reserved for Bryce's staff mystery.
- **Content pass 1:** 32 tasks in tiers by magic level and `needs` chains (first days: woodpile, doorstep, rain barrel, washing line, lantern, window box; up to level 5: plant the grove, welcome sign, thank-you picnic). 20 Australian visitors (fairy-wren, kookaburra, echidna, possum, blue-tongue, frog after the pond, etc.), still placeholder ink blobs; optional fields `look`, `icon`, `fly`, `speed`, `task`. 21 lines each for him and her plus 7 each while working. 20 gentle events rolled every 2 h of play (and once on return after 2 h+), gated by hour, land stage, season or task.
- **Isometric scene:** plain 2D canvas, DPR-aware, no libraries. Plot image is the world; props and gnomes sit on a 0..1 grid mapped to the plot's top face, depth-sorted by gx+gy, drawn at SPR=0.5. Gnomes wander named spots (door, fire, bench, bed, barrel, tub, sprout, barrow, lantern, fence), facing chosen from screen-space motion (front/back/side, side mirrored). Tap one for a line. Real-clock lighting: day 8-17, blends 5-8 and 17-20, night tint with campfire flicker, glows, fireflies; dawn/dusk overlay.
- **Pinch-zoom fix (DONE 2026-10-24):** pinch anchors the world point under the starting midpoint (no drift), zoom clamped min..4, Safari page-zoom gestures blocked, camera starts about 2.4x min zoom centred on the gnomes.
- **Test tokens:** `#fast`, `#day #night #dawn #dusk`, `#vis=robin`, `#reset`. Console: `GL.s`, `GL.give({seed:5})`, `GL.reset()`.
- **Checked** at 375x812 in a desktop browser (loop, tiles, lighting). Content pass 1 tested by script only. **Not yet checked on Bryce's real iPhone** (smoothness, pinch fix).
- **Known placeholders/gaps:** emoji inventory icons; offerings and visitors are code-drawn blobs; every barren tile shows identical stumps; gnomes still use the old elderly walk sheets; no notifications; no sound.

### Art set: isometric (made on Mac, `~/Downloads/fairy-garden/iso1/`)
- `plot-barren` (1376x768 diamond slab; cut to `sprites/plot-barren.webp` 1225x728; top-face corners top (612,1), left (3,346), right (1221,347), bottom (612,691)) and 11 homestead pieces (shelter, campfire, firewood, barrel, seedbed, stonebench, tub, lanternstump, wheelbarrow, fence, sapling), all in `sprites/`.
- Walk sheets (him side/front/back, her side/front/back; her front/back redone from a fresh Gemini chat) packed to `sprites/{him,her}-{side,front,back}.png` + `gnomes.json` (cells 109x242 him, 136x242 her). These are the OLD elderly pair.
- Older art set 1 (painted backdrop, oak home, props, gnomes, visitors) is in `docs/art/`, for reference. The painted diorama and code-drawn three.js prototype are retired; copies remain in `/mnt/project-files/fairy-garden/{diorama,prototype}/`.

## Game design framework (reference)
- **Visit:** a few minutes, once or several times a day: look, gather, help, set something going, note visitors, leave.
- **Three arcs:** Land (bare -> green -> meadow -> woodland); Homestead (shelter under a root -> proper home with cut-away interior -> garden, veg patch, well, workshop); Town (visiting gnomes stay, build homes, a village grows).
- **Magic:** weak at first so early play is hands-on; grows by real day, unlocking coaxing seedlings, calling rain, waking trees.
- **Events:** random visitors (animals, spirits, a travelling gnome), weather, finds in soil, couple moments, seasonal touches; mostly good, odd mild fixable setback.

## Vision decisions (2026-10-25, from the "Pin down the game's vision" thread)
The full question set lives in `docs/VISION-QUESTIONS.md`. Answers are recorded here as Bryce gives them.
- **World size:** Village, about 25 tiles (5x5). Big enough for a stream, a path, several neighbours' homes and a little square.
- **Land spread:** ripples out from the home tile; each healed tile reveals its misty neighbours.
- **Barren tiles:** a mix of human scars: bare plain, stumps (have), plus a dry creek bed, an old fence/rubbish and one more to paint.
- **Finished map headline (Bryce's words):** a gnome village (homes, well, square, bridge, mill/workshop, orchard, pond) that stays cosy and embedded in nature, "not a gnome city, still plenty of nature and whimsy". Rule of thumb: more than half of every tile stays wild (ferns, toadstools, roots, water); buildings sit under or inside trees, roots and stumps rather than in rows.
- **Ageing:** yes, slowly over many months: young now, middle-aged around the village stage, old in the long tail (three character art sets over time; the old placeholder walk sheets may become the final stage).
- **The player is an unseen helper spirit:** you tap and things happen; the gnomes talk to "the kind spirit"; the magic is yours to lend them.
- **Names: Wendel (him) and Hazel (her).** Confirmed 2026-10-25; replaces the working names Ferdinand and Rosalind everywhere (content.js lines still need updating).
- **Personalities:** Wendel is the dreamer (tinkers, invents, gazes at stars, a little absent-minded); Hazel is practical (organises, gardens, keeps them fed, dry wit). Gentle comedy between them; both kind.
- **Daily routine:** yes, a real rhythm on the phone clock: wake, breakfast by the fire, work, an evening sit (Wendel's pipe, Hazel's knitting), sleep. Visit at night and you find them asleep or by the fire. Needs poses: sleep, eat, sit, pipe, knit.
- **Visit end:** both: a clear gentle "all done for now" moment (a line from Hazel or Wendel, the screen settles) plus idle fiddling (decorating, chatting, collecting dew) that stays open.
- **Children:** maybe later; nothing built now, but story and save leave room for a child arriving around the village stage.
- **Visit length and frequency (Bryce's words):** the main loop is 2-5 minute visits, 2-3 times a day (jobs roughly 3-8 h), but quick bored check-ins must always find a little something to do (a dew drop, a chat line, a pot to move, a small 10-20 min job).
- **Home stages:** three big leaps: (1) shelter under a root with campfire (have), (2) snug house in a stump or under an oak, (3) house plus garden, well and workshop. Small add-ons are decorations on top.
- **Interior:** tap the house to open a painted cut-away room as its own scene (one picture per home stage); the evening routine (fire, pipe, knitting, bed) plays out there.
- **Decorating:** a modest set of loose items you can place and drag around the home tile (bench, lantern, flower pots, washing line, fence bits). Not a full garden designer.
- **First village buildings:** well, bakery oven, workshop, bridge over the stream (everyday village life). Others (mill, orchard, beehives, pond, meeting hall, inn, market stalls) can come later.
- **Town growth:** travelling gnomes visit; build them a home (under a root, in a stump) and they stay. You choose who stays; the visitor journal and the town are linked.
- **Neighbour count:** 6-10 by the finished village (baker, carpenter, old sage, a few families), still mostly trees.
- **Neighbour depth:** each has a trade and a handful of sayings AND a little quest of their own (a small story to help with). Writing budget: roughly 8-10 mini-quests over the game.
- **Who you help:** mainly Wendel and Hazel; neighbours occasionally ask small favours (firewood for the baker, a rare flower for the sage). Never a whole-village manager.
- **Animals:** mostly Australian wildlife (fairy-wren, echidna, possum, blue-tongue, kookaburra, frog) plus a few honorary classics from the books (hedgehog, owl, mouse).
- **Magical folk:** a few, rare and special: a spirit of the land, will-o'-wisps at night, maybe one mischievous troll-ish nuisance. Not a fairy theme park.
- **Journal:** each creature gets a small painted portrait, one warm line of lore, and the date first seen.
- **Regulars:** some creatures become daily regulars if you leave out food (seed, berries) and may nest nearby. No named pets.
- **Magic is for healing land and gentle weather only:** coax sprouts, call rain, wake a tree, clear mist. No crafting or conjuring; the staff mystery stays separate and special.
- **Light (magical resource):** both gathered at night from wisps and dew AND earned by good deeds (finishing jobs, helping creatures), so day-only players are not punished.
- **Pacing:** 3-6 months of light daily play to a finished village. Home tile green in 1-2 weeks, proper house around a month, village by about half a year; ageing spreads over a year or more.
- **Ending:** a soft ending (a village festival marks the finish), then the world keeps living: seasons, visitors, events and ageing carry on gently.
- **Voice:** warm, a little old-fashioned, lightly funny, like a storybook narrator ("Wendel has misplaced his pipe again. Hazel knows exactly where it is.").
- **Reading:** a line or two in normal play; big milestones (new neighbour, home stage, festival, staff beats) open a small illustrated story page.

## Open questions for Bryce (do not assume)
- Town stage: one fixed scene that gets busier, or neighbouring scenes to tap through (current engine suggests a spreading tile map)?
- The staff mystery itself (Bryce writes it).

## What's next (prioritised)
1. **Bryce:** play the live game on the iPhone for a day or two; report pinch/zoom, smoothness, timer feel, anything wrong. (Art batch 1 done.)
2. ~~Cut and pack batch 1~~ done 2026-10-25. `tools/pack_walks.py` now reads `cut/` made by `cut_cc.py` (Gemini gave each walk sheet a different layout, so frames were picked by hand in the SEL table). Source jpgs are in `docs/art/batch1/`.
3. **Tune from Bryce's notes:** timers, costs, content in `content.js`.
4. **Next art batch (Claude writes prompts):** gnome action sheets (dig, water, carry, sit), painted resource icons, painted visitors, more props for the 32 tasks, variety so barren tiles are not identical.
5. **Engine/feature work (Fable for design):** modular map growth, homestead stages 2+ (proper home), more crops, decorating (place and move items), notifications/Home Screen icon and full-screen web-app settings, optional sound.
6. **Staff mystery hook** once Bryce writes it.
7. **Experiments (low priority):** one Grok Imagine side-by-side test of a gnome vs the Nano Banana sheet; an AI picture-to-3D-world test (Bryce asked) on one painted scene; an art "assembly line" queue (`art/queue.md`) if Gemini credits run low.

## Hosting
- Repo: https://github.com/7hpgypydbd-sudo/gnome-life (public, `main`; game at repo root, docs in `docs/`).
- Live: https://7hpgypydbd-sudo.github.io/gnome-life/ (GitHub Pages from `main` root; redeploys on every push).
- Mac working copy: `~/Downloads/gnome-life`.
