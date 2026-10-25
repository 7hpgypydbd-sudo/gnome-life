// Gnome Life — content tables. Rules and numbers live here, not in the engine.
// Durations are in minutes of real time (see game.js: #fast divides them).
window.CONTENT = {
  version: 1,
  names: { him:'Wendel', her:'Hazel' },   // the couple (decided 2026-10-25)

  // Real items + one magical resource (light). Emoji are placeholders for painted icons.
  resources: {
    twig:  { name:'twig',  icon:'🪵' },
    moss:  { name:'moss',  icon:'🍃' },
    stone: { name:'stone', icon:'🪨' },
    acorn: { name:'acorn', icon:'🌰' },
    seed:  { name:'seed',  icon:'🌱' },
    water: { name:'dew',   icon:'💧' },
    light: { name:'light', icon:'✨' },
    berry:   { name:'berry',   icon:'🫐', color:'#6a4c8a' },
    feather: { name:'feather', icon:'🪶', color:'#cdbfa3' },
  },

  // What the land offers while you are away. One every offerEvery minutes, at most offerCap lying about.
  offerEvery: 20, offerCap: 8,
  offers: [ // weight by time of day: day / night
    { kind:'twig',  day:5, night:2 },
    { kind:'moss',  day:4, night:2 },
    { kind:'stone', day:3, night:1 },
    { kind:'acorn', day:2, night:1 },
    { kind:'seed',  day:1, night:0 },
    { kind:'water', day:3, night:1 },   // dew, mostly mornings (boosted in code before 10am)
    { kind:'light', day:0, night:5 },   // wisps of light only at night
    { kind:'berry',   day:2, night:0 },  // wild berries, daytime only
    { kind:'feather', day:1, night:1 },  // dropped by passing birds
  ],

  // Crops for the seed bed. plant costs, water starts the clock, harvest gives.
  crops: {
    sprout: { name:'a sprout', plant:{ seed:1 }, grow:180, harvest:{ seed:2, moss:1 }, green:1,
              stages:['planted','growing','ready'] },
  },

  // Gnome tasks: you give the materials, a gnome does it over real time.
  // who: which gnome walks over and works; spot: where (prop name); green: regrowth points for the home tile.
  // act: which painted action loop plays while working (dig, water, carry); if missing, the spot decides (wheelbarrow dig, seed bed and sapling water, otherwise carry).
  tasks: [
    // --- first days ---
    { id:'ruts',    name:'Fill the wheel ruts',        who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:3, twig:2 }, mins:120, green:1, magic:2,
      blurb:'The loggers left deep ruts. Stones and twigs will pack them down.' },
    { id:'clear',   name:'Clear the ground',           who:'her', act:'carry', spot:'clearing', cost:{}, give:{ twig:3, stone:2 }, mins:90, green:0, magic:1,
      blurb:'Snapped branches and loggers\' rubbish everywhere. Hazel rakes a clean patch, and keeps the good sticks and stones.' },
    { id:'bed',     name:'Dig a seed bed',             who:'her', act:'dig', spot:'clearing', cost:{ twig:2 },  mins:120, green:1, magic:1,
      needs:['ruts', 'clear'], blurb:'Now the ground is flat and clear, the earth can be turned. Something can finally grow.' },
    { id:'roof',    name:'Moss for the shelter roof',  who:'her', spot:'shelter',     cost:{ moss:4 },           mins:180, green:1, magic:2,
      blurb:'The canvas leaks. A thick moss roof keeps the rain out and the warmth in.' },
    { id:'fence',   name:'Mend the fence',             who:'him', spot:'fence',       cost:{ twig:4 },           mins:120, green:1, magic:1,
      blurb:'Half the fence is down. Rabbits know it.' },
    { id:'sapling', name:'Plant the sapling out',      who:'her', act:'water', spot:'sapling',     cost:{ water:2, moss:2 },  mins:360, green:2, magic:3,
      needs:['ruts'], blurb:'The potted oak is ready for real ground. It will outlive us all.' },
    { id:'feeder',  name:'Set out a feeding dish',     who:'her', act:'carry', spot:'feeder', cost:{ stone:2, twig:1 }, mins:45, green:0, magic:1, needs:['clear'],
      blurb:'A flat stone dish on a stump. Put out seed or berries and see who comes. Some will come back.' },
    { id:'bench',   name:'Set the bench by the fire',  who:'him', spot:'stonebench',  cost:{ stone:2 },          mins:60,  green:0, magic:1,
      blurb:'Somewhere to sit of an evening.' },
    { id:'woodpile', name:'Stack the firewood',        who:'him', spot:'fire',        cost:{ twig:3 },           mins:60,  green:0,
      blurb:'Dry wood off the ground, bark side up. Winter is a long way off, but it is coming.' },
    { id:'doorstep', name:'Lay a flat-stone doorstep', who:'him', act:'dig', spot:'shelter',     cost:{ stone:3 },          mins:90,  green:1,
      blurb:'So the mud stays outside. Mostly.' },
    { id:'rainbarrel', name:'Scrub the rain barrel',   who:'him', spot:'fire',        cost:{ twig:2, stone:1 },  mins:60,  green:0,
      blurb:'Every drop off the roof is a drop they do not have to carry from the creek.' },
    { id:'clothesline', name:'String up a washing line', who:'her', spot:'fire',      cost:{ twig:3, moss:1 },   mins:60,  green:0,
      blurb:'Two tunics, one apron, a very small pair of socks. The sun can do the drying.' },
    { id:'lantern', name:'Mend the old lantern',       who:'him', spot:'fire',        cost:{ twig:1, stone:1, light:1 }, mins:90, green:0,
      blurb:'It needs a wisp of caught light, and a gnome who admits he is not good at wiring.' },
    { id:'windowbox', name:'Hang a window box',        who:'her', act:'water', spot:'shelter',     cost:{ twig:2, moss:2, seed:1 }, mins:90, green:1, needs:['roof'],
      blurb:'A home is not a home until something is flowering by the window.' },

    // --- a glow (day 2 onward) ---
    { id:'herbs',   name:'Plant a herb corner',        who:'her', act:'water', spot:'seedbed',     cost:{ seed:2, water:2, moss:1 }, mins:180, green:1, minLevel:2, needs:['bed'],
      blurb:'Thyme, mint and the one parsley that will not die. Good for tea and for bees.' },
    { id:'compost', name:'Start a compost heap',       who:'him', act:'dig', spot:'wheelbarrow', cost:{ twig:2, moss:3, water:1 }, mins:180, green:1, minLevel:2,
      blurb:'Nothing is waste if you wait. Leaves, peelings and patience.' },
    { id:'birdbath', name:'Set a stone birdbath',      who:'him', act:'water', spot:'stonebench',  cost:{ stone:4, water:2 }, mins:120, green:1, minLevel:2,
      blurb:'A hollow stone full of dew. Somebody small will want a wash.' },
    { id:'wildflowers', name:'Scatter wildflower seed', who:'her', act:'water', spot:'sapling',    cost:{ seed:3, water:1 }, mins:240, green:2, minLevel:2, needs:['ruts'],
      blurb:'Not in rows. Wildflowers like to choose their own places.' },
    { id:'beanpoles', name:'Raise the bean poles',     who:'him', act:'dig', spot:'seedbed',     cost:{ twig:5 },           mins:120, green:0, minLevel:2, needs:['bed'],
      blurb:'A teepee of sticks for a vine that has not been planted yet. Optimism.' },
    { id:'path',    name:'Lay a stepping-stone path',  who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:6 },          mins:240, green:1, minLevel:2, needs:['doorstep'],
      blurb:'From the doorstep to the fire, so the grass can grow where the feet used to go.' },
    { id:'berrybush', name:'Plant a berry bush',       who:'her', act:'water', spot:'sapling',     cost:{ seed:2, water:2, moss:2 }, mins:300, green:2, minLevel:2, needs:['ruts'],
      blurb:'Berries for jam, and berries for the birds. Mostly the birds.' },

    // --- a steady light (day 3 onward) ---
    { id:'pond',    name:'Dig a little dew pond',      who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:4, twig:2, water:3 }, mins:360, green:2, minLevel:3, needs:['compost'],
      blurb:'Just big enough for a frog and a sky. Lined with clay and lots of stones.' },
    { id:'beehive', name:'Hang a hollow-log bee house', who:'him', spot:'fence',     cost:{ twig:4, moss:2, acorn:2 }, mins:240, green:1, minLevel:3, needs:['herbs'],
      blurb:'For the little native bees who live alone and sting almost never.' },
    { id:'nestbox', name:'Nail up a nest box',         who:'him', spot:'fence',       cost:{ twig:3, feather:1, acorn:1 }, mins:180, green:1, minLevel:3, needs:['fence'],
      blurb:'The hole must be the right size. Too big and the wrong sort of bird moves in.' },
    { id:'hedgehoghouse', name:'Build a leaf-pile shelter', who:'her', spot:'fence',  cost:{ twig:3, moss:3 },   mins:180, green:1, minLevel:3,
      blurb:'A heap of leaves and sticks in a quiet corner. Please do not tidy it.' },
    { id:'toadstools', name:'Coax a ring of toadstools', who:'her', act:'water', spot:'sapling',   cost:{ moss:4, water:2, light:2 }, mins:300, green:1, minLevel:3,
      blurb:'A little light, a lot of damp. The ring will be the best seat in the garden.' },
    { id:'acornplant', name:'Plant acorns for a grove', who:'her', act:'dig', spot:'sapling',    cost:{ acorn:5, water:2 }, mins:360, green:2, minLevel:3, needs:['sapling'],
      blurb:'Most will be eaten or forgotten. That is how a forest begins.' },

    // --- home stage 2: the old stump becomes a proper house (three jobs, each changes the picture) ---
    { id:'house1', name:'Hollow out the old stump', short:'hollowing the stump', who:'him', act:'dig', spot:'shelter', cost:{ twig:4, stone:4 }, mins:360, green:1, minLevel:3, needs:['roof', 'doorstep'],
      blurb:'The loggers left the stump; the gnomes will make it a home. Room for a bed, a hearth and, Wendel insists, a workbench.' },
    { id:'house2', name:'Fit a plank wall and windows', short:'fitting the windows', who:'him', act:'carry', spot:'shelter', cost:{ twig:6, moss:2, light:2 }, mins:360, green:1, minLevel:3, needs:['house1'],
      blurb:'Planks across the gap, and two round windows with a wisp of light set in the glass so they never quite go dark.' },
    { id:'house3', name:'Raise the roof and chimney', short:'raising the roof', who:'her', act:'carry', spot:'shelter', cost:{ twig:8, moss:6, stone:6 }, mins:480, green:2, minLevel:4, needs:['house2'],
      blurb:'Bark shingles instead of patched canvas, and a stone chimney for a real hearth. After this, it is a house.' },

    // --- a warm flame (day 5 onward) ---
    { id:'seedsave', name:'Keep a seed tin',           who:'her', spot:'shelter',     cost:{ seed:4, twig:2 },   mins:180, green:1, minLevel:4,
      blurb:'Labelled in her tiny handwriting. Next year starts with this year\'s best.' },
    { id:'wildmeadow', name:'Sow the meadow strip',    who:'her', act:'water', spot:'wheelbarrow', cost:{ seed:5, water:3 },  mins:360, green:3, minLevel:4, needs:['wildflowers'],
      blurb:'A long ribbon of grasses and clover along the fence, left to grow wild.' },
    { id:'lanternpath', name:'Line the path with glow jars', who:'her', spot:'fence', cost:{ light:5, stone:2 }, mins:240, green:1, minLevel:4, needs:['path'],
      blurb:'Wisps in jars, so nobody trips on the way back from the creek.' },
    { id:'leanto',  name:'Raise a spare-room lean-to', who:'him', spot:'shelter',     cost:{ twig:8, moss:6, stone:4 }, mins:360, green:2, minLevel:4, needs:['windowbox'],
      blurb:'In case friends come to stay. Or family. Mostly family.' },
    { id:'swing',   name:'Hang a bark swing',          who:'him', spot:'sapling',     cost:{ twig:4, moss:1 },   mins:120, green:0, minLevel:4, needs:['acornplant'],
      blurb:'From the lowest branch of the new oak. For the afternoons when nothing needs doing.' },

    // --- a bright fire (day 8 onward) ---
    { id:'greatgrove', name:'Plant the grove',         who:'her', act:'dig', spot:'sapling',     cost:{ acorn:8, seed:4, water:4 }, mins:360, green:3, minLevel:5, needs:['acornplant'],
      blurb:'Oaks, wattles and one very hopeful fig. They will not see it finished. Someone will.' },
    { id:'sign',    name:'Carve a welcome sign',       who:'him', spot:'fence',       cost:{ twig:4, feather:2 }, mins:120, green:1, minLevel:5, needs:['leanto'],
      blurb:'"All Creatures Welcome. Please Wipe Paws." The second line took three tries.' },
    { id:'picnic',  name:'A thank-you picnic for the garden', who:'her', spot:'stonebench', cost:{ berry:4, moss:2, acorn:2 }, mins:120, green:1, minLevel:5,
      blurb:'Crumbs for the ants, berries for the birds, one slice of cake for the gnomes.' },
  ],

  // Regrowing a neighbouring tile is a task too; generated per tile in code from this template.
  regrow: { name:'Coax the land next door', who:'her', cost:{ seed:3, moss:3, water:2 }, mins:360, magic:4, minLevel:2,
            blurb:'Seeds, moss and dew, and a little of their magic, and the bare ground next door will green.' },

  // Home tile regrowth stages by green points.
  landStages: [
    { at:0, key:'barren', name:'bare ground',  sub:'a bare patch of ground, waiting' },
    { at:4, key:'green',  name:'first green',  sub:'a haze of green over the bare earth' },
    { at:12,key:'meadow', name:'young meadow', sub:'grass, clover and the first daisies' },
    { at:26,key:'wood',   name:'young woodland', sub:'saplings taller than a gnome' },
  ],

  // Magic grows with the days you visit. level by distinct days visited.
  magicLevels: [ // daysNeeded, name, what it unlocks
    { days:1, name:'a flicker',     unlock:null },
    { days:2, name:'a glow',        unlock:'coax' },
    { days:3, name:'a steady light',unlock:'rain' },
    { days:5, name:'a warm flame',  unlock:'wake' },
    { days:8, name:'a bright fire', unlock:null },
  ],
  spells: {
    coax: { name:'Coax a sprout',  cost:{ light:2 }, blurb:'Finish whatever is growing in the bed, right now.' },
    rain: { name:'Call soft rain', cost:{ light:3 }, blurb:'Waters every planted bed and leaves dew on the ground.' },
    wake: { name:'Wake the land',  cost:{ light:4 }, blurb:'Halves the time left on a regrowing patch.' },
  },

  // Visitors for the journal. hours: [from,to) 24h; stage: min land stage key; task: only after that task is done.
  // h: height on screen in world pixels (a gnome is about 120). faces: which way the painted picture looks (L/R), so it can be mirrored.
  // icon: stand-in (journal and garden) until a painting exists (art slot vis-<id>; the six old paintings are already in).
  // fly: hovers that high off the ground (lands to eat). eats: what it takes from the feeding dish (seed / berry).
  // nest: a fed regular eventually settles nearby (nest | burrow | leafpile | stones). trouble: a small fix for you; earns light.
  visitors: [
    { id:'robin',    name:'Robin',       hours:[6,18],  weight:4, h:44, faces:'L', icon:'🐦', speed:0.25, eats:['seed'], nest:'nest',
      note:'Hops after the digging, hoping for worms.' },
    { id:'mouse',    name:'Field mouse', hours:[0,24],  weight:3, h:30, faces:'L', icon:'🐭', speed:0.06, eats:['seed'], nest:'burrow',
      note:'Keeps a close eye on the seed bed.',
      trouble:{ text:'has got its head stuck in an old loggers\' bottle.', act:'Tip the bottle', thanks:'Out it popped, whiskers first, and sat washing its face as if nothing had happened.' } },
    { id:'hedgehog', name:'Hedgehog',    hours:[17,24], weight:3, h:50, faces:'R', icon:'🦔', speed:0.05, eats:['berry'], nest:'leafpile',
      note:'Snuffles along the fence line at dusk.',
      trouble:{ text:'has a dry leaf stuck on nearly every spine.', act:'Pick the leaves off', thanks:'It snuffled, very politely, and trundled off a good deal lighter.' } },
    { id:'owl',      name:'Tawny owl',   hours:[19,24], weight:2, h:72, faces:'L', icon:'🦉', speed:0.3, alsoHours:[0,5], note:'Watches from the lantern post. Says nothing.' },
    { id:'ladybird', name:'Ladybird',    hours:[8,17],  weight:3, h:18, faces:'R', icon:'🐞', speed:0.05, stage:'green', note:'Only came once there was something green to land on.' },
    { id:'spirit',   name:'Wood spirit', hours:[21,24], weight:1, h:84, faces:'R', icon:'✨', fly:30, speed:0.06, stage:'green', alsoHours:[0,4], note:'A soft light that is not a firefly. It likes the new moss.' },
    { id:'wren',      name:'Fairy-wren',     hours:[6,17],  weight:3, h:26, icon:'🐦', fly:14, speed:0.2, task:'birdbath', eats:['seed'], nest:'nest',
      note:'A tiny blue flicker with a cocked tail. It bathed, looked at everyone, and left.',
      trouble:{ text:'is caught in a loop of the loggers\' old string.', act:'Untangle it', thanks:'One careful tug and it was free. It scolded everybody, then sang.' } },
    { id:'rosella',   name:'Crimson rosella', hours:[6,11], weight:2, h:40, icon:'🦜', fly:12, speed:0.25, stage:'green', alsoHours:[15,18], eats:['seed'],
      note:'Red and blue and very sure of itself. Cracked every seed in the dish, then checked under it for more.' },
    { id:'butterfly', name:'Butterfly',      hours:[9,17],  weight:3, h:20, icon:'🦋', fly:26, speed:0.1, stage:'meadow', note:'Landed on a daisy and stayed so still the gnomes held their breath.',
      trouble:{ text:'has dew on one wing and cannot lift off.', act:'Breathe warm air on it', thanks:'The wing dried, opened, and off it went, a little crooked at first.' } },
    { id:'snail',     name:'Garden snail',   hours:[5,10],  weight:2, h:18, icon:'🐌', speed:0.015, note:'Left a silver trail across the doorstep. Entirely unapologetic.',
      trouble:{ text:'is halfway across the path, right where Wendel walks.', act:'Carry it to the clover', thanks:'Set down in the clover. It did not say thank you. Snails never do.' } },
    { id:'frog',      name:'Green tree frog', hours:[19,24], weight:3, h:24, icon:'🐸', speed:0.05, task:'pond', alsoHours:[0,4], note:'Moved in the first night the pond held water. Sings off-key and with total confidence.' },
    { id:'dragonfly', name:'Dragonfly',      hours:[10,16], weight:2, h:18, icon:'🪰', fly:30, speed:0.3, task:'pond', stage:'green', note:'Zipped over the pond and hovered like a tiny helicopter.' },
    { id:'possum',    name:'Brushtail possum', hours:[20,24], weight:2, h:62, icon:'🐿️', speed:0.05, alsoHours:[0,4], stage:'green', eats:['berry'],
      note:'Huge ears, huge eyes, and a firm belief that the fruit is for it.',
      trouble:{ text:'has climbed the lantern stump and is too proud to climb down.', act:'Lean a twig ladder', thanks:'It came down the ladder backwards, very slowly, pretending that was the plan all along.' } },
    { id:'bluetongue', name:'Blue-tongue lizard', hours:[10,16], weight:2, h:22, icon:'🦎', speed:0.04, stage:'green', eats:['berry'], nest:'stones',
      note:'Sunbathed on the doorstep. Stuck out a blue tongue. The gnomes are still discussing it.',
      trouble:{ text:'is too cold to move, stuck in a patch of shade.', act:'Roll a warm stone over', thanks:'It lay on the sun-warmed stone until it could blink again, then wandered off, much obliged.' } },
    { id:'echidna',   name:'Echidna',        hours:[6,10],  weight:1, h:36, icon:'🦔', speed:0.04, stage:'meadow', alsoHours:[16,19], note:'A walking pincushion on a mission to find ants. It found them.',
      trouble:{ text:'has its nose stuck in an old tin can.', act:'Ease the tin off', thanks:'Pop. One very surprised echidna, and one tin for the gnomes\' scrap pile.' } },
    { id:'bandicoot', name:'Bandicoot',      hours:[18,24], weight:2, h:34, icon:'🐭', speed:0.07, stage:'green', alsoHours:[0,5], eats:['berry'], nest:'burrow',
      note:'Dug little cone-shaped holes all over the lawn. Every one was a favour.',
      trouble:{ text:'has fallen into one of its own holes.', act:'Lift it out', thanks:'Lifted out, dusted off, and straight back to digging. Some creatures never learn. Good.' } },
    { id:'frogmouth', name:'Tawny frogmouth', hours:[19,24], weight:1, h:60, icon:'🦉', speed:0.2, stage:'meadow', alsoHours:[0,5], note:'Pretended to be a broken branch. A very convincing broken branch.' },
    { id:'kookaburra', name:'Kookaburra',    hours:[5,9],   weight:1, h:56, icon:'🐦', speed:0.25, stage:'meadow', alsoHours:[16,19], note:'Laughed at the fence. The fence did not laugh back. Everyone else did.' },
    { id:'nativebee', name:'Native bee',     hours:[9,16],  weight:2, h:12, icon:'🐝', fly:20, speed:0.15, task:'beehive', note:'A small, shiny, round bee. Moved into the log house and did not ask for a lease.' },
    { id:'glowworm',  name:'Glow-worm',      hours:[20,24], weight:1, h:10, icon:'✨', speed:0.01, stage:'meadow', alsoHours:[0,4], note:'A single point of cool blue-green light under the fern. It seems to be waiting for someone.' },
    { id:'moth',      name:'Bogong moth',    hours:[20,24], weight:2, h:20, icon:'🦋', fly:24, speed:0.12, alsoHours:[0,4], note:'Drawn to the lantern. Told firmly to stay away from the flame. Mostly did.',
      trouble:{ text:'is fluttering against the shelter canvas, trying to get out of the night.', act:'Guide it to the lantern', thanks:'It settled by the lantern glass and stayed there, content, all evening.', task:'lantern' } },
    { id:'wisp',      name:'Will-o\'-wisp', hours:[21,24], weight:1, h:30, icon:'💫', fly:40, speed:0.08, stage:'green', alsoHours:[0,4], spirit:true,
      note:'A small cold light that bobbed just out of reach and left a little brighter than it came.' },
  ],
  // the feeding dish (job "Set out a feeding dish"): put out seed or berries; whoever eats there on enough different days becomes a regular
  feeding: { foods:['seed', 'berry'], regularAfter:3, nestAfter:6 },
  troubleChance: 0.2,   // how often a visitor that can be in trouble arrives in trouble
  deedsPerDay: 3,       // light earned by helping creatures, at most this much a day
  visitorEvery:[90, 200], // seconds between visitors during a visit

  // Side mystery placeholder: a magic staff one of the gnomes finds. Bryce is writing this story himself;
  // nothing here is plot, only the shape: ordered beats with a trigger and a flag the engine can set.
  story: { beats: [ /* { id:'staff-found', when:{ landStage:'green' }, text:'...', sets:'staffFound' } */ ] },

  lines: {
    him: ["Bare as a baker's elbow. We'll fix that.", "Did you see? A sprout. Right in the middle.", "Mind the ruts, love.", "Kettle's on.", "Tomorrow we dig the bed properly.", "I remember when all this was ferns.",
          "Our own front door. Well, our own front hole.", "She said yes. I still can't quite believe it.", "I've measured twice and I'm still wrong. Don't tell her.", "Did you know worms are basically farmers?",
          "Every stump was once a tree that had a view.", "I'm going to build her a garden bench. I haven't told her.", "One acorn, one oak. That's the maths.", "Look at that moss. Doing it all without being asked.",
          "Marriage tip: never say 'just a quick job'.", "The soil's coming back. Smell that? That's life.", "We're not saving the world. We're saving this corner of it.", "I think the fence is leaning on me.",
          "That robin is judging my digging.", "Let's leave the long grass long. Somebody lives in it.", "Tea first. Heroics after."],
    her: ["Hello, dear. Come to help?", "The sapling wants water, not wishes.", "Isn't it quiet without the trees?", "I've put the moss aside for the roof.", "A little each day, that's the trick.", "Listen… was that a robin?",
          "He built the doorstep crooked. I love it.", "Wattle and daisies by spring, that's my promise.", "Everything here is borrowed from the soil. We should say thank you.", "I counted four new green shoots this morning.",
          "Plant something that will outlast you.", "I've named the sapling. I'm not saying the name.", "We have a home, a kettle and each other. What more is there?", "The bees will come once there's something for them. Build it and they will.",
          "Mind the clover, it's feeding the soil.", "Do you hear that? The frogs are practising.", "A gnome could get used to this.", "Nothing is waste. Not even the dead leaves.", "We don't own this patch. We just look after it.",
          "Put the kettle on, love, I'll bring the biscuits.", "It's not much yet. But it's ours, and it's growing."],
    working: { him:["Nearly there.", "Pass me that, would you?", "Good honest work.", "Measure twice, hammer once. Mostly.", "That's not crooked, that's character.", "Hand me the stone. No, the other stone.", "If it holds a gnome, it holds a bird."],
               her:["Patience. It's coming along.", "Almost done, dear.", "Hum-de-dum.", "In goes the seed. Up comes the world.", "Gently, now. Plants can tell.", "A little water, a little time.", "I could do this all afternoon."] },
  },

  // Gentle random happenings. every: minutes of play between rolls; chance: per roll. Never a loss, only small gifts and moments.
  // give: items added to the pack. offer: kinds that appear on the ground. light: wisps. Optional gates: hours, stage, seasons (southern hemisphere), task.
  events: {
    every: 120, chance: 0.55,
    list: [
      { id:'drizzle',   weight:3, text:'A soft drizzle passed over. The dew will be good tomorrow.', give:{ water:2 } },
      { id:'breeze',    weight:3, text:'A breeze rattled the trees and dropped some twigs by the door.', offer:['twig','twig','moss'] },
      { id:'rabbit',    weight:2, text:'A hungry rabbit nibbled the clover and left a seed in apology.', give:{ seed:1 }, stage:'green' },
      { id:'tea',       weight:3, text:'The two of them took tea on the bench and watched the light change.' },
      { id:'dance',     weight:2, text:'She hummed. He pretended not to dance.', hours:[17,22] },
      { id:'frost',     weight:2, text:'Frost on the moss at dawn. Mugs of tea, and nothing hurt.', hours:[5,9], seasons:['winter'] },
      { id:'storm',     weight:2, text:'A short, loud storm. The roof held. They counted the thunder together.', give:{ water:3, twig:1 }, seasons:['summer','spring'] },
      { id:'mushrooms', weight:2, text:'Mushrooms appeared after the rain, in a circle exactly where nobody had looked.', offer:['moss','moss'], seasons:['autumn','winter'] },
      { id:'wattle',    weight:2, text:'Wattle blossom blew in. The whole garden smells of honey.', give:{ seed:1 }, seasons:['spring'] },
      { id:'cicadas',   weight:2, text:'The cicadas started up. Nobody could hear a thing, and nobody minded.', hours:[10,17], seasons:['summer'] },
      { id:'leaves',    weight:2, text:'A drift of autumn leaves landed neatly in the compost corner.', give:{ moss:1 }, seasons:['autumn'] },
      { id:'firefly',   weight:3, text:'Three wisps of light drifted through, as if looking for the gnomes.', give:{ light:1 }, hours:[19,24] },
      { id:'owlcall',   weight:2, text:'An owl called twice in the dark. She called back. It was a very short conversation.', hours:[20,24] },
      { id:'sunrise',   weight:2, text:'They sat up early for the sunrise. It was worth the yawning.', hours:[5,8], give:{ water:1 } },
      { id:'gift',      weight:2, text:'A small bird left a feather on the doorstep. They think it was a thank-you.', give:{ feather:1 }, stage:'green' },
      { id:'berries',   weight:2, text:'He found wild berries by the fence and ate half before sharing.', give:{ berry:2 }, hours:[8,17] },
      { id:'seedwind',  weight:2, text:'The wind carried in a handful of seeds from somewhere green.', give:{ seed:2 }, stage:'green' },
      { id:'moonlit',   weight:1, text:'The moon came out and the whole patch looked, for a minute, like it had always been a garden.', hours:[20,24], stage:'meadow', give:{ light:2 } },
      { id:'neighbours', weight:1, text:'Far off, a window lit up. Other gnomes are out there, somewhere.', hours:[18,24], stage:'meadow' },
      { id:'wash',      weight:2, text:'Washing day. Two tunics, one apron, a very small pair of socks. Dry by noon.', hours:[8,12], task:'clothesline' },
    ],
  },
};
