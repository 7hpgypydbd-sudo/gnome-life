# How the graphics should work from here (decided 2026-10-25)

Bryce asked for a proper look at how the game's pictures should work, because the big painted background tiles are not working, and night is too dark. This is the assessment, in plain words, and one clear recommendation.

## What is wrong today

- **The ground is 17 huge paintings** (each a diamond 1225 pixels wide, about 6.6 MB of pictures in total) laid side by side. Where two meet, the grass, paths and stream do not line up. Stumps, rocks, fences and ruts are painted into the ground, so a job cannot really remove them, and every new "state" of the ground means painting another whole tile.
- **Night is one dark wash over everything**, and lights are blurry yellow blobs added on top. The blobs do not actually light the ground or the walls, so the picture reads as "dark with some glow spots", not "a garden at night with lamps".
- Everything else (the gnomes, props, creatures, icons) is cut-out pictures on a see-through background. **Those are fine and stay exactly as they are.**

## The recommendation, in one sentence

Build the ground from small painted pieces that the game blends and scatters, light the night with a proper light layer and painted lamps, and keep using Gemini for all of it. No new paid service is needed yet.

### 1. The ground becomes small pieces

- **Plain ground swatches.** About 8 small square patches of plain ground, each a flat seamless texture (barren dirt, dry grass, green grass, meadow, moss, path dirt, creek pebbles, water). The game blends neighbouring swatches with soft, wobbly masks, so healing spreads outwards like watercolour instead of one whole tile swapping. There are no joins to match, ever.
- **The first swatches cost nothing.** The 17 painted tiles we already have contain plenty of plain grass and dirt. I can crop those out and make them repeat seamlessly with a small tool. They are already in the right style and already drawn from the game's viewpoint, so they will match what Bryce has approved.
- **Paths and the stream are stencils.** The game only decides the shape of the curve; every pixel you see is still painted (the water swatch inside, painted pebble and reed stickers along the bank, a painted sparkle). This permanently fixes the "stream and paths don't meet" problem. If a test still looks computer-drawn, the fallback is a small set of painted bend pieces, as noted in the plan.
- **Sticker sheets.** One sheet per kind of ground with about 12 tiny pieces (grass tufts, pebbles, clover, cracks, twigs, fallen leaves, little flowers). The game scatters them with a little randomness, and puts a ring of them around the base of every object so things sit IN the ground instead of on it.
- **Everything you can touch is an object.** Stumps, rocks, fence runs and ruts come out of the ground paintings and become separate pieces. Clearing a stump removes the actual stump. Most of these can be cut out of the tiles we already have.
- **Phone speed.** The blended ground is built once into an off-screen picture and reused, so the phone draws less per frame than now, and the pictures to download drop from about 6.6 MB to well under 1 MB.

### 2. Night gets a real light layer

- **Already done today in a quick pass:** the night tint is now a lighter moonlit blue, and two jobs add light ("Hang glow-worm lanterns", "Set glow-worm street lamps"), with their two paintings in `docs/ART-BATCH-8.md`. That is the right direction, so this plan builds on it rather than replacing it.
- The next step is the light layer. Darkness becomes its own layer. Each light cuts a soft warm hole in it, so the ground and walls near a lamp are genuinely brighter, the way a lantern lights a garden. Far from lights the night stays a soft blue moonlight, never near-black: there is a floor on how dark it can get.
- **Painted lamps become things in the world**, which is what Bryce asked for: glow-worm jars hung on sticks, toadstool lamps, a string of fireflies between two posts, the mended lantern, firelight from the camp. Wendel and Hazel can make and place them (this folds into the decorating set), so lighting the garden is something you do, not a setting.
- Each lamp needs just one small painting (lit) plus a soft glow sprite drawn by code. The two batch 8 paintings cover the lanterns and lamps; a toadstool lamp and a firefly string would be two more small prompts later.

### 3. Tools, checked honestly

The hard rule is that Bryce must own everything, because the game may be sold one day.

| Tool | What it is good for here | Ownership (checked 2026-10-25) | Verdict |
|---|---|---|---|
| **Gemini (Nano Banana)**, which Bryce has | Everything we do now; small flat swatches are the easiest thing for it | Google's terms say it does not claim ownership of generated content and that commercial use is allowed. Images carry an invisible SynthID mark (harmless) and sometimes a small visible sparkle in a corner, which cutting out removes | **Keep. Main tool.** |
| **Grok Imagine** (xAI) | Same kind of picture-making. It has a "Character Sprite" and a "Props & UI Kit" template, background removal, and can take up to 5 reference pictures at once. There is no real "sprite maker" that turns our art into sheets; the templates are prompts in disguise | Consumer terms say "You own the Outputs"; xAI keeps a licence to reuse what you make (including for training), which does not stop Bryce selling the game | Fine as a second opinion for a stubborn picture. Not needed. |
| **Scenario** (about US$15/month; commercial use needs a paid plan) | The one real edge: you can train a private style model on our approved pictures, so every new piece comes out matching without re-describing the style each time. Also has texture presets | Most of its models give you ownership of outputs, but it varies by model and must be checked per model | Worth a trial **only if** matching the style becomes a fight. Not now. |
| **PixelLab, Retro Diffusion, SpriteLab, SpriteCook** | Pixel-art sprite sheets and auto-tiles | Commercial use allowed | Wrong style (blocky pixels). Skip. |
| **Ludo, Layer.ai, Leonardo** | General picture makers with a sprite-sheet button | Varies | No edge over Gemini. Skip. |

**Converting our existing art:** no service is needed. Cropping plain ground out of the tiles and cutting stumps and rocks into separate pieces is a small tool in the repo, the same kind that already cuts the gnome sheets. That gets the ground test done with zero new paintings.

### 4. What this means for the 55 written prompts

- **Unchanged: 52 of 55.** Batches 4, 5, 6, 7 and 8 (home stages, rooms, creatures, nests, neighbours, buildings, festival, story paintings) are cut-out objects and paintings. They work exactly the same under the new ground. Bryce can paint them any time.
- **Hold 3 from batch 3:** "plot-ruts-filled", "plot-cleared" and "stepping-stones" are whole-plot ground pictures. Under the new approach they become a swatch, a few stickers and three stone objects instead. Everything else in batch 3 (moss roof, fallen fence, planted oak, full barrel, lit lantern, washing line, stick pile, yard bits, icons) is fine.
- **Written 2026-10-25 as days 1-3 of `docs/ART-DAY-PLAN.md`** (bigger than first planned, because Bryce asked for a mix-and-match collection with little details and Easter eggs: 9 swatches, 8 sticker sheets, stumps and rocks before/after, leftovers, two sheets of hidden surprises). Original plan: **New small batch, "Ground 1", about 9 prompts, written after the test:** 4 to 6 flat swatches that the crops do not cover (water, meadow flowers, moss, pebbles), 2 sticker sheets. The "repainted stream and path bends" idea is dropped.

## Order of work

1. **A before/after test** on the home tile and its neighbours: harvested swatches, blended edges, the stream as a stencil, and the new night with three lamps. One thread, Opus at medium effort, no new paintings. Bryce looks at two pictures and says yes or no. **Built 2026-10-25 behind `#newground`; details in docs/PLAN.md, pictures in `/mnt/project-files/graphics-test/`.**
2. If yes: write the Ground 1 prompts, Bryce paints them, then convert the rest of the map, turn painted-in stumps and rocks into objects, and retire the big tiles.
3. Lamps become craftable and placeable as part of the decorating set.
