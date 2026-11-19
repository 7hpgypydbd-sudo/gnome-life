# Art day 25 (2026-11-19): Mabel redesign, wheat gold

Bryce chose a wheat gold hat for Mabel (away from the red pointed "David the Gnome" look). Palette: wheat gold, oat cream, cornflower-blue dress, crust-brown wood, a dusting of flour. 9 Gemini pictures, all first try, no limit hit.

Gallery: https://claude.ai/artifact/65vCj4F2iTAjsLN3fzwGvh

NOT WIRED. Where things sit in the stone circle (wagon, oven, wheat, where the wattles move to) is Bryce's weekend plan. sprites/ is untouched; cuts are in art-day-25/cut/ under game names, ready to copy over once placement is decided.

| cut file | size | what | replaces |
|---|---|---|---|
| folk-mabel | 292x699 | Mabel, gold hat, same pose and basket | sprites/folk-mabel (300x699) |
| face-mabel | 96x96 | head + hat crop, same framing as the old one | sprites/face-mabel |
| home-mabel | 520x318 | her caravan settled as home: blue door open, steps, chocked wheels, shafts on a log, cold chimney (code adds smoke/glow) | sprites/home-mabel (stump, 380x283): wider, check scale vs gnomes |
| wagon-arrive | 640x389 | caravan driven by Mabel, pulled by the two carter mice, facing right (Gemini's chimney smoke removed) | new |
| carter-mice-1..4 | h150 | in harness walking right (shafts trailing), in harness standing/looking back, unhitched with a loaf (their pay), trotting away left | new |
| bld-mabel-1, bld-mabel-2, bld-mabel | w260 | oven build steps: stone ring half laid, clay dome over stick frame, finished | bld-mabel (finished oven) |
| wheat-bed-1..5 | w160 | sown furrows, shoots, green, ripe gold, stubble with 3 sheaves | could replace farm-wheat-1..4/-cut |
| baker-sack, -sacks, -loaves, -paddle, -buns, -trough, -sheaf, -pin-honey, -sign | h120 | baker's bits (sign is blank) | new |
| story-mabel | 1200x900 | secret cake scene, Mabel in gold, caravan behind | sprites/story-mabel |
| story-mabel-home | 1200x670 | wagon + mice rolling into the ring of standing stones, gum clearing | sprites/story-mabel-home |

content.js still says `home:'stump'` and `look:{ hat:8, ... }` for Mabel; the build thread changes these when it wires the art.
Raw paintings: art-day-25/painted/ (PNG, 2730x1536 etc.), prompts: art-day-25/prompts/, cutter: art-day-25/cut_day25.py.
