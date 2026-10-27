# Gnome Life: decorations by stage ("Little makes")

Agreed with Bryce 2026-10-26 (thread "Write the first month's story"). Living copy for comments: https://claude.ai/artifact/2gJUHxfNv3thA8gDXmxeDp . **Built in v52** (see docs/PLAN.md, v52 entry, for the few spots that moved). Replaces VISION's old drag-and-place decorating set (see the concept review: decorations just appear in their planned spot).

## How decorations unlock

Each patch of land (tile) earns its own little makes as it heals. Every time a tile reaches a new land stage (bare ground, first green, young meadow, young woodland), four or five new decorations for that tile become available.

- **Hazel's list.** When a tile reaches a new stage, a small card from Hazel says what they could make now ("Now the yard's greening, I'd love some flower pots by the door."). The new makes appear in Jobs under **Little makes**.
- **Paid for with what you gather (Bryce).** Little makes are where gathered resources go, so the pack never just piles up. Cost grows with the stage: about 2-3 bits at bare ground, 4-6 at first green, 6-10 at young meadow, 10-15 at young woodland, using the rarer finds too (feathers, acorns, berries). Each still takes only 15-45 minutes, so a short check-in always has something to spend on. One job at a time per gnome still applies; either gnome can make any of them.
- **It appears where it belongs.** Every make has a fixed spot from the yard layout plan (docs/PLAN.md "Yard layout plan"); nothing to place or drag.
- **Progress you can see.** The Journal shows a line per patch ("The yard: 6 of 20 little makes").
- **Greening.** A make gives no green (it is building), except anything planted (flower pots, flower border, sweet-pea arch, fern corner, wildflower patch, herb pots): +1 each.
- **Order within a stage** is free.
- Land stage per tile: today only the home tile tracks green points (`CONTENT.landStages`); other tiles need their own stage for this (the garden tile opens at first green).

## The home yard (tile 0,0): 20 makes

*(already a job)* = exists today and moves into Little makes.

| Stage | Make | Where (yard-plan zone) | Line in Jobs |
| --- | --- | --- | --- |
| Bare ground | Little wheelbarrow *(already a job: `barrow`)* | Wendel's corner | "The old one lost its wheel on the hill. This one is smaller, and mostly for Hazel's flowers." |
| Bare ground | Stone ring round the fire | Hearth | "So the sparks stay where they're put." |
| Bare ground | Two upturned-pot stools | Hearth | "They had a lot of pots. Now they have chairs." |
| Bare ground | Tin-can wind spinner | On the woodpile | "Made from the loggers' old tins. It squeaks. Wendel calls that music." |
| Bare ground | Boot-scraper stone | By the door | "For the mud. Hazel's idea, Wendel's boots." |
| First green | Flower pots by the door (planted) | Door | "Three of the travelling pots, finally with something in them." |
| First green | Woven grass doormat | Doorstep | "Wipe your feet. Yes, you." |
| First green | A little scarecrow | Seed bed edge | "It does not scare the rabbit. The rabbit naps under it." |
| First green | Pebble edging round the seed bed | Seed bed | "Little white pebbles, one at a time, all round the bed." |
| First green | A pot of daisies on the old fireside stump (planted) | Hearth | "The old stump by the fire needed something to do." |
| Young meadow | Bark swing *(already a job: `swing`)* | The oak | "From the lowest branch of the oak. For the afternoons when nothing needs doing." |
| Young meadow | Sundial | Big old stump by the spring | "It's always teatime somewhere. Usually here." |
| Young meadow | Herb pots by the rain barrel (planted) | Water corner | "Mint, because it will grow anywhere, and thyme, because Hazel insists." |
| Young meadow | Wattle wreath on the door | Door | "Golden and smelling of honey. It changes with the seasons." |
| Young meadow | Plank over the spring trickle | Spring path | "So nobody has to hop." |
| Young woodland | Hammock | Between the oak and the big stump | "Built for one. Used by two." |
| Young woodland | Snail-shell wind chime | Under the eaves | "Every shell was empty when they found it. They checked." |
| Young woodland | A name board over the door | Door | "The house needs a name." Named by Bryce 2026-10-27: The Gnomestead. |
| Young woodland | Moss cushion on the bench | Bench | "Softer. Greener. Slightly damp." |
| Young woodland | Welcome sign *(already a job: `sign`)* | Where the yard meets the village path | "All Creatures Welcome. Please Wipe Paws." |

## The couple's garden (tile 0,1): 14 makes

Opens at first green. The bigger garden jobs (second bed, compost, pond, bee house, nest box, leaf pile, berry bush) stay as proper jobs.

| Stage | Make | Where | Line in Jobs |
| --- | --- | --- | --- |
| First green | Stepping stones into the garden | Track from the yard | "Flat stones, a gnome's stride apart. Wendel's stride." |
| First green | A little wicket gate | Where yard meets garden | "Not to keep anyone out. Just to have a gate." |
| First green | Pebble ring round the mouse house | Mouse house corner | "So the mice have a front garden too." |
| First green | A sitting stone | Middle of the garden | "Warm by noon. Hazel's thinking spot." |
| First green | Wildflower patch (planted; folds in `wildflowers`) | Garden edges | "Not in rows. Wildflowers choose their own places." |
| Young meadow | Flower border along the path (planted) | Path edges | "Foxgloves at the back, daisies at the front, a wiggle in the middle." |
| Young meadow | Sweet-pea arch (planted) | Garden entrance | "Bent willow and sweet peas. Smells like summer." |
| Young meadow | A tiny mouse-sized table and stools | By the mouse house | "Wendel made them from acorn cups. The mice approve." |
| Young meadow | Stone frog | Pond edge | "It doesn't croak. The real frog is unimpressed." |
| Young meadow | Bird dish on a post | Creature corner | "A saucer of dew up high, out of the rabbit's reach." |
| Young woodland | Mossy log bench | Under the trees | "An old log, a lot of moss, room for two and a rabbit." |
| Young woodland | Fern corner (planted) | Shady back corner | "Ferns like the dark and the damp. So does Gerald." |
| Young woodland | Willow seat for two | Looking over the pond | "Woven by Hazel. Sat in mostly by Wendel." |
| Young woodland | A painted pebble path to the creature corner | Creature corner path | "Every pebble painted with a different animal. One is a snail." |

## Everywhere else (later)

The same rule works on every other tile; each gets its own short list when its spots are planned in the pencil-sketch chat: neighbours' gardens (makes that suit the owner: Mabel's bread-oven bench, Clem's lavender row, the Fernsby twins' tree swing), path verges (milestones, a bench at a bend, a bird box on a post), stream banks (a fishing stool, reeds, a stepping-stone ford, a bench by the water), wild corners (only planted things: ferns, a fallen log left for the beetles).

**Still Bryce's to choose, whenever:** makes to add, swap or drop; a name for the house.
