# Art batch 7 — the festival and the seasonal visitors (written 2026-10-25)

The game already works without any of these. The festival green's table, feast, bunting, lanterns and flower arch are code-drawn stand-ins; the festival story pages show a little picture of Wendel and Hazel (or the oldest neighbour) instead of a painting; the four seasonal visitors are emoji. These pictures replace them. Wiring: put the finished pictures (named as below) in one folder and run `python3 tools/slot_in_art.py <folder>`; it keys the magenta, cuts each sheet into its pieces (left to right) and writes the `sprites/` files. No code change. Same Mac workflow as before (Steps.txt + one text file per prompt in `~/Downloads/Gnome Art Day/`), set up when Bryce is ready to paint.

**Best painted after batch 6**, so the neighbours in the story pictures can be copied from their approved sheets.

**Rules for the sheets (the cutting tool depends on them):** pieces in ONE row, left to right in the order given, with clear magenta space between them; nothing touching the edges; no ground, shadow or text. Furniture at the same three-quarter, slightly-from-above angle as the shelter, with the long table and the bunting running diagonally from the upper left down to the lower right, like the edge of a ground tile.

| # | File | Pieces, left to right | Replaces |
|---|---|---|---|
| 1 | festival-table.jpg | the long table and two benches, bare with a white cloth; the SAME table laid with the feast | `fest-table`, `fest-feast` |
| 2 | festival-green.jpg | bunting on two poles; the flower arch; one paper lantern on a hooked pole | `fest-bunting`, `fest-arch`, `fest-lantern` |
| 3 | visitors-seasonal.jpg | silvereye, sacred kingfisher, Christmas beetle, yellow-tailed black cockatoo (all facing LEFT) | `vis-silvereye`, `vis-kingfisher`, `vis-beetle`, `vis-cockatoo` |
| 4-9 | story-fest-idea.jpg ... story-fest-end.jpg | six landscape story paintings, no magenta | the festival pages |

Sizes on screen come from `ART_SLOTS` in `index.html` (table 300 wide, bunting 300, arch 120, lantern 44; visitors by `h` in `content.js`). Nudge those if one looks wrong. The game draws the lantern four times round the green and adds the night glow itself, so paint the lantern unlit.

**Not in this batch (later, optional):** a dancing strip for Wendel and for Hazel (4 frames each, like the batch 2 action sheets). Until then they walk slowly round each other on festival night. Wiring those needs a small code change (a `dance` act in `sprites/gnomes.json`), so leave them until the couple's middle-aged sheets are painted.

---

**Style paragraph** (start of every NEW chat):

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.
```

1. `festival-table.jpg` (NEW chat; reference: `sprites/stonebench.webp` and `sprites/shelter.webp` for scale and angle)

```text
[Style paragraph.] Two pieces of gnome-sized outdoor furniture, in one row, well apart, seen from the same three-quarter, slightly-from-above angle as the pasted pictures. Each is a long, rough wooden trestle table with a plain bench on each side, the whole thing running diagonally from upper left to lower right, long enough for twelve gnomes, made of split planks with bark still on the edges. (1) The table bare, with a plain white cloth laid along it. (2) Exactly the same table and benches, now laid for a feast: round loaves, small honey pots, berry tarts, a big golden pie in the middle, a white iced cake with a red berry on top, wooden cups, little jugs of wildflowers. Flat solid magenta background.
```

2. `festival-green.jpg` (same chat)

```text
Same style and angle, same layout but three pieces: (1) a string of cloth bunting hung between two thin wooden poles, running diagonally from upper left to lower right, the string sagging gently, small triangular flags in faded red, mustard, blue, cream, green and plum; (2) an arch woven from bent willow, as tall as two gnomes, thick with leaves, sprays of golden wattle and white paper daisies; (3) one round paper lantern, unlit, hanging from a hooked wooden pole a little taller than a gnome. Flat solid magenta background.
```

3. `visitors-seasonal.jpg` (NEW chat; reference: `docs/art/visitors.jpg`, the old hedgehog / robin / mouse / owl sheet)

```text
[Style paragraph.] Four Australian creatures in exactly the same style as the pasted animals, in one row, left to right, well apart, each seen from the side and facing LEFT, standing on nothing, each painted big to fill its quarter of the picture: (1) a silvereye, a tiny olive-green bird with a grey back and a neat white ring round its eye; (2) a sacred kingfisher, turquoise-blue back and wings, cream-buff chest, a big dark beak; (3) a Christmas beetle, a round shiny gold-green beetle, wings closed; (4) a yellow-tailed black cockatoo, glossy black with yellow cheek patches and yellow panels in its tail. Flat solid magenta background.
```

4-9. Story pictures (NEW chat; reference: the approved neighbour sheets from batch 6 and the couple's walk frames). Landscape, a soft vignette, NO magenta. Start each with:

```text
Traditional children's book illustration like The Secret World of the Gnomes: fine brown ink outlines, soft watercolour washes, muted earthy colours, warm and gentle. Landscape picture with a soft cream vignette fading at the edges. Wendel (red hat, brown beard, blue tunic) and Hazel (green hat, auburn braids, green bodice and white apron) are exactly as in the pasted reference.
```

then one of:

- `story-fest-idea.jpg`: a bright morning outside a stump house; a row of village gnomes standing together looking pleased with themselves; Wendel throwing up his arms, delighted; Hazel already writing a list on a scrap of bark.
- `story-fest-secret.jpg`: the round baker gnome (or any older neighbour) leaning in and whispering behind her hand, finger to her lips, eyes twinkling, towards the viewer; in the soft background, Wendel and Hazel walking away arm in arm, not noticing.
- `story-fest-night.jpg`: dusk on a mown green; paper lanterns glowing on poles; bunting overhead; a long table crowded with food; village gnomes in their best clothes arriving; Wendel with a neatly combed beard, Hazel with a sprig of wattle behind her ear.
- `story-fest-surprise.jpg`: lantern light; Wendel and Hazel standing under a woven willow arch full of wattle and daisies, Hazel with both hands over her mouth, Wendel open-mouthed; a neighbour standing on a bench raising a cup; the whole village turned towards them, beaming.
- `story-fest-dance.jpg`: night; Wendel and Hazel dancing on the grass, holding each other close, clumsy and happy; neighbours clapping round the edge; small wisps of light drifting down from the dark; one low warm star above a stump house in the distance.
- `story-fest-end.jpg`: a wide, peaceful view of a little gnome village tucked into a green valley at golden evening: homes under roots and in stumps, a stream with a small bridge, a path, smoke from chimneys, lots of wild ferns and trees; very small in the middle, Wendel and Hazel sitting together on a bench, seen from behind.
