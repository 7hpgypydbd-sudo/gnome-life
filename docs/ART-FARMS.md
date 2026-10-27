# Farm art: the neighbours' farms and the platypus (written 2026-10-27, thread "Build the neighbours' farms and the platypus")

Pictures for a future art day. Until they are painted, v60 draws stand-ins in code (`FARM_PLANT`, `FARM_EDGE`, `FARM_PROP` in index.html; the platypus in `drawPlatypus`), so nothing waits on them. Wiring a painting in is a small job on the art day: each stand-in draw function gets a "use the painting if there is one" line, like the bare-tile pictures.

Rules (same as every art day): nothing glows (Juniper's moonflowers are pale, not lit); a hidden snail where it says; flat magenta #FF00FF behind cut-outs; a new Gemini chat per picture; paste the reference first (`sprites/stonebench.webp` for the view, a gnome sprite for size: a gnome is about knee-high to a fence post). Farms are small: a whole farm fits beside a gnome home, and a plant is about the size of a gnome's hat or smaller (fruit trees and willows a little taller than a gnome when grown).

Style paragraph (the same in every prompt): *Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.*

Every farm sheet is the same layout: **four separate plants in one row** with wide clear magenta gaps, each on its own small crumb of soil, seen from a gentle slanted view from above and to the front: 1) just planted, 2) coming up, 3) grown, 4) full (in flower or in fruit). Then a small extra piece where it says.

## 1. farm-herbs: Mabel's herb and rhubarb patch (hidden snail)
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Eight separate pieces in two rows with wide clear magenta gaps, each on a small crumb of dark soil, gentle slanted view from above: top row, a clump of garden thyme and sage growing in four stages (a few sprigs; a small clump; a full rounded clump; the same clump in tiny pale flowers); bottom row, a rhubarb plant in four stages (a red knobbly crown; small crinkled leaves on red stalks; big crinkled leaves on long red stalks; huge umbrella leaves with thick red stalks). Hidden detail: a tiny snail on the biggest rhubarb leaf. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-herb-1..4.webp`, `farm-rhubarb-1..4.webp`.

## 2. farm-willow: Tobias's willow bed
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Five separate pieces in one row with wide clear magenta gaps: a willow stool in four stages (a bare willow stick pushed into wet earth; the stick sprouting small narrow leaves; a fountain of long whippy wands with narrow green leaves, taller than a garden gnome; the same with soft pale catkins), and 5) the same stool just cut back to short stumps, with a bundle of cut wands tied with twine lying beside it. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-willow-1..4.webp`, `farm-willow-cut.webp`.

## 3. farm-veg: the Fernsbys' veg patch and the twins' scarecrow (hidden snail)
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Separate pieces with wide clear magenta gaps, each on a small crumb of dark soil: a cabbage in three sizes; a pea vine climbing a single stick, small then full with pods; a low strawberry plant, small then with red berries; a few radishes with leafy tops and pink shoulders showing; and a small scarecrow on a pole made by children, which looks a little like a gnome: a too-big blue coat, a tall red pointed hat, a straw beard and button eyes, straw poking out of the cuffs. Hidden detail: a tiny snail on the scarecrow's arm. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-cabbage-1..3.webp`, `farm-peas-1..2.webp`, `farm-straw-1..2.webp`, `farm-radish.webp`, `farm-scarecrow.webp`.

## 4. farm-orchard: the Pebbleworths' fruit trees
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Five separate pieces in one row with wide clear magenta gaps: a young fruit tree in four stages (a thin whip tied to a stake; a small tree in leaf with its stake; a young tree a little taller than a garden gnome covered in white blossom; the same tree heavy with red apples), and 5) an old wooden orchard ladder, narrow and a little crooked, leaning on nothing. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-fruit-1..4.webp` (pear and plum by tinting the fruit), `farm-ladder.webp`.

## 5. farm-lavender: Clem's lavender
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Five separate pieces in one row with wide clear magenta gaps: a lavender bush in four stages (a tiny grey-green cutting; a small rounded grey-green bush; a rounded bush with a few blue-violet flower spikes; a full bush covered in blue-violet spikes with two small bees), and 5) a small bottlebrush shrub with red brush flowers. Paint the lavender flowers a soft blue-violet, never pink, so it cuts cleanly from the magenta.
```
Cut/wire: -> `sprites/farm-lavender-1..4.webp`, `farm-bottlebrush.webp` (cut this sheet by hand: the violet sits close to the magenta).

## 6. farm-wheat: Barnaby's wheat
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Five separate pieces in one row with wide clear magenta gaps, each a small clump of wheat on a crumb of soil, at the scale of a garden gnome's knee: 1) a fuzz of green shoots; 2) green blades knee-high to a gnome; 3) green wheat with heads forming; 4) golden ripe wheat with nodding heads; 5) short pale stubble with two little upright sheaves tied with straw. Add a few paper daisies at the foot of the ripe clump. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-wheat-1..4.webp`, `farm-wheat-cut.webp`.

## 7. farm-flax: Nettle's dye garden
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Separate pieces with wide clear magenta gaps: a small clump of flax in three stages (fine green shoots; tall thin stems; tall stems with small pale sky-blue flowers); a woad plant (a leafy rosette, then tall with clusters of tiny yellow flowers); a weld plant (a tall slender yellow-green flower spike); and a small native indigo bush (Indigofera australis) with sprays of small pea flowers in soft blue-violet and a little blue butterfly on it. Avoid pink anywhere.
```
Cut/wire: -> `sprites/farm-flax-1..3.webp`, `farm-woad-1..2.webp`, `farm-weld.webp`, `farm-indigo.webp`.

## 8. farm-moon: Juniper's moonflowers (hidden snail)
```text
Generate an image: A wide 16:9 picture. [Style paragraph]. Separate pieces with wide clear magenta gaps: a short rustic trellis of thin sticks tied with twine; a moonflower vine climbing a single stick in three stages (small; climbing with heart-shaped leaves and long twisted pale buds; the same vine with big round white flowers wide open, as at dusk, pale cream but NOT glowing, no light coming from them); a clump of evening primroses with pale yellow flowers open. Hidden detail: a tiny snail on the trellis. Avoid pink and purple anywhere.
```
Cut/wire: -> `sprites/farm-trellis.webp`, `farm-moon-1..2.webp`, `farm-moon-open.webp`, `farm-primrose.webp`.

## 9. The platypus
Already on the healing list (`docs/ART-HEALING.md` picture 3, `vis-platypus`): only its back, flat tail and duck bill showing, with a few ripples. It is now built (v60): the painting slots straight in with no code change (art slot `vis-platypus`). A journal portrait for it would be nice too: *a platypus at the surface of a quiet creek at dawn, mist on the water, reeds, one ripple ring* -> `sprites/portrait-platypus.webp`.

## Small things that can stay as code
The dug beds, the frog puddle (it reuses the pond picture), the clover, sedges and lemon myrtle hedge can stay as code stand-ins unless Bryce wants them painted.
