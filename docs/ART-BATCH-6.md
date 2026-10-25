# Art batch 6 — neighbours and the village (written 2026-10-25)

Roadmap step 7 in `PLAN.md`. The game already works without any of these: neighbours are Wendel's or Hazel's painted walk recoloured (new hat and coat colours, grey hair for the old ones), and homes, trade buildings, the bridge, the traveller's tent, the glow jars, the new icons (bread, plank, honey, yarn), the things you look for in a story, and the story pictures are all code-drawn stand-ins. These pictures replace them. Wiring: put the finished pictures (named as below) in one folder and run `python3 tools/slot_in_art.py <folder>`; it keys the magenta, cuts each sheet into its pieces (left to right) and writes the `sprites/` files. No code change. Same Mac workflow as before (Steps.txt + one text file per prompt in `~/Downloads/Gnome Art Day/`), set up when Bryce is ready to paint.

**Order:** paint the three neighbour sheets first and show them to Bryce (they are the neighbours' reference sheets, as the vision asks). Once Bryce likes them, paste them as reference into the home and story chats.

**Reference for the neighbour sheets:** paste the young couple's front walk frames (`docs/art/batch1/walk-him-young-front.jpg` and `walk-her-young-front.jpg`) so the neighbours match Wendel and Hazel. For homes and buildings, paste `sprites/shelter.webp` (the root shelter) and one ground tile (`docs/art/batch1/tile-green.jpg`) for scale and style.

**Rules for the sheets (the cutting tool depends on them):** pieces in ONE row, left to right in the order given, with clear magenta space between them; nothing touching the edges; no ground, shadow or text. Neighbours stand facing the viewer, full body, same size as each other (children smaller). Homes and buildings at the same three-quarter, slightly-from-above angle as the shelter, each on a tiny patch of earth no wider than itself.

| # | File | Pieces, left to right |
|---|---|---|
| 1 | folk-1.jpg | Mabel (baker), Tobias (carpenter), Bert Pebbleworth, Mags Pebbleworth |
| 2 | folk-2.jpg | Rowan Fernsby, Ivy Fernsby, Posy (girl twin), Pip (boy twin) |
| 3 | folk-3.jpg | Clem (beekeeper), Barnaby (miller), Nettle (weaver), Juniper (lamplighter) |
| 4 | homes-1.jpg | Mabel's stump home, Tobias's log home |
| 5 | homes-2.jpg | the Fernsbys' root burrow, the Pebbleworths' hollow tree |
| 6 | homes-3.jpg | Clem's flower-roofed root home, Barnaby's tall stump |
| 7 | homes-4.jpg | Nettle's log with a big window, Juniper's hollow tree with a lamp window |
| 8 | buildings-1.jpg | bread oven, carpenter's workshop, village well |
| 9 | buildings-2.jpg | little orchard, bee skeps, water mill |
| 10 | buildings-3.jpg | loom shed, one glow-jar post, the traveller's tent |
| 11 | bridge.jpg | the plank bridge (one piece) |
| 12 | icons-village.jpg | bread, plank, honey pot, ball of yarn |
| 13 | finds.jpg | recipe scrap, gnome hat in the grass, bee swarm, blue water-flower, stray wisp |
| 14-21 | story-mabel.jpg ... story-juniper.jpg | one landscape painting per neighbour's story (no magenta) |

Sizes on screen come from `ART_SLOTS` in `index.html` (homes 190 wide, buildings 130, bridge 200; neighbours are drawn about as tall as Wendel). Nudge those if one looks wrong. Not needed now: separate round portraits (`face-<id>`), a picture for each "moved in" page (`story-<id>-home`), and walking frames for neighbours (they glide with a gentle bob until then).

---

**Style paragraph** (start of every NEW chat):

```text
Style: traditional children's book illustration like The Secret World of the Gnomes. Fine brown ink outlines with soft watercolour washes, muted earthy colours, cream highlights, naturalistic and gentle, printed-on-paper look. Not clay, not 3D, not cartoon, not vector. Soft light from the upper left. Flat solid magenta background #FF00FF with no shadow, gradient, glow, text or frame.
```

1. `folk-1.jpg` (NEW chat; reference: the couple's front walk frames)

```text
[Style paragraph.] Paint four gnomes in exactly the same style, size and proportions as the pasted gnome couple. One row, left to right, well apart, each standing, full body, facing the viewer, feet on nothing, all the same height: (1) Mabel, a round, rosy-cheeked woman gnome in her forties with flour on her forearms, a red pointed hat, a blue dress and a white apron, a cloth-covered basket of bread on one arm; (2) Tobias, a broad, cheerful man gnome with a bushy brown beard full of sawdust, a blue pointed hat, a brown leather work apron with tools in the pockets; (3) Bert, a very old man gnome with a long white beard, a soft purple-blue hat, a green waistcoat, leaning on a short walking stick, with a twinkle in his eye; (4) Mags, a very old woman gnome with white hair in a bun under a dusty pink hat, a lavender shawl, holding a small red apple. Flat solid magenta background.
```

2. `folk-2.jpg` (same chat)

```text
Same style and size, same layout: four members of one gnome family, standing, full body, facing the viewer: (1) Rowan, a lanky young father gnome with a short brown beard, a green hat, an orange-brown jacket, a forked hazel water-divining stick in one hand; (2) Ivy, a young mother gnome with dark braids, a sky-blue hat and a rose-coloured dress, sleeves rolled up; (3) Posy, a little girl gnome about half their height, yellow hat, purple dress, muddy knees, grinning; (4) Pip, a little boy gnome the same size as Posy, pink hat, green tunic, holding a small frog. Flat solid magenta background.
```

3. `folk-3.jpg` (same chat)

```text
Same style and size, same layout: four more gnomes, standing, full body, facing the viewer, all the same height: (1) Clem, a freckled young woman gnome with a wide straw sun hat over a yellow pointed hat, a honey-coloured dress, a little woven straw beehive under one arm and two bees near her; (2) Barnaby, a tall, quiet man gnome with flour in his eyebrows and beard, an orange-brown hat, a green smock, a sack of grain over one shoulder; (3) Nettle, a thin, sharp-eyed older woman gnome with grey hair, a magenta hat, a teal dress, a tape measure round her neck and a ball of blue yarn; (4) Juniper, a slim girl gnome in her late teens, a deep purple hat, a dark blue cloak, carrying a long pole hung with small glass jars of glowing light (paint the jars glowing softly, but no glow on the background). Flat solid magenta background.
```

4. `homes-1.jpg` (NEW chat; reference: shelter.webp, tile-green.jpg and the approved neighbour sheet)

```text
[Style paragraph.] Two small gnome homes in the same style and three-quarter angle as the pasted root shelter, in one row, well apart, each on a tiny patch of earth no wider than itself: (1) a snug home inside a fat sawn-off tree stump, a wide round red door, one round window, moss on top, a short stone chimney, a little bench by the door (the baker's home); (2) a hollow fallen log lying on its side with a round green door in its cut end, a small window along its side, moss and a fern on top, a tin chimney pipe (the carpenter's home). A gnome is as tall as the door. Flat solid magenta background.
```

5. `homes-2.jpg` (same chat)

```text
Same style, angle and scale, same layout: (1) a roomy family burrow dug under the arching roots of a big tree root, a round golden-yellow door, two small round windows, washing on a little line, a child's toy boat by the door; (2) a home in the hollow of a standing old tree trunk, tall, ivy climbing it, a round green door at the bottom and one round window high up, two little chairs by the door. Flat solid magenta background.
```

6. `homes-3.jpg` (same chat)

```text
Same style, angle and scale, same layout: (1) a cosy root-and-earth home whose turf roof is covered in wildflowers (yellow, pink, white and purple), a round honey-coloured door, two small windows, bees about the flowers; (2) a tall narrow tree stump home with a crooked stone chimney, a round purple door, a narrow window, a sack of grain by the door. Flat solid magenta background.
```

7. `homes-4.jpg` (same chat)

```text
Same style, angle and scale, same layout: (1) a neat hollow log home with a big square window of small panes, a round teal door, a tidy doorstep, a little striped curtain in the window; (2) a slim hollow tree home with a round dark blue door and a round window at the very top with a glass jar of soft light in it (paint the jar glowing a little, no glow on the background). Flat solid magenta background.
```

8. `buildings-1.jpg` (same chat)

```text
Same style, angle and scale, three pieces in one row, well apart, each on a tiny patch of earth: (1) a round clay bread oven on a low stone base, a dark arched mouth with a warm glow inside, a short chimney, a wooden peel leaning against it; (2) an open-sided carpenter's workshop: four posts, a plank roof, a sawhorse, a workbench, tools hanging along the back; (3) a village well: a round stone wall, a little wooden roof on two posts, a rope and a wooden bucket. Flat solid magenta background.
```

9. `buildings-2.jpg` (same chat)

```text
Same style, angle and scale, same layout: (1) a little orchard: four young fruit trees in a loose ring, each tied to a stake, a few red and yellow fruit, mulch around their feet; (2) three woven straw bee skeps on a low wooden bench, a few bees; (3) a small wooden water mill: a little mill house with a turning water wheel on its side and a short wooden water chute. Flat solid magenta background.
```

10. `buildings-3.jpg` (same chat)

```text
Same style, angle and scale, same layout: (1) a small open loom shed: a slanted roof on posts, a wooden loom inside, lengths of blue, gold, red and green cloth hung to dry; (2) one thin wooden post with a crossbar and a glass jar of soft light hanging from it (paint the jar glowing a little, no glow on the background); (3) a small patched canvas tent with a wooden pole, a bundle and a walking stick beside it, its flap open. Flat solid magenta background.
```

11. `bridge.jpg` (same chat)

```text
Same style and angle: one small arched wooden plank bridge with simple handrails, long enough to cross a little stream, seen from the same three-quarter angle, running from lower left to upper right. No water, no ground, just the bridge. Flat solid magenta background.
```

12. `icons-village.jpg` (NEW chat; reference: `docs/art/batch2/icons-pickups.jpg`)

```text
[Style paragraph.] Paint four small item icons in exactly the same style as the pasted icon sheet, one row, left to right, well apart, each centred and filling its quarter: a round loaf of brown bread; a short smooth wooden plank; a small clay pot of golden honey with a wooden dipper; a ball of blue wool yarn. Flat solid magenta background.
```

13. `finds.jpg` (same chat)

```text
Same style, same layout but five pieces: a scrap of old yellowed letter paper with faded handwriting, slightly torn; a tiny red pointed gnome hat poking out of a tuft of long grass; a small hanging cluster of honey bees, like a little swarm on a twig; a small blue water flower with a few leaves; a small round wisp of pale cream-green light with a faint wavy tail (no glow on the background). Flat solid magenta background.
```

14-21. Story pictures (NEW chat; reference: the approved neighbour sheets and the couple's walk frames). Landscape, a soft vignette, NO magenta: these are the illustrated story pages at the end of each neighbour's story. Start each with:

```text
Traditional children's book illustration like The Secret World of the Gnomes: fine brown ink outlines, soft watercolour washes, muted earthy colours, warm and gentle. Landscape picture with a soft cream vignette fading at the edges. Wendel (red hat, brown beard, blue tunic) and Hazel (green hat, auburn braids, green bodice and white apron) are exactly as in the pasted reference.
```

then one of:

- `story-mabel.jpg`: Wendel in a doorway at dusk, sheepishly holding out a lopsided honey-seed cake like a shield; Hazel sitting down on the step with a hand at her mouth, looking at an old handwritten recipe propped beside the cake; Mabel the baker peeking round the corner, beaming.
- `story-tobias.jpg`: evening by the campfire; Hazel rocking in a new wooden rocking chair with one arm slightly longer than the other, holding Wendel's hand as he kneels beside her; firelight.
- `story-fernsby.jpg`: a summer afternoon in long grass; two little gnome twins asleep with jam on their faces; Wendel and Hazel lying on their backs looking at clouds, turned towards each other, smiling.
- `story-pebbleworth.jpg`: night on a grassy rise; Wendel pointing up at one warm low star above a stump house; Hazel beside him looking up; in the background an old gnome couple on a bench, holding hands, politely looking away.
- `story-clem.jpg`: by straw bee skeps in sunshine; Hazel, one hand lightly bandaged, feeding Wendel a spoonful of honey; Clem the beekeeper smiling under her sun hat.
- `story-barnaby.jpg`: outside the stump house; a wheelbarrow of grain sacks; Wendel and Hazel laughing in a cloud of flour they have thrown at each other; tall Barnaby quietly walking away.
- `story-nettle.jpg`: Hazel hugging thin Nettle the weaver, who stands stiffly but is starting to smile; a folded blue-green-gold blanket between them with two tiny gnomes under a tree woven in one corner; Wendel watching, pleased.
- `story-juniper.jpg`: a warm supper table inside the stump house; Hazel, Wendel and young Juniper the lamplighter eating; a glowing jar in the round window; the dark hill outside.
