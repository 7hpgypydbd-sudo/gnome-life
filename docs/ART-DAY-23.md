# Art day 23: round thirteen art

Branch `art-day-23` (from main 7420959, v104). New art lives in `art-day-23/cut/`; nothing in `sprites/` was changed.

## The wheelbarrow push (Wendel and Hazel)

Bryce: the pushed barrow must be the same barrow the gnomes build (`sprites/wheelbarrow.webp`). So each frame was painted
with Gemini, then the painted barrow was swapped for the real `wheelbarrow.webp` (same size and angle), with the gnome's
hands laid back on top. The empty strips use the barrow pixel for pixel; the loaded strips use `wheelbarrow-loaded.webp`,
which is `wheelbarrow.webp` with junk (rusty tins, a coil of wire, a broken crate, two old nails, and a snail) painted into the tray.
The barrow body, wheel, legs and handles are unchanged.

| File | What | Frames |
|---|---|---|
| `him-barrowwalk.webp` | Wendel pushing the loaded barrow | 8, cell 211x260 |
| `him-barrowwalk-empty.webp` | Wendel pushing the empty barrow | 8, cell 211x260 |
| `her-barrowwalk.webp` | Hazel pushing the loaded barrow | 8, cell 232x260 |
| `her-barrowwalk-empty.webp` | Hazel pushing the empty barrow | 8, cell 232x260 |
| `wheelbarrow-loaded.webp` | the parked barrow, loaded with junk (261x204, same canvas as wheelbarrow.webp) | - |

- Facing right, walking towards the lower right (the barrow keeps its three-quarter angle, wheel front right). Mirror for left.
  The barrow is iso, so there are no front/back push views: use the side strip for every direction (like `potwalk`/`canwalk`).
- Scale: the gnome is 242 px tall in the cell, the same as the walk sheets, so draw a cell with the walk sheets' scale.
  The barrow in the strip is ~163 px wide, about 5% smaller than the parked prop (prop s 0.6 = ~171 px at gnome scale).
- The barrow sits still inside the cell (gnome bobs and steps); its left/top/width and each frame's feet point are in
  `him-barrowwalk.json` / `her-barrowwalk.json` (`feet_xy_per_frame`, bottom of the boots ~y 236-244; the wheel hangs a few px lower).
  Anchor the gnome by its feet, i.e. feet at the gnome's position, barrow ahead of it.
- Suggested speed ~9 fps (like `carry`/`canwalk`). `preview-*.gif` show the loops.
- Suggested GNOMES entries: `him.acts.barrowwalk = {n:8, cell:[211,260]}`, `barrowwalkempty` likewise; `her` with cell [232,260].

## The brimming pond

`garden-pond-new.webp` (1000x446, the same canvas and footprint as `garden-hollow-rain.webp`): the hollow full of still
rainwater, damp mud rim, a floating leaf, first tufts of grass, NO reeds, no stone ring, a snail on the front rim.
It sits between `garden-hollow-rain` and `garden-pond-large` (1000x499: draw it with the same bottom/centre as those two to cross-fade).

## Raw paintings and tools

`art-day-23/raw/` (Gemini originals) and `art-day-23/tools/` (key, frame cut, barrow match and swap: `compose.py him raw/him-push-1.jpg`, Hazel used a -36,-10 nudge so the back handle meets her hand).
