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

> **v71 (2026-10-28, thread "Design the decorations and item economy"):** the old track got its own six makes, every neighbour has three "wishes" for their own home, the house is dressed for each season, and the gnomes' store has shelves. Design page: https://claude.ai/artifact/NzJj9MVP2uTiBFCb9XVSGm . Bryce chose: the neighbours make their own wishes (Hazel takes the basket over); shelves hold 40 of each land find and 20 of each neighbour's gift. See "The item economy (v71)" at the end.

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
| Young woodland | Snail-shell wind chime | Under the eaves | "Every shell was empty when they found it. They checked." (v71: 2 stones, 3 feathers) |
| Young woodland | A name board over the door | Door | "The house needs a name." Named by Bryce 2026-10-27: The Gnomestead. |
| Young woodland | Moss cushion on the bench | Bench | "Softer. Greener. Slightly damp." (v71: 5 moss, 3 feathers) |
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
| Young woodland | A painted pebble path to the creature corner | Creature corner path | "Every pebble painted with a different animal. One is a snail." (v71: 5 stones, 4 berries) |

## Everywhere else (later)

The same rule works on every other tile; each gets its own short list when its spots are planned in the pencil-sketch chat: neighbours' gardens (makes that suit the owner: Mabel's bread-oven bench, Clem's lavender row, the Fernsby twins' tree swing), path verges (milestones, a bench at a bend, a bird box on a post), stream banks (a fishing stool, reeds, a stepping-stone ford, a bench by the water), wild corners (only planted things: ferns, a fallen log left for the beetles).


## The old track (tile 1,0): 6 makes (v71)

Wendel and Hazel make these themselves, like the yard's. A track never grows to young woodland, so they come at first green and young meadow. Mostly planks, which little else uses.

| Stage | Make | Costs | Line in Jobs |
| --- | --- | --- | --- |
| First green | A signpost at the bend | 2 plank, 2 twig | "Two arms. One says Home. One says Everywhere Else." |
| First green | A milestone | 3 stone, 1 berry | ""The Gnomestead, this way." Painted in berry ink, so it will need doing again." |
| Young meadow | A bench at the bend | 3 plank, 2 moss | "For a rest on the way up the hill. Nobody has to stop. Everybody does." |
| Young meadow | A letterbox on a post | 2 plank, 2 feather | "For notes between neighbours. Hazel checks it twice a day." |
| Young meadow | A village notice board | 3 plank, 1 feather, 1 berry | "Lost: one pencil (Tobias). Found: one pencil (behind Tobias's ear)." |
| Young meadow | A drinking trough for travellers | 4 stone, 4 dew | "For visitors with four legs, or six." |

## Dressing the house for the season (v71)

Once the stump house is finished, each season Hazel's list gets one more (no card; a line in the log). Hazel hangs a garland over the door; it stays up until the next season's, and each one can be made again the next year (game.js `dressTick`).

| Season | Make | Costs | Line |
| --- | --- | --- | --- |
| Spring | Dress the house for spring | 3 seed, 3 dew, 2 moss | A garland of blossom over the door and along the fence posts. It smells of honey and new grass. |
| Summer | Dress the house for summer | 2 yarn, 3 berry, 1 feather (before Nettle: 2 twig, 3 berry, 1 feather) | Bunting of berry-dyed scraps along the fence, and a jar of wildflowers on the step. |
| Autumn | Dress the house for autumn | 3 berry, 3 acorn, 2 twig | Gold leaves and acorns strung over the door. Wendel keeps eating the acorns. They are not that kind. |
| Winter | Dress the house for winter | 4 berry, 2 yarn, 2 moss (before Nettle: 4 berry, 3 moss, 1 feather) | A swag of moss and red berries, with knitted bobbles. Cosy, Hazel says. Itchy, says the robin. |

## The neighbours' wishes (v71): 24 makes, made by the neighbours

Once a neighbour's trade building is up, now and then they wish for a little make for their own home (C.wishes). It shows on their page with a "!" over them when the store can pay; you tap **Send the basket**, Hazel (or Wendel) carries it over, and the neighbour potters at the spot for two hours while it fades in. One wish at a time per neighbour, the next two days after the last is made, at most one new wish in the village every six hours, and the last of each three waits for their patch to be young woodland. A wish only comes when the village already makes everything it costs (no yarn wishes before Nettle). The Journal counts them ("The neighbours' wishes: 6 of 24").

