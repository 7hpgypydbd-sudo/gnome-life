# Art batch 1 — ground tiles + the young couple's walk sheets (written 2026-10-24)

How to run it: one numbered prompt per Gemini (Nano Banana) image. Start a **fresh Gemini chat** where it says so. Paste the named reference image FIRST (drag the file in, or copy it to the clipboard and cmd+v), then paste the prompt. Download the full-size image (1376 wide, not the 1024 preview) and drop it into `~/Downloads/fairy-garden/inbox/` named as shown. Claude cuts, cleans and packs from there; a cheaper model (Sonnet) is fine for that step.

Style block (already inside every prompt below, so just paste the whole prompt):
> Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.

## Part A — ground tiles (all in ONE fresh chat; paste `iso1/plot-barren.jpg` as the reference for prompt 1, and the tiles stay in that chat so the angle matches)

Each tile must have plain straight edges so it can join the others. Output 1376x768 landscape. Save as the name given.

1. `tile-barren-plain.jpg` (reference: `iso1/plot-barren.jpg`)
   > [style block] An isometric 2:1 diamond ground tile exactly matching the pasted tile's angle, size and earth edge, centred and filling the image width. Surface: bare logged ground, packed pale earth with faint wheel ruts, a few small stones, dry grass stubble, one small cut stump near the middle, nothing else. Plain, quiet, repeatable. The four edges must be straight and plain with nothing hanging over them. Flat solid magenta background.

2. `tile-barren-stumps.jpg` (same chat, no new reference)
   > Same tile, same angle, size and earth edge as the one you just made. Variation: two larger cut stumps, a tangle of dead brambles in one corner, a dry mud puddle. Edges straight and plain so it joins the first tile. Flat solid magenta background.

3. `tile-green.jpg` (same chat)
   > Same tile, same angle, size and earth edge. Surface: the same bare earth but with the first green coming back: patches of fresh moss, thin new grass, clover, a few tiny white flowers, one small stone. Still mostly earth. Edges straight and plain. Flat solid magenta background.

4. `tile-meadow.jpg` (same chat)
   > Same tile, same angle, size and earth edge. Surface: young meadow fully covered in soft grass, clover, daisies and buttercups, one mossy stone, a tuft of taller grass. Edges straight and plain. Flat solid magenta background.

5. `tile-woodland.jpg` (same chat)
   > Same tile, same angle, size and earth edge. Surface: young woodland floor: moss, ferns no taller than a quarter of the tile height, fallen leaves, a few small brown mushrooms, one young sapling about a third of the tile height standing near the centre. Nothing may hang over the edges. Flat solid magenta background.

6. `tile-stream.jpg` (same chat; this is the first joining tile)
   > Same tile, same angle, size and earth edge, meadow surface as before, but with a narrow clear stream running straight across from the exact middle of the top-left edge to the exact middle of the bottom-right edge, with mossy stones along its banks. The stream must meet both edges at their exact midpoints so tiles can join. Flat solid magenta background.

7. `tile-path.jpg` (same chat)
   > Same tile, same angle, size and earth edge, meadow surface, with a worn earth footpath about a quarter of the tile wide running from the exact middle of the top-right edge to the exact middle of the bottom-left edge. The path must meet both edges at their exact midpoints. Flat solid magenta background.

If a tile comes back with a different angle or slab thickness, reply once: "Match the first tile's diamond exactly: same angle, same size, same earth edge thickness, straight edges." If it is still off, stop and tell Claude rather than re-rolling.

## Part B — his walk sheets (ONE fresh chat per character; paste a crop of `iso1/ref-him-young-v1.jpg` as the reference: the side-profile figure for 8, the front figure for 9, the back figure for 10. Cropping one figure a few hundred pixels tall works best.)

Output 1376x768 landscape. Gemini will give 2 rows of 6; that is fine.

8. `walk-him-young-side.jpg` (reference: side-profile crop of `ref-him-young-v1.jpg`)
   > [style block] Match the pasted character exactly: same face, short chestnut beard, red pointed cap, dusty blue-grey tunic, brown belt, brown trousers, pale tan boots, same line and paint style. A walk cycle of this young gnome man seen in clean side profile facing right. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

9. `walk-him-young-front.jpg` (NEW chat; reference: front-view crop of `ref-him-young-v1.jpg`)
   > [style block] Match the pasted character exactly: same face, short chestnut beard, red pointed cap, dusty blue-grey tunic, brown belt, brown trousers, pale tan boots, same line and paint style. A walk cycle of this young gnome man seen from the front, walking toward the viewer. Both rows must be the front view. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

10. `walk-him-young-back.jpg` (NEW chat; reference: back-view crop of `ref-him-young-v1.jpg`)
   > [style block] Match the pasted character exactly: red pointed cap, dusty blue-grey tunic, brown belt, brown trousers, pale tan boots, chestnut hair, same line and paint style. A walk cycle of this young gnome man seen from directly behind, walking away from the viewer. Both rows must be the back view. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

## Part C — her walk sheets (same pattern; crops of `iso1/ref-her-young-v1.jpg`)

11. `walk-her-young-side.jpg` (NEW chat; reference: side-profile crop of `ref-her-young-v1.jpg`)
   > [style block] Match the pasted character exactly: same face, chestnut hair in two long plaits, olive green pointed cap and bodice, warm brown long-sleeved dress, cream apron tied at the back, grey-green clogs, same line and paint style. A walk cycle of this young gnome woman seen in clean side profile facing right. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

12. `walk-her-young-front.jpg` (NEW chat; reference: front-view crop)
   > [style block] Match the pasted character exactly: same face, chestnut plaits, olive green pointed cap and bodice, warm brown dress, cream apron, grey-green clogs, same line and paint style. A walk cycle of this young gnome woman seen from the front, walking toward the viewer. Both rows must be the front view. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

13. `walk-her-young-back.jpg` (NEW chat; reference: back-view crop)
   > [style block] Match the pasted character exactly: chestnut plaits down the back, olive green pointed cap and bodice, warm brown dress, cream apron bow at the back, grey-green clogs, same line and paint style. A walk cycle of this young gnome woman seen from directly behind, walking away from the viewer. Both rows must be the back view. 8 frames in 2 rows of 4, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Flat solid magenta background.

## Checks before dropping a file in the inbox
- Full-size download (1376 wide), solid magenta, no text or shadows.
- Walk sheets: both rows are the same view (a row sometimes reverts to profile; if so, ask once for "both rows in the [front/back] view").
- Tiles: same diamond angle and slab thickness as `plot-barren.jpg`; nothing crossing the edges.
