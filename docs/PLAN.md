# Fairy Garden — running plan

A cosy 3D gnome garden for Bryce's iPhone, played as a web page from a Safari Home Screen shortcut. Charm and aliveness over complexity; must run smoothly on a phone.

_Last updated: 2026-10-24 late evening (thread "First gameplay loop": gameplay v2 built and published)_

**Start here, next chat:** The playable build is https://claude.ai/artifact/9ne3w3pgRjb5kFA1t1NKVA (v2, first gameplay loop, placeholder art). Code on Bryce's Mac in `~/Downloads/fairy-garden/iso/` (`index.html` scene + UI, `game.js` rules/save, `content.js` data tables). READ `STYLE-GUIDE.md` before any art. Art is made in batches by Bryce: the next batch is written in `ART-BATCH-1.md` (7 ground tiles + 6 young-couple walk sheets); when files land in `~/Downloads/fairy-garden/inbox/`, cut and pack them (Sonnet is fine) and wire them in: tiles replace the green-wash placeholder in `drawTile`, walk strips replace the elderly pair via `iso/tools/pack_walks.py` + `sprites/gnomes.json`. Then: Bryce plays v2 for a day or two and says what feels wrong; tune timers/content in `content.js`. Hosting (GitHub Pages) is still open. The old painted diorama and code-drawn prototype are reference only.

## Content pass 1 (2026-10-24, Sonnet; for roughly 1-2 weeks of play)
- **Tasks:** 5 -> 32 (1-6 h timers), in tiers gated by magic level (`minLevel`) and `needs` chains: first days (woodpile, doorstep, rain barrel, washing line, lantern, window box), level 2 (herbs, compost, birdbath, wildflowers, bean poles, path, berry bush), level 3 (pond, native bee house, nest box, leaf-pile shelter, toadstool ring, plant acorns), level 4 (seed tin, meadow strip, glow-jar path, lean-to, swing), level 5 (plant the grove, welcome sign, thank-you picnic). Land stage thresholds stretched to 4 / 12 / 26 green points so woodland lands around day 8-10.
- **Gatherables:** new `berry` (daytime) and `feather`; resources can carry a `color` for the placeholder offering.
- **Visitors:** 6 -> 20 (fairy-wren, butterfly, snail, green tree frog, dragonfly, possum, blue-tongue, echidna, bandicoot, tawny frogmouth, kookaburra, native bee, glow-worm, moth). New optional fields: `look` [colour, rx, ry], `icon`, `fly`, `speed`, and `task` (only appears once that task is done, e.g. frog after the pond). Still placeholder blobs.
- **Lines:** 21 each for him and her, 7 each while working (young newlyweds, warm and a bit silly, regrowth theme).
- **Events (new `CONTENT.events`):** 20 gentle happenings, rolled every 2 h of play (and once on return after 2 h+), gated by hour, land stage, southern-hemisphere season or task. Only small gifts or moments, never a loss. Shown as a toast, in the journal log, and in "While you were away".
- **Small engine hooks added** (needed to make the tables work, no behaviour changes): `rollEvent`/`season` in `game.js`, `task` gate in `pickVisitor`, `events` in the save; `index.html` reads `look/icon/fly/speed` from visitor data, `color` from resources, and toasts events. Staff mystery hook untouched.
- Tested only by script (all tasks/costs valid, visitors and events roll); not eyeballed in a browser or on the phone.

