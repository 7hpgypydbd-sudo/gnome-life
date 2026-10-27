# Crops art: the seed bed's real vegetables (written 2026-10-27, thread "Grow real crops in the seed bed")

Six pictures for the next art day. Until they are painted the game draws tidy stand-ins in code (`drawCrop` and friends in index.html), so nothing waits on them.

Rules (same as every art day): nothing glows; hidden snail where it says; flat magenta #FF00FF behind cut-outs; a new Gemini chat per picture; paste the reference first. Reference for size and view: `sprites/stonebench.webp` (the gentle slanted view from above and to the front) and a gnome sprite (`sprites/him-side` sheet) so the plants come out gnome-sized: a full carrot top reaches about a gnome's knee, a ripe pumpkin is nearly as big as Wendel.

**How the game will use them:** one plant is drawn at each of the ~30 spots spread evenly over the oval bed (no rows of squares), so every crop sheet is *one single plant* at each growing step, not a whole bed. The game picks the step by how grown the crop is. The pumpkin is one big plant for the whole bed, so its sheet is leaves and three pumpkin sizes.

Style paragraph (the same in every prompt): *Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.*

## crop-carrot: carrots in four steps (+ the two-legged carrot)

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Five separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, each sitting on its own small crumb of dark dug soil: 1) a tiny two-leaf seedling just up; 2) a young carrot plant with a few short feathery fern-like fronds; 3) a full carrot top, a fountain of fine feathery fronds; 4) the same full top with the round orange shoulder of a carrot just showing at the soil; 5) one small crooked carrot pulled out of the ground, very orange, with its feathery top, forking at the bottom into two little legs. Real carrot foliage, finely divided like parsley, soft greens. Avoid pink and purple anywhere.
```

Cut/wire: `cut_kit.py` -> `sprites/crop-carrot-1..4.webp` (one per step), `sprites/carrot-legs.webp` (for story page 2.1 and the pick float).

## crop-lettuce: lettuces in four steps (hidden snail)

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Four separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, each on its own small crumb of dark dug soil: 1) a tiny two-leaf seedling; 2) a small loose rosette of soft round leaves; 3) a bigger open lettuce, ruffled leaf edges; 4) a full round butterhead lettuce, darker green outer leaves curling open around a pale crinkled heart. Hidden detail: a tiny brown snail on an outer leaf of the full lettuce. Avoid pink and purple anywhere.
```

Cut/wire: -> `sprites/crop-lettuce-1..4.webp`.

## crop-bean: bean plants in four steps

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Four separate pieces in one row, evenly spaced with wide clear magenta gaps, seen from a gentle slanted view from above and to the front, each on its own small crumb of dark dug soil: 1) a bean seedling, two thick round seed leaves; 2) a young bean plant with a few heart-shaped leaves and one curly tendril; 3) a taller leafy runner bean plant twining up a single thin twig; 4) the same plant fully grown with small white-and-cream flowers and three or four long slim green bean pods hanging down. Avoid pink and purple anywhere.
```

Cut/wire: -> `sprites/crop-bean-1..4.webp`.

## bean-poles: the bean-pole wigwam, bare and grown over

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Two separate pieces side by side with a wide clear magenta gap, seen from a gentle slanted view from above and to the front: on the left, a small wigwam of four thin rough sticks with the bark on, pushed into the soil and tied at the top with a twist of pale twine, about as tall as a gnome; on the right, the same wigwam covered in a twining runner bean vine, heart-shaped leaves all the way up, small cream flowers and long slim green pods hanging down. Hidden detail: a ladybird on one pod. Avoid pink and purple anywhere.
```

Cut/wire: -> `sprites/beanpoles.webp`, `sprites/beanpoles-grown.webp` (the game cross-fades between them as the beans grow; three stand along the back of the bed).

## crop-pumpkin: Wendel's pumpkin

```text
Generate an image: A wide 16:9 picture. Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Six separate pieces with wide clear magenta gaps, seen from a gentle slanted view from above and to the front: top row, three clumps of big rough pumpkin leaves on a short trailing vine (one plain, one with a yellow trumpet flower, one with a curly tendril); bottom row, three pumpkins lying on their sides on a bit of vine: a small hard green one, a half-ripe one turning from green to orange, and a big ripe deep-orange pumpkin with deep ribs and a thick curly stalk, wide and squat, about as big as a gnome. Hidden detail: a tiny snail on top of the big pumpkin. Avoid pink and purple anywhere.
```

Cut/wire: -> `sprites/pumpkin-leaf-1..3.webp`, `sprites/pumpkin-1..3.webp` (leaves are placed along the code-drawn vine; the pumpkin grows through the three sizes).

## icons-pantry: four pantry icons

Paste first: `sprites/icon-seed.webp` and `sprites/icon-berry.webp` (to match the pick-up icon style and size)

```text
Generate an image: Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame. Four small icons in one row, evenly spaced with wide clear magenta gaps, painted exactly like the pasted icons (same size, same style, same cream paper-cut edge): a bunch of three carrots with their feathery tops; a round butterhead lettuce; a little bundle of three green bean pods tied with twine; a small squat orange pumpkin with a curly stalk. Avoid pink and purple anywhere.
```

Cut/wire: `cut_tiles_icons.py` -> `sprites/icon-carrot.webp`, `icon-lettuce.webp`, `icon-bean.webp`, `icon-pumpkin.webp` (the game already looks for `icon-<kind>` and falls back to the emoji).
