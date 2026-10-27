# Healing art: the bare tiles (written 2026-10-27, thread "Build the healing jobs for the bare tiles")

Pictures for a future art day. Until they are painted, v57 draws tidy stand-ins in code (`HEAL_DRAW` in index.html) or reuses pieces we already have (the loggers' leftovers, stumps and rocks, woodland ferns and reeds, the creature sprites), so nothing waits on them. Wiring each painting in is a small job on the art day: swap the `draw:` stand-in in `HEAL_LOOK` for `pic:'<name>'`.

Rules (same as every art day): nothing glows; a hidden snail where it says; flat magenta #FF00FF behind cut-outs; a new Gemini chat per picture; paste the reference first (`sprites/stonebench.webp` for the view, a gnome sprite for size: a gnome is about knee-high to a fence post).

Style paragraph (the same in every prompt): *Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.*

## 1. heal-saplings: gum and wattle saplings in three sizes, plus a stick guard

```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Seven separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, each standing on its own small crumb of soil: 1) a tiny eucalyptus seedling with four grey-green leaves; 2) a knee-high young gum, thin pale trunk, a few drooping grey-green leaves; 3) a young gum tree a little taller than a garden gnome, smooth pale cream-and-grey bark, drooping sickle-shaped leaves; 4) a tiny wattle seedling, feathery leaves; 5) a knee-high wattle bush, soft feathery green; 6) a young wattle tree taller than a gnome, dark trunk, feathery green leaves with fluffy golden flower balls; 7) a ring of four thin rough sticks pushed into the ground and tied with twine, as a tree guard (empty in the middle). Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/heal-gum-1..3.webp`, `heal-wattle-1..3.webp`, `heal-guard.webp`; replace `HEAL_DRAW.tree`.

## 2. heal-deadtree: the old dead tree, plain and lived-in (hidden snail)

```text
Generate an image: [Style paragraph]. Two separate pieces side by side with a wide clear magenta gap: a tall dead eucalyptus tree, silver-grey weathered wood, bark long gone, a few bare twisting limbs, a dark round hollow halfway up, roots gripping cracked dry earth. On the left the tree alone; on the right the same tree with a small wooden nest box pegged under the hollow, a brushtail possum peeping out of the hollow, and a tiny brass door-knocker beside the hollow. Hidden detail: a tiny snail on a root. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/heal-deadtree.webp`, `heal-deadtree-home.webp`; replace `HEAL_DRAW.deadtree`.

## 3. heal-critters: wombat, heron, platypus

```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Four separate animals in one row with wide clear magenta gaps, side view, naturalistic Australian animals drawn gently: 1) a round, solid, sleepy common wombat standing; 2) the same wombat curled up asleep; 3) a white-faced heron standing on one leg, grey and very still; 4) a platypus swimming at the surface, only its back, flat tail and duck bill showing, with a few ripples. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/vis-wombat.webp`, `vis-wombat-sleep.webp`, `vis-heron.webp`, `vis-platypus.webp` (the platypus is for the last creek stretch at dawn, not built yet).

## 4. heal-homes: small things the gnomes build for the creatures (hidden snail)

```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Six separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, gnome-sized: 1) a flat sunny stone with a shallow clay dish of water on it (a bee stone); 2) a little stone bird bath, a hollowed stone on a short stone pillar, full of water; 3) a small wooden bird box with a mossy roof on top of an old fence post; 4) a forked stick pushed into a creek bank, leaning out over nothing (a kingfisher perch); 5) a flat stone dish of seeds sitting on a low sawn stump; 6) a low dry-stone wall of round grey stones, about five stones long. Hidden detail: a tiny snail on the bee stone. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/heal-beestone.webp`, `heal-birdbath.webp`, `heal-birdbox.webp`, `heal-perch.webp`, `heal-seeddish.webp`, `heal-wall.webp`.

## 5. heal-junk: the loggers' old fence and the creek rubbish

```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Five separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front: 1) a short run of old grey split-timber fence, three leaning posts with sagging rusty wire; 2) the same, one post snapped and fallen; 3) an old wooden cart wheel lying flat, a spoke missing; 4) a broken tin bucket on its side; 5) a small heap of dug-out earth and stones (a fallen-in creek bank). Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/heal-fence-1..2.webp`, `heal-wheel.webp`, `heal-bucket.webp`, `heal-slump.webp`.

## 6. heal-nursery: the nursery shelf with pots, three ways

```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Three separate pieces in one row with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, gnome-sized: a rough plank shelf resting on two short stumps, with four small terracotta pots on it. 1) the pots empty; 2) the pots full of dark soil, one gumnut on top of each; 3) a small seedling in every pot (gum, wattle, gum, banksia). Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/heal-shelf-1..3.webp`; replace `shelfItem`.

## 7. heal-toss: tossing seed balls (both gnomes)

Painted like the other action strips (4 frames each, facing right, same size as `her-pickup`): Hazel and Wendel each tossing a seed ball from a cupped hand, underarm, a few little brown balls in the air. Stand-in today: the pick-up strip. -> `sprites/her-toss.png`, `him-toss.png` and an `act:'toss'` in content.js.

## 8. Wood spirit teaching poses (4)

The Wood spirit (paste `sprites/vis-spirit.webp`) blowing a seed ball along on its breath (Ask the wind), holding up a small grey cloud like a lantern (Call a rain cloud), cupping a seed and whispering to it (Wake a sleeping seed), humming over a trickle of water (Sing the water on). -> `sprites/spirit-wind.webp`, `spirit-cloud.webp`, `spirit-seed.webp`, `spirit-sing.webp` for the lesson cards.

Also still on the list from the plan: an "in between" painted ground for each kind of tile is NOT needed now: the blended ground greens point by point by itself.
