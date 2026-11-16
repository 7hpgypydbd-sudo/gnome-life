# Art day 23 (round thirteen, v105)

Bryce asked for these to be painted now (2026-11-16) instead of living with code stand-ins. Mac thread: "Paint the wheelbarrow and new pond", branch `art-day-23`.

| Picture | What | Fits with | Stand-in until it lands |
|---|---|---|---|
| `him-barrowwalk`, `her-barrowwalk` | Wendel and Hazel each pushing the wheelbarrow, loaded with loggers' junk (tins, wire, a crate). Side view walk cycle, same cell size and frame count as their walk strips (sprites/gnomes.json `acts`). | Must be the wheelbarrow they make, `sprites/wheelbarrow.webp` (Bryce: use it, or repaint it to match the animation). | `drawBarrowStandIn` in index.html: the yard's wheelbarrow drawn in front of a plain walk, junk on it on the way to the tip. |
| `him-barrowwalke`, `her-barrowwalke` (nice to have) | The same, barrow empty. | | The loaded strip is used both ways. |
| `garden-pond-new` | The rain-filled hollow, brimming, no reeds yet. Same footprint, scale and angle as `garden-hollow-rain` and `garden-pond-large` (it cross-fades between them). | | `hollowFull()`: water drawn into `garden-hollow-rain`. |

Wiring when they land: add the strips to `sprites/gnomes.json` `acts` as `barrowwalk` (and `barrowwalke`); the game picks them up by name (`Gnome.draw`, `barW`). `garden-pond-new` is already an art slot and is used the moment the file exists. Paint unlit; a snail hides in each.
