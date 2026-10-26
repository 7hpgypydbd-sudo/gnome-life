# Art day 10: the growing woodpile (written 2026-10-26, not painted yet)

Why: in the rebuilt early jobs (v39), Wendel's first job is **Gather the fallen wood**. He fetches three lots of wood (two fallen branches in the yard and the pile of good sticks Hazel saved while clearing) and stacks them by the house, so the woodpile grows in **three steps**. Today the game shows the old painted firewood stack at three sizes, which is only a stand-in. Painting is a separate Mac chat once Bryce says go.

**How to run it:** same as the other art days. Gemini (Nano Banana), Mac folder `~/Downloads/Gnome Art Day/`, finished picture in `2 - Put finished pictures here/` with the file name below. Start a NEW Gemini chat and paste the reference picture first (`firewood.jpg`, the painted stack already in the game, from `sprites/firewood.webp`).

Style line as on every art day (paint LIT things UNLIT; the game adds glow):

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.
```

1. `woodpile-stages.jpg` (NEW chat; reference: `firewood.jpg`)

```text
[style line] Match the pasted woodpile exactly: same split logs, same bark and pale cut ends, same gentle slanted view from above and to the front, same size of log. Three versions of the same small gnome woodpile in a row from left to right, evenly spaced with wide clear magenta gaps, all sitting on the same baseline, the same log size in all three, so they can be swapped in place. Left: just started, one low row of four or five logs laid side by side on two short sticks to keep them off the ground, and a couple of loose twigs leaning against it. Middle: half built, two rows of logs, the second row stacked across the gaps of the first, a small bundle of thin sticks tied with grass beside it. Right: finished, a neat rounded stack four rows high, bark side up on top, a bundle of kindling tucked in at one end, a single wood shaving curled on the top log. Hidden detail: on the finished stack only, a tiny dark green shiny beetle sitting on the top log, and a very small snail tucked into a gap low down on the middle one. No ground, no shadow. Avoid pink and purple anywhere.
```

**Check before dropping it in the inbox:** full-size download, solid magenta, three separate stacks with gaps, same log size in all three, nothing touching the edges.

**Where it goes in the game (for the wiring chat):** cut the three stacks with `tools/cut_kit.py` into `sprites/woodpile-1.webp`, `-2.webp`, `-3.webp`. In `index.html`, `drawProp` draws the `firewood` prop scaled by `WOOD_SCALE[woodStage()]`; swap that for the matching painted stage at full scale (keep `woodStage()`, it already counts the three lots). The code-drawn beetle "Gerald" (`AFTER.firewood`) walks along the top log of the finished stack; keep him if the painted beetle is missed, otherwise drop him.
