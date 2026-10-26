# Art day 13: Wendel dowsing for water (written 2026-10-26, not painted yet)

Why: Bryce asked for a dowsing animation for Wendel's "Look for water" job. Until it is painted, the game shows his standing side picture with a code-drawn forked twig that twitches and dips hard as he nears the spring (`act:'dowse'` in `WORKPATH.spring`, stand-in in `Gnome.draw`).

**How to run it:** same as art day 11. Gemini (Nano Banana) in Chrome on the Mac, a NEW chat, paste the two reference sheets first (`sprites/him-side.png` = walk sheet, `sprites/him-dig.png` = digging), then the prompt. Finished picture: `him-dowse.jpg` in `~/Downloads/Gnome Art Day/2 - Put finished pictures here/`.

1. `him-dowse.jpg`

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome as the pasted pictures (top row is his walk sheet, bottom row is him digging): match his face, beard, red cap, blue-grey tunic, belt, trousers and boots exactly. A dowsing loop of 4 frames in one row, him walking slowly in side profile facing right, holding a forked hazel twig out in front of him at waist height, one fork in each fist, palms up, the long end pointing forward, his face intent and listening. Frame 1 twig level, frame 2 twig twitching up a little, frame 3 twig dipping sharply down towards the ground and his eyebrows raised in surprise, frame 4 twig level again. Same size and baseline as the pasted sheets, the same gnome in all four, full body, feet visible, evenly spaced with wide clear magenta gaps so nothing touches the next frame. No ground, no shadow. Avoid pink and purple.
```

**Check before dropping it in the inbox:** full-size download, solid magenta, four separate frames with gaps, the twig whole in every frame, same gnome size as the walk sheet.

**Where it goes in the game (for the wiring chat):** pack it like `him-build` (art day 12: `tools/pack_*.py`) into `sprites/him-dowse.png` with an act `dowse` (4 frames) in `sprites/gnomes.json`, and RE-PASTE gnomes.json into `const GNOMES` in index.html (see the v47 hotfix lesson). Once `acts.dowse` exists the code twig switches itself off. `ACT_FPS.dowse` is 3.

2. `yard-bench.jpg` (Bryce 2026-10-26: Wendel builds a SIMPLE BENCH by the fire, a plank on two legs, instead of rolling a log; NEW chat; reference: `stonebench.jpg` from `sprites/stonebench.webp` for the slanted view and scale)

```text
[style line] One simple gnome bench, seen from the same gentle slanted view from above and to the front as the pasted picture: a single thick rough-sawn plank of pale weathered wood laid across two short stout legs made of split log slabs, the plank held on with two round wooden pegs at each end, the bark still on the edges of the legs. Long enough for two small gnomes to sit side by side. Hidden detail: a heart and the letters W + H carved small into the front edge of the plank, and a tiny snail on one leg. No ground, no shadow. Avoid pink and purple.
```

Where it goes: cut with `tools/cut_kit.py` into `sprites/yard-bench.webp`. It is an art slot already (`ART_SLOTS['yard-bench']`, 64 px wide); once the file exists the finished bench uses it instead of the code-drawn one (the code bench still shows legs-then-plank while it is being built).

3. `bench-couple.jpg` (Bryce 2026-10-26: once the plank bench is painted and in the game, we need a picture of Wendel and Hazel sitting together on it, to see how it looks. Paint it AFTER `yard-bench`, in a NEW chat. References, pasted in this order: `yard-bench.jpg` (the finished painted bench), `sprites/him-sit.png`, `sprites/her-sit.png`)

```text
[style line] The same bench as the first pasted picture, seen from the same gentle slanted view from above and to the front, with the two gnomes from the other pasted pictures sitting on it side by side for a quiet evening: Wendel on the left in his red cap and blue-grey tunic, leaning back a little with his pipe, and Hazel on the right in her green cap, plaits and apron, knitting, her shoulder against his. Match their faces, clothes and size exactly to the pasted pictures, and the bench exactly to the first picture (the carved heart and W + H on the front edge still showing between their feet). Their feet dangle a little above the ground. Plain daylight colours, NOT lit by the fire: no orange glow, no warm light on their faces (the game adds the firelight at night). Hidden detail: a tiny snail on the end of the bench beside Hazel. No ground, no shadow. Avoid pink and purple.
```

**Check:** full-size download, solid magenta, both gnomes whole, same bench, nothing glowing.

Where it goes: cut with `tools/cut_kit.py` into `sprites/bench-couple.webp` (make it an art slot like `yard-bench`, same width so it lines up). The wiring chat then shows it instead of the bench + the two separate sitting gnomes whenever both sit on the bench of an evening.
