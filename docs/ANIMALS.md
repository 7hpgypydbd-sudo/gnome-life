# The animals' side stories (written 2026-10-27)

**Words revised 2026-10-28** (thread "Rewrite the story prose"): the final words of every beat now live in `content.js` (`animals.beats`); the drafts quoted in the tables below are the earlier versions. Side-by-side: https://claude.ai/artifact/5hT9CR9KAn79MLw9kYnDZz .

Design doc, no code yet. Written for Bryce and for the build chat that wires it. The tone is the storybook's: warm, small, a little funny, and nobody is ever in real danger. This sits beside `STORY.md` (Wendel and Hazel's marriage) and `DECORATIONS.md` (the little makes). The animals' stories are the second thread of the game; the first is the couple.

## Tone rule (Bryce, 2026-10-27)

Wendel is gentle, caring and understanding, like David the gnome in nature: a dreamer who notices small things and is kind to every creature. He is never stubborn, grumpy or the cause of trouble. Any conflict between the couple comes from a good-natured misunderstanding or an outside event, and both of them are kind throughout. Use this for every future revision, here and in `STORY.md`.

## The pattern every animal follows

The concept review fixed one five-beat pattern. Steps 1-4 are already built for most animals; step 5 is the new part this doc supplies.

1. **First visit and greeting card.** Built (tap the creature).
2. **A little trouble you fix.** Built for 11 creatures (`trouble` in `content.js`).
3. **Becomes a regular** (fed on 3 different days). Built.
4. **Moves in** to a home the gnomes made (fed on 6 days, or the make is built). Built for some. **This is the only beat that greens the land (+1).**
5. **A closing page.** NEW. A short storybook page in the Journal ("Our story" tab, same look as `STORY.md` pages, one hidden snail), plus a **doorstep gift** (below).

Rules of thumb for every story here:
- Spread over **real days**, never all in one visit. If a beat is due while the player is away, it waits and shows in "While you were away", then opens as a card on return (same as page 1.5).
- Nothing is lost for good. A raid costs a few sprouts, never the harvest. Nobody is hurt, scared away or sad at the end.
- One beat per visit at most, so there is always a small surprise tomorrow.
- The closing page gives **0 green**. Building gives 0. Only the creature moving in greens.
- Cards use the creature's portrait, one short paragraph, and one button in Wendel and Hazel's voices. No named pets: Wendel and Hazel say "the rabbit", "the hedgehog".

## The doorstep gift (one small system for all closing pages)

After an animal's closing page, one **gift** appears on the doorstep the next morning: a single tappable cream-edged keepsake with its own tiny line, once per animal, kept in the Journal under "Gifts". Each gives one small thing (a seed, a feather, a wisp of light) and nothing more, so it never swamps the economy. It is the animal's thank-you and a reason to look at the doorstep.

| Animal | Gift | Line | Gives |
|---|---|---|---|
| Rabbit | A dandelion clock | "Left very carefully, so as not to blow it." | 3 seeds |
| Field mouse | A tiny shiny button | "Hazel has decided it is a plate." | 1 light |
| Tawny owl | A single feather | "Not a word. Just the feather." | 1 feather |
| Hedgehog | An acorn cap of dried berries | "Saved for winter, then shared anyway." | 2 berries |
| Robin | A red thread end | "Hazel's own colour, frayed from the nest." | 1 moss |
| Fairy-wren | A blue tail-feather | "One. He has plenty." | 1 feather |
| Green tree frog | A pebble worn smooth | "From the bottom of the pond. It sang while it brought it." | 1 stone |
| Blue-tongue | A shed, perfect leaf skin | "Do not ask." | 1 moss |

(The other creatures get a gift only if Bryce wants more later; see the maybe pile.)

---

## 1. The rabbit: "that rabbit"

The cheeky foil. Wendel is worried about his seedlings and Hazel sees first that it is hungry; both soften together, and it ends as a family. **Chapter 1 to a full year.**

**Already built:** R1 it empties the dish (day 2-3), R2 it nibbles a few sprouts, R3 the fence appears. Later visits: peers through the fence, naps by the woodpile, pinches a berry. Page 1.5 "The thief" is written and live.

