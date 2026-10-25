# Art batch 3 — the "after" pictures, the repainted plot and the button icons (written 2026-10-25)

> **2026-10-25: the prompts below are replaced by `docs/ART-DAY-PLAN.md`** (one ordered list of 74 pictures in 7 art days, with the new mix-and-match ground kit and small details added). Paint from that list. This file stays for its wiring notes, which still apply.

Roadmap step 2 in `PLAN.md`. Written from the "art to paint later" list the clear-the-land build left in `PLAN.md`, in the same format as `ART-BATCH-2.md`. Bryce runs it in Gemini (Nano Banana) from the Mac folder `~/Downloads/Gnome Art Day/`: `3 - Steps.txt` has these steps in plain words, `4 - Prompts to copy/` has one text file per prompt (open, Cmd+A, Cmd+C), and finished pictures go into `2 - Put finished pictures here/`. Batch 2's output moved to `0 - Batch 2 (done)/`.

**The idea of this batch:** every early job already changes the picture with a code-drawn stand-in (`BEFORE`, `AFTER`, `EXTRAS`, `drawGroundChanges` and `drawRutsFilled` in `index.html`). These pictures replace the stand-ins with real paint. Most prompts therefore say "repaint the pasted picture exactly, the ONLY change is..." with the current sprite pasted as the reference, so the new piece drops straight on top of the old one at the same size and angle. The references are the live sprites flattened onto magenta (`shelter.jpg`, `fence.jpg`, `sapling.jpg`, `barrel.jpg`, `lanternstump.jpg`, and `props-ref.jpg` = firewood + bench + barrel for scale), plus `plot-barren.jpg` from batch 1.

Every prompt below already contains the style paragraph, so each one is pasted whole. Glows (lantern, flame) are never painted; code adds them. 12 pictures.

| # | File | Replaces in the game |
|---|---|---|
| 1 | plot-ruts-filled.jpg | `drawRutsFilled` stand-in (home tile after "Fill the wheel ruts") |
| 2 | plot-cleared.jpg | `drawGroundChanges` raked patch (home tile after "Clear the ground") |
| 3 | shelter-mossroof.jpg | moss blobs over the canvas ("Moss for the shelter roof") |
| 4 | fence-fallen.jpg | the *before* of "Mend the fence"; the existing `fence.webp` becomes the mended run |
| 5 | oak-planted.jpg | `drawPlantedOak` ("Plant the sapling out") |
| 6 | barrel-full.jpg | water ellipse on the barrel ("Scrub the rain barrel") |
| 7 | lantern-lit.jpg | lit lantern stump ("Mend the old lantern"; glow stays in code) |
| 8 | washing-line.jpg | code-drawn line and clothes ("String up a washing line") |
| 9 | stick-pile.jpg | stick-and-stone heap ("Clear the ground") |
| 10 | yard-bits.jpg | doorstep stones, window box, loose bench stones (*before* bench), loose firewood (*before* woodpile) |
| 11 | stepping-stones.jpg | "Lay a stepping-stone path" (no stand-in yet) |
| 12 | icons-buttons.jpg | the emoji on the Pack / Jobs / Magic / Journal buttons |


## PART 1 - THE HOME PLOT, REPAINTED (steps 1 and 2, both in ONE chat)

