# Gnome Life — Art Style Guide (v1, 2026-10-24)

The one document to read before asking Nano Banana (Gemini) for any new art. Every new piece must sit next to `iso1/walk-her-side.jpg`, `iso1/homestead-1.jpg` and `iso1/plot-barren.jpg` without looking like it came from a different game.

Reference images (on Bryce's Mac, `~/Downloads/fairy-garden/iso1/`):
- **Characters:** `walk-her-side.jpg` is the approved reference look. Gnome reference sheets (young newlywed pair, made 2026-10-24, APPROVED by Bryce: "love them"): `iso1/ref-her-young-v1.jpg` and `iso1/ref-him-young-v1.jpg` (5 views each: front, side right, back, three-quarter, face). Once approved these replace the old elderly sheets as THE reference crop for every future walk/action sheet.
- **Props:** `homestead-1.jpg`.
- **Ground:** `plot-barren.jpg`.

## 1. The look in one sentence
Traditional children's-book illustration in the manner of *The Secret World of the Gnomes*: fine brown ink line over soft watercolour washes, naturalistic and gentle, on cream paper. Never clay, never toy, never 3D render, never vector-flat, never anime.

## 2. Linework
- Every shape has a thin, slightly uneven **brown-black ink outline** (`#2a1510` to `#3d1d1a`, not pure black). Line weight varies a little: heavier under objects and in creases, finer on highlights and far edges.
- Interior detail is drawn with line, not with shading: wood grain, stitching, bark ridges, blades of grass, wrinkles, strands of hair.
- Hatching is used sparingly for the deepest shadow (under a root, inside a door).
- No lineless painting, no soft airbrush edges, no glow effects baked in (glows are added in code).

## 3. Palette
Muted, earthy, slightly warm, as if printed on cream paper. Nothing saturated except two accents: his **red cap** and the green of **new growth**. Measured from the approved art:

| Use | Hex | Notes |
|---|---|---|
| Ink line | `#2a1510` | warm dark brown |
| Paper / highlights | `#f2e7d8` | cream, not white |
| Skin | `#edd2bd` base, `#dd9a85` cheeks | rosy cheeks and nose on everyone |
| Hair / beard (young pair) | `#8a5a2b` light, `#5a3a1c` shade | chestnut brown for both |
| Beard / grey hair (old pair, retired) | `#f2e7d8` with `#bab6b1` shadow | keep for possible later-life stage |
| His cap | `#dd765c` light, `#b14c37` shade | the red accent |
| His tunic | `#9aa5ab` light, `#7b868d` shade | dusty blue-grey |
| His trousers | `#8a7156` | |
| Boots / clogs | `#bd977d` light, `#6e5d51` shade | pale tan leather |
| Her cap and bodice | `#9a9452` light, `#6f6b3b` shade | olive green |
| Her dress | `#a48260` light, `#714c34` shade | warm brown |
| Her apron | `#faefd9` | cream |
| Wood (props) | `#b09975` light, `#6f5b43` mid, `#523f2e` dark | |
| Bare earth | `#ccb184` light, `#9d8562` mid, `#5c482e` dark | |
| Moss / grass | `#ad984d` dry, `#7f8c3a` fresh, `#5b6b2d` deep | fresh green only on living plants |
| Stone | `#c7c2b8` light, `#8f8a80` shade | cool grey |
| Metal (kettle, bands) | `#6b6a70` with rust `#8a4a2e` | |
| New growth accent | `#8fc15a` | bright leaf green, use tiny |

Rules: shadows are warmer darker versions of the local colour, never grey or black. Keep saturation low everywhere except the two accents. Skies, mist and backgrounds are never painted into sprites (everything is a cut-out).

## 4. Lighting
- One soft **key light from the upper left** (the viewer's left, slightly in front). Left faces of objects are lighter, right faces darker. Tops are lightest.
- Shadows are soft watercolour pools, slightly warm, with a small contact shadow where things meet the ground. Drop shadows on the ground are **not** painted into sprites; the engine draws a blob shadow.
- No strong cast shadows across other objects, no rim light, no bloom.
- Day only. Night, dawn, dusk and lantern glow are tints and additive glows applied in code, so never ask Gemini for a night version of a sprite.

## 5. Isometric angle and projection
- Ground is a **2:1 isometric diamond**: the tile's top face is twice as wide as it is tall, edges at about 30° to the horizontal (measured 29.5° on `plot-barren.jpg`, corners top (612,1) left (3,346) right (1221,347) bottom (612,691) in the 1376x768 image).
- Camera looks down at roughly 30° elevation from the south-west, so you see the top and the two front faces (left and right) of every object. Front faces are visible, back faces are not.
- The slab has a visible earth edge below the top face (about 1/14 of the tile height). Ground tiles must be made in the **same Gemini chat as `plot-barren.jpg`** (or with it pasted as the reference) so the angle and edge match.
- **Props** are drawn at the same angle: tops visible, slight left/right faces. Round things (barrel, tub, stump) show an elliptical top about 2:1.
- **Characters** are the exception: Gemini ignores isometric for people, so gnomes are drawn as clean **side profile, front and back** views, and the engine mirrors the side view for left. This is fine; the eye accepts it.
- Everything is drawn in **orthographic** perspective: no vanishing points, parallel edges stay parallel, far things are not smaller.

## 6. Scale rules
All sheets are generated at 1376x768 (landscape) or 768x1376 (portrait). The engine draws sprites at half their sheet size (`SPR=0.5`), so sheet pixels are the only scale that matters.

| Thing | Height on sheet | In-game relation |
|---|---|---|
| Standing gnome (him) | ~330 px (cap tip to boot) | the unit everything is measured against |
| Standing gnome (her) | ~330 px, wider skirt | same height as him |
| Doorway / shelter | 1.1 to 1.3 gnome heights | gnomes fit through doors |
| Barrel, tub, bench | 0.5 to 0.7 gnome | hip height |
| Lantern pole | 1.3 gnome | |
| Fence panel | 0.5 gnome tall, 1.5 gnome wide | |
| Toadstool (fly agaric, full size) | 1.0 to 1.5 gnome | gnomes are tiny; toadstools are furniture |
| Fern frond | 1.5 to 2 gnome | |
| Tree stump (big) | 1 gnome tall, 2 wide | |
| Ground tile top face | 1225 x 690 px | about 3.7 gnomes across the diamond's width |
| Small visitors (mouse, ladybird, robin) | 0.2 to 0.4 gnome | |
| Hedgehog, owl | 0.5 to 0.8 gnome | |

Rule: in every prompt, state the size in gnome heights and include one gnome in the reference crop when scale matters. Keep the gnomes a little bigger than real-world logic would say, because they are the characters.

## 7. Magenta-background cut-out conventions
- Background is always **flat solid magenta `#fc0cf9`** (Gemini renders it around `rgb(252,12,249)`). Say "flat solid magenta background #FF00FF, no gradient, no shadow on the background, no outline glow".
- No drop shadows on the magenta, no ground plane, no base platform, no frame, no text, no labels, no numbers.
- Each item fully inside the image, **clear gaps between items** (at least 40 px) so the cutter can split them. For regular grids ask for "N columns, M rows, evenly spaced" (walk sheets split by gaps with `iso/tools/cut_blobs.py`); for irregular prop sheets use `iso/tools/cut_cc.py` (flood fill, join 8 px).
- Key formula (in the tools): `mag = min(R,B) - G`, `alpha = clip((0.42 - mag/255) / 0.22)`. Pinker outputs need `--thresh 0.36`.
- Avoid magenta, pink and purple in the art itself (cheeks are fine, they are desaturated). If Gemini adds a pink glow (spirits), strip it and add the glow in code.
- Walk sheets: ask for "8 frames in 2 rows of 4"; Gemini returns 2 rows of 6. Frame 0 is usually a standing pose. Check that both rows are the same view before cutting; a row sometimes reverts to profile.
- Output sizes: 1376x768 for walk sheets and ground tiles, 768x1376 for prop sheets. Download the full-size image, not the 1024-wide preview.

## 8. Working with Gemini (Nano Banana) without drift
- **Fresh chat per character or per family of props.** Long chats drift (the "old cartoon" her-front sheet came from a drifted chat).
- **One reference crop** of the exact pose and angle you want, pasted first. Easiest on the Mac: put the PNG on the clipboard with `osascript -e 'set the clipboard to (read (POSIX file "/path/crop.png") as «class PNGf»)'`, click the Gemini prompt box, press cmd+v (works, no base64 needed). Crop one figure, a few hundred px tall is fine. Say "match this character exactly: same face, hair, clothes, colours, line and paint style".
- Ground tiles and anything that must share the slab angle go in the **same chat as the barren plot**, or with the barren plot crop pasted.
- Ask for one thing per image. Do not ask for a sheet that mixes characters and props.
- If Gemini answers with text only, reply "you replied with text only, please actually generate the image".
- Do not iterate more than twice on one sheet; if the second try is still off, change the prompt structure rather than re-rolling.

## 9. Prompt templates

**Style block (paste into every prompt):**
> Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.

**Character reference sheet:**
> [style block] Character reference sheet for [NAME], a [young / middle-aged] gnome [man/woman]: [face, hair, beard, build]. Clothes: [list with colours]. Show the same character 5 times in one row, evenly spaced with clear gaps: front view standing, side profile facing right, back view, three-quarter front, and a close-up of the face. Full body, feet visible, neutral friendly expression. Match the pasted reference exactly.

**Walk cycle:**
> [style block] Match the pasted character exactly. A walk cycle of [NAME] seen in [side profile facing right / front view walking toward the viewer / back view walking away]. 8 frames in 2 rows of 4, evenly spaced, clear gaps, same size in every frame, feet at the same baseline. Full body.

**Action sheet:**
> [style block] Match the pasted character exactly. [NAME] in side profile facing right doing [ACTION, e.g. digging with a small spade] as a loop of 6 frames in one row, evenly spaced, clear gaps, same size, feet on one baseline.

**Prop sheet:**
> [style block] Isometric game props seen from the same angle as the pasted ground tile (camera from the south-west, looking down about 30 degrees, top and two front faces visible, no perspective). [N] separate items laid out in a [C] by [R] grid with clear gaps: [list, each with size in gnome heights, e.g. "a wooden well about 1.5 gnomes tall"]. Each item complete and alone, no ground under it, no shadow on the background.

**Ground tile:**
> [style block] An isometric 2:1 diamond ground tile exactly matching the pasted tile's angle, size and earth edge: [description of the surface, e.g. "young meadow: soft grass, clover, a few daisies, one mossy stone"]. The tile's four edges must be plain and straight so it can join other tiles, with nothing hanging over the edge. Centre the diamond, fill the image width.

**Visitor / creature:**
> [style block] A [creature] at gnome-world scale ([0.3] gnome heights), [pose], seen from the side slightly above. [Optional: 4 frames of idle in one row.] Alone, complete, no ground.

## 9b. Character bible (decided 2026-10-24)
- The couple are **young newlyweds, about 25**. Bryce's idea: they may age over the course of the game (young -> middle-aged -> the grey-haired pair from the old sheets), so keep the old sheets.
- **Him:** tall red pointed cap, dusty blue-grey tunic, brown belt with brass buckle, brown trousers, pale tan boots, short neat chestnut beard and moustache, rosy cheeks, stocky.
- **Her:** olive green pointed cap and bodice, warm brown long-sleeved dress, cream apron tied at the back, grey-green clogs, chestnut hair in two long plaits, rosy cheeks.
- Names and personalities: still undecided (placeholders Ferdinand and Rosalind in the code).

## 10. Checklist before accepting a sheet
1. Same line weight and paint feel as `walk-her-side.jpg`.
2. Colours from the table, nothing neon except the red cap and leaf green.
3. Light from upper left.
4. Props show top plus two front faces at the slab angle; gnomes are clean side/front/back.
5. Sizes in gnome heights are right.
6. Solid magenta, gaps between items, no shadows or text.
7. Full-size download (1376 wide), not the preview.

## Change log
- 2026-10-24 v1: written from the isometric set 1. Bryce decided: young newlywed pair. Reference sheets v1 generated and APPROVED by Bryce the same day. These are locked.