| Beat | When | What the player sees | Card or toast text |
|---|---|---|---|
| **R4 The truce** (new) | After the fence is built and the rabbit has eaten from the dish on 3 different days | The rabbit now sits politely at the gate, nose twitching, instead of testing the fence. The sprout nibbling stops for good. It still naps and pinches a berry now and then. | Toast: *"The rabbit sat by the gate for an hour, perfectly good. Wendel is keeping an eye on it. Wendel has also put the stick away and made it a little seat by the gate."* |
| **R5 A hole of its own** (new) | After the garden tile opens, the truce is made, and the player builds the garden make **"Heap a soft earth bank"** (creature corner, Wendel, 40 min, 2 stones + 1 moss, 0 green) | A little mound of loose earth by the garden's creature corner. Two nights later the rabbit has dug a burrow into it: a round dark door with a few crumbs of soil. It **moves in (+1 green)**. | Card, button "Welcome home": *Hazel patted the earth bank flat for the third time and said it was a bit much. Wendel said a rabbit should have a proper home, and patted it flat a fourth time. In the morning there was a round door in the side of it, and the sound of someone very pleased with themselves, thumping.* |
| **R6 Rabbit's row** (new, optional make) | Garden, any stage after R5 | Hazel sows a little clover strip outside the fence "so it stops asking". Rabbits sometimes graze it at dawn. | Make blurb: *"Clover for the rabbit's side of the fence. Peace costs three seeds."* |
| **R7 Four small noses** (the closing page) | The first **spring morning** (southern spring, September to November by the phone's date) once the burrow is at least 3 weeks old. If the burrow is older when spring comes, it fires on the first spring visit. | Dawn. A row of four tiny baby rabbits sits along the inside of the garden fence with their noses through the gaps, looking at the vegetables. The mother rabbit sits behind them looking pleased and ashamed. The babies stay as small regulars (up to three on screen), hopping and napping in a heap. | **Page "Four small noses"**, button "Not the lettuce": *Wendel counted them twice. Hazel counted them once and put the kettle on. "They'll want something," she said. "We'll plant extra," said Wendel, beaming. The smallest of the four had a dandelion seed stuck on one ear and did not know. It was the best morning of the spring.* Then the gift appears next day. |

**Small touches (Bryce loves these):**
- One baby always has a dandelion seed on its ear. It stays there in every later sighting. Tap that baby: *"Still wearing it."*
- If the player has fed the rabbit on 10+ days, once in winter the rabbit's burrow door has a tiny frost-flower wreath someone made. (Nobody knows who. It was the mouse children.)
- The rabbit naps on the bench if the gnomes are not using it in the evening.
- Gerald the woodpile beetle looks away when the rabbit naps on the woodpile.

---

## 2. The field mouse family: "tenants"

The mouse is the first neighbour the gnomes make, by accident. **From the first week to midwinter.**

**Already built:** M1 first visit, M2 head stuck in a loggers' bottle (fixed), M3 regular, M4 moves into the walked toadstool and its washing line appears (page 3.3, `flags.miceIn`, +1 green, "Welcome to the toadstool").

One thing to fix in the build: the mouse's `nest:'burrow'` in `content.js` would give it a hole before the toadstool. It should **not** nest until the toadstool is a house; the toadstool is its home.

| Beat | When | What the player sees | Card or toast text |
|---|---|---|---|
| **M5 The mouse door** (new) | The mouse children get through the fence (3-5 days after M4), at the first sprout or harvest | Small mice slip through the gaps. Wendel patches the gap with sticks, a little apologetically; next day there is another. On the third patch, a tiny **hinged flap** (a mouse door, a bit of bark on a leather hinge) appears low in the fence, and the mice use it. Make: **"Cut a mouse door in the fence"** (Wendel, 20 min, 1 twig, 0 green). | Toast: *Wendel patched the fence three times, saying sorry to the gap each time. On the fourth morning, Hazel cut a small door in it herself, and Wendel held the bark flap while she tied the hinge. "Rent," she said.* |
| **M6 One sock** (new) | A week after M4 | Wendel looks for a sock (the single detail: he stands scratching his head by the clothesline). A close look at the toadstool window shows a small grey cloth: his sock, as a hammock and curtain. | Toast: *"Have you seen my other sock?" said Wendel. Hazel did not look up. "Leave it," she said.* |
| **M7 The button** (closing page) | A cold winter dusk (southern winter) at least 2 weeks after M4, or the first winter evening | The toadstool window glows, lit by a tiny lamp, and a thread of smoke from a cap-sized chimney. Three little silhouettes in the window. | **Page "The window with the sock in it"**, button "Goodnight, tenants": *It was the first really cold night, and the toadstool had a light in it. Through the window, three small mice and one grey sock. Wendel stood with his hands in his pockets for a long time. "It's a good sock," he said. "It's doing very well." The next morning on the doorstep, someone had left a single button.* Gift next day. |

**Touches:** The tiny washing line grows one more item each time the player returns after a rainy day (a sock, a bonnet, a leaf). The smallest mouse sits in the mouse door at dusk and watches the owl, who watches back. Tapping the toadstool in winter shows a tiny "Please do not knock" sign.

---

## 3. The tawny owl: "says nothing"

The silent watcher. It never makes a sound until one winter night. **A slow arc, spanning weeks to the big oak.**

**Already built:** O1 it appears at night on the woodpile ("Says nothing"). It has no trouble and eats nothing, so it is not on the dish chain; it is a landmark.

| Beat | When | What the player sees | Card or toast text |
|---|---|---|---|
| **O2 Company** (new) | Several nights in a row where it visits and the gnomes are by the fire | When the gnomes sit on the bench in the evening, the owl is on the woodpile, head turned to watch them, and they both stay a little quiet. | Toast, one of three: *Wendel gave the owl a nod. The owl gave him nothing.* / *"He's looking at me again," said Wendel. "He's looking at the fire," said Hazel.* / *Hazel says it is good company if you do not ask it for conversation.* |
| **O3 It likes the sapling** (new) | After the sapling is planted (v54 job) | The owl now sits on the sapling's stake on its night visits, looking down at it, and comes more often (higher weight). | Toast: *The owl has taken to inspecting the little oak. It has not yet written a report.* |
| **O4 An owl box** (new make) | The oak reaches its big-shade stage (the oak plan's 4th look, with the owl perch). Make **"Hang an owl box in the oak"** (Wendel, 3 hours, 4 twigs + 2 moss + 1 feather, 0 green) | A wooden box with a round hole appears among the oak's branches, near the perch. Two nights later the owl **moves in (+1 green)**: the perch is occupied by day, and it is asleep, a round fluffy shape in the hole. | Card, button "Sleep well": *Wendel hung the box just so. The owl looked at it for three nights. On the fourth, it was in it, fast asleep and as round as a cushion. "That," said Hazel, "is a tenant who knows what they want."* |
| **O5 Hoo** (closing page) | On a winter night after O4, when it is well after midnight (the gnomes have a rare late-night bench scene) | Wendel has stayed out stargazing and dozed on the bench; Hazel comes out with a blanket and sits beside him. The owl turns its head and says its first and only word, once. | **Page "Hoo"**, button "Goodnight, owl": *Wendel had meant to come in an hour ago. Hazel came out with a blanket instead, and sat beside him, and neither of them said anything for a long time. Above them, in the oak, the owl opened one eye. "Hoo," it said, very quietly, and shut it again. It was the only thing it ever said, and it said it just right.* Gift (a feather) next day. |

**Touches (hidden):** A tawny frogmouth, pretending to be a broken branch, sits in the oak from the big stage. The player can find it: tapping the "branch" makes it blink once. The owl and the frogmouth never acknowledge each other. In winter the owl box has a snow cap.

---

## 4. The hedgehog: "the leaf coat"

The hedgehog's trouble is secretly its story. **From the first dusk to spring.**

**Already built:** H1 snuffles at dusk along the fence line, H2 trouble (dry leaves stuck on its spines), H3 regular (berries), H4 the leaf-pile shelter make, then it moves in (+1 green).

| Beat | When | What the player sees | Card or toast text |
|---|---|---|---|
| **H5 It was shopping** (new, card on the first autumn dusk after H4, southern autumn is March to May) | The first autumn after it moves in | At dusk the hedgehog comes up the path wearing a **thick coat of dry leaves** on its spines, trundles into the shelter and shakes them off into a neat heap. Repeats a few nights. | **Card (page)**, button "Of course": *"That wasn't stuck at all," said Hazel. "It was shopping." Wendel remembered picking those leaves off, very carefully, in the dusk. "I took its groceries," he said, stricken, and put a berry in the dish by way of an apology.* |
| **H6 Do not disturb** (new) | The first winter after H5 | The hedgehog stops coming. The shelter has a small bark sign leaning at the door that Wendel made: "ASLEEP". Tapping the shelter shows a card; the journal shows "Asleep until spring". | Card: *Wendel made a sign in his best handwriting. It said ASLEEP. Hazel said that was obvious from the snoring, and then helped him paint a small leaf on it.* |
| **H7 Thin and cross** (closing page) | The first warm spring morning | The hedgehog stumbles out of the leaf shelter, thin and sleepy, and walks straight to the feeding dish at a very early hour. It eats everything. Then it sits in the sun with its eyes shut. | **Page "Thin and cross"**, button "Eat up": *It came out at six in the morning, thin as a stick with a prickle on it, and went directly to the dish without so much as a good morning. Hazel filled it twice. Wendel took down the sign, dusted it and kept it. "For next year," he said.* Gift (acorn cap of berries) next day. |

---

## 5. The other creatures: short arcs

Everyone in the roster gets one small beat 5, so none of them are only a card. Short ones, one line of card text each. Most use the doorstep gift. Each is a one-visit moment, tiny.

| Creature | Beat 5 (closing) | Where | Gift |
|---|---|---|---|
| **Robin** (nest in the yard) | *"Hazel's red thread turned up in the nest, woven in very neatly. She said that was a compliment."* In spring two chicks peep from the nest, mouths wide. | First spring after it nests | Red thread end |
| **Fairy-wren** (birdbath, nest) | *"It bathed for ten minutes, then sang, then bathed again. Wendel says it is practising."* In spring, a pair of wrens, the male bright blue, the female brown, crosses the yard together. | First spring after it nests | Blue tail feather |
| **Green tree frog** (pond) | *"It sings off-key and with total confidence. Wendel has started to hum along. Hazel hums back when he isn't listening."* After rain the frog is louder, and a second small voice answers. | Rainy night after the pond has been in 2 weeks | Smooth pebble |
| **Blue-tongue** (doorstep, stones) | *"It sunbathed on the doorstep so long that Hazel just stepped over it. Then Wendel did. Then the postie-gnome did."* A shed skin lies perfect on the doorstep one morning. | After moving in under the stones | Shed skin |
| **Possum** (woodpile) | The trouble (too proud to climb down) becomes a running gag: after, it comes down the twig ladder frontwards every time, very slowly. | Any night after helped | none |
| **Bandicoot** (burrow) | *"Every cone-shaped hole was a favour. The lawn is the best-aerated in the valley."* | After moving in | none |
| **Echidna** | Tin pops off; later it walks past the fence with an air of having done something clever. | After helped | none |
| **Kookaburra** | Laughs at the fence at dawn; the first morning the fence has a rabbit nose through it, it laughs twice as hard. | If the rabbit has babies (R7) | none |
| **Native bee** (bee house) | Moves into the log house, and the herb corner buzzes. Hazel: "Good for the beans." | After moving in | none |
| **Glow-worm** | Waits under the fern; on the festival eve it joins the lights. | Festival | none |

The Wood spirit and will-o'-wisp are not animals; they keep their roles in `STORY.md`.

---

## 6. How it fits the greening rule

Only creatures moving into gnome-made homes green the land: the **rabbit's earth bank** (burrow), the **mouse toadstool** (already counted), the **owl box**, the hedgehog's leaf-pile (already counted), plus the nests already built. Closing pages and gifts give 0 green. Total new green: **+2** (burrow, owl box). The mouse door, clover strip, sign and gifts add 0.

## 7a. Built in v63 (2026-10-27, thread "Build the animals' side stories into the game")

All in `content.js` `animals` (words, gifts, beats) and `game.js` `animalTick` (rules); pictures are code stand-ins in `index.html` until painted.
- **Beats** (`CONTENT.animals.beats`): one a day at most. Each waits for its moment (`when`: a job done, a creature moved in, days since, a season, an hour), sets `flags.<beat id>`, and opens as a small card with the animal's portrait or as a storybook page (`kind:'page'`, painting slot `page-a-<id>`). Beats that come while you are away wait and open when you are back. Read them again in the Journal under "Our story", "The animals' stories".
- **Rabbit:** the truce comes after the fence, once the rabbit has eaten at the dish on 3 different days (it now eats seed or berries on its visits, and sometimes while you are away). Then it sits politely at the gate (Bryce: no stool for it). Garden make "Heap a soft earth bank" (2 stones + 1 moss) -> two days later the burrow (painted `nest-burrow`), **+1 green to the garden**, card "A hole of its own"; the mother sits by her door by day. Make "Sow a clover strip" (3 seeds). In spring, 3 weeks on, at dawn-to-morning: page "Four small noses", Hazel names her **Clover** (`rabbitName`, Bryce to confirm), three babies by the burrow by day (one with a dandelion seed on its ear: tap it, "Still wearing it."). Gift next morning.
- **Mice:** no more burrow of their own (the toadstool is their home). 3 days after moving in: card "A gap in the fence" and the yard make "Cut a mouse door in the fence" (1 twig) -> bark flap on the fence, card "Rent". A week in: card "One sock", and Wendel's grey sock hangs as a hammock between two grass stalks in front of the mouse house, with the littlest baby mouse asleep in it, ears out of the cuff (tap it). Bryce: a gnome's sock is far too small for a grown mouse, so only the littlest baby uses it. Bryce found a sock in the tiny window too small to see, so it moved outside; in winter it goes indoors as the littlest one's sleeping bag. A winter evening, 2 weeks in: page "The window with the sock in it"; on winter evenings after that the window is lit (warm colour, no glow) with a clay-pipe chimney and a thread of smoke. Tap the toadstool in winter: "Please do not knock."
- **Owl:** after the sapling is planted it perches on the little oak at night (card "The inspector"); when the gnomes are on the bench it gets one of the three "company" lines. Make "Put up an owl box by the oak" (yard, young woodland, 4 twigs + 2 moss + 1 feather; a tall post beside the oak until the oak's bigger looks exist) -> two days later it moves in, **+1 green**, card "An owl box"; asleep in the hole by day, perched on the box at night, snow cap in winter. Winter, after 11 pm: page "Hoo".
- **Hedgehog:** the leaf pile now shows once it has moved in (moved to an open spot right of the fence). First autumn dusk: page "It was shopping", and in autumn it wears its leaf coat. Winter: card "Do not disturb", ASLEEP sign at the pile and it stops visiting. Spring morning: page "Thin and cross".
- **Lyrebird:** new rare winter visitor (young meadow on, emoji stand-in). Bryce: copying the hammer is hard to show, so instead it does its real display: it scratches a little stage, throws its harp tail over its head and dances (one line a visit); once met in winter: card "The dance" and a tail-feather gift.
- **Short closing cards with gifts:** robin (spring, nest), fairy-wren (spring, nest), frog (night, pond 2 weeks), blue-tongue (lives in the stones).
- **Doorstep gifts:** the morning after a closing beat a keepsake (bigger pick-up) lies just in front of the door; tap it for its card. Kept in the Journal under "Gifts".
- **Test panel:** "Skip to the next animal beat" (ignores season and hour, finishes what it waits on).
- **Not built:** the platypus (the farms chat has it), the kookaburra / possum / echidna / bandicoot / bee / glow-worm one-liners, the frogmouth hidden find, frost wreath, rabbit napping on the bench, the family-tree page, the late-night "Hoo" bench scene in the yard (the page text carries it).

## 7. What the build chat needs

Flags to add (all new, all in `game.js` state): `flags.rabbitTruce`, `flags.rabbitBurrow`, `flags.rabbitBabies`, `flags.mouseDoor`, `flags.mouseSock`, `flags.owlBox`, `flags.owlHoo`, `flags.hogShopping`, `flags.hogAsleep`, and one list `gifts` (animal id -> opened). New jobs/makes: Heap a soft earth bank (garden), Sow a clover strip (garden), Cut a mouse door in the fence (yard), Hang an owl box in the oak (yard). Each plays through the existing `s.pages.cards` queue so pages open one at a time. Season checks use the phone's date (southern hemisphere), as the seasons already do. The doorstep gift is one new pick-up type with `inked()`. Test panel: add "Skip to next animal beat". Beats are not in a hurry: the earliest closing page is the hedgehog's first autumn, the rabbit's babies the first spring after the burrow.

## 8. Accepted extras (Bryce, 2026-10-27: "The lyrebird, rabbit and platypus ideas are all good")

These are in, to be written into beats and wired by the build chat. The remaining items are still a maybe pile.
- **IN: the lyrebird** (new Australian visitor, winter, in the meadow stage): it mimics Wendel's hammering and his humming. On a quiet night it hums his tune back. Nice with the "no sound yet" rule, because the text does the work. Needs one new creature portrait and sprite.
- **IN: the rabbit gets a name** at the babies page (Hazel names it; Wendel refuses to use it).
- **IN: platypus at the stream**, only after the stream heals, shy; the one creature that never moves in, just passes by in the dawn.
- **A visitor's family tree** page in the Journal: who is whose parent (the rabbit babies, the mouse children, the wren pair).
- **More gifts** for the "none" creatures above.

**First-draft beats for the three extras:**
- **Lyrebird** (winter, meadow stage, a rare visitor): it perches on the fence and copies the hammering, then Wendel's hum, a beat late. Hazel hears her own name in it. Card: *Wendel hummed three notes to see what would happen. Three notes came back. He tried a fourth. The lyrebird improved it.* Closing: it leaves one long tail feather on the doorstep (gift, 1 feather).
- **Rabbit's name** (on the "Four small noses" page): Hazel proposes a name; Wendel loves it at once and uses it ever after. Bryce to pick the name.
- **Platypus** (after the stream heals, dawn only, very rare): it glides past the stream tile and dives; the journal says *"Seen once. Will not be rushed."* It never moves in, never eats from the dish, and gives no gift; its page is one line in the Journal. Greens nothing.

## 9. Pictures needed (also in `docs/PLAN.md`)

New art for these stories. Each page painting is a storybook scene with a hidden snail, like the `STORY.md` pages. Prompts to be written when Bryce says yes.

| # | Picture | Used for |
|---|---|---|
| 1 | Rabbit at the gate: polite sitting pose (and burrow mound with round door) | R4, R5 |
| 2 | Four baby rabbits in a row, noses through the fence (sheet of 4 poses, one with a dandelion seed on its ear) | R7 |
| 3 | Page: "Four small noses" | R7 |
| 4 | Mouse door in the fence prop; toadstool window variants (sock curtain, lit window, chimney smoke) | M5-M7 |
| 5 | Page: "The window with the sock in it" | M7 |
| 6 | Owl box in the big oak; owl asleep in the box; owl on the sapling stake | O3, O4 |
| 7 | Tawny frogmouth as a branch in the oak (hidden find) | O4 touch |
| 8 | Page: "Hoo" (Wendel asleep on the bench, Hazel with a blanket, owl above) | O5 |
| 9 | Hedgehog in a leaf coat; "ASLEEP" sign on the leaf shelter | H5, H6 |
| 10 | Page: "Thin and cross" and page: "It was shopping" (two small pages) | H5, H7 |
| 11 | Eight gift icons on cream paper-cut edges (dandelion clock, button, feather, acorn cap, red thread, blue feather, pebble, shed skin) | Doorstep gifts |
| 12 | Lyrebird (perched, tail up) with portrait; platypus in the stream with portrait | Section 8 |

**Slot names (v63):** pages `page-a-rabbitBabies`, `page-a-mouseWinter`, `page-a-owlHoo`, `page-a-hogShopping`, `page-a-hogSpring`; creatures `vis-lyrebird`, `portrait-lyrebird`; makes `make-earthbank`, `make-clover`, `make-mousedoor`, `make-owlbox`. Each drops in as a webp with that name in `sprites/` and replaces its stand-in; the rest (babies, sock window, owl asleep, leaf coat, ASLEEP sign, gift icons) still need small code changes when painted.
| 13 | Robin chicks in the nest; wren pair; frog pair (three small portrait redos) | Section 5 |
