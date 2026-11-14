# Art day 21 (2026-11-14)

Painted in Nano Banana (Gemini) on Bryce's Mac. Raw paintings and prompts in `art-day-21/painted|prompts`, cutting in `art-day-21/cut_day21.py` (run it on the trial cuts from `tools/cut_blobs.py --gap 30`). Every painting hides a snail. Nothing is wired in yet: the build thread does that.

## New sprites (all new names, nothing overwritten)

| Sprite | What | Notes |
|---|---|---|
| `sprites/ground/lawn-calm.webp` (280x140) | Calm finished lawn swatch, soft short grass and moss | Replacement for the busy `moss` swatch (notes 41, 52). Swap `'moss'` for `'lawn-calm'` in GSWATCH/swatch calls, or copy over moss.webp when Bryce okays it. Seamless (offset blend). |
| `sprites/kit/patch-calm-{clover,buttercup,violet,moss,leaves,fresh}.webp` (420 wide) | Soft ground patches, edges feathered to nothing, grass colour pulled to the lawn | Replace kit patch-01/02/04/06/08; `leaves` (soft gum-leaf litter) replaces the orange pine-needle patch-05. Still fade them in slowly with the green (note 52). |
| `sprites/garden-heap.webp` | Rubbish heap on a low mound (tins, crate, wire, tyre, offcuts, bucket) | All five garden stages are 1000 px wide with the same oval footprint: draw at the large-pond spot, ~420 world px wide, centre 0.52, 0.56. |
| `sprites/garden-heap-half.webp` | Half cleared, trampled earth with footprints | |
| `sprites/garden-hollow.webp` | Bare dry dip where the heap stood | |
| `sprites/garden-hollow-rain.webp` | Muddy rain water pooling in the dip | |
| `sprites/garden-pond-large.webp` | Finished pond, NO stone ring (Bryce 2026-11-14): grass and moss to the water, reeds, a muddy bank, lily pads | Slightly smaller than the other stages inside the same footprint. |
| `sprites/spring-paved.webp` (640 wide) | The spring with a ring of rustic flat pavers (note 46) | Same spring and root as spring-clear, pavers round it; draw it in place of spring-clear once paved. |
| `sprites/tub-wash.webp` (420 wide) | Low wide open wash tub: soapy water, washboard, cloth (note 24) | Replaces the drum-like `tub`. |
| `sprites/yard-leanto.webp`, `yard-leanto-frame.webp` (520 tall) | Wendel's work corner: bark-and-branch shelter with bench, tools on pegs, stool; and half built (poles, a few bark sheets, no bench) | Painted with a small pitched roof rather than a single slope; open fronted. |
| `sprites/seedbed-rect.webp` (720 wide) | Empty dug rectangle bed, dark soil in rows, pebbles on the two front sides | Corner tips touch the painting's edge, so the left/right points are a few px blunt. |
| `sprites/stepping-stones.webp` (600 wide) | Seven flat stones curving lower left to upper right on an earth strip | Doorstep to fire. Mirror for the other way. |
| `sprites/wildflower-patch-1..3.webp` | Native wildflower clump: sprouts; flowering (paper daisies, billy buttons, blue flowers); wider with seedlings | Same scale across all three (largest 420 wide). |
| `sprites/story-mabel-home.webp` (1200x670) | Story page: Mabel at the red door of her stump house, pie on the sill, gum trees | |
| `sprites/room-stump-hollowing.webp` (1000x1000) | Inside the stump half hollowed: shavings, tools on a crate, ladder, broom, unlit lantern | Same round framing as room-stump. A first try added two old bearded gnomes; repainted empty. |

## Second round (same day): the stand-in slots

`tools/standin_check.js` (run in Chrome against main) listed 24 empty slots. This round fills 16 of them:

| Sprite | What |
|---|---|
| `sprites/story-{tobias,fernsby,pebbleworth,clem,barnaby,nettle,juniper}-home.webp` (1200x670) | "Moved in" story pages, each painted from that folk's own sprite and home sprite, matching their `movedIn` text. Fernsby is from Gemini's preview (1024 px, scaled up) because Chrome stopped downloading. |
| `sprites/face-{mabel,tobias,fernsby,pebbleworth,clem,barnaby,nettle,juniper}.webp` (96x96) | Head crops of each folk's existing painted sprite (no new painting), centred on the face. |

Still empty after this: plot-ruts-filled, plot-cleared, vis-rabbit, bld-juniper, make-mousedoor, make-owlbox, gift-lyrebird. Gemini used about 30 pictures today (window 5-hour limit near full; weekly ~5%).
