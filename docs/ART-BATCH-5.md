# Art batch 5 — visitors, nests and the feeding dish (written 2026-10-25)

Roadmap step 6 in `PLAN.md`. The game already works without these: six creatures (robin, field mouse, hedgehog, tawny owl, ladybird, wood spirit) use the old painted pictures from art set 1, and the rest show a stand-in icon in the garden and in the journal. Nests, burrows and the feeding dish are drawn by code. These six pictures replace the stand-ins. Wiring: put the finished pictures (named as below) in one folder and run `python3 tools/slot_in_art.py <folder>`; it keys the magenta, cuts each sheet into its four pieces (left to right), and writes `sprites/vis-<id>.webp`, `sprites/nest-<kind>.webp` and `sprites/feeding-dish.webp`. No code change. Same Mac workflow as batches 3 and 4 (Steps.txt + one text file per prompt in `~/Downloads/Gnome Art Day/`), set up when Bryce is ready to paint.

**Reference for every visitor sheet:** paste `docs/art/visitors.jpg` (the old hedgehog / robin / mouse / owl sheet) so the new animals match the six already in the game.

**Rules for the visitor sheets (the cutting tool depends on them):** four animals in ONE row, left to right in the order given, with clear magenta space between them; every animal seen from the side, **facing left**, standing on nothing (no ground, no leaf, no shadow). Paint each one big, filling its quarter of the picture: the game shrinks them (a wren ends up a quarter of a gnome's height, a possum half). Sizes on screen come from `h` on each visitor in `content.js`; nudge those if one looks wrong.

| # | File | Pieces, left to right |
|---|---|---|
| 1 | visitors-birds.jpg | superb fairy-wren, crimson rosella, kookaburra, tawny frogmouth |
| 2 | visitors-ground.jpg | echidna, blue-tongue lizard, bandicoot, brushtail possum |
| 3 | visitors-small.jpg | garden snail, green tree frog, glow-worm, native bee |
| 4 | visitors-flying.jpg | butterfly, dragonfly, bogong moth, will-o'-wisp |
| 5 | nests.jpg | bird's nest, burrow, leaf pile, stone hidey-hole |
| 6 | feeding-dish.jpg | the feeding dish (one piece) |

Not needed now: separate round journal portraits. The journal shows each creature's garden picture in a round frame; painted portraits (`portrait-<id>`) can come later if Bryce wants them.

---

1. `visitors-birds.jpg` (NEW chat; reference: visitors.jpg)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Paint in exactly the same style as the pasted animal sheet. Four Australian birds in one row, left to right, well apart, each seen from the side and FACING LEFT, standing, with no ground under them: a superb fairy-wren (the blue male with his cocked tail), a crimson rosella, a laughing kookaburra, a tawny frogmouth sitting upright. Natural colours, true to life, each bird large and filling its quarter of the picture. Flat solid magenta background.
```

2. `visitors-ground.jpg` (same chat)

```text
Same style, same layout: four Australian animals in one row, left to right, well apart, each seen from the side and FACING LEFT, with no ground under them: a short-beaked echidna, a blue-tongue lizard with its blue tongue just showing, a long-nosed bandicoot, a common brushtail possum on all fours with its bushy tail. Natural colours, true to life, each animal large and filling its quarter of the picture. Flat solid magenta background.
```

3. `visitors-small.jpg` (same chat)

```text
Same style, same layout: four small creatures in one row, left to right, well apart, each seen from the side and FACING LEFT, drawn large so each fills its quarter of the picture, with no ground under them: a garden snail with a brown spiral shell, a green tree frog sitting, a glow-worm (a small pale grub whose tail end is a soft blue-green, but do not paint a glow around it), a small round shiny native bee. Flat solid magenta background.
```

4. `visitors-flying.jpg` (same chat)

```text
Same style, same layout: four flying creatures in one row, left to right, well apart, each seen from the side and FACING LEFT, wings open, drawn large so each fills its quarter of the picture: a brown and orange butterfly, a blue-green dragonfly, a soft brown bogong moth, and a will-o'-wisp: a small round wisp of pale cream-green light with a faint wavy tail, like a tiny flame with no candle (paint the wisp itself, but no glow spreading onto the background). Flat solid magenta background.
```

5. `nests.jpg` (NEW chat; reference: visitors.jpg)

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Four small animal homes in one row, left to right, well apart, each seen from slightly above at a three-quarter angle, each sitting on a tiny patch of earth no wider than itself: a little round bird's nest woven from twigs, grass and moss with two pale blue eggs in it; a small dark burrow entrance in the earth with a heap of freshly dug soil beside it; a loose heap of fallen brown and orange leaves and sticks with a dark gap at the bottom where an animal could crawl in; three flat warm stones leaning together with a dark gap underneath for a lizard. No animals. Flat solid magenta background.
```

6. `feeding-dish.jpg` (same chat)

```text
Same style, same angle: one shallow round stone dish resting on top of a short sawn-off log, like a little bird table, sitting on a tiny patch of earth. The dish is empty (the food is added later). No animals. Flat solid magenta background.
```