| Neighbour | Wish | Costs | Line |
| --- | --- | --- | --- |
| Mabel | A pie shelf under her window | 2 plank, 3 berry | "For cooling pies. And for Wendel to walk past, slowly." |
| Mabel | A herb wreath on the red door | 2 twig, 2 moss, 2 berry | "Bay and rosemary. Her kitchen smells of it, and now so does her door." |
| Mabel | Flour-sack bunting (young woodland) | 2 yarn, 1 plank | "Old flour sacks cut into flags. Everything smells faintly of bread." |
| Tobias | A sawhorse by his door | 3 plank, 2 twig | "He says it is for work. He mostly sits on it." |
| Tobias | A carved owl on the roof | 2 plank, 1 feather | "To keep the mice honest. The mice are not fooled." |
| Tobias | Offcut wind chimes (young woodland) | 2 plank, 1 yarn | "Little ends of wood on strings. They clonk rather than chime. He likes clonk." |
| Fernsby | A tree swing for the twins | 3 yarn, 1 plank | "One swing, two twins. There is a rota. Nobody follows it." |
| Fernsby | A paddling puddle for the toy boat | 6 dew, 3 stone | "A stone-lined puddle exactly one boat wide." |
| Fernsby | A height chart on the door frame (young woodland) | 2 berry, 1 plank | "Two marks a month, in berry ink. The twins stand on tiptoe." |
| Pebbleworth | A bird table by their chairs | 2 plank, 3 berry | "So they can watch the birds from their chairs, which is the point of chairs." |
| Pebbleworth | A climbing rose up the trunk | 3 seed, 3 dew, 1 moss | "Mags planted it the day they moved in, in her head. Now it is real." |
| Pebbleworth | A knitted rug for Bert's knees (young woodland) | 3 yarn, 2 feather | "Bert says he doesn't need it. Bert never takes it off." |
| Clem | An honesty stall for honey | 3 plank, 2 honey | "Take a pot, leave a button. The bees keep the accounts." |
| Clem | A bee bath | 3 stone, 3 dew | "A saucer of pebbles and water, so no bee goes thirsty or gets its feet wet." |
| Clem | A painted bee on her door (young woodland) | 3 berry, 1 feather | "Painted with a feather. It has five legs. Nobody has told her." |
| Barnaby | A sack barrow | 3 plank, 3 twig | ""Mm. Useful."" |
| Barnaby | A weather vane on the chimney | 1 plank, 2 feather, 1 stone | "A wooden rooster. Barnaby says it is a duck." |
| Barnaby | A bench he says he doesn't need (young woodland) | 3 plank, 3 moss | "He sits on it every evening. "Mm."" |
| Nettle | Yarn round every fence post | 4 yarn | "Every post a different colour. "Disgraceful," she says, proudly." |
| Nettle | A dye pot on three stones | 3 stone, 4 berry | "Berries in, purple out. Mostly onto Nettle." |
| Nettle | A rag rug on the step (young woodland) | 3 yarn, 1 bread | "Woven from scraps. The bread is for the mouse who helped." |
| Juniper | A moonflower patch | 3 seed, 3 dew | "Flowers that open at night, for the moths she misses from home." |
| Juniper | A star chart on her door | 3 berry, 1 feather | "Painted so she can find home in the sky. It is to the left of the big one." |
| Juniper | A honey pot for the moths (young woodland) | 2 honey, 2 stone | "A dish of honey water on a flat stone. The moths come every night." |

## The item economy (v71)

- **Shelves.** The gnomes' store holds 40 of each land find (twig, moss, stone, acorn, dew, berry, feather) and 20 of each neighbour's gift (bread, plank, honey, yarn); Hazel's seed tin 30 and the pantry 12 as before; light has no limit. When a shelf is full the land leaves something else instead, and a neighbour's gift waits (their gift that day is skipped). The store shows "shelf full". (`C.store`, game.js `shelf`, `shelfFull`, `shelfTrim`.)
- **Bread and honey at breakfast:** one honey a day once there is honey (game.js `mealTick`).
- **Pretend player (tools/progression_sim.js, which now also sends the baskets).** Before v71, by day 90 a three-times-a-day player had about 336 berries, 278 twigs, 174 dew, 164 stones, 117 feathers, 92 planks, 80 honey, 64 yarn. After: nothing over 40 (gifts 20), with the 24 wishes all made by about day 63. A twice-a-day player stays under 40 everywhere and is still working through the wishes at day 90; the first month (stones and twigs tight) is unchanged.
- **Next art day:** 34 stand-ins to paint: the 24 wishes (art slot `wish-<id>`), the 6 track makes (`make-<id>`), the 4 garlands (`make-dress_<season>`, drawn over the door). Their slots are not registered yet (no missing-file requests): add them in index.html where `ART_SLOTS['make-' ...]` is set once the pictures exist.

**Still Bryce's to choose, whenever:** makes to add, swap or drop.
