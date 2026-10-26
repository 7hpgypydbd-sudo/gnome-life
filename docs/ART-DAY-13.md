# Art day 13: Wendel dowsing for water (written 2026-10-26, not painted yet)

Why: Bryce asked for a dowsing animation for Wendel's "Look for water" job. Until it is painted, the game shows his standing side picture with a code-drawn forked twig that twitches and dips hard as he nears the spring (`act:'dowse'` in `WORKPATH.spring`, stand-in in `Gnome.draw`).

**How to run it:** same as art day 11. Gemini (Nano Banana) in Chrome on the Mac, a NEW chat, paste the two reference sheets first (`sprites/him-side.png` = walk sheet, `sprites/him-dig.png` = digging), then the prompt. Finished picture: `him-dowse.jpg` in `~/Downloads/Gnome Art Day/2 - Put finished pictures here/`.

1. `him-dowse.jpg`

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. The same gnome as the pasted pictures (top row is his walk sheet, bottom row is him digging): match his face, beard, red cap, blue-grey tunic, belt, trousers and boots exactly. A dowsing loop of 4 frames in one row, him walking slowly in side profile facing right, holding a forked hazel twig out in front of him at waist height, one fork in each fist, palms up, the long end pointing forward, his face intent and listening. Frame 1 twig level, frame 2 twig twitching up a little, frame 3 twig dipping sharply down towards the ground and his eyebrows raised in surprise, frame 4 twig level again. Same size and baseline as the pasted sheets, the same gnome in all four, full body, feet visible, evenly spaced with wide clear magenta gaps so nothing touches the next frame. No ground, no shadow. Avoid pink and purple.
```

**Check before dropping it in the inbox:** full-size download, solid magenta, four separate frames with gaps, the twig whole in every frame, same gnome size as the walk sheet.

**Where it goes in the game (for the wiring chat):** pack it like `him-build` (art day 12: `tools/pack_*.py`) into `sprites/him-dowse.png` with an act `dowse` (4 frames) in `sprites/gnomes.json`, and RE-PASTE gnomes.json into `const GNOMES` in index.html (see the v47 hotfix lesson). Once `acts.dowse` exists the code twig switches itself off. `ACT_FPS.dowse` is 3.
