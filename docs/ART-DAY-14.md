# Art day 14: the next art batches (prepared 2026-10-26)

Three batches painted in one go, in order, no waiting for approval between them (Bryce, 2026-10-26). **44 pictures**: batch 1 = 18 (strip, props, world pieces, retries, fixes, feeding dish), batch 2 = 6 sheets holding the 33 little makes (docs/DECORATIONS.md), batch 3 = 16 story paintings (docs/STORY.md "Paintings and hidden snails").

Rules: see the art skill (nothing glows, paint lit things unlit, hidden snail in every painting, flat magenta #FF00FF for cut-outs, new Gemini chat per picture, character reference sheets pasted first). Prompts are also one .txt each in `art-day-14/prompts/` and on the Mac in `~/Downloads/Gnome Art Day/4 - Prompts to copy/Art day 14/`. Reference pictures: `art-day-14/refs/` (sprites on flat magenta). Painted pictures go in `art-day-14/painted/<id>.jpg` on branch `art-day-14-pictures`.

Output name for each picture is its id, e.g. `b1-02-yard-bench.jpg`.

## b1-01-him-dowse: Wendel dowsing strip

Paste first: `art-day-14/refs/sprites__him-side.jpg`; `art-day-14/refs/sprites__him-dig.jpg`

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome as the pasted pictures (top row is his walk sheet, bottom row is him digging): match his face, beard, red cap, blue-grey tunic, belt, trousers and boots exactly. A dowsing loop of 4 frames in one row, him walking slowly in side profile facing right, holding a forked hazel twig out in front of him at waist height, one fork in each fist, palms up, the long end pointing forward, his face intent and listening. Frame 1 twig level, frame 2 twig twitching up a little, frame 3 twig dipping sharply down towards the ground and his eyebrows raised in surprise, frame 4 twig level again. Same size and baseline as the pasted sheets, the same gnome in all four, full body, feet visible, evenly spaced with wide clear magenta gaps so nothing touches the next frame. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: pack like him-build: sprites/him-dowse.png, act dowse (4 frames), re-paste gnomes.json into index.html

## b1-02-yard-bench: Plank bench

Paste first: `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. One simple gnome bench, seen from the same gentle slanted view from above and to the front as the pasted picture: a single thick rough-sawn plank of pale weathered wood laid across two short stout legs made of split log slabs, the plank held on with two round wooden pegs at each end, the bark still on the edges of the legs. Long enough for two small gnomes to sit side by side. Hidden detail: a heart and the letters W + H carved small into the front edge of the plank, and a tiny snail on one leg. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py -> sprites/yard-bench.webp (slot yard-bench)

## b1-03-bench-couple: Wendel and Hazel on the bench

Paste first: `art-day-14/painted/yard-bench.jpg (the finished painting from step 2)`; `art-day-14/refs/sprites__him-sit.jpg`; `art-day-14/refs/sprites__her-sit.jpg`

Paint AFTER the bench. If the bench painting is not done yet, paste its Gemini download.

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same bench as the first pasted picture, seen from the same gentle slanted view from above and to the front, with the two gnomes from the other pasted pictures sitting on it side by side for a quiet evening: Wendel on the left in his red cap and blue-grey tunic, leaning back a little with his pipe, and Hazel on the right in her green cap, plaits and apron, knitting, her shoulder against his. Match their faces, clothes and size exactly to the pasted pictures, and the bench exactly to the first picture (the carved heart and W + H on the front edge still showing between their feet). Their feet dangle a little above the ground. Plain daylight colours, NOT lit by the fire: no orange glow, no warm light on their faces. Hidden detail: a tiny snail on the end of the bench beside Hazel. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/bench-couple.webp (slot like yard-bench)

## b1-04-wheelbarrow-small: Small wheelbarrow

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted picture's style, ink line, colours and scale exactly, same gentle slanted view from above and to the front. One small empty gnome wheelbarrow, noticeably smaller than the pasted one, about as high as a gnome's waist: a shallow box of pale new planks pegged together, one little spoked wooden wheel at the front, two short handles, a few flower petals and a smear of soil in the bottom as if it carries flowers. Slightly crooked, clearly home-made. Seen from the front-left so the whole box and the wheel show. Hidden detail: a tiny snail on one handle. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> slot make-barrow / wheelbarrow-small

## b1-05-toad-legs: Toadstool on root legs

Paste first: `art-day-14/refs/sprites__kit__wood-15.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted picture's style, ink line, colours and scale exactly, same gentle slanted view from above and to the front. The same big red toadstool as the pasted picture (same cap, same cream spots, same stem), but standing up on four knobbly brown root legs that have wriggled out from under its cap, like old tree roots with tiny curled root toes, mid-step with one front leg lifted, the stem tipped forward a little as though it is walking, a faint sleepy happy face is NOT painted (keep it a plain toadstool). The legs are thick and short so it still looks like a stout toadstool. Hidden detail: a tiny snail clinging to one root leg. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/toad-legs.webp, used while it walks (toadItem in index.html)

## b1-06-toad-house: Toadstool mouse house

Paste first: `art-day-14/refs/sprites__kit__wood-15.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted picture's style, ink line, colours and scale exactly, same gentle slanted view from above and to the front. The same big red toadstool as the pasted picture, now a small mouse family's house: a little arched wooden door with a tiny round brass knob cut into the front of the cream stem, a small round window with a cross frame beside it (glass painted dark and empty, NOT lit), a flat stone doorstep, a tiny flower pot with a daisy beside the door, and a very small washing line strung from the stem to a blade of grass with three tiny cloths and two pegs. The cap and spots stay exactly as in the pasted picture. Hidden detail: a tiny snail on the top of the cap. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/toad-house.webp (replaces the code-drawn mouseHouse)

## b1-07-pond: Dew pond

Paste first: `art-day-14/refs/sprites__spring-clear.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted picture's style, ink line, colours and scale exactly, same gentle slanted view from above and to the front. A small round dew pond for a gnome garden, as one piece: clear still water with soft ripples and two pale reflections of leaves, a ring of mossy stones round the edge, a few reeds and a bulrush at the back left, one round lily pad with a tiny white flower, and a few pebbles under the clear shallows. About as wide as five gnomes lying end to end. The pond sits in the ground with a natural earthy lip. Hidden detail: a tiny snail on one stone at the edge. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/pond.webp

## b1-08-spirit-float: Wood spirit floating

Paste first: `art-day-14/refs/sprites__vis-spirit.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same Wood spirit as the pasted picture: a gentle see-through leaf-green woodland spirit of swirling leaves, bark-brown wisps and long flowing hair, soft and kind, painted flat in watercolour with ink outlines like a creature in the book, painted as if switched off: NO glow, NO halo, NO light rays, NO pink, no sparkle. Pose: floating gently upright in mid-air, drifting, arms loosely out, hair and leaves trailing behind as if on a breeze, eyes open and kind, looking slightly down and to the right. Same size as the pasted picture, full figure. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/spirit-float.webp (strip any pink fringe in the cut)

## b1-09-spirit-point: Wood spirit pointing

Paste first: `art-day-14/refs/sprites__vis-spirit.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same Wood spirit as the pasted picture: a gentle see-through leaf-green woodland spirit of swirling leaves, bark-brown wisps and long flowing hair, soft and kind, painted flat in watercolour with ink outlines like a creature in the book, painted as if switched off: NO glow, NO halo, NO light rays, NO pink, no sparkle. Pose: floating, one arm stretched out to the right with a long slender finger pointing, as if showing a gnome where to look, the other hand held to its chest, leaning toward the pointing side, hair and leaves swept the other way. Same size as the pasted picture, full figure. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/spirit-point.webp

## b1-10-spirit-settle: Wood spirit settling

Paste first: `art-day-14/refs/sprites__vis-spirit.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same Wood spirit as the pasted picture: a gentle see-through leaf-green woodland spirit of swirling leaves, bark-brown wisps and long flowing hair, soft and kind, painted flat in watercolour with ink outlines like a creature in the book, painted as if switched off: NO glow, NO halo, NO light rays, NO pink, no sparkle. Pose: settling down to rest beside a fire, floating low with its leafy skirts gathered and folded under it as if sitting on the air, hands in its lap, head tilted, a peaceful half-smile, hair falling over one shoulder. Same size as the pasted picture, full figure. No fire in the picture. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/spirit-settle.webp

## b1-11-edges-stream: Stream banks (retry)

Paste first: `art-day-14/refs/sprites__kit__edge-01.jpg`; `art-day-14/refs/sprites__tile-stream.jpg`

Retry. Look at edge-01 first: the old one had hard ends.

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted pieces' style and slanted view. A sheet of 3 long thin stream-bank strips, each running from lower left to upper right, stacked in 3 rows with wide clear magenta gaps, nothing touching. The first try looked stuck on, so make them SOFT and NATURAL: (1) a stream bank seen from the grass side, a gentle earthy lip where soft grass leans over the water, a few small stones and reeds, the lower edge fading softly to nothing; (2) the opposite bank, same but facing the other way; (3) a bank with a small sandy beach, flat stepping stones and a clump of reeds. Each strip is only about as thick as half a gnome, with both ends and the long edges fading out softly like a watercolour wash with no hard cut-off. No water in the strips (the stream is painted separately). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py -> sprites/kit/bank-01..03.webp

## b1-12-edges-path: Path edges (retry)

Paste first: `art-day-14/refs/sprites__kit__edge-04.jpg`; `art-day-14/refs/sprites__tile-path.jpg`

Retry.

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the pasted pieces' style and slanted view. A sheet of 3 long thin footpath-edge strips, each running from lower left to upper right, stacked in 3 rows with wide clear magenta gaps, nothing touching. The first try looked stuck on, so make them SOFT and NATURAL, like a watercolour wash: (1) a path edge where trodden pale earth fades into grass with small tufts, clover and a few pebbles; (2) the same edge facing the other way; (3) the end of a footpath where the trodden earth thins and fades out into grass. Each strip is only about as thick as half a gnome, with both ends and the long edges fading out softly with no hard cut-off, and no flat path in the strip, only the ragged fringe. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/kit/pathedge-01..03.webp

## b1-13-fix-orchard: Orchard without the halo

Paste first: `art-day-14/refs/orchard-crop.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Redraw ONLY the orchard from the pasted picture, the same four small fruit trees with thin trunks and tied stakes, the same leaves and little fruit, the same patches of turned earth with fallen apples at their feet and the same size, but painted as solid dry watercolour: NO pale glow, NO white halo, NO soft bloom round the trees, the leaves end in clean ink-edged shapes against the flat magenta. Hidden detail: a tiny snail on the lowest trunk. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> replaces the orchard in the Pebbleworth building (bld-pebbleworth / orchard slot)

## b1-14-fix-stickpile: Stick pile, whole

Paste first: `art-day-14/refs/sprites__stick-pile.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Redraw the pasted pile of gathered sticks with its three grey stones, the same size and look, but keep EVERYTHING inside the picture with clear magenta space all round: no stick end touching or cut off at any edge of the picture, the stones and the loose twigs all whole. Hidden detail: a tiny snail on the largest stone. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/stick-pile.webp (replace)

## b1-15-fix-barnaby: Barnaby page, no walking man

Paste first: `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. Repaint the pasted picture exactly (same composition, same two gnomes laughing in the cloud of flour, same big tree with the little door, the wheelbarrow of grain sacks, the spilled sacks, the path and the meadow flowers with the snail at lower right), but REMOVE the small distant walking gnome with the staff on the right, leaving only meadow and path where he stood. Nothing else changes.
```

Cut/wire: -> sprites/story-barnaby.webp (replace)

## b1-16-dish-food: Feeding dish with seed and with berries

Paste first: `art-day-14/refs/sprites__feeding-dish.jpg`

From docs/ART-DAY-13.md prompt 4 (round four).

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Two copies of the same stone feeding dish on its little log stand as the pasted picture, side by side with a wide magenta gap, seen from exactly the same view and size: on the left the shallow stone bowl is heaped with a small pile of pale seeds and grain, a few spilled on the rim; on the right it is heaped with small dark berries (blackberries, a few red rowan berries and two leaves), one berry rolled onto the rim. Match the dish, its stand and the cut branch stub exactly so they can swap with the empty one. Hidden detail: a tiny snail on the log stand of the berry dish. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py -> sprites/dish-seed.webp, sprites/dish-berry.webp (width 62 like feeding-dish)

## b1-17-her-feed: Hazel tipping food strip

Paste first: `art-day-14/refs/sprites__her-pickup.jpg`; `art-day-14/refs/sprites__her-side.jpg`

From docs/ART-DAY-13.md prompt 5 (round four).

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome as the pasted pictures, matching face, clothes and size exactly. A 4-frame loop in one row, side profile facing right, tipping food from a small woven willow basket held in both hands into something just off the right edge at waist height: frame 1 basket held level, frame 2 basket tilting forward, frame 3 basket tipped right over with a few berries falling out of it, frame 4 a gentle shake of the basket, smiling. Full body, feet visible, evenly spaced with wide clear magenta gaps. No dish, no ground, no shadow. Avoid pink and purple outside the berries.
```

Cut/wire: pack like him-build: sprites/her-feed.png, act feed (4 frames, ACT_FPS.feed 3), re-paste gnomes.json

## b1-18-him-feed: Wendel tipping food strip

Paste first: `art-day-14/refs/sprites__him-pickup.jpg`; `art-day-14/refs/sprites__him-side.jpg`

From docs/ART-DAY-13.md prompt 5 (round four).

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome as the pasted pictures, matching face, clothes and size exactly. A 4-frame loop in one row, side profile facing right, tipping food from a small woven willow basket held in both hands into something just off the right edge at waist height: frame 1 basket held level, frame 2 basket tilting forward, frame 3 basket tipped right over with a few berries falling out of it, frame 4 a gentle shake of the basket, smiling. Full body, feet visible, evenly spaced with wide clear magenta gaps. No dish, no ground, no shadow. Avoid pink and purple outside the berries.
```

Cut/wire: pack like him-build: sprites/him-feed.png, act feed (4 frames, ACT_FPS.feed 3), re-paste gnomes.json

## b2-01-yard-1: Little makes, yard: bare ground and first green

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 9 separate little garden decorations for a gnome yard, 3 columns by 3 rows, evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) a ring of fire-blackened stones, low, as a fire ring (open middle, no flames); (2) two upturned clay flower pots used as stools, side by side, one slightly chipped; (3) a tin-can wind spinner: four little tin can halves on a thin post, seen as a small whirly toy, rusty and patched; (4) a flat boot-scraper stone with a short iron bar set in it; (5) three small terracotta flower pots in a row, each with leafy green seedlings and one tiny white flower; (6) a woven grass doormat, oval, plaited from pale dry grass; (7) a little scarecrow on a single pole: a sack head with a stitched smile, a tiny patched tunic, a twig for arms, a battered gnome-sized hat; (8) a short curved stretch of white pebble edging, about twenty small round white pebbles set side by side in a gentle curve; (9) a flower pot with a few white daisies on top of a short old cut stump; Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b2-02-yard-2: Little makes, yard: meadow and small woodland things

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 7 separate little garden decorations for a gnome yard, 4 columns by 2 rows (7 pieces, the last space empty), evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) a round stone sundial on a short mossy stone pillar, the brass gnomon pointing up, numerals as tiny marks, unlit; (2) two herb pots, one with mint and one with thyme, small rustic pots with a tiny label stick in each; (3) a round wattle wreath of woven willow with golden everlasting flowers and a few ears of grass, for hanging on a door; (4) a short plank laid flat over two stones, as a little footbridge over a trickle, wooden edge with worn grain; (5) a snail-shell wind chime: five empty snail shells of different sizes hanging from a curved twig on strings; (6) a small oblong wooden name board on two short chains, plain blank face with a tiny carved leaf in the corner and no letters; (7) a moss cushion, plump and rectangular, sewn from green moss with a little stitched hem; Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b2-03-yard-3: Little makes, yard: big three

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 3 separate little garden decorations for a gnome yard, 1 column by 3 rows, evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) a bark swing: a flat seat of curved bark hanging from two rope loops tied to a short stub of oak branch at the top of the picture, the rope ends knotted; (2) a hammock of woven rope netting slung between two short posts with little cross-pegs, empty and slightly sagging in the middle, with a folded patched blanket on one end; (3) a welcome sign: a short post with a hand-painted pale board reading no words, but a pawprint, a feather and a snail drawn on it as symbols, and a small mat nailed beneath; Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b2-04-garden-1: Little makes, garden: first green

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 5 separate little garden decorations for a gnome yard, 3 columns by 2 rows (5 pieces, the last space empty), evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) three flat grey stepping stones in a gently curved row, a gnome stride apart; (2) a little wicket gate: two short posts and a low woven willow gate between them, with a simple latch, standing on its own; (3) a ring of small pebbles with a gap, as a pebble ring about the size of a doorway mat; (4) a smooth flat-topped sitting stone, rounded, warm beige with a patch of moss on one side; (5) a wildflower patch: a loose clump of wild flowers of different heights, poppies, cornflowers, daisies and clover, uneven and not in rows; Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b2-05-garden-2: Little makes, garden: young meadow

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 5 separate little garden decorations for a gnome yard, 3 columns by 2 rows (5 pieces, the last space empty), evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) a flower border strip: a long thin curve of foxgloves at the back, daisies at the front and a wiggle of mixed flowers in the middle; (2) a sweet-pea arch of bent willow canes with sweet peas climbing it, white and pale yellow flowers only; (3) a tiny mouse-sized table with two little stools made from acorn cups, a leaf plate with a crumb on it; (4) a stone frog, smooth grey, sitting with its throat puffed out, a little moss on its back; (5) a bird dish on a post: a shallow saucer of clear water fixed on a thin post about gnome height; Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b2-06-garden-3: Little makes, garden: young woodland

Paste first: `art-day-14/refs/sprites__wheelbarrow.jpg`; `art-day-14/refs/sprites__stonebench.jpg`

```text
Generate an image: A tall 9:16 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Match the style, ink line and colours of the pasted props exactly (a barrow and a stone bench, for scale and wood colour). A sheet of 4 separate little garden decorations for a gnome yard, 2 columns by 2 rows, evenly spaced with wide clear magenta gaps so nothing touches, each about as big as a small gnome's waist-high prop (a gnome is about 3 inches tall in the pictures), all the same slanted view from above and to the front, painted at consistent scale: (1) a mossy log bench: a fallen log cut flat on top and thick with moss, long enough for two gnomes and a rabbit; (2) a fern corner: a tight clump of five young ferns of different sizes with a few fallen leaves at the roots; (3) a willow seat for two: a small woven willow bench with a curved back, plaited neatly, a folded tiny blanket on one end; (4) a short row of painted pebbles in a curve, each pebble painted with a different little animal in cream and brown ink (a rabbit, a mouse, a bird, a hedgehog, and a snail); Each sits in the ground with no ground plane. Hidden detail: one tiny snail on one of the objects (any one). No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: cut_kit.py (grow/min thresholds as for the secrets sheets) -> sprites/make-<id>.webp for each, in numbered order

## b3-01-p1-1: Story painting 1.1

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 1.1: the couple stand at the top of the old logging track at sunset, Wendel with the old wheelbarrow that has lost one wheel and Hazel holding a little oak sapling in its pot, a bare valley of cut stumps spreading away below them, and the runaway wheel bowling off down the hill on its own in the distance Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail riding on the runaway wheel.
```

Cut/wire: -> sprites/page-1-1.webp (slot page-1-1)

## b3-02-p1-2: Story painting 1.2

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 1.2: the couple sit on upturned flower pots by their first small fire at dusk, stars coming out over the bare stumps, a fat dark-green shiny beetle called Gerald on top of a small woodpile beside them, Hazel handing Wendel a tin mug Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on a log in the woodpile next to Gerald.
```

Cut/wire: -> sprites/page-1-2.webp (slot page-1-2)

## b4-01-p1-3: Story painting 1.3

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 1.3: the couple kneel one on each side of a brand new little pool of clear water at the foot of the big old stump (the future home, canvas flap and round door visible behind them), leaves and stones cleared from it, a broken wooden crate tipped aside, both delighted, water just beginning to trickle away through the dry bare earth Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail drinking at the edge of the pool.
```

Cut/wire: -> sprites/page-1-3.webp (slot page-1-3)

## b4-02-p1-4: Story painting 1.4

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter.jpg`; `art-day-14/refs/sprites__campfire.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 1.4: planting day in the bare cleared yard: Hazel kneeling planting seeds in a neat straight row, Wendel beside her wiggling a wobbly curved line of seeds, an open seed tin between them, a watering can, the little oak in its pot beside them, the stump home with its canvas flap and the small stick-tripod campfire behind them, cut stumps and dry earth all round Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail inside the open seed tin.
```

Cut/wire: -> sprites/page-1-4.webp (slot page-1-4)

## b4-03-p1-5: Story painting 1.5

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 1.5: dawn: a thin brown wild rabbit bounding away across the bare yard with a green sprout in its mouth, a licked-clean feeding dish on a short stump in the foreground, a few gaps in the rows of tiny seedlings, Hazel standing at the round door of the stump home beside the canvas flap with her hands on her hips, half cross and half laughing, Wendel behind Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail under the licked-clean feeding dish.
```

Cut/wire: -> sprites/page-1-5.webp (slot page-1-5)

## b4-04-p2-1: Story painting 2.1

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter.jpg`; `art-day-14/refs/sprites__campfire.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 2.1: evening in the yard in front of the stump home: the couple hold up a freshly picked, small crooked orange carrot with two legs between them beside the little stick-tripod campfire with its kettle, laughing, a basket of other carrots beside them, the dug seed bed behind them with green tops, the canvas flap and round door of the stump home at the back Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on a carrot top in the basket.
```

Cut/wire: -> sprites/page-2-1.webp (slot page-2-1)

## b4-05-p2-2: Story painting 2.2

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 2.2: the couple squashed into the dry corner inside the front of the stump home under the leaking old patched canvas flap, which sags and drips in several places, under a patched shawl, cooking pots and jars and mugs set out everywhere catching the drips, the round wooden door half open behind them, wet dark stains on the canvas, both looking up with resigned smiles Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail in one of the drip pots, quite happy.
```

Cut/wire: -> sprites/page-2-2.webp (slot page-2-2)

## b4-06-p2-3: Story painting 2.3

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__campfire.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 2.3: evening in the yard: the couple sit side by side on the small new plank bench (a low thin plank on two short log legs, low enough that their boots rest on the ground, only just long enough for the two of them) by the embers of the stick-tripod fire with its kettle, a flat stone wedged under one leg to stop the wobble, Wendel pleased with himself, Hazel with her head on his shoulder, the stump home with its new moss roof and round door behind them, a small pot of tea between their feet Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on the wedged stone.
```

Cut/wire: -> sprites/page-2-3.webp (slot page-2-3)

## b4-07-p2-4: Story painting 2.4

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 2.4: the couple patting the soil round the little oak they have just planted out at the front corner of the bare yard, the empty clay pot tipped beside it with a W and an H scratched on it, their hands both on the soil, a small trowel, the moss-roofed stump home behind them, a few young green shoots and dry earth Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail inside the empty pot.
```

Cut/wire: -> sprites/page-2-4.webp (slot page-2-4)

## b3-10-p2-5: Story painting 2.5

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 2.5: a journal page seen from above on a wooden table: Hazel's neat handwriting in brown ink as little unreadable wavy lines, Wendel's untidy margin scribbles and arrows, a few little pencil sketches of the oak, a carrot, a rabbit and the stump home, a pressed leaf, a pipe laid beside it Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail drawn in the margin by Wendel, labelled with a tiny wavy label that is meant to read not Gerald.
```

Cut/wire: -> sprites/page-2-5.webp (slot page-2-5)

## b3-11-p3-0: Story painting 3.0

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.0: a frosty morning, seen from just inside the front of the stump home: Hazel sitting up in a rough bed looking out through the open round door at the next big old hollow stump white with frost, Wendel on the floor tangled up in a blanket, breath hanging in the air, the moss roof and canvas flap above them Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on the stump's bark, by a knot hole.
```

Cut/wire: -> sprites/page-3-0.webp (slot page-3-0)

## b3-12-p3-1: Story painting 3.1

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__kit__wood-15.jpg`; `art-day-14/refs/sprites__vis-spirit.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.1: in a small green garden next to the yard the couple pushing and pulling at a huge red-capped toadstool that will not budge, Wendel pushing with his shoulder, Hazel pulling with both hands, a pale leaf-green wisp of a spirit just drifting out from the trees behind them that only the viewer sees, the moss-roofed stump home visible in the distance Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on top of the toadstool cap, unbothered.
```

Cut/wire: -> sprites/page-3-1.webp (slot page-3-1)

## b3-13-p3-2: Story painting 3.2

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__kit__wood-15.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.2: the big red toadstool walking on four knobbly root legs across the little garden, mid-waddle, the couple watching open-mouthed, Wendel's pipe falling out of his mouth towards the grass, Hazel catching it without looking, the moss-roofed stump home in the distance Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail clinging to one of the root legs.
```

Cut/wire: -> sprites/page-3-2.webp (slot page-3-2)

## b3-14-p3-3: Story painting 3.3

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__kit__wood-15.jpg`; `art-day-14/refs/sprites__portrait-mouse.jpg`; `art-day-14/refs/sprites__shelter-mossroof.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.3: the toadstool house in the garden corner with its little door and round window, a tiny washing line, and three small mice on the doorstep, a mother mouse hanging up washing, the couple smiling at them from a polite distance, the stump home behind Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail pegged on the washing line, or so it looks.
```

Cut/wire: -> sprites/page-3-3.webp (slot page-3-3)

## b3-15-p3-4: Story painting 3.4

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__house-windows.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.4: dawn, Wendel sitting on an upturned crate in the yard drawing a plan with a pencil on a big sheet of paper, the stump home hollowed out behind him with a plank wall and round windows going in, a small lean-to against the side of the house sketched in faint outline, screwed-up tower plans crumpled all round his feet, a small mug steaming beside him Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on the crumpled tower plan.
```

Cut/wire: -> sprites/page-3-4.webp (slot page-3-4)

## b3-16-p3-5: Story painting 3.5

Paste first: `art-day-14/refs/sprites__him-front.jpg`; `art-day-14/refs/sprites__her-front.jpg`; `art-day-14/refs/sprites__house-finished.jpg`; `art-day-14/refs/sprites__story-barnaby.jpg`

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. A wide 16:9 storybook page painting with a soft cream vignette at the edges, painted edge to edge with no border, no frame, no text, no magenta. Nothing glows: lanterns, windows and fires are painted as if switched off, no halos or light beams. SETTING (must match the game and the story): an Australian hill clearing that loggers have stripped. The ground is bare pale dry earth and dry tussock with only a few tiny green shoots, many cut tree stumps, and a few ghost gums and wattle trees far away on the ridge. NO lush European forest, NO big leafy oaks, NO stone cottages or fireplaces. The couple's home is a tall, wide, weathered, hollow tree STUMP (as the pasted house picture), with a round wooden door at its foot, and at first only a patched cream canvas flap stretched over the front of the hollow on poles; later a moss roof; later a plank wall with round windows; finally a shingle roof and a stone chimney. The two gnomes from the pasted reference pictures, Wendel (the same gnome as the pasted reference: red pointed cap, blue-grey tunic, brown beard, belt, trousers and boots) and Hazel (the same gnome as the pasted reference: green pointed cap, long plaits, brown dress and cream apron). Painting for story page 3.5: evening: the couple in a happy heap just inside the new round front door of the finished stump house, boots in the air, the plank wall, shingle roof and round windows of the finished house seen round the door frame, windows dark and empty, a far lantern bobbing up the track visible through the open door, a small flat stone doorstep beside them Match the gnomes' faces, clothes and size to the pasted pictures, the home to the pasted house picture, and the painting style to the last pasted picture (a finished story page). Hidden detail, small but findable: a tiny snail on the doorstep he tripped over.
```

Cut/wire: -> sprites/page-3-5.webp (slot page-3-5)

## b4-08-bench-small: Small plank bench (redo)

Paste first: `art-day-14/refs/sprites__stonebench.jpg`; `art-day-14/refs/sprites__him-front.jpg`

REDO (Bryce: the first bench was far too big for the gnomes). Paste the gnome so Gemini can judge scale.

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. One small simple gnome bench, MUCH smaller than a normal garden bench, seen from the same gentle slanted view from above and to the front as the first pasted picture. The pasted gnome (second picture) shows the right scale: the bench seat is only knee-high on him, so a gnome sitting on it rests his boots flat on the ground, and the whole bench is only about as long as three gnome-widths. A thin plank (no thicker than a gnome's hand) of pale weathered wood on two short, low log-slab legs with the bark on, held with two small round pegs at each end. Hidden detail: a tiny heart and W + H scratched small into the front edge of the plank, and a tiny snail on one leg. No ground, no shadow. Avoid pink and purple anywhere.
```

Cut/wire: -> sprites/yard-bench.webp

## b4-09-sit-couple: Wendel and Hazel sitting together (loop)

Paste first: `art-day-14/refs/sprites__him-sit.jpg`; `art-day-14/refs/sprites__her-sit.jpg`

Replaces the old bench-couple picture: bench is drawn separately in the game. Used on the bench by the fire in the evening.

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same two gnomes as the pasted pictures, matching faces, clothes and size exactly: Wendel (red cap, blue-grey tunic, beard) on the left, Hazel (green cap, plaits, brown dress, cream apron) on the right, sitting close together side by side facing right, her shoulder against his. A loop of 4 frames in one row, the pair repeated: frame 1 Wendel puffing his pipe, Hazel knitting; frame 2 a small puff of smoke, Hazel looking up at him; frame 3 Wendel leaning his head against hers, Hazel's needles still; frame 4 both looking contentedly at the view. Plain daylight colours, NOT lit by a fire: no orange glow. Full body, feet visible, flat on the ground, evenly spaced with wide clear magenta gaps so nothing touches the next frame. The thing they sit on is NOT painted: no bench, no log, no stool, no ground, no shadow; they sit as if on an invisible seat about knee-high, thighs level, boots flat on the ground. Avoid pink and purple.
```

Cut/wire: pack like him-build: sprites/sit-couple.png

## b4-10-sit-him: Wendel sitting alone (loop)

Paste first: `art-day-14/refs/sprites__him-sit.jpg`; `art-day-14/refs/sprites__him-side.jpg`

For sitting alone on the bench during his wanderings.

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome Wendel as the pasted pictures, matching face, beard, red cap, blue-grey tunic and size exactly. A loop of 4 frames in one row, him sitting alone in side profile facing right, relaxed and a little slouched: frame 1 puffing his pipe, frame 2 a small puff of smoke, frame 3 looking up at the sky with a smile, frame 4 scratching his beard. Plain daylight colours. Full body, feet visible, flat on the ground, evenly spaced with wide clear magenta gaps so nothing touches the next frame. The thing they sit on is NOT painted: no bench, no log, no stool, no ground, no shadow; they sit as if on an invisible seat about knee-high, thighs level, boots flat on the ground. Avoid pink and purple.
```

Cut/wire: pack like him-build: sprites/sit-him.png

## b4-11-sit-her: Hazel sitting alone (loop)

Paste first: `art-day-14/refs/sprites__her-sit.jpg`; `art-day-14/refs/sprites__her-side.jpg`

For sitting alone on the bench during her wanderings.

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome Hazel as the pasted pictures, matching face, plaits, green cap, brown dress, cream apron and size exactly. A loop of 4 frames in one row, her sitting alone in side profile facing right, knitting a small green scarf from a ball of wool at her feet: frame 1 needles together, frame 2 needles apart, frame 3 glancing up with a smile, frame 4 back to the knitting. Plain daylight colours. Full body, feet visible, flat on the ground, evenly spaced with wide clear magenta gaps so nothing touches the next frame. The thing they sit on is NOT painted: no bench, no log, no stool, no ground, no shadow; they sit as if on an invisible seat about knee-high, thighs level, boots flat on the ground. Avoid pink and purple.
```

Cut/wire: pack like him-build: sprites/sit-her.png