## Gameplay v2 (DONE 2026-10-24, thread "First gameplay loop") — what it is
- **Files:** `iso/index.html` (canvas scene, tile map, DOM sheets), `iso/game.js` (state, rules, timers, save), `iso/content.js` (all tables: resources, offers, crops, tasks, land stages, magic levels, spells, visitors, lines, story hook). Content changes should only touch `content.js`.
- **Save:** one JSON blob in localStorage key `gnomelife.save` behind a tiny `Store` adapter (load/write/clear) so it can move to a server later. Autosaves every second if dirty, plus on page hide. Old saves gain new fields on boot (shallow migrate). `v:1`.
- **Timers:** absolute `endsAt`/`readyAt` timestamps, resolved lazily in `G.tick()`; `#fast` in the URL makes a content "minute" 0.1 s (3 h -> 18 s) for testing. Each magic level trims task time 8%.
- **Loop:** (1) *Look*: a "While you were away" sheet on return (new day, what finished, how many offerings). (2) *Gather*: the land leaves one offering every 35 min, capped at 6 so there is never a backlog; twigs, moss, stones, acorns, seeds, dew by day, wisps of light at night; tap to gather. (3) *Help*: Tasks sheet; give materials, a gnome walks to the spot and works (bob + puffs) for 1-6 h: fill the ruts, moss the roof, mend the fence, set the bench, plant the sapling out (after ruts). (4) *Plant*: tap the seed bed: plant (1 seed) -> water (1 dew) -> grows 3 h -> pick (2 seeds + 1 moss). (5) *Journal*: visitors appear during a visit (placeholder ink blobs: robin, mouse, hedgehog, owl, ladybird, spirit; by hour and land stage), tap to note.
- **Land:** home tile earns "green" points from tasks and harvests: bare (0) -> first green (4) -> young meadow (8) -> young woodland (14). Reaching first green reveals up to 2 bare neighbour tiles (misty); each has a "Coax the land next door" task (3 seeds, 3 moss, 2 dew, 6 h, needs magic level 2) that greens it and reveals its neighbours, out to 2 tiles from home. Tiles are the barren plot image repeated with a green wash placeholder until the painted tile set exists. Tile geometry: east step (609,346), south step (-609,345); `toWorld(gx,gy,tile)`, `fromWorld` for taps.
- **Magic:** level = distinct days visited (1,2,3,5,8 days -> levels 1-5). Unlocks: L2 Coax a sprout (2 light: finish the crop), L3 Call soft rain (3 light: waters the bed, +2 dew), L4 Wake the land (4 light: halve a regrow timer). Magic sheet shows the meter and a "start over" link.
- **Story hook:** save has `story: { chapter, flags, found }`, `G.flag()/hasFlag()`, and `CONTENT.story.beats` (empty). Reserved for Bryce's side mystery about a magic staff one gnome finds; Bryce writes that plot himself, do not invent it.
- **Test tokens:** `#fast`, `#day #night #dawn #dusk`, `#vis=robin`, `#reset` (wipes the save). Console: `GL.s`, `GL.give({seed:5})`, `GL.reset()`.
- **Checked** at 375x812 in the desktop app browser: day and dusk, sheets, tile joins, full loop in fast mode (plant/water/harvest, 4 tasks, first green, 2 tiles revealed, regrow). Not yet on the real iPhone.
- **Known placeholders/gaps:** inventory icons are emoji; offerings and visitors are code-drawn blobs; repeated barren tile shows the same stumps on every tile; the gnomes still use the old elderly walk sheets; no notifications; no sound.

