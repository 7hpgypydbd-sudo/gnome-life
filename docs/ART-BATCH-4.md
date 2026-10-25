# Art batch 4 — home stage 2 (the stump house) and the rooms (written 2026-10-25)

Roadmap step 5 in `PLAN.md`. The game already works with code-drawn stand-ins (`drawHouseStandIns` and `roomShelter` / `roomStump` in `index.html`); these five pictures replace them. Nothing else changes: run `python3 tools/slot_in_art.py <folder of finished pictures>` and the game picks them up (`ART_SLOTS`). Same workflow as batch 3 (Steps.txt + one text file per prompt in `~/Downloads/Gnome Art Day/`), written when Bryce is ready to paint.

**House pictures (1-3)** repaint the live `shelter.jpg` (the shelter flattened onto magenta) step by step in ONE chat, so each matches the one before at the same size and angle. Each is the WHOLE stump, and each keeps the stone doorstep and the window box from batch 3. Glows are never painted; code adds the window glow and the chimney smoke.

**Room pictures (4-5)** are square cut-away interiors with NO gnomes in them: the game draws Wendel and Hazel on top (sitting by the hearth in the evening, asleep in bed at night). So the painting must leave these places clear, in a 1000x1000 picture: the bed's mattress around x 560-940, y 760-880 (lower right; the sleepers bring their own blankets, so paint an empty bed with just a pillow); the floor in front of the hearth around x 380-700, y 700-950 (lower middle) for the evening sit; the hearth or light source at the left (stage 2: fire around x 225, y 760; stage 1: a candle on a crate around x 470, y 690). If a painting puts them elsewhere, move the spots in `ROOMS` in `index.html`.

| # | File | Replaces in the game |
|---|---|---|
| 1 | house-hollowed.jpg | wood shavings + carved hole ("Hollow out the old stump") |
| 2 | house-windows.jpg | plank wall and two round windows ("Fit a plank wall and windows") |
| 3 | house-finished.jpg | bark-shingle roof and stone chimney ("Raise the roof and chimney"): home stage 2 |
| 4 | room-shelter.jpg | the room under the old root (stage 1) |
| 5 | room-stump.jpg | the room inside the stump house (stage 2) |


## PART 1 - THE STUMP BECOMES A HOUSE (steps 1 to 3, all in ONE chat)

1. `house-hollowed.jpg` (NEW chat; reference: `shelter.jpg`, ideally the batch 3 `shelter-mossroof.jpg` if it exists)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Repaint the pasted gnome home exactly: the same hollow old tree stump with its roots, the same round wooden door with its round window and window box, the same flat stone doorstep, the same roof over the doorway, same size, same angle, same position in the picture. The ONLY changes: the gnomes have started hollowing out the stump to live in. A small round hole has been freshly carved high up in the trunk on the right, showing pale new wood around its edge, and a heap of curly pale wood shavings lies at the foot of the stump to the right of the doorstep. Everything else stays exactly as it is. No people. Flat solid magenta background.
```

2. `house-windows.jpg` (same chat)

```text
Same stump again, same size, angle and position, with the shavings swept away. Now the dark gap to the right of the round door is closed with a wall of upright wooden planks fitted snugly between the roots, with a small round window in it. The carved hole high in the trunk is now a second round window with a wooden frame and four small panes. Both windows have plain glass; do not paint any light or glow in them. Everything else stays exactly as it is. Flat solid magenta background.
```

3. `house-finished.jpg` (same chat)

```text
Same stump house again, same size, angle and position. Now the roof over the doorway is a proper snug roof of overlapping bark shingles with patches of moss, reaching back into the stump, and a short stone chimney rises from the top of the stump on the right. It now looks like a real cosy gnome house inside an old tree stump, but no bigger than before. No smoke (it is added later), no light in the windows, no people. Flat solid magenta background.
```


## PART 2 - INSIDE THE HOME (steps 4 and 5, each its own chat, no reference needed)

4. `room-shelter.jpg` (NEW chat)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. A square picture: a cut-away view, seen from straight in front, into a small low earthy hollow under the roots of an old tree stump where two tiny gnomes have just moved in. Packed earth walls with roots hanging from the ceiling. On the left, the round way out, with a patched canvas flap tied back and a glimpse of sky. In the middle, an upturned wooden crate used as a table with one candle stuck on it. In the lower right, an empty bed made of dry leaves and moss with one small pillow, wide enough for two. A plank shelf on the back wall with a few jars. A small round mat of moss on the floor. Simple, a bit makeshift, but cared for. Soft daylight. No people, no animals, no text, no frame.
```

5. `room-stump.jpg` (NEW chat)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. A square picture: a cut-away view, seen from straight in front, into a snug round room carved inside an old tree stump, the walls showing the curved tree rings of the wood. On the left, a stone hearth with a small fire and a stone chimney going up. In the lower right, a gnome-sized wooden bed with an empty patchwork quilt folded back and one pillow, wide enough for two. A round window high on the right wall. A round woven rug in the middle of a plank floor, in front of the fire, with an empty space on it. A plank shelf with jars and a teapot, a little wooden stool. Warm, cosy, lived-in. Soft daylight from the window. No people, no animals, no text, no frame.
```
