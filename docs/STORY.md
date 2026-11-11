# Gnome Life: the first month's story (chapters 1-3)

Agreed by Bryce 2026-10-26 (thread "Write the first month's story"). Living copy for reading and comments: https://claude.ai/artifact/HUoQHsALfrq6PHMzn1mkT9 . This file is the master for the words; code takes them from here. **Words rewritten 2026-10-28** (thread "Rewrite the story prose": warmer storybook voice, clearer player role, Wendel gentle throughout; every page id, trigger and unlock unchanged; side-by-side at https://claude.ai/artifact/5hT9CR9KAn79MLw9kYnDZz ). The Wood spirit now calls the player "old heart". **Wired into the game in v52** (see docs/PLAN.md, v52 entry); the "Fitting it into the game" section at the end is what was built.

- **Story pages** are the big illustrated pages that open at a milestone. Each is short and ends with one button.
- **Every page fires from something the player already does** in the job chain (see "Where every card appears").
- **Each chapter opens with a small title** above its first page ("Chapter one: The bare clearing").
- **The thread through all three chapters** is the two of them learning to make a home together, with one gentle wobble per chapter: the rabbit, the leaky roof, and the argument about the house.
- **Setting:** an Australian hill clearing. Gum trees, wattle, magpies at dawn, a kookaburra who laughs at everything.

## Before chapter one: the welcome screen (2026-10-28)

**v87 (2026-11-11):** cut to about 60 words and three one-line tips (fresh-eyes review: three long screens before the first touch). The words below are the older, longer version; `CONTENT.welcome` in content.js holds the live ones. The Wood spirit's hello is now a short line in its paper strip, not a window.

