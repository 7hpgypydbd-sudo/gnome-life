# Art day 9: the gully and the bend-down pick-up (written 2026-10-26)

Why: Bryce changed "Fill the wheel rut" into **a rain-washed gully** (there is no wagon in the story), and wants both gnomes to visibly **bend down and pick things up** while they gather (Hazel clearing the rubbish today uses a digging stand-in). Approved by the coordinator. Not painted yet: painting is a separate Mac chat once Bryce says go.

**How to run it:** same as the other art days. Gemini (Nano Banana), Mac folder `~/Downloads/Gnome Art Day/`, finished pictures in `2 - Put finished pictures here/` with the file names below. Start a NEW Gemini chat for each numbered step and paste the named reference picture first (reference pictures are in `1 - Reference pictures/`; `her-side.jpg` and `him-side.jpg` are the approved side-view gnomes, `ground-grass.jpg` is a painted ground swatch).

Every prompt starts with the usual style line (paint LIT things UNLIT; the game adds glow):

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.
```

| # | File | What it is for |
|---|---|---|
| 1 | `gully-long.jpg` | the long gully "before" and "after", replacing `rut-mud` / `rut-filled` |
| 2 | `action-her-pickup.jpg` | Hazel bends down and gathers, two loops (replaces the digging stand-in) |
| 3 | `action-him-pickup.jpg` | Wendel bends down and gathers, two loops |

**Where they go in the game (for the wiring chat):** `gully-long` becomes `sprites/kit/rut-mud.webp` / `rut-filled.webp` (or new names; `drawHomeRuts` in index.html draws them at 860 px wide, clipped to the patch, mud fades out as Wendel works, the "after" now stays when done instead of vanishing). The pick-up sheets become new action strips (`her-pickup`, `him-pickup`, 4 frames, the `acts` table in `GNOMES`); `WORKPATH` jobs in index.html switch their crouch from `dig` to `pickup`. Cut with `tools/cut_kit.py` (the strips can use the same frame cutter as the other action sheets).

---

1. `gully-long.jpg` (NEW chat; reference: ground-grass.jpg)

```text
[style line] Paint in exactly the same style, colours and gentle slanted view as the pasted painted ground. One long single gully carved by storm water, running straight from lower left to upper right across the whole picture, edge to edge, as wide as two gnomes: a deep, wavy-edged muddy channel with dark wet earth at the bottom, a thin trickle of clear rainwater winding along it with a small puddle in one spot, raised crumbly banks of dry soil on both sides with a few exposed pale roots and little pebbles that washed down, a few flattened grass stems and one small fallen leaf caught in the trickle. Hidden detail: a tiny acorn cap floating in the puddle like a boat, and a very small snail on the bank. Below it, with a wide clear magenta gap, the same gully after gnomes have filled it in: smooth level dirt, lightly raked, a few small stones and twigs pressed in where it was, soft grass creeping back in from both edges so the old line is only just visible, no mud, no water, a tiny clover tuft. Both ends of both pieces fade softly into nothing so they can be joined to the ground. No shadow. Avoid pink and purple anywhere.
```

2. `action-her-pickup.jpg` (NEW chat; reference: `her-side.jpg`)

```text
[style line] Match the pasted character exactly: same face, chestnut hair in two long plaits, olive green pointed cap and bodice, warm brown long-sleeved dress, cream apron tied at the back, grey-green clogs, same line and paint style. Two action loops of this young gnome woman in clean side profile facing right, as 2 rows of 4 frames, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Top row: bending down to pick something up from the ground and put it in a small woven basket on her arm, 4 frames of one motion: standing and looking down, bending at the waist and reaching down with one hand, straightening up holding a small twig bundle, dropping it into the basket. Bottom row: crouching to gather small things, 4 frames of one motion: crouched low with knees bent, brushing aside leaves with one hand, lifting a small stone in both hands, standing halfway up with the stone against her apron. Nothing else in the picture, no props lying on the ground. Hidden detail: a tiny snail shell peeking out of her apron pocket in one frame. Flat solid magenta background.
```

3. `action-him-pickup.jpg` (NEW chat; reference: `him-side.jpg`)

```text
[style line] Match the pasted character exactly: same face, short chestnut beard, red pointed cap, dusty blue-grey tunic, brown belt, brown trousers, pale tan boots, same line and paint style. Two action loops of this young gnome man in clean side profile facing right, as 2 rows of 4 frames, evenly spaced with clear gaps, same size in every frame, feet on the same baseline, full body, no ground, no shadow. Top row: bending down to pick something up from the ground, 4 frames of one motion: standing and looking down, bending at the waist and reaching down with one hand, straightening up holding a small stone, tucking it into a canvas bag slung on his hip. Bottom row: crouching to gather, 4 frames of one motion: crouched low with knees bent, tugging a buried twig out of the earth with both hands, lifting it free, standing halfway up with the twig over his shoulder. Nothing else in the picture, no props lying on the ground. Hidden detail: a tiny ladybird sitting on his cap in one frame. Flat solid magenta background.
```

## Checks before dropping a file in the inbox
- Full-size download (1376 wide), solid magenta, no text or shadows.
- Action sheets: two rows, all frames facing right, same size, feet on one baseline, nothing lying on the ground.
- Gully: before on top, after below, both edge to edge and fading at the ends, no pink or purple.
