# Art batch 8 — glow-worm lights for the night (written 2026-10-25)

Two small pictures. The game already draws code stand-ins (`drawWormLight` in `index.html`); these replace them with no code change (`ART_SLOTS`: `worm-lantern`, `worm-lamp`). Run `python3 tools/slot_in_art.py <folder>`. Each is ONE light: the game draws it at every hook or post spot. The soft green glow is code, so never paint glow, rays or a halo.

| # | File | Replaces |
|---|---|---|
| 1 | worm-lantern.jpg | the small hanging jar ("Hang glow-worm lanterns"; drawn at three hooks by the door and bench) |
| 2 | worm-lamp.jpg | the lamp post ("Set glow-worm street lamps"; drawn at four spots along the yard) |

1. `worm-lantern.jpg`

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. One tiny hanging lantern for a gnome: a small round glass jar with a twisted wire handle and a little cork lid, hanging from a short bent twig hook. Inside, a scrap of green moss and three or four pale yellow-green glow-worms curled up, softly lit from within. Do not paint any glow outside the glass. Whole object visible, centred, small, upright. No people. Flat solid magenta background.
```

2. `worm-lamp.jpg`

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. One charming little street lamp for gnomes: a slim crooked wooden post made from a twig-straight branch with bark, a short curved arm at the top, and from it a small round glass jar lamp with a tiny acorn-cap roof, holding moss and a few pale yellow-green glow-worms lit softly from within. A little ivy leaf twists up the post and a few pebbles sit at its foot. Do not paint any glow outside the glass. Whole object visible, standing upright, centred, about three times taller than wide. No people. Flat solid magenta background.
```