## Isometric art set 1 (DONE 2026-10-24, all Nano Banana, on Bryce's Mac in `~/Downloads/fairy-garden/iso1/`)
- `plot-barren.jpg` 1376x768: the barren logged-clearing plot as an isometric diamond slab on magenta. Cut: `iso/sprites/plot-barren.webp` 1225x728. Top-face corners in that image: top (612,1), left (3,346), right (1221,347), bottom (612,691).
- `homestead-1.jpg` 768x1376 on magenta: 11 pieces, cut to `iso/sprites/*.webp`: shelter (root hollow + canvas awning + plank door), campfire (kettle on tripod), firewood, barrel, seedbed (flat diamond of turned earth), stonebench, tub, lanternstump (lantern pole and stump came out as one piece), wheelbarrow, fence, sapling (potted). Made in the same Gemini chat as the plot so the angle matches.
- Walk sheets, 1376x768 each, 2 rows of 6: `walk-him-sw.jpg` (side profile facing right; frames 0 and 6 are standing), `walk-him-front.jpg` (top row front walk, bottom row reverted to profile), `walk-him-back.jpg` (top row back walk). Her: `walk-her-side.jpg`, `walk-her-front.jpg`, `walk-her-back.jpg`, all 1376x768 (front and back redone 2026-10-24 in a fresh Gemini chat using only her original front-standing pose as the reference, after Bryce said the first front sheet didn't match the side; the old cartoony one is kept as `walk-her-front-old-cartoon.jpg`). Lesson: a long Gemini chat drifts in style; start a fresh chat with a tiny cropped reference of the exact pose/angle you want. Gemini ignores "isometric three-quarter" for characters and gives side/front/back, which is fine (side is mirrored for left).
- Packed: `iso/sprites/{him,her}-{side,front,back}.png` strips (cell 109x242 him, 136x242 her; 10 side frames, 6 front, 6 back), manifest `iso/sprites/gnomes.json`. Tools: `iso/tools/cut_blobs.py` (gap split, for regular sheets), `cut_cc.py` (flood fill, for irregular prop sheets), `pack_walks.py`, `contact.py`.
- Nano Banana gotchas (paste, downloads, cutting) are in Claude's memory file `nano-banana-workflow`.
- Bryce (2026-10-24): "the side is on the right track, I like where you are going with this". Wants the world MUCH bigger than one plot; coordinator suggested modular ground tiles that join into a large map with props anchored on them, and locking a style guide + gnome designs before scaling art. Not yet decided.
- DECIDED 2026-10-24: the couple are young newlyweds (about 25). Bryce: making them younger also keeps us further from David the Gnome; they could age over the course of the game. New reference sheets `iso1/ref-*-young-v1.jpg`; the existing walk sheets are the OLD elderly pair and must be regenerated from the new refs before the gameplay loop ships (fine as placeholders meanwhile).

Notes from eyeballing the sheets: `gnome-him.jpg` is a 3x3 grid (stand, walk R, walk R, wave, dig, sit, stand, blank, sit); `gnome-her.jpg` is 2x3 (stand, walk R, walk L, wave w/ herbs, basket, watering, with a small sprout beside the watering pose); `visitors.jpg` is 2x4 (hedgehog, robin, owl, ladybird on leaf, owl, mouse, mouse, spirit); `props.jpg` is 3x4 as listed. Grid cells are even, so `tools/cut_sprites.py` with those cols/rows should work.

## New direction (Bryce, 2026-10-24, evening)
A cosy **virtual pet**: you look after a newlywed gnome couple (original characters, inspired by the feel of David the Gnome but not copying its names, designs or story) as they grow their home and surroundings from a basic newlywed homestead. Animal and spirit visitors, random events, and ways you help them grow. Bryce said the code-drawn v4 look is "headed in the right direction but still needs a LOT of work". Graphics plan: painted art from Nano Banana (Gemini) brought to life with animation, instead of code-drawn 3D. First painted test done (`art/painted-test-couple.jpg`): Bryce called it "gorgeous" and asked how to make it 3D, rich and explorable. Proposed: painted diorama (layered painted cut-outs at depths in three.js, partial orbit + zoom + parallax, painted character sprites, tap-through scenes incl. a cut-away home interior that fills as they grow). Alternatives: AI image-to-3D models (Meshy/Tripo), or AI image-to-3D-world (experimental). Bryce picked the painted diorama (2026-10-24). First art set is DONE (made 2026-10-24 with the test image as a style reference).

## Art set 1 (COPIED 2026-10-24 into project files: `art/source/*.jpg`, the 6 originals; nothing cut yet)
- `backdrop.jpg` 1376x768: misty woodland, open middle; framed by two big mossy trunks at left and right edges.
- `oak-home.jpg` 1024x1024 on magenta: oak base, round door, round window, brass knob, lantern. Trunk runs off the top.
- `props.jpg` 768x1375 on magenta: 12 items in a 3x4 grid (fern, fly agaric, brown mushrooms, firewood, mossy stone, acorns, grass+flowers, veg patch, bucket, plus bonus: grass tuft with toadstool, 2nd veg patch, 2nd bucket).
- `gnome-him.jpg` 768x1375 on magenta: him in a 3x3-ish grid (standing, walk right, walk right again (mirror for left), wave, dig, sit, plus duplicate standing/sitting row). Magenta slightly pinker; key with a looser threshold.
- `gnome-her.jpg` 768x1375 on magenta: her, 2 wide x 3 tall: standing, walk right, walk left, wave, basket, watering.
- `visitors.jpg` 768x1375 on magenta: 2 wide x 4 tall: hedgehog, robin, ladybird on leaf, tawny owl, field mouse, glowing spirit (owl and mouse drawn twice). Spirit has pink glow baked in; clean it and add glow in code.
- Also `art/painted-test-couple.jpg` in project files (the original test; Bryce: "gorgeous").
- Cutting tool: `tools/cut_blobs.py sheet.jpg out_dir prefix [--thresh 0.36] [--join 4] [--maxh N] names...` keys out magenta and finds each figure as a blob (the sheets are NOT regular grids), names them top-to-bottom, left-to-right. Use `--thresh 0.36` for gnome-him (pinker magenta), `--join 6` for visitors. Cut sprites live in `diorama/sprites/` (webp). `tools/cut_sprites.py` (grid version) is superseded.
- The spirit sprite needed a custom key (pink glow stripped, warm tint); the oak-home trunk top is alpha-faded into the mist; `floor.jpg` is a seamless moss tile synthesised from the backdrop's ground; `shadow.png`/`glow.png` are generated.

## How art gets made (important)
- **DECIDED 2026-10-24 (Bryce, to save usage): art in batches.** Claude does NOT drive Chrome for art any more. Claude writes a numbered list of prompts from STYLE-GUIDE.md (with which reference image to paste for each), Bryce pastes them into Gemini himself and drops the downloads into `~/Downloads/fairy-garden/inbox/`, and Claude does the cheap part: cutting, cleaning, packing and placing. Use a cheaper model (Sonnet) for sprite processing and small tweaks; keep the top model for design and tricky code. Main work switches to the gameplay loop, saving and data; placeholder art is fine meanwhile.
- Next art batch: WRITTEN 2026-10-24 as `ART-BATCH-1.md` (13 prompts: 7 ground tiles incl. stream and path joiners, 6 walk sheets for the young couple). Waiting on Bryce to run it; outputs go to `inbox/`.
- This cloud thread has NO Claude in Chrome tools. Start a Remote Control session on Bryce's Mac (start_remote_control) and have it use Claude in Chrome + Gemini (Nano Banana skill steps, paste the reference image via JS). It saves to ~/Downloads/fairy-garden/.
- While a Remote Control session runs, this thread's folder tools are blocked. Stop it, then request ~/Downloads access and stage the files into /mnt/project-files/fairy-garden/art/. (At end of thread 1, device_stage_files was denied by a permission rule after the RC stop, so the 6 files were not copied yet.)
- Bryce wants to see images in the chat: attach them via post_message.

## Game design (draft from Bryce's ideas, 2026-10-24; open questions are NOT decided)

**Premise.** Two newlywed gnomes arrive in a barren, human-scarred patch of land (a logged clearing or a bare highway verge). The humans are implied gone. With your help, and with magic that starts weak and grows day by day, the gnomes regrow the world: first the land around them, then their home, then a whole gnome town.

**Core loop (a visit of a few minutes, once or several times a day).**
1. Look around: see what grew, who visited, what happened overnight.
2. Gather: pick up what the land has offered since last visit (seeds, acorns, moss, twigs, dew, found treasures).
3. Help: do the small tasks the gnomes can't yet do alone (clear rubble, carry water, plant, build a piece of the home).
4. Set things going: plant or start a build, which then takes real time to finish.
5. Note it down: creature journal entries for new visitors.
Then leave; the garden keeps growing while you're away.

**Gentle timers.** Things take real time (a seed sprouts in hours, a wall in a day) so there's a reason to come back, but the waits are there to make it feel alive and worth returning to, never to frustrate or sell anything. Rule of thumb: always leave something to do now, something ready soon, and something slow. Time follows the real clock (day/night, southern-hemisphere seasons); try it and adjust if it feels too slow.

**Progression (three arcs).**
1. *Land:* bare soil → first green → meadow → young woodland. The world is the pet as much as the gnomes are.
2. *Homestead:* shelter under a root → proper home (cut-away interior that fills with furniture) → garden, veg patch, well, workshop.
3. *Town:* once the homestead is done, visiting gnomes stay, build their own homes, and a village grows.

**Magic.** The gnomes' magic is weak at the start, so early on you do most of the helping. Each real day it grows, unlocking bigger acts (coaxing a seedling up, calling rain, waking a sleeping tree). Keeps the early game hands-on and the later game wondrous.

**Events and surprises.** Random visitors (animals, spirits, a travelling gnome), weather, finds in the soil, small story moments between the couple, seasonal happenings. Mostly good; the odd mild setback (a storm, a hungry rabbit) that the player helps fix.

**Themes.** Environmentalism and regrowth, wholesomeness, patience, craft and care, in the spirit of the gnome books.

**First 1-2 weeks of content (enough to start; build as we go).**
- The barren start scene and 3-4 land stages.
- One resource loop (gather → use) with 4-6 resource types.
- Homestead stage 1 to 2 (shelter → first real home), with a handful of build steps.
- Around 10 gnome tasks and 8-10 visitors for the journal.
- Daily magic growth with 2-3 visible unlocks.
- A few random events and one seasonal touch for the current season.

**Built for more than one player (design and code).** Design assumes any player, not just Bryce (no in-jokes required to understand it). Save data is one JSON blob behind a small load/save layer so it can move from localStorage to a server or sync later. Game rules and content (tasks, visitors, build steps, timers) live in data tables, not scattered in code. Timers use absolute timestamps so they survive closing the page. Keep content easy to add without touching the engine.

**Presentation:** DECIDED 2026-10-24 after the diorama demo: isometric / fixed three-quarter view, painted (FarmVille layout, gnome-book look), pinch-zoom and drag only. Characters stay 2D painted sprites with proper multi-frame walk cycles from Nano Banana. No Meshy/Tripo (ownership).

**Open questions for Bryce (please don't assume):**
- ~~Timer feel~~ DECIDED 2026-10-24: typical waits are mostly 2-6 hours (small things finish between morning, lunch and evening visits; big builds take a day or two). Still open: should a visit have a natural end, or always leave something tiny to do?
- ~~Resources~~ DECIDED 2026-10-24: both, small set. A few real items for building and planting (e.g. acorns, moss, twigs, water, stones, seeds) plus one magical resource (e.g. collected light) that fuels the gnomes' spells.
- ~~Setbacks~~ DECIDED 2026-10-24: gentle, fixable ones (storm, hungry rabbit, wilting patch). Never destroys progress; you help put it right and often gain something from it (a new visitor, a story moment).
- ~~Story~~ DECIDED 2026-10-24: a light quest line. A gentle thread of scripted moments and a few named characters (ideas: an old wise gnome, a spirit of the land) guide the big milestones (first green, the home, the town); emergent events fill the gaps.
- The couple's names and personalities.
- Town stage: a fixed single scene that gets busier, or new neighbouring scenes to tap through?
- ~~Catch-up~~ DECIDED 2026-10-24: keeps growing, gently. Timers finish and plants grow while away, but nothing new starts without you. Return to a pleasant surprise, never a backlog.

## Decisions made (all from Bryce, 2026-10-24)
- **Theme:** gnomes are the heart of it. Style reference: "The Secret World of the Gnomes" feel, so cosy woodland gnomes with red pointed caps, living under tree roots and in toadstools, alongside woodland animals.
- **Art style (revised 2026-10-24):** the gnome-book look, NOT clay toys. Bryce rejected the clay prototype as looking "for preschoolers". Target: detailed naturalistic watercolour illustration, muted earthy colours, weathered gnome faces and real clothes (red cap, blue tunic, brown trousers, clogs), tiny gnomes in a full-scale woodland of huge ferns, roots, moss and toadstools. Bryce chose "show me both first": a code-drawn restyle (done, v4) plus one painted Nano Banana gnome test to compare before committing.
- **What you do:** gardening + decorating. Plant seeds, water them, watch them grow over real days, and place toadstools, gnome homes, lanterns etc. where you like. (Not built yet.)
- **Creatures:** gnomes, fireflies, little bugs like ladybugs. Bryce said to add anything else that fits the theme, and that the roster should keep growing over time.
- **Goal:** a gentle creature journal. Tap visitors to note them down.
- **Real time:** day/night follows the phone clock and the garden changes with the real seasons. Bryce lives in Australia, so seasons use the southern hemisphere (Sep–Nov spring, Dec–Feb summer, Mar–May autumn, Jun–Aug winter).
- **Tech:** a single web page using three.js r147 (jsDelivr) + OrbitControls for one-finger spin and pinch zoom. No build step. Progress saved on the phone in localStorage (keys `fg.firstVisit`, `fg.seen`).

## Open questions
- Where the code lives and how it's hosted (suggested: new GitHub repo + GitHub Pages). Waiting on Bryce.
- Game design: still open are the couple's names/personalities, town layout (one busier scene vs tap-through neighbours), and whether a visit has a natural end. Decided 2026-10-24: 2-6h timers, real items + one magical resource, gentle fixable setbacks, light quest line, world keeps growing gently while away. See the "Game design" section.

## What's built
- **Pinch fix (2026-10-24):** pinch now anchors the world point under the starting midpoint (no drift/jitter), zoom clamped min..4, Safari gesture/touchmove page-zoom blocked, camera starts zoomed ~2.4x min centred on the gnomes.
### Isometric scene v1 (2026-10-24): `iso/index.html` + `iso/sprites/`, published privately at https://claude.ai/artifact/9ne3w3pgRjb5kFA1t1NKVA
- Plain 2D canvas, no libraries, DPR-aware. The plot image is the world; props and gnomes are placed on a 0..1 x 0..1 grid mapped onto the plot's top face (`toWorld`), depth-sorted by gx+gy, drawn at half the sheet scale (SPR=0.5).
- One-finger drag pans, pinch zooms about the pinch centre (pointer events), mouse wheel zooms on desktop. Zoom is clamped so the plot always fits at minimum.
- Gnome couple wander between named spots (door, fire, bench, bed, barrel, tub, sprout, barrow, lantern, fence), facing chosen from screen-space motion (front within 40 degrees of down, back within 40 of up, otherwise side, mirrored for left). Tap one: it stops, faces you and says a line (placeholder names Ferdinand and Rosalind still unconfirmed).
- Real clock: daylight 8-17, blends 5-8 and 17-20, night otherwise; night = multiply tint + campfire flicker, lantern and door glows (lighter); dawn/dusk warm overlay. Campfire smoke and sparks, fireflies at night, drifting motes by day. Test with `#day #night #dawn #dusk` (hash change reloads).
- Checked at 375x812 in the desktop app's browser: day, dusk, night, zoom. Not yet checked on the real iPhone.
### Painted diorama v1 (2026-10-24): `diorama/index.html` + `diorama/sprites/`, published privately at https://claude.ai/artifact/LbDX1X53S983AoByqxiCGg
- three.js r147 (jsDelivr import map) + OrbitControls. One-finger orbit limited to about ±35° (a third of the way round), small tilt range, pinch zoom 3.5–19 units, no pan.
- Backdrop painting wrapped on a curved wall (arc radius 13.5 around the hollow); only the top 70% of the painting is the wall, its mid-ground meets a flat mossy floor tiled from the painting's own ground, with a soft shade ring hiding the seam and grass/fern/mushroom cut-outs along it.
- Oak home (7.2 units tall, trunk top faded into mist) at left; props as cut-out planes at different depths (ferns near the camera for parallax, toadstools, brown caps, firewood, stone, acorns, grass, bucket; veg patch laid flat). Blob shadows under everything.
- Gnome couple (working names Ferdinand and Rosalind, NOT confirmed by Bryce): yaw-billboard sprites that walk between spots at different depths (frames swap, mirrored for left), he digs the veg patch / sits on the stone / waves, she waters / gathers mushrooms with the basket / waves; at night they drift home to the door. Tap one: it waves and says a line in a speech bubble.
- Visitors every 25–65 s, picked by time of day: hedgehog (dusk, crosses at the back), robin (day, flies in and perches on the stone), ladybird (day, on the big fern), field mouse (any), tawny owl (night, perches by the oak), wood spirit (night, floats with a glow). Tap one to add it to the Field Journal (localStorage `fg.seen`).
- Real clock: smooth dawn/dusk tint, deep blue night, lantern + window glow, warm light pool on the ground, fireflies at night. Southern-hemisphere season in the subtitle (winter/autumn tint nudges). Test tokens: `#day #night #dawn #dusk`, `#vis=robin` (any visitor key) forces a visitor.
- Previews: `diorama/preview-day.jpg`, `preview-night.jpg`, `preview-orbit.jpg`.
- Known polish to do: floor tile is softer/flatter than the painting; the gnome sheets only give one or two walk frames so the walk is a simple two-step; the painted backdrop's own big trunks are on the wall, not separate parallax layers.

### Old code-drawn prototype
`prototype/index.html`, published privately at https://claude.ai/artifact/6V1KMnUAnFwMV76NGiA9Cn (v4, code-drawn gnome-book restyle; the earlier clay version is retired)
- Gnome-scale woodland floor that fades into hazy distant trunks: the great oak (Bramble's arched plank door between big roots, round window, hanging lantern, bracket fungus), Pip's hollow fallen log with round door and chimney smoke, Old Tumble on a mossy stone smoking his pipe.
- Big swaying ferns, instanced grass tufts, fallen leaves, acorns, pebbles, fly-agaric toadstools at real gnome scale, small woodland flowers (+3 per day visited, max 40), light shafts by day.
- Painterly look: watercolour-wash canvas textures, muted earthy palette, paper-grain overlay and vignette, IM Fell English + Crimson Pro type.
- Gnomes with longer proportions, white beards, red caps, clogs; they walk, wave and speak when tapped; lanterns at night.
- Creatures: ladybirds, snail (day), hedgehog (not midday), bumblebees (spring/summer days), fireflies (night), tawny owl on an oak root (night).
- Field Journal (9 entries) with rendered portraits and silhouettes for unseen ones.
- Real clock lighting and southern-hemisphere seasons. Test tokens: `#spring #summer #autumn #winter #dawn #day #dusk #night`.

## What's next
0. NEXT (2026-10-24): Bryce plays gameplay v2 on the iPhone and runs `ART-BATCH-1.md` in Gemini. Then: cut/pack the batch (Sonnet), wire tiles + young walk sheets in, tune timers and content from Bryce's notes. After that: gnome action sheets (dig, water, carry, sit), painted icons for resources, painted visitors, more tasks/crops, the staff mystery hook once Bryce writes it.
0b. Plan a modular world: reusable painted ground tiles (dirt, moss, grass, stream, path) that join into a large map, with props/buildings anchored to them, spreading as the gnomes regrow the land. (The v2 tile map and the batch-1 tiles are the first step.)
0c. Side mystery (Bryce, 2026-10-24): alongside the FarmVille-ish main game, a mystery develops about a magic staff the gnome finds. Placeholder only; Bryce will write the story himself. Data hook is in place (see Gameplay v2).
1. ~~First gameplay loop~~ DONE 2026-10-24 (v2). ~~Cut sprites, build the painted diorama~~ DONE 2026-10-24 (v1, see What's built). Bryce's verdict: likes the general effect and the art style is right, but it's "a bit wonky", the gnomes look like cut-outs, are jumpy and walk weirdly (only 1-2 walk frames; flat planes in an orbiting camera).
2. DECIDED 2026-10-24: isometric painted world, Nano Banana art only, no 3D-model services. Build order: (a) art: isometric ground/land stages, barren start, homestead stage 1 pieces, gnome 4-direction walk + action sheets (ask for 8-frame strips per direction; check consistency, regenerate as needed); (b) isometric scene engine (2D canvas or three.js orthographic, painted sprites, depth-sorted, pinch-zoom + drag, day/night tint); (c) first gameplay loop from the Game design section.
3. Art assembly line (Bryce's idea): keep a queue of art requests in PLAN.md/`art/queue.md`; when Gemini credits run out, schedule a recurring Remote Control run to work through it slowly.
3. Design the rest of the virtual-pet loop with Bryce (quiz cards): still-open questions in the Game design section.
- **To do (coordinator, 2026-10-24):** one cheap Grok Imagine side-by-side test of a gnome (same prompt and reference as the Nano Banana sheet) to compare quality and cost.
- **To do (Bryce asked, 2026-10-24):** try option 3, an AI "picture to 3D world" tool (Gaussian-splat style), on one painted scene to see if it can make a walkable 3D space that runs on iPhone.
- Gardening loop: plant seeds, water, plants grow over real days.
- Decorating: place and move toadstools, lanterns, gnome bits.
- More journal visitors over time (ideas: mouse, frog, rabbit, robin, moth, a travelling gnome who visits on some days).
- Set up the repo + GitHub Pages hosting, Home Screen icon, full-screen web-app settings.
- Test on Bryce's iPhone for smoothness (shadows are the main cost if it stutters).