1. `plot-ruts-filled.jpg` (NEW chat; reference: `plot-barren.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Repaint the pasted isometric diamond ground tile exactly: same angle, same size, same earth edge, same stumps, same rocks, same dead branches, same scattered rubbish and the same tiny green sprout in the middle, centred and filling the image width. The ONLY change: the deep muddy wheel ruts and tyre tracks are gone. Where they were, the ground has been packed flat and filled with small grey stones and short twigs pressed into the earth, so faint pale bands of packed stone and earth run where the ruts used to be. Everything else stays exactly as it is. The four edges must be straight and plain with nothing hanging over them. Flat solid magenta background.
```

2. `plot-cleared.jpg` (same chat; no new reference)

```text
Same tile again: same angle, size, earth edge, stumps and big rocks, with the ruts still filled with packed stones exactly as you just painted. Now the loose rubbish is gone too: no dead branches, no snapped sticks, no tangle of brambles, no litter. The middle of the tile is a swept patch of even bare earth with faint rake lines, ready for digging. The stumps, big rocks and the tiny green sprout stay. Nothing new is added, no plants, no grass. Edges straight and plain. Flat solid magenta background.
```


## PART 2 - THE SHELTER WITH ITS MOSS ROOF (step 3, its own chat)

3. `shelter-mossroof.jpg` (NEW chat; reference: `shelter.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Repaint the pasted gnome shelter exactly: the same hollow old tree stump with its roots, the same round wooden door with the round window above it, same size, same angle, same position in the picture, same line and paint style. The ONLY change: the patched canvas awning over the doorway is replaced by a thick snug roof of green moss and bark laid over a frame of bent sticks, the same shape and size as the canvas was, with moss hanging a little over its front edge. No people, no ground, no shadow on the background. Flat solid magenta background.
```


## PART 3 - BEFORE AND AFTER PIECES FOR THE YARD JOBS (steps 4 to 11)

4. `fence-fallen.jpg` (NEW chat; reference: `fence.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted woven-stick fence panel exactly in style, colours, scale and isometric angle. Paint the same kind of panel but FALLEN DOWN: one post snapped off near the ground, the woven panel lying tipped over on its side along the same direction as the pasted panel runs, a few loose sticks slipped out of the weave and lying beside it. Same length as the pasted panel. No ground, no shadow on the background, no people. Flat solid magenta background.
```

5. `oak-planted.jpg` (NEW chat; reference: `sapling.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted young oak seedling exactly in style, colours and line. Paint the same seedling now planted out in the ground, with no pot. It stands in a small low mound of fresh dark earth with a ring of small grey stones around it, and it is a little taller and fuller, about one and a half times the pasted height, with six or seven young oak leaves. Seen from the same slightly-above angle. No ground beyond the mound, no shadow on the background. Flat solid magenta background.
```

6. `barrel-full.jpg` (NEW chat; reference: `barrel.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Repaint the pasted wooden rain barrel exactly: same barrel, same size, same angle, same iron bands, same wooden ladle. The ONLY changes: it has been scrubbed clean so the wood is a little brighter, the lid is off and leaning against the side of the barrel, and the barrel is brim-full of clear water, seen from above as a pale blue-grey oval with soft ripples and a small cream highlight where the light catches it. The ladle rests across the rim. No ground, no shadow on the background. Flat solid magenta background.
```

7. `lantern-lit.jpg` (NEW chat; reference: `lanternstump.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Repaint the pasted tree stump with its crooked lantern pole exactly: same stump, same pole, same hanging lantern, same size, same angle, same position. The ONLY change: the lantern is mended and lit. Its glass panes are clean and straight, and inside is a small steady warm yellow flame with a soft orange centre. Paint the flame as a solid painted shape with an ink outline. Do NOT paint any glow, halo or light spilling onto the background or onto the stump; the background stays flat solid magenta right up to the lantern. No ground, no shadow on the background. Flat solid magenta background.
```

8. `washing-line.jpg` (NEW chat; reference: `props-ref.jpg`)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, line, colours and isometric angle of the three pasted props. Paint a gnome washing line as one prop: two rough wooden poles, each about one and a half times the height of the pasted barrel, standing about four barrel-widths apart along the same direction as the pasted firewood stack, with a sagging cord between them. Pegged on the line and lifting gently in a breeze: a dusty blue-grey tunic, a warm brown dress, a cream apron and one very small pair of grey socks. Nothing touches the ground except the bottoms of the poles. No ground, no shadow on the background. Flat solid magenta background.
```

9. `stick-pile.jpg` (same chat; no new reference)

```text
Same style, scale and angle as before. A tidy pile of gathered dead branches and snapped sticks, stacked loosely in a low heap about the size of the pasted firewood stack, with three or four grey stones set beside it. Dry, grey-brown, no leaves. Seen from the same slightly-above angle. No ground, no shadow on the background. Flat solid magenta background.
```

10. `yard-bits.jpg` (same chat; no new reference)

```text
Same style, scale and angle as before. A sheet of 4 separate small yard pieces laid out in one row with wide clear gaps between them, all seen from the same slightly-above angle. From left to right: (1) a doorstep made of three flat grey stones laid side by side in a short row, each stone about half the width of the pasted barrel; (2) a small wooden window box, a plain rough plank box about as wide as the barrel, full of soft earth with seven small flowers in pale pink, pale yellow, white and lilac with green leaves; (3) four flat grey stones lying loose and scattered, not stacked; (4) six short logs and sticks lying loose and scattered across each other, not stacked. No ground, no shadow on the background, no text. Flat solid magenta background.
```

11. `stepping-stones.jpg` (same chat; no new reference)

```text
Same style, scale and angle as before. A gently curving line of seven flat grey stepping stones set into a narrow strip of bare earth that runs from the lower left to the upper right at the same isometric angle as the pasted props, each stone about half the width of the pasted barrel, with a few tufts of short dry grass between the stones. The strip of earth has soft faded edges so it can blend into the ground. No shadow on the background, no text. Flat solid magenta background.
```


## PART 4 - THE FOUR BUTTON ICONS (step 12, its own chat, no picture)

12. `icons-buttons.jpg` (NEW chat; no reference)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. A sheet of 4 chunky game button icons in one row with wide clear gaps between them, each the same size and roughly round in outline, bold and simple enough to read when very small, drawn with a slightly thicker ink outline than usual and painted in the same muted watercolour colours. From left to right: (1) a round wicker basket with a handle, seen from a little above, holding an acorn and a tuft of moss; (2) a small wooden mallet crossed over a wooden-handled garden trowel; (3) a single green oak leaf with three small four-pointed sparkle stars around it, the stars painted solid pale yellow with ink outlines and no glow; (4) a closed brown leather journal with a cream page edge and a small pressed flower on its cover. No ground, no shadow, no text, no labels. Flat solid magenta background.
```

## Checks before dropping a file in the inbox
- Full-size download, solid magenta, no text, no shadows on the background, no glow spilling onto the magenta.
- "Repaint exactly" pieces really are the same object at the same size, angle and position, with only the one change. If Gemini redesigns it, ask once to keep it exactly like the pasted picture; if it fails twice, skip and tell Claude.
- Plot tiles: same diamond angle and slab thickness as `plot-barren.jpg`, nothing crossing the edges.
- Sheets: four separate items in one row with clear gaps.

## After the pictures are done (Claude's job, Sonnet)
Cut with `tools/cut_cc.py` (sheets) or a plain magenta key (single pieces), convert to webp at the sprite's current size, then wire in: the two plot tiles swap in by `taskProg('ruts')` / `taskProg('clear')` on the home tile; `shelter-mossroof`, `oak-planted`, `barrel-full` and `lantern-lit` swap for their props once the job is done (`fence-fallen` is the *before* and the existing fence the *after*); `stick-pile`, `washing-line`, the doorstep and the window box replace the code-drawn `EXTRAS` and `AFTER` bits; the loose stones and loose firewood replace `BEFORE`; `stepping-stones` becomes the art for the path job; the four icons replace the button emoji (also drop the old `BEFORE`/`AFTER` drawing code as each piece lands).
Not painted this batch (still code or later batches): the ruts-filling animation while the job runs, the herb corner, compost, birdbath and the other later jobs, home stage 2.