*Opens the very first time the game starts, before page 1.1, so a new player (Bryce's mum, say) knows what this is and who they are. Words in `CONTENT.welcome`; the screen itself is drawn in index.html by the play-notes chat.*

**Welcome to Gnome Life**

This is a little storybook that grows a page at a time, a little more each day you visit.

It is about two gnomes, Wendel and Hazel. They have just been married, and they have come to live on a bare hillside where the loggers cut down every tree. Over many days they will dig and plant and build, and slowly turn it back into a green, cosy home, and one day a whole village.

<b>And you?</b> You are the heart of the wood: the old spirit of this hillside, gone quiet since the loggers came, and woken a little at a time by the gnomes' care. They can't see you, but they feel you whenever things go their way. They do all the work; you gather what the land leaves lying about, and choose what they do next.

**How to play**
- 👆 <b>Swipe</b> to look around. <b>Pinch</b> to zoom in close.
- ✨ <b>Tap the little things lying about</b> (twigs, stones, seeds). A breath of your magic carries them to the gnomes' store (🧺 Store).
- 🔨 <b>Jobs shows what they can do next.</b> If you are ever unsure what to do, look in Jobs. A dot on it means a job is ready to start.
- 👀 <b>Tap anything</b>, the gnomes included, to see what it is.
- 🕰️ <b>Jobs take real time.</b> Start one, put your phone down, and come back later. A short visit or two a day is plenty.
- 🌿 <b>There is no hurry</b>, and nothing can go wrong. Nothing dies and nobody loses.

**Button:** Open the story

After page 1.1 closes, a small pointer: "Wendel and Hazel are waiting to start. Open 🔨 Jobs to see what they can do first."

## Chapter one: The bare clearing (day one, told over three mornings)

They arrive, find water, gather a woodpile for their first real fire, and plant their first seeds. The wobble is the rabbit. **v87 (2026-11-11, fresh-eyes review "one page a morning"):** everything in chapter one happens on day one, so its five pages are cut to three: 1.1 at the welcome, then 1.3 and 1.5 on the next two mornings, each about the day before. The old 1.2 (the spring) is folded into 1.3, and the old 1.4 (planting) into 1.5; their paintings stay in `sprites/` unused.

### 1.1 The end of the road
*Opens the very first time the game is played, straight after the welcome screen. Cut to about 150 words in v87.*

They came up the old logging track at the end of a long, hot afternoon, Wendel pulling their little wagon and Hazel beside it with the little oak in its pot. Everything they owned was in that wagon, and most of it was pots.

The clearing at the top was not what the pedlar had promised. The loggers had taken every tree but the stumps and left their rubbish behind. Nothing grew, and not one bird was singing.

Wendel looked at it all for a long while. "Well," he said gently. "It's got a lovely view."

"It's got us now, too," said Hazel. She set the little oak down by the biggest stump, and before dark the wagon was a little shelter under its roots. Not much of a house. But theirs.

This hill had a heart once, the old spirit of the wood. When the loggers came it went quiet, deep under the stumps. That evening, as two small gnomes made camp, it stirred, just enough to notice them. That heart is you.

**Button:** Let's begin

### 1.3 Water, and a fire
*The morning after "Gather the fallen sticks" is done (so usually day two). Painting: the first fire (page-1-3).*

Their first whole day on the hill began with water, because nothing lives without it. Wendel walked the clearing with a forked twig held out in front of him, eyes half shut, the way his grandfather had taught him, and Hazel walked softly behind, because dowsing wants quiet.

Between the roots of an old stump, the twig gave a twitch. "There," he whispered. The spring was choked with stones and dead leaves, and he pulled them out one by one until a thread of clear water came up, cold as a secret. Deep under the hill, something old turned over in its sleep. That was you.

By evening there was a woodpile too, every fallen stick in the clearing stacked bark side up, the way his grandfather used to. Hazel quietly laid the fire, because she knew how much he had been looking forward to it. A beetle came out of the woodpile to see what the fuss was about. Wendel bowed to him and named him Gerald.

"I had a speech," said Wendel, patting his pockets. "I think it's with my pipe." Hazel took the pipe out of her apron, where it had been since the bottom of the hill. He looked at the fire, and the first stars, and at her. "We're here," he said. That was the whole speech, and Hazel said it was the best one she had ever heard.

**Button:** What a first day

### 1.5 Rows, wiggles and a thief
*The morning after page 1.3 (its moment, the rabbit's raid on the first sprouts, comes on day one). Painting: the thief (page-1-5). The last paragraph changes once the fence is built.*

On planting day Hazel opened the seed tin her mother had given her: carrots, beans, a pinch of lettuce, and one enormous pumpkin seed. Wendel put that one in his top pocket. "For something special," he said.

"Rows," said Hazel, drawing a straight line in the soil. "Wiggles," said Wendel, drawing a curly one. So they planted in rows with one wiggle at the end, and both of them were happy, which is how most marriages work.

Then somebody got into the seed bed: somebody with long ears, a white tail and no manners at all.

*(If flag:rabbitDish:)* The feeding dish was licked clean, and three sprouts were nibbled down to nothing.

Three of the little sprouts were nibbled down to nothing.

Hazel had seen it from the shelter: a rabbit as thin as a rake, chewing as fast as it could in case someone took the sprout away. "Poor thing's starving, love," she said. "Same as we were when we got here."

*(If fence:)* "Then we'll share," said Wendel. So he built a little fence round the bed, with a gate, and they put something out for the rabbit, and asked it, nicely, to leave the carrots for them.

"Then we'll share," said Wendel at once. "A little fence round the bed, with a gate. We'll put something out for the rabbit, and just ask it, nicely, to leave the carrots for us."

**Button:** Fair's fair

## Chapter two: Putting down roots (weeks 1 to 2)

The first harvest, a proper roof, a bench for two and the little oak in the ground. The wobble is a wet night under a leaky canvas.

### 2.1 Supper from our own ground
*Opens at the first harvest from the seed bed. This is the moment the home jobs unlock. Until the crops chat brings real vegetables, the harvest is still "sprouts" in the game; the page can go in as it is and match once carrots arrive.*

The first carrots came out of the ground small and crooked and very, very orange. One of them had two legs. Wendel held it up and said it looked like him. Hazel said it was better looking.

They washed them in the spring and ate them by the fire with a pinch of salt. Nothing had ever tasted so good, because nothing had ever been so much their own. And where the carrots had grown, the soil was a little darker than before, as if it had learned something.

Wendel put the carrot tops aside for the rabbit. Hazel licked her fingers and looked over at the old canvas shelter, which sagged in the middle like a tired hammock.

"Now then," she said. "About that roof."

**Button:** About that roof

### 2.2 The night it rained
*Opens when "Moss for the shelter roof" is finished.*

It rained the night before the new roof was finished. Not a gentle rain: a proper hill rain, sideways and cheerful, that found every hole in the old canvas and came through all of them at once.

They ended up squashed together in the one dry corner under Hazel's shawl, with every pot they owned set out to catch the drips. Plink, went the pots. Plonk. Plink.

"This is the worst night of our marriage," said Wendel.

"It's the only night of our marriage under this roof," said Hazel. "Give it time." And then they were both laughing too hard to hear the drips. Out in the dark, the thirsty ground drank every drop.

In the morning Hazel laid the moss on thick, green and springy, and Wendel handed it up to her a piece at a time. The shelter has not leaked since. They keep one pot by the door anyway, for luck.

**Button:** Snug at last

### 2.3 Room for two
*Opens when "Build a bench by the fire" is finished.*

All afternoon Wendel had been busy behind the woodpile, and every time Hazel came near he said it was "nothing, just a stick thing, go away".

It was a bench: one good plank on two stout legs, set by the fire, just long enough for two gnomes if they did not mind sitting close.

She sat on it. It wobbled. He wedged a flat stone under one leg. It stopped wobbling.

"Do you like it?" he asked, a little anxiously.

"No," said Hazel. That is what she says when she likes something so much she cannot talk about it, and Wendel knew it. He sat down beside her, and they stayed there until the fire was only embers and Gerald had gone to bed.

**Button:** Shuffle up

### 2.4 The little oak
*Opens when "Plant the sapling out" is finished.*

The little oak had come a long way in its pot. Hazel had picked up the acorn by the roadside on the morning they were married, carried it in her pocket all day, and planted it that night in a teacup.

Now, at last, it went into real ground at the front corner of the yard. Hazel dug the hole and set it in, Wendel brought spring water in the can, and then they knelt and patted the soil down round it, both together.

"It'll outlive us," said Wendel softly.

"That's the idea," said Hazel. "One day some other gnome will sit under it and wonder who planted it."

"We could carve our names on it."

"Not on the tree, love," said Hazel. "It's got enough to do." But she let him scratch a very small W and H on the empty pot, and he has kept it ever since.

**Button:** Grow tall

### 2.5 Our first week
*Opens the morning after 2.4 (v87: it no longer waits for seven days, since one page a morning already spreads the story; with a quick player it comes on about day eight; the first line is now 'Our first week, or near enough.' instead of 'Seven days.'). A page from Hazel's journal, with Wendel's notes squeezed into the margin. Any line about something not done yet is left out.*

**Our first week, in Hazel's handwriting**

Seven days. We have a roof (moss, no leaks). *(once the roof is on)* We have a fire every night (Wendel chopped the old stump into firewood, he is very proud of it). *(once the old stump is chopped for firewood)* We have a spring we found ourselves (Wendel found it, he would like that written down). *(once the spring is found)* We have a seed bed, and we have eaten from it. *(once the bed is dug)* We have a fence, and a rabbit who thinks the fence is a suggestion. *(once the fence is up)*

And the land is waking. There's a haze of green at the edges now. Wendel says he can smell it coming, like rain.

I think somebody is helping us. Things turn up just where we need them: twigs by the door, stones by the bed, dew in the morning. Wendel says it's the hill itself, waking up. I don't know who you are, or what you are. But thank you.

*In the margin, in Wendel's:* Best week of my life. Lost my pipe four times. Found it in her apron four times.

**Button:** Turn the page

## Chapter three: A proper home (weeks 2 to 4)

The garden next door opens, the toadstool walks off and the mice move in, and the old stump becomes a house. The wobble is their first real disagreement, about the house.

### 3.0 A house for winter (the stump house quest)
*Opens the first time "Hollow out the old stump" can be started (usually week two, so often before 3.1). It starts a quest, "A proper home", shown at the top of the Journal with four steps that tick off as they are done.*

*(In spring and summer, by the phone's date:)* It was a grey morning, the first in weeks. Not cold, just damp enough that the canvas sagged and dripped. Wendel's cold toes found Hazel's under the blanket, and she let them stay.

*(Otherwise:)* It was the first cold morning. Not very cold: just enough that Hazel's breath made a little cloud in the air. Wendel's cold toes found hers under the blanket, and she let them stay.

Hazel sat up and looked at the drooping canvas, and the moss roof, and the big old stump the shelter leaned against.

"Wendel," she said. "That stump is hollow."

"Mm," said Wendel, mostly asleep.

*(In winter:)* "A stump that size could be a house. A real one, with a door and windows and a chimney. Before this winter gets any colder."

*(Otherwise:)* "A stump that size could be a house. A real one, with a door and windows and a chimney. Before the winter comes."

Wendel sat up so fast he took the whole blanket with him. He had been waiting all his life for someone to say those words, and he already knew where the round windows would go.

**The quest: A proper home**
- [ ] Hollow out the old stump
- [ ] Fit a plank wall and windows
- [ ] Raise the roof and chimney
- [ ] Move in (page 3.5)

**Button:** Let's build a house

### 3.1 Next door
*Opens when the land next door on the left (the couple's garden, tile 0,1) turns green.*

Hazel stood at the edge of the yard with her hands on her hips, looking at the patch of land next door. A week ago it had been grey and bare. Now it was, very definitely, green.

"A garden," she said. "A real one. Flowers along the path. A corner for the creatures. Somewhere to sit that isn't next to your woodpile."

"What's wrong with my woodpile?"

"Gerald lives in it."

There was just one problem. Right in the middle of her garden stood the biggest, reddest, most settled toadstool either of them had ever seen. Hazel gave it a careful tug. Wendel gave it a polite push. It did not so much as wobble.

"Sorry, old fellow," said Wendel, patting its cap. "We don't mean to be rude. It's only that you're right where the roses want to go."

Neither of them saw what drifted out of the trees just then, soft and green as new leaves, and settled beside the toadstool as if it had been waiting for this very moment. But you did.

**Button:** Hello there

### 3.2 The toadstool takes a walk
*Opens when the toadstool has finished walking to the garden's far corner, after the player casts "Give the toadstool legs".*

It isn't every day you see a toadstool get up.

First it shivered. Then four knobbly root legs wriggled out from under its cap, tested the ground one at a time, and stood it up with a creak. It looked about, the way you do when you have slept too long. Then off it went, wobble, wobble, wobble, to the far corner of the garden, where it sat down with a sigh of deep content.

Wendel's pipe fell out of his mouth. Hazel picked it up and put it back without looking.

"Did you do that?" Wendel whispered.

"No," said Hazel. She looked round at the empty air, the way you look for someone who has just stepped out of the room, and she smiled. "There's something about this place," she said. "Something old and kind. I think the hill likes us."

It was you, of course. But we won't tell them.

**Button:** Just a little magic

### 3.3 Somebody's moved in
*Opens the day after the toadstool's little door and window appear, when the mouse family moves in (`flags.miceIn`). If the field mouse was never helped out of the bottle, the second paragraph starts "A field mouse who had been watching from the long grass" instead.*

On the morning after the toadstool grew its little door, there was a tiny line of washing strung between its stalk and a blade of grass.

*(If the field mouse was helped out of the bottle:)* The field mouse they had once helped out of a bottle had moved in, and brought her family: one husband, very polite, and three small mice who had already found their way into the seed bed. Hazel let them off, the first time.

*(Otherwise:)* A field mouse who had been watching from the long grass had moved in, and brought her family: one husband, very polite, and three small mice who had already found their way into the seed bed. Hazel let them off, the first time.

"Our first neighbours!" said Wendel, delighted, and went straight off to find them a crumb of carrot.

"Our first tenants," said Hazel. "They can pay their rent in being sweet." They are very good at it.

And here is a thing worth knowing: wherever a creature makes its home, the land takes heart. By lunchtime the grass round the toadstool was greener than anywhere else in the garden.

**Button:** Welcome home, mice

### 3.4 Big plans
*Opens when "Hollow out the old stump" is finished.*

The old stump was hollow now, with room inside for a bed, a hearth and a table. Wendel had drawn up the plans. There were a great many of them.

There was a tower, for looking at the stars. A round room at the top with a telescope. A workbench in the kitchen, "so I can be near you, love", with all his bits and pieces on the shelf where the plates should go.

Hazel looked at the plans for a long time. Then she said, "No." It was not her happy no.

Wendel looked at the plans again, and then at her face, and understood. "You wanted somewhere for us," he said quietly. "Not somewhere for my bits and pieces." They ate supper without saying much, but it was a thinking sort of quiet, not a cross one.

In the morning she found him outside already, drawing again. This time it was a little lean-to against the side of the house, all his own: a workbench, a hook for every tool, and a small window that looked at the stars.

"Your bits and pieces can live in there," said Hazel, and kissed the top of his head. "And the spare room stays spare."

"What's it for?"

"You never know," said Hazel.

**Button:** Back to work

### 3.5 Over the threshold
*Opens when "Raise the roof and chimney" is finished and the stump house is done. Closes chapter three; the first traveller follows as now.*

The last shingle went on at sunset. The chimney drew on the very first try. The round windows glowed gold.

Wendel wanted to do it properly. He scooped Hazel up at the doorstep, took one grand step, caught his toe on the doorstep he had laid himself, and they both went through the door in a heap. They lay on the new floor and laughed until they cried.

"Welcome home, my love," said Wendel, from somewhere underneath her skirts.

"Welcome home, you great lump," said Hazel.

Neither of them had noticed the little board over the door yet. Hazel had painted it in her best lettering: THE GNOMESTEAD, with a tiny snail underneath, taking the last letter very slowly.

That night, for the first time, they slept under a real roof in a real house, on a hillside that was learning to be green again. And far down the old track, a small lantern was bobbing up the hill. Somebody else was coming.

**Button:** The end of chapter three

## The Wood spirit's lessons

The Wood spirit comes five times in the first month, once each time the player's magic grows, and teaches one new thing on a greeting card (small card size, not a full story page). Its one big lesson, repeated gently each time: **magic is for asking, not pushing**; it only helps what is already trying to live. It floats beside the thing it is teaching about until tapped. The gnomes cannot see it, though Hazel sometimes looks right at it.

Whichever lesson comes first gets this opening line: *"Something soft and green drifts out of the trees, like a handful of new leaves that forgot to fall. It turns and looks straight at you, as if it has always known you were there. The gnomes can't see it. But you can."*

### Lesson one: Coax a sprout (second day of visits, magic level 2)
*It floats over the seed bed.*

"Hello again, old heart. I've been watching you help them. The glimmers you gather, the dew and the wisps, are light, and light is your magic. It can't make anything grow. Nothing can. But it can whisper to a seed that is already trying, and tell it to hurry, because somebody is hungry."

**New in your magic:** Coax a sprout.

### Lesson two: Call soft rain (third day, magic level 3)
*It floats over the spring pool.*

"The clouds pass over this hill without stopping. They think nothing lives here any more. Ask them nicely to look down, and they might. But never ask for a storm, old heart. A garden wants a drink, not a bath."

**New in your magic:** Call soft rain.

### Lesson three: Give the toadstool legs (when the garden opens)
*It floats round the big toadstool. Replaces the v50 card text.*

"Big, isn't he? And very settled. You could push him all day and he wouldn't mind you one bit. But ask him kindly, give him a little light, and he'll find his own legs. He might even like the corner better."

**New in your magic:** Give the toadstool legs.

### Lesson four: Wake the land (fifth day, magic level 4)
*It floats at the edge of the healed ground, where the land next door is still a pencil sketch (the sketch look comes in a later chat; until then, at the misty edge).*

"See out there, past the garden, where the land is still dark? It isn't dead. It's only asleep, dreaming of what it used to be. When the gnomes have done their part, you can help it wake a little sooner. Only a little. Waking up is not something you rush."

**New in your magic:** Wake the land.

### Lesson five: A bright fire (eighth day, magic level 5)
*It comes at dusk and floats by the campfire.*

"Your light is strong now, old heart, stronger than it has been since the trees came down. There's nothing new to teach you today. Only this: you'll find light in the dark, in wisps and dew, and you'll find it every time you are kind. Help the small ones when they're in trouble. That is the brightest magic there is."

"I'll be about. Whenever this hill needs something new, I'll come and show you."

**No new spell.** The journal gets a Wood spirit page, and the spirit can turn up later to teach any new special spell the same way.

## The land is waking (greening rule)

Only living things bring the land back. Building gives no green on its own, however lovely. Growing things do, and so does a creature moving into a home the gnomes made, because that is life coming back too.

| What happens | Green it brings |
| --- | --- |
| The spring runs again | 1 |
| Each harvest from the seed bed | 1 |
| Window box, herb corner | 1 each |
| Little oak planted, berry bush, wildflowers | 2 each |
| A creature moves into a gnome-made home (nest box, leaf pile, bee house, pond, burrow, the mouse family's toadstool) | 1 each |
| Anything built (fence, bench, roof, lantern, birdbath, compost, house, bridge) | 0 |

Three cards mark the big changes (they replace the `explain` text in `CONTENT.landStages`). Each opens once.

**First green.** You'd have to kneel down to see it: a haze of green over the bare brown earth, so faint that Hazel thought it was her eyes. It isn't. Every living thing the gnomes grow here teaches the soil to grow again. The spring brought the water back, and each crop leaves a little more life behind. Keep things growing, and the green will spread.

**Young meadow.** One morning there was grass round the house. Not a haze any more, but real grass, with clover in it, and the first daisies, and a magpie strutting about as if he had planted it all himself. The ground remembers now. Plant things that stay, like trees and bushes and flowers, and the woods will start to come home.

**Young woodland.** Young trees are coming up all round the yard now, some planted and some that came by themselves, and the little oak has a new crown of leaves. The creatures who left long ago are finding their way back, one by one, following the green. This isn't a clearing any more. It's the beginning of a wood.

**Small notes when a creature moves in** (toast + "While you were away"):
- "The robins have moved into the nest box. The grass by the fence looks greener this morning."
- "Something prickly has moved into the leaf pile. The ground round it is waking up."
- "A frog has moved into the pond, and the land is the better for it."
- "The mice have moved into the toadstool. Wherever someone makes a home, the land takes heart."

## All done for now

*(v64: the gnomes say these to each other. They feel a kindly presence about the place (the heart of the wood) but never see you; only the Wood spirit talks to you. See docs/VISION.md.)*

Once a visit, when both gnomes are busy (or nothing more can be started) and every pick-up lying about has been collected, the visit gently closes: one gnome looks up and says a line, a small paper label reads **All done for now**, and the view eases out a little to show the whole yard. Nothing is locked: chatting, little finds and fiddling stay open. `{time}` is the real time their jobs finish.

**Both busy, daytime**
- Hazel: "That's us busy till about {time}, love. Nothing to do till then but the doing."
- Wendel: "Nothing more to start till about {time}. Then we'll see what we've made."
- Hazel: "Leave it be, Wendel. A watched seed bed never sprouts."

**Nothing more to start (waiting on materials or time)**
- Wendel: "We'll need a few more bits before the next job. The land always leaves something out, if you wait."
- Hazel: "That's all we can do today. It's enough. A little each day, that's the trick."

**Evening**
- Hazel: "Kettle's on, the fire's lit, and we're stopping. Come and sit, love."
- Wendel: "I'm putting my feet up. Don't tell anyone I said that before six."

**Night**
- Hazel, whispering: "He's asleep already. There'll be dew in the morning."
- Wendel, yawning: "Goodnight, valley. Goodnight, Gerald. Goodnight, whatever kind old thing lives here."

**After a big day** (a story page opened this visit)
- Hazel: "What a day. I think we've earned a sit down, love."

## The five tidy-ups, in story words

1. **One yard light (parked for now).** v51 takes out the little fireside lamp stump and shelves "Mend the old lantern", so the first month has no lantern. When a yard light comes back (with the parked lamp posts) it is just one, and lights along the paths are Juniper the lamplighter's gift to the village. The glow-worm lanterns job (`wormlantern`) goes either way.
2. **Wendel's workshop.** *Raise Wendel's workshop lean-to* (appears after page 3.4): "A lean-to of his own against the side of the house, with a hook for every tool and a little window for the stars. His mess lives in here now. Hazel is delighted." The workbench goes inside it once Tobias's planks arrive. The spare room stays spare.
3. **The spring gets a stone ring.** *Ring the spring with stones:* "Flat stones round the spring pool, so the edges don't crumble and the birds have somewhere to stand. Not a well. Wells are for villages." The village well belongs to the Fernsbys.
4. **Real crops.** Carrots first (pages 1.4 and 2.1), then beans, which need *Raise the bean poles*: "For the beans, which have strong opinions about climbing." Wendel's one enormous pumpkin seed waits for the crops chat to give it its moment. Harvests go into the pantry.
5. **Compost.** *Start a compost heap:* "Peelings, leaves and patience. Dug into the seed bed, it makes the soil rich: one extra seed every harvest." The dew pond is fed by a trickle from the spring instead.

## Where every card appears

**v87 (2026-11-11): one page a morning.** A page's moment (below) only puts it in the queue. It opens on the first visit of a LATER day, at most one page a day, so the storybook always tells you about yesterday. The jobs that follow a page wait until it has been read, so the story leads and the fifteen pages take at least fifteen days however fast someone plays; a long break gives one page, not a pile. Pretend player at three visits a day: 1.3 day 2, 1.5 day 3, 2.1 day 4, 2.2 day 5, 2.3 day 6, 2.4 day 7, 2.5 day 8, 3.0 day 9, 3.1 day 12, 3.2 day 13, 3.3 day 14, 3.4 day 15, 3.5 day 16. The side jobs that used to wait for page 2.1 (doorstep, bean poles, washing line, herbs, compost, spring ring) now come with the first harvest itself, so the first days stay busy.

| Moment (puts the page in the queue) | Page (opens the next morning) | What it opens up once read |
| --- | --- | --- |
| Opens the game for the first time | 1.1 (with the welcome, at once) | the first jobs |
| `woodpile` finished | 1.3 Water, and a fire | |
| the rabbit's raid (it always comes for the first sprouts) | 1.5 Rows, wiggles and a thief | |
| first harvest | 2.1 Supper from our own ground | the roof |
| `roof` finished | 2.2 The night it rained | the bench |
| `bench` finished | 2.3 Room for two | the little oak |
| `sapling` finished | 2.4 The little oak | |
| straight after | 2.5 Our first week | |
| straight after | 3.0 A house for winter + quest | the house; the garden patch comes out of the mist |
| the garden patch turns green | 3.1 Next door (spirit lesson three: toadstool) | the creature corner |
| toadstool walk ends | 3.2 The toadstool takes a walk | |
| `flags.miceIn` | 3.3 Somebody's moved in | |
| `house1` finished | 3.4 Big plans | the lean-to |
| `house3` finished | 3.5 Over the threshold | the old track, the first traveller |

**House rules (v87, "a quiet front door"):** at most ONE window a visit, and none in the middle of a visit. The morning page comes first; an animal's beat from an earlier visit may take the window if no page wants it. Land stages, Hazel's lists and the spring no longer open a card: the land changes, a short paper note says so, and the words go into **Hazel's diary** at the top of the Journal (which also holds what used to be the "While you were away" page). Every page is kept in the Journal under **Our story**.

## Paintings and hidden snails

One painting per page for a later Mac art day, storybook style like the festival pages. Until painted, pages show their words on parchment. Every painting hides a snail.

| Page | The painting | Where the snail hides |
| --- | --- | --- |
| 1.1 | The couple at the top of the logging track at sunset, the wheel-less barrow and potted oak, bare stumps below, the runaway wheel bowling off down the hill | Riding on the runaway wheel |
| 1.2 | Kneeling either side of the new little pool between the roots of an old stump (the current picture still has a crate; repaint some day) | Drinking at the edge of the pool |
| 1.3 | On upturned pots by the first fire, stars over the stumps, Gerald on the woodpile | On a log in the woodpile, next to Gerald |
| 1.4 | Planting: Hazel in straight rows, Wendel making his wiggle | Inside the open seed tin |
| 1.5 | The thin rabbit at dawn with a sprout in its mouth, Hazel in the doorway | Under the licked-clean feeding dish |
| 2.1 | Holding up the two-legged carrot by the fire | On a carrot top in the basket |
| 2.2 | Squashed in the dry corner under the shawl, pots everywhere | In one of the drip pots, quite happy |
| 2.3 | On the new bench by the embers, the wedged stone under one leg | On the wedged stone |
| 2.4 | Patting the soil round the oak, the empty pot with W and H | Inside the empty pot |
| 2.5 | A journal page: Hazel's writing, Wendel's margin notes, little pencil sketches | Drawn in the margin by Wendel, labelled "not Gerald" |
| 3.0 | A frosty morning, Hazel sitting up in bed looking at the big stump, Wendel tangled in the blanket | On the stump's bark, by a knot hole |
| 3.1 | Pushing and pulling the great toadstool, the spirit drifting from the trees | On top of the toadstool cap, unbothered |
| 3.2 | The toadstool mid-waddle on root legs, Wendel's pipe falling | Clinging to one of the root legs |
| 3.3 | The toadstool house with its tiny washing line and three small mice | Pegged on the washing line, or so it looks |
| 3.4 | Wendel at dawn drawing the lean-to, tower plans crumpled at his feet | On the crumpled tower plan |
| 3.5 | In a heap just inside the new door, windows glowing, a far lantern on the track | On the doorstep he tripped over |

Also for the art list: two or three more Wood spirit poses (floating, pointing, settling by the fire).

## Cross-check with what is already in the game (2026-10-26)

Checked every page against the jobs, props, creatures and neighbour stories in `content.js` and the v51 changes. What already matches, and what was adjusted:

- **Matches:** Hazel clears the rubbish and Wendel dowses the spring; Gerald the beetle in the woodpile; the canvas shelter that leaks; the bench blurb ("just long enough for two gnomes") and Wendel's line "I'm going to build her a garden bench. I haven't told her."; the little oak carried from their old home; the rabbit's raid line and its later visits; the field mouse's bottle trouble and "keeps a close eye on the seed bed"; the toadstool's four root legs; the round windows of house 2; house 1's blurb ("Wendel insists, a workbench"), which page 3.4 now pays off; Wendel lays the doorstep he trips over; Hazel's mother (Mabel's lost honey-seed cake recipe); they married in a hurry on the road with no feast (Nettle's story and the festival secret), which is why the acorn was picked up by the roadside; the festival's closing words ("two small gnomes and a wheelbarrow"); the magic levels (days 2, 3, 5, 8) and the spells they unlock; light from wisps at night and from good deeds.
- **Round six (2026-10-29):** they now arrive with a little wagon; a wheel rolls off down the hill, and that night they take the wagon apart (wheel and floor = door and walls under the big stump, canvas top = first roof, the pots came off it). The 1.1 picture still shows a barrow (repaint some day).
- **Adjusted (earlier):** they arrive with the old wheelbarrow but its wheel rolls off down the hill, so it fits the later job "Make a little wheelbarrow" (new blurb: "The old one lost its wheel on the hill. This one is smaller, and mostly for Hazel's flowers."); the seed tin was given "the day they set off", not on the wedding morning (they married on the road); the bench takes "all afternoon", not two days (the job is an hour); the oak goes "at the front corner of the yard" (its yard-plan spot); page 1.2 waits for an evening visit so the stars are out; page 1.5 opens right after the raid, any time of day; in 3.1 the gnomes do not see the Wood spirit, only you do; the yard lantern is out of the first month (v51 shelves it with the fireside lamp stump).
- **Note for the v51 thread:** the tawny owl's journal line says it "watches from the lantern post", which goes in v51.
- **Window box** now comes after the house (v51); nothing in the story depends on it earlier.

## Fitting it into the game (code to change, for the merge chat)

- **Story pages:** a `CONTENT.story.pages` table (id, chapter, title, text, button, trigger) and a small queue in game.js that fires them from the triggers above; reuse the existing story-page sheet (`openStory`); an **Our story** list in the Journal; chapter titles above the first page of each chapter.
- **1.1** replaces the top of the current welcome sheet; the "How it works" tips stay after it.
- **Stump house quest:** page 3.0 plus a quest card at the top of the Journal with the four steps ticking off (`house1`, `house2`, `house3`, moved in).
- **Wood spirit:** appears by the bed / spring / sketched edge / fire on the day magic levels 2-5 are reached (any hour), tap = lesson card; v50's toadstool card text replaced by lesson three; first-meeting line on whichever comes first; a journal page.
- **Greening:** set `green:0` on birdbath, nestbox, beehive, hedgehoghouse, compost, pond, bridge (and the festival jobs); add +1 green when a creature moves into a gnome-made home (nests from regulars, pond frog, bee house bee, mouse family, later the rabbit's burrow); new `explain` texts for the three land stages; move-in notes.
- **All done for now:** detect both gnomes busy (or nothing startable) and no pick-ups out; once per visit; line by time of day; paper label; ease the camera out.
- **Tidy-ups:** drop `wormlantern`; new `barrow` blurb above; rename `leanto` to "Raise Wendel's workshop lean-to" at the yard-plan spot 0.15, 0.20, needs `house1`, `workbench` needs it; new "Ring the spring with stones" job; `pond` needs `spring` not `compost`; compost +1 seed per harvest; new job blurbs above. Real crops themselves belong to the crops chat.
