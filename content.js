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
    // made by neighbours (daily gifts once their trade building is up); emoji until painted icons exist (icon-<kind>)
    bread: { name:'bread', icon:'🍞' },
    plank: { name:'plank', icon:'🪵' },
    honey: { name:'honey', icon:'🍯' },
    yarn:  { name:'yarn',  icon:'🧶' },
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

    // --- with the neighbours: jobs that use what they make (each waits for that neighbour's trade building) ---
    { id:'workbench', name:'Fit Wendel a proper workbench', short:'fitting the workbench', who:'him', spot:'shelter', cost:{ plank:4, stone:2 }, mins:240, green:1, needs:['trade:tobias'],
      blurb:'Real planks, a vice, and a drawer for the things he swears he will tidy away.' },
    { id:'quilt', name:'Knit a winter quilt', short:'knitting the quilt', who:'her', act:'sit', spot:'shelter', cost:{ yarn:4, moss:2 }, mins:300, green:1, needs:['trade:nettle'],
      blurb:'Square by square, of an evening. Wendel holds the wool and talks too much.' },
    { id:'pantry', name:'Fill the pantry for winter', short:'filling the pantry', who:'her', spot:'shelter', cost:{ bread:3, honey:2, seed:3 }, mins:180, green:1, needs:['trade:mabel', 'trade:clem'],
      blurb:'Jars, sacks and one very good cake tin. Let it snow. (It will not snow. But still.)' },
    { id:'bridge', name:'Build a bridge at the stepping stones', short:'building the bridge', who:'him', act:'carry', cost:{ plank:4, stone:4, twig:4 }, mins:420, green:2, needs:['trade:tobias'], needsTile:'1,-1',
      blurb:'Tobias draws it, Wendel builds it, and the far side of the stream can finally be reached with dry feet.' },

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
    // seasonal visitors (southern hemisphere seasons; seasons: only then)
    { id:'silvereye', name:'Silvereye',      hours:[7,17],  weight:3, h:26, faces:'L', icon:'🐤', speed:0.2, eats:['berry'], seasons:['autumn','winter'],
      note:'Turns up in a chattering little flock when the weather cools, every one of them wearing a neat white ring round the eye, like spectacles.' },
    { id:'kingfisher', name:'Sacred kingfisher', hours:[6,16], weight:2, h:36, faces:'L', icon:'🐦', speed:0.18, seasons:['spring','summer'], stage:'green',
      note:'Back from the north for the warm months, turquoise as the stream. Sits very still on the fence and waits for something to move.' },
    { id:'beetle',    name:'Christmas beetle', hours:[18,23], weight:2, h:16, icon:'🪲', fly:20, speed:0.1, seasons:['summer'],
      note:'A clumsy, shining gold-green beetle that blundered into the lantern light, apologised, and did it again.' },
    { id:'cockatoo',  name:'Yellow-tailed black cockatoo', hours:[7,16], weight:1, h:60, faces:'L', icon:'🐦‍⬛', fly:36, speed:0.15, seasons:['winter'], stage:'meadow',
      note:'A slow pair came over, wailing. Old gnomes say that means rain. It rained.' },
    { id:'wisp',      name:'Will-o\'-wisp', hours:[21,24], weight:1, h:30, icon:'💫', fly:40, speed:0.08, stage:'green', alsoHours:[0,4], spirit:true,
      note:'A small cold light that bobbed just out of reach and left a little brighter than it came.' },
  ],
  // the feeding dish (job "Set out a feeding dish"): put out seed or berries; whoever eats there on enough different days becomes a regular
  feeding: { foods:['seed', 'berry'], regularAfter:3, nestAfter:6 },
  troubleChance: 0.2,   // how often a visitor that can be in trouble arrives in trouble
  deedsPerDay: 3,       // light earned by helping creatures, at most this much a day
  visitorEvery:[90, 200], // seconds between visitors during a visit

  // ---------- neighbours and the village (decided by Bryce 2026-10-25) ----------
  // One traveller at a time camps by the path. Build them a home and they stay; or wave them on and someone else comes.
  // Each neighbour has a trade building (a job that changes the picture, then a small daily gift at their door), a few
  // sayings, the odd small favour, and one short story quest that shows a moment in Wendel and Hazel's marriage.
  village: {
    firstAfter: 'house3',     // the first traveller turns up once the stump house is finished
    gapDays: 4,               // days after one neighbour moves in before the next traveller comes
    waveGapDays: 1,           // after waving a traveller on, someone else comes after about this long
    favourEvery: 360,         // minutes between small favours (only one waiting at a time)
    questAfterDays: 1,        // a neighbour's story begins about a day after their trade building is finished
    // where homes go, nearest first: plain healed tiles (not the stream row or the path). A home needs one of these to be green.
    lots: ['0,1', '-1,0', '-1,1', '2,0', '-2,0', '2,1', '-2,1', '0,2', '-1,2', '0,-2', '-1,-2', '2,-2', '-2,-2', '2,2', '-2,2'],
    order: ['mabel', 'tobias', 'fernsby', 'pebbleworth', 'clem', 'barnaby', 'nettle', 'juniper'],   // who comes next (waved-on travellers go to the back)
  },
  // look: stand-in colouring of Wendel's (base him) or Hazel's (base her) painted walk: hat and coat hues (0-360), grey hair, size.
  // members: extra gnomes who live in the same home (the family). home: stand-in kind (stump | root | log | hollow), door colour.
  // Steps of a story quest: say (what is happening) plus one of: give (hand things over), job (a gnome works on it, in Jobs),
  // find (something to spot on the land and tap; hours = only then), wait (minutes of real time). Then the story page.
  folk: [
    { id:'mabel', name:'Mabel Crumb', short:'Mabel', trade:'the baker', base:'her', look:{ hat:8, coat:205, s:1.04 }, home:'stump', door:'#b5532f', icon:'🍞',
      intro:'A round little gnome with flour to her elbows came up the path today, pushing a barrow of warm loaves. "I go where an oven is needed," she said, "and you two, my dears, have no oven at all." She has put up a patched tent by the path, and the whole clearing smells of bread.',
      build:{ cost:{ twig:6, stone:6, moss:4 }, mins:420, who:'him', blurb:'A snug stump home with a wide door, so a gnome with a tray of buns can get through it sideways.' },
      movedIn:'Mabel stood in her new doorway and cried a little into her apron. "A home," she said, "and neighbours, and not a single oven in sight. We shall see about that." That evening there were buns on everyone\'s step.',
      sayings:['Nothing a warm loaf cannot mend. Well, nearly nothing.', 'You two are too thin. Here.', 'Bread is just patience you can eat.', 'Hazel says he snores. I say, find me a husband who doesn\'t.', 'The trick with dough is the same as with gnomes: warmth, and leave it alone a while.'],
      building:{ name:'Build Mabel\'s bread oven', short:'building the oven', who:'him', act:'carry', cost:{ stone:8, moss:3, water:2 }, mins:300,
        blurb:'A round clay oven beside her door, with a stone floor and a little chimney. After this, there is bread.', gift:{ bread:1 }, giftText:'A warm loaf on Mabel\'s step, wrapped in a cloth.' },
      favours:[ { ask:'The oven is hungry this morning. Could you spare 3 twigs?', cost:{ twig:3 }, thanks:'Bless you. The first bun out is yours.' },
                { ask:'I\'m trying a seed loaf. Have you 2 seeds to spare?', cost:{ seed:2 }, thanks:'There. It will be lumpy and wonderful.' },
                { ask:'A drop of honey would make this cake sing. Just 1?', cost:{ honey:1 }, thanks:'Oh, that\'s the stuff. Come by later.' } ],
      quest:{ name:'The forgotten anniversary', steps:[
        { say:'Mabel pulls you aside. "It is Wendel and Hazel\'s first anniversary this week. Hazel mentioned it, very lightly. Wendel has not mentioned it at all. I think the dear man has forgotten." A cake would help. She needs 3 seeds and 2 berries.', give:{ seed:3, berry:2 } },
        { say:'"Now the hard part," says Mabel. "Hazel\'s mother wrote her a honey-seed cake recipe on the back of a letter, and it blew away on the road here. She has never said, but she misses it." Look for a scrap of paper caught somewhere on the land.', find:{ name:'a scrap of old letter', icon:'📜' } },
        { say:'The recipe! Wendel goes pale, then pink, then very determined. He and Mabel bake it together in secret, late, by the oven.', job:{ name:'Bake the secret cake with Mabel', short:'baking in secret', who:'him', act:'carry', mins:180, cost:{ water:1 } } } ],
        story:{ title:'The forgotten anniversary', text:'He had forgotten. He admitted it at once, standing in the doorway with the cake held out like a shield. Hazel looked at the cake, and at the familiar slanting handwriting propped beside it, and sat down rather suddenly. "That\'s Mum\'s," she said. They ate it on the step, all three of them, and Wendel was forgiven by the second slice.' },
        reward:{ light:3, bread:2 } } },

    { id:'tobias', name:'Tobias Burl', short:'Tobias', trade:'the carpenter', base:'him', look:{ hat:205, coat:28, s:1.1 }, home:'log', door:'#5a7a3a', icon:'🪚',
      intro:'A broad, loud gnome with sawdust in his beard and a toolbox on his back strode into the clearing, looked at the stump house and said, "Who did those windows? Not bad. Not good, but not bad." He is camping by the path and has already mended the wheelbarrow without asking.',
      build:{ cost:{ twig:8, stone:4, moss:4 }, mins:420, who:'him', blurb:'A hollow fallen log for a home, with a round door at one end. Tobias says he will do the fiddly bits himself.' },
      movedIn:'Tobias moved into his log with one bag, one toolbox and a song so loud the robins left. By evening he had fitted a shelf, a second shelf, and a shelf for his spare shelves.',
      sayings:['Measure twice. Then once more, because Wendel measured the first time.', 'Wood remembers the tree it was. Be nice to it.', 'A good joint needs no nails. A good friend neither.', 'Your Wendel\'s got clever hands. Wanders off in his head, mind.', 'Hand me that. No, the other that.'],
      building:{ name:'Raise Tobias\'s workshop', short:'raising the workshop', who:'him', act:'carry', cost:{ twig:10, stone:4, moss:2 }, mins:360,
        blurb:'An open-sided workshop with a plank roof, a sawhorse and a wall of hanging tools. After this, there are planks.', gift:{ plank:1 }, giftText:'A smooth spare plank leaning by Tobias\'s door.' },
      favours:[ { ask:'Lost my pencil again. Have you a feather? I\'ll whittle a new one.', cost:{ feather:1 }, thanks:'Champion. Now where did I put the wood.' },
                { ask:'My saw wants grease. A bit of moss and dew will do it: 2 moss, 1 dew.', cost:{ moss:2, water:1 }, thanks:'Hear that? Not a squeak.' },
                { ask:'Working late. A loaf wouldn\'t go amiss. Just 1.', cost:{ bread:1 }, thanks:'Mabel\'s, is it? That woman is a wonder.' } ],
      quest:{ name:'Too long in the workshop', steps:[
        { say:'Wendel has spent four days running in Tobias\'s workshop, making "something important". Hazel has done every job alone, and tonight she said nothing at all at supper, which is worse than saying something. Tobias scratches his beard. "My fault. Let\'s finish the thing quick." He needs 3 planks.', give:{ plank:3 } },
        { say:'The "something important" is a rocking chair, for Hazel\'s evenings. It just needs finishing.', job:{ name:'Finish the rocking chair', short:'finishing the chair', who:'him', act:'carry', mins:240, cost:{ moss:2 } } },
        { say:'Tobias says the chair should sit one night in the workshop "to settle". Really, he is giving Wendel time to work out what to say.', wait:480 } ],
        story:{ title:'The rocking chair', text:'He carried it home in the morning and set it down by the fire. "I should have told you where I was," he said. "I should have helped." Hazel ran her hand along the arm, which was very smooth, and slightly crooked. "You made the left one longer," she said. "I know," said Wendel. She sat in it, and rocked, and after a while she reached out and held his hand.' },
        reward:{ light:3, plank:2 } } },

    { id:'fernsby', name:'The Fernsbys', short:'the Fernsbys', trade:'a young family', base:'him', look:{ hat:120, coat:20, s:1.0 }, home:'root', door:'#c08a2a', icon:'👪',
      members:[ { base:'her', look:{ hat:200, coat:340, s:0.98 } }, { base:'her', look:{ hat:50, coat:280, s:0.6 } }, { base:'him', look:{ hat:330, coat:150, s:0.58 } } ],
      intro:'A whole family came up the path at once: Rowan Fernsby, his wife Ivy, and the twins Pip and Posy, who were already up a tree before anyone said hello. "We\'re water-finders," Ivy explained. "We find water, and the twins find trouble." They are camped by the path, in a tent that is mostly washing.',
      build:{ cost:{ twig:8, stone:6, moss:6 }, mins:480, who:'her', blurb:'A roomy burrow under arching roots, with a round door and a little window for each twin.' },
      movedIn:'The Fernsbys moved in under the roots, and that night the clearing was louder and happier than it had ever been. Hazel watched the twins chase fireflies and said nothing, and Wendel watched Hazel.',
      sayings:['Have you seen the twins? No? Good, that means they\'re hiding properly.', 'There\'s water under here. There\'s water under everywhere, if you\'re patient.', 'Pip! Put the frog down!', 'You two make it look easy. Being married, I mean.', 'Posy says your garden is the best garden. Posy has seen two gardens.'],
      building:{ name:'Dig the village well', short:'digging the well', who:'him', act:'dig', cost:{ stone:10, twig:4 }, mins:420,
        blurb:'Rowan has found water. A ring of stones, a little roof and a bucket on a rope. After this, nobody carries dew in their hat.', gift:{ water:2, feather:1 }, giftText:'A bucket of well water by the roots, and a feather the twins found.', site:'well' },
      favours:[ { ask:'The twins want a picnic. Could you spare 2 berries?', cost:{ berry:2 }, thanks:'They\'ve eaten them already. Thank you anyway!' },
                { ask:'Posy has built a tiny house for a beetle. It needs 2 twigs for a roof.', cost:{ twig:2 }, thanks:'The beetle has moved in. Posy is unbearable about it.' },
                { ask:'Rowan has worn through his socks again. A bit of yarn? Just 1.', cost:{ yarn:1 }, thanks:'Ivy says she\'ll darn them. Ivy says that every time.' } ],
      quest:{ name:'Hide and seek', steps:[
        { say:'Ivy and Rowan need an afternoon to dig, and Hazel offers to mind the twins. "How hard can it be?" says Wendel. The twins vanish almost at once. Look for Pip somewhere on the land.', find:{ name:'Pip, hiding', icon:'🧒' } },
        { say:'One found. Posy is better at hiding. Look again; she likes high places.', find:{ name:'Posy, up a stump', icon:'👧' } },
        { say:'Both twins found, both muddy, both starving. A picnic on the grass will settle everyone: 2 bread and 2 berries.', give:{ bread:2, berry:2 } } ],
        story:{ title:'Someday', text:'The twins fell asleep in the grass with jam on their faces. Wendel lay back and looked at the clouds. "Exhausting," he said. "Completely exhausting." Hazel was quiet for a moment. "Someday?" she said. Wendel turned his head and looked at her for a long time. "Someday," he said, and he was smiling.' },
        reward:{ light:3, berry:3 } } },

    { id:'pebbleworth', name:'Bert and Mags Pebbleworth', short:'the Pebbleworths', trade:'the orchard keepers', base:'him', look:{ hat:250, coat:100, grey:true, s:0.95 }, home:'hollow', door:'#4a6a3a', icon:'🍎',
      members:[ { base:'her', look:{ hat:330, coat:260, grey:true, s:0.92 } } ],
      intro:'An old couple came slowly up the path today, arm in arm, pulling a little cart of fruit-tree cuttings wrapped in wet moss. "Fifty-one years married," said Mags, before anyone asked. "Fifty-two," said Bert. "Fifty-one," said Mags, and he winked at Wendel. They have put up a tent by the path and are sharing an apple on the step.',
      build:{ cost:{ twig:6, stone:6, moss:6 }, mins:420, who:'her', blurb:'A cosy home in a hollow tree, with two chairs by one window. They do not need much; they need each other.' },
      movedIn:'Bert carried Mags over the threshold of the hollow tree, very slowly, and they both laughed so much they had to sit down. Hazel watched from the path with her hand on her heart. "That will be us," said Wendel. "You will drop me," said Hazel.',
      sayings:['Fifty-one years, and he still brings me the first apple.', 'The secret? Say sorry first, even when you\'re right. Especially then.', 'An orchard is a promise to people you will never meet.', 'Your Wendel looks at the stars the way Bert used to look at me. Still does, the old fool.', 'Don\'t tell Mags, but I let her win at cards.'],
      building:{ name:'Plant the Pebbleworths\' orchard', short:'planting the orchard', who:'her', act:'dig', cost:{ seed:3, water:4, moss:3 }, mins:360,
        blurb:'A little ring of young fruit trees from their cuttings, staked and mulched. After this, there is fruit.', gift:{ berry:2 }, giftText:'A basket of windfall fruit by the Pebbleworths\' door.' },
      favours:[ { ask:'Bert\'s knees are complaining. Could you spare 2 moss for a cushion?', cost:{ moss:2 }, thanks:'He says thank you. He says it from the cushion.' },
                { ask:'The young trees are thirsty. 3 dew, dear?', cost:{ water:3 }, thanks:'Listen to them drink.' },
                { ask:'Mags wants a loaf, and Bert wants to be the one who brings it. Just 1?', cost:{ bread:1 }, thanks:'Bert is very pleased with himself.' } ],
      quest:{ name:'A star for Hazel', steps:[
        { say:'Bert tells Wendel that, as a young gnome, he named a star for Mags and has shown it to her every anniversary since. Wendel has gone very thoughtful. He wants to do the same for Hazel, and Bert says they will need to chart the sky properly, with good quills: 3 feathers.', give:{ feather:3 } },
        { say:'They must sit up through the night to find the right star: one that rises over the stump house.', job:{ name:'Sit up for the stars with Bert', short:'watching the stars', who:'him', act:'sit', mins:240, cost:{ light:1 } } },
        { say:'They have found it. Bert copies the chart out neatly, by daylight, with Mags correcting his spelling.', wait:360 } ],
        story:{ title:'Hazel\'s Lamp', text:'Wendel took her up the rise after supper and pointed. "That one. Low, warm, over our roof. It\'s on Bert\'s chart now, and it says Hazel\'s Lamp." Hazel looked at it for a long while. "You know it was always there," she said. "I know," said Wendel. "But now it\'s yours." A little way off, on their bench, Bert and Mags very carefully looked the other way, holding hands.' },
        reward:{ light:4 } } },

    { id:'clem', name:'Clementine Bramblewick', short:'Clem', trade:'the beekeeper', base:'her', look:{ hat:45, coat:45, s:0.98 }, home:'root', door:'#d4a020', icon:'🐝',
      intro:'A freckled gnome in a wide straw hat came up the path humming, with a woven skep on her back and a little cloud of bees around her like a veil. "They don\'t sting," she said. "Well. They don\'t sting me." She has camped well away from the path, which everyone appreciates.',
      build:{ cost:{ twig:6, stone:4, moss:6, seed:2 }, mins:420, who:'her', blurb:'A cosy root home with a flower-covered roof, so the bees have something to do on the way in.' },
      movedIn:'Clem moved in under the roots and planted flowers on her roof the very same day. By the next morning there were bees in the herb corner, bees on the berry bush, and one bee, briefly, in Wendel\'s beard.',
      sayings:['Hum to them. They like to know you\'re coming.', 'A hive is a family that agrees about everything. Imagine.', 'Your herb corner is the talk of the hive.', 'Honey is just summer, saved for later.', 'Wendel tried to talk to my bees. They found him confusing.'],
      building:{ name:'Set out Clem\'s bee skeps', short:'setting out the skeps', who:'her', act:'carry', cost:{ twig:6, moss:4, seed:3 }, mins:300,
        blurb:'Three woven straw skeps on a low bench in the sun. After this, there is honey.', gift:{ honey:1 }, giftText:'A little pot of honey on Clem\'s step, with a bee still checking it.' },
      favours:[ { ask:'My bees want more flowers. Could you spare 3 seeds to sow?', cost:{ seed:3 }, thanks:'They\'ll thank you in honey. Eventually.' },
                { ask:'A skep has a hole. 2 twigs and some moss will patch it: 2 twigs, 1 moss.', cost:{ twig:2, moss:1 }, thanks:'Snug again. Listen to them settle.' },
                { ask:'A dish of dew for the bees on a hot day? 2 dew.', cost:{ water:2 }, thanks:'Look at them drinking. Tiny, tidy tongues.' } ],
      quest:{ name:'The runaway swarm', steps:[
        { say:'Hazel was helping Clem with the hives when the newest swarm took off in a huff. Hazel was stung on the hand, and Wendel has been fussing over it ever since, which Hazel says is worse than the sting. First, find where the swarm has gone.', find:{ name:'the runaway swarm', icon:'🐝' } },
        { say:'The swarm is hanging in a lump on a branch, sulking. Clem needs a fresh skep to coax them into: 4 twigs and 3 moss.', give:{ twig:4, moss:3 } },
        { say:'Hazel insists on carrying the skep herself, bandaged hand and all, and Wendel insists on carrying Hazel\'s basket, and Clem insists they both stop talking.', job:{ name:'Coax the swarm home', short:'coaxing the swarm', who:'her', act:'carry', mins:180, cost:{ water:1 } } } ],
        story:{ title:'The first honey', text:'When the first comb came out of the new skep, Clem gave it to Hazel. Hazel gave the first spoonful to Wendel, who had spent three days asking about her hand. "It was one sting," she said. "I know," he said. "I didn\'t like it." She laughed at him, and kissed him, and he tasted of honey.' },
        reward:{ light:3, honey:2 } } },

    { id:'barnaby', name:'Barnaby Thorne', short:'Barnaby', trade:'the miller', base:'him', look:{ hat:35, coat:100, s:1.0 }, home:'stump', door:'#7a5a9a', icon:'🌾',
      intro:'A tall, quiet gnome with flour in his eyebrows came up the path carrying a millstone on his back, which should not have been possible. "Heard you had a stream," he said, and that was all he said for an hour. He is camped by the path, and Wendel has already asked him forty questions about gears.',
      build:{ cost:{ twig:8, stone:8, moss:4 }, mins:480, who:'him', blurb:'A tall stump home with a crooked chimney. Barnaby ducks to get in; he does not seem to mind.' },
      movedIn:'Barnaby moved into his stump and slept for most of a day. When he woke, he and Wendel sat on the doorstep and drew mill wheels in the dirt with sticks until it was dark, and Hazel brought them both soup.',
      sayings:['Mm.', 'Water does the work. A miller just listens.', 'Wendel\'s a good lad. Asks a lot.', 'Hazel makes a fine soup. Don\'t tell Mabel I said so.', 'A full sack for winter is the best sound there is.'],
      building:{ name:'Build Barnaby\'s little water mill', short:'building the mill', who:'him', act:'carry', cost:{ twig:8, stone:8, water:3 }, mins:420,
        blurb:'A little mill house with a turning water wheel. After this, sacks of seed for sowing.', gift:{ seed:2 }, giftText:'A little sack of seed by Barnaby\'s door.' },
      favours:[ { ask:'Mm. Wheel\'s squeaking. 2 moss?', cost:{ moss:2 }, thanks:'Mm. Better.' },
                { ask:'Need a plank for the sluice. Just 1.', cost:{ plank:1 }, thanks:'That\'ll hold.' },
                { ask:'Stones for the mill race. 3, if you have them.', cost:{ stone:3 }, thanks:'Good stones. Thank you.' } ],
      quest:{ name:'Winter stores', steps:[
        { say:'The nights are drawing in, and Hazel has started counting the pantry jars twice a day. Wendel has noticed, and is worried that she is worried. Barnaby says, "Mm. Mill\'s stuck. Fix it, and there\'ll be plenty." The wheel is jammed with river stones.', job:{ name:'Free the jammed mill wheel', short:'freeing the wheel', who:'him', act:'dig', mins:240, cost:{ twig:2 } } },
        { say:'The wheel turns again, but the mill race needs shoring up before the winter rains: 4 stones and 2 twigs.', give:{ stone:4, twig:2 } },
        { say:'Barnaby mills through the night, slow and steady, and Wendel stays to help carry the sacks.', wait:420 } ],
        story:{ title:'A full pantry', text:'They brought the sacks home on the wheelbarrow, Wendel pushing and Barnaby, for once, talking. Hazel stood in the doorway and counted them, and then stopped counting. "You knew I was worried," she said. "You count the jars in your sleep," said Wendel. She threw a handful of flour at him. He threw one back. Barnaby, very quietly, went home.' },
        reward:{ light:3, seed:4 } } },

    { id:'nettle', name:'Nettle Thimble', short:'Nettle', trade:'the weaver', base:'her', look:{ hat:300, coat:180, grey:true, s:0.95 }, home:'log', door:'#3a6a7a', icon:'🧶',
      intro:'A thin, sharp-eyed gnome with a loom strapped to her back came up the path, looked Hazel up and down, and said, "Who darned that apron? Dreadful." Hazel has not quite forgiven her. She is camped by the path, weaving something blue, and pretending not to care what anyone thinks.',
      build:{ cost:{ twig:8, moss:6, stone:4 }, mins:420, who:'her', blurb:'A neat log home with a big window, for light to weave by. Nettle has sent back the first plan.' },
      movedIn:'Nettle moved into her log and hung a curtain so fine that Hazel, despite everything, went over to look at it. They talked about stitches for an hour. Neither of them will admit it.',
      sayings:['Hmph.', 'A loose thread is a loose thread. Fix it now, not later.', 'Hazel has good hands. Bad needles, but good hands.', 'I was never married. I was very busy. It was a choice.', 'Wool remembers the sheep. Be kind to it.'],
      building:{ name:'Build Nettle\'s loom shed', short:'building the loom shed', who:'her', act:'carry', cost:{ twig:8, moss:4, stone:2 }, mins:300,
        blurb:'A little open shed with her loom and coloured cloth hung to dry. After this, there is yarn.', gift:{ yarn:1 }, giftText:'A ball of yarn on Nettle\'s step, with a note: "Use it properly."' },
      favours:[ { ask:'I need berries for dye. 3. Not squashed ones.', cost:{ berry:3 }, thanks:'Acceptable. Thank you.' },
                { ask:'Moss for a green dye. 3, and fresh.', cost:{ moss:3 }, thanks:'Hmph. Good moss. Thank you.' },
                { ask:'Honey for my throat. 1. I am not unwell. I am simply asking.', cost:{ honey:1 }, thanks:'...Thank you.' } ],
      quest:{ name:'The wedding blanket', steps:[
        { say:'Nettle has found out, by being very nosy, that Wendel and Hazel married in a hurry on the road, with no feast and no gifts. "No wedding blanket," she says. "Disgraceful." She wants to weave them one, and needs dye: 3 berries and 3 moss.', give:{ berry:3, moss:3 } },
        { say:'"The blue," says Nettle. "Hazel wore blue. I need the little blue flower that grows by water." Look for it somewhere on the land.', find:{ name:'a blue water-flower', icon:'💠' } },
        { say:'Nettle weaves for a day and a night. Hazel is not allowed near the shed, and is going quietly mad.', wait:600 } ],
        story:{ title:'The wedding blanket', text:'Nettle brought it over folded, and pushed it into Hazel\'s arms as if it were nothing. It was blue and green and gold, and in one corner, very small, were two gnomes under one tree. Hazel opened her mouth and Nettle said, "Don\'t." So Hazel hugged her instead, and Nettle, after a long, stiff moment, hugged her back.' },
        reward:{ light:3, yarn:2 } } },

    { id:'juniper', name:'Juniper Wick', short:'Juniper', trade:'the lamplighter', base:'her', look:{ hat:270, coat:220, s:0.88 }, home:'hollow', door:'#2a5a8a', icon:'🏮',
      intro:'A young gnome, hardly more than a girl, came up the path at dusk with a pole over her shoulder hung with glass jars of caught light. She looked very tired, and very far from home. "I light the way," she said, "for anyone who needs it." She has made a small camp by the path, ringed with glowing jars.',
      build:{ cost:{ twig:6, stone:6, moss:6, light:2 }, mins:420, who:'her', blurb:'A little home in a hollow tree, with a round window at the top for a lamp that never goes out.' },
      movedIn:'Juniper moved into the hollow tree and set her brightest jar in the top window. "So I can find my way home," she said. Hazel took her a blanket and a bowl of soup and stayed until she fell asleep.',
      sayings:['Every dark night has a few wisps in it. You only have to look.', 'I used to be scared of the dark. Now I just bring a jar.', 'Your window glows the warmest in the whole valley.', 'Hazel says I can come to supper any time. Is that true? Really?', 'Wendel showed me a star called Hazel\'s Lamp. I think it\'s the nicest name there is.'],
      building:{ name:'Hang glow jars along the path', short:'hanging the glow jars', who:'her', act:'carry', cost:{ twig:6, stone:4, light:4 }, mins:300,
        blurb:'Posts with jars of caught light all along the village path, so nobody walks home in the dark. After this, Juniper brings in wisps.', gift:{ light:1 }, giftText:'A wisp of light in a jar on Juniper\'s step.', site:'path' },
      favours:[ { ask:'A jar has cracked. 2 stones to make a new holder?', cost:{ stone:2 }, thanks:'There. All lit again.' },
                { ask:'Could you spare 2 dew? The wisps like a damp jar.', cost:{ water:2 }, thanks:'Look how bright it is now!' },
                { ask:'Can I have a loaf? I forgot to eat again. 1 bread.', cost:{ bread:1 }, thanks:'Thank you. Don\'t tell Hazel I forgot.' } ],
      quest:{ name:'The lamp in the window', steps:[
        { say:'Juniper has been very quiet. Hazel thinks she is homesick. Wendel thinks she is lonely. They argue about which, which is the closest thing to a quarrel they have had in weeks. Either way, her favourite wisp has gone dim. Bring her 3 dew to freshen its jar.', give:{ water:3 } },
        { say:'The wisp still will not shine. "It wants a friend," Juniper says. Look for a stray wisp out on the land after dark.', find:{ name:'a stray wisp', icon:'✨', hours:[19, 6] } },
        { say:'Hazel and Wendel invite Juniper to supper, and Hazel cooks far too much.', job:{ name:'Cook a supper for Juniper', short:'cooking supper', who:'her', act:'carry', at:'home', mins:120, cost:{ berry:2, seed:1 } } } ],
        story:{ title:'The lamp in the window', text:'After supper, Juniper said, "Do you know why I stopped here? I came over the hill at night, and I saw your window. It was the only light for miles, and someone was laughing behind it." Hazel looked at Wendel. They had both been right, it turned out. She had been homesick and lonely, both. "Well," said Hazel, "now it\'s your window too."' },
        reward:{ light:4 } } },
  ],

  // ---------- seasons (southern hemisphere, from the phone's date) ----------
  // Code tints and drifting things in index.html (SEASON_LOOK); seasonal visitors (seasons on a visitor) and events (seasons on an event).
  seasons: {
    spring: { name:'Spring', arrive:'Spring has come to the valley. Wattle on the wind, blossom on the stream, and everything in a hurry to grow.' },
    summer: { name:'Summer', arrive:'Summer. Long golden evenings, the cicadas tuning up, and Hazel insisting on hats.' },
    autumn: { name:'Autumn', arrive:'Autumn. The light has gone soft and amber, the leaves are letting go, and Wendel has found his scarf.' },
    winter: { name:'Winter', arrive:'Winter. Mist in the hollows, frost on the moss at dawn, and the fire never quite goes out.' },
  },

  // ---------- the festival: the soft ending (decided by Bryce 2026-10-25) ----------
  // Once enough neighbours live here, they propose a Greening Festival for the healed valley, and quietly tell you (only you) it
  // is really the wedding feast Wendel and Hazel never had. Festival jobs get the green ready; then, on the next evening, the
  // night itself plays as story pages, the couple dance on the green, and an "end of the beginning" page closes the main story.
  // The world keeps going after that, and the festival comes back on the same date every year.
  // {who} = the neighbour who has lived here longest. alt = cost used if nobody in the village makes one of the goods in cost.
  festival: {
    name: 'The Greening Festival',
    needFolk: 6,              // neighbours living here before the festival is proposed
    hours: [17, 23],          // the festival evening (the couple dance on the green; the neighbours gather at the table)
    jobs: [
      { id:'fest:green', name:'Mow a green for the festival', short:'mowing the green', who:'her', act:'dig', cost:{ twig:2, stone:2 }, mins:240, green:1, claims:true, spot:'green',
        blurb:'A soft, mown green on a healed patch with no home on it, with room for a long table and a little dancing.' },
      { id:'fest:table', name:'Build the long table', short:'building the long table', who:'him', act:'carry', cost:{ plank:4, twig:4 }, alt:{ twig:10, stone:4 }, mins:360, green:1, needs:['fest:green'], spot:'table',
        blurb:'One long table and two benches, long enough for the whole village and somebody\'s cousin.' },
      { id:'fest:bunting', name:'Sew the bunting', short:'sewing bunting', who:'her', act:'carry', cost:{ yarn:3, feather:3 }, alt:{ moss:4, feather:4 }, mins:300, green:1, needs:['fest:green'], spot:'bunting',
        blurb:'Little cloth flags on a string from pole to pole, every one a different colour. Hazel has opinions about the order.' },
      { id:'fest:lanterns', name:'Hang lanterns round the green', short:'hanging lanterns', who:'him', act:'carry', cost:{ light:4, twig:4, stone:2 }, mins:300, green:1, needs:['fest:green'], spot:'lanterns',
        blurb:'Paper lanterns on poles round the green, each with a wisp of light inside, so the dancing can go on after dark.' },
      { id:'fest:arch', name:'Weave a flower arch', short:'weaving the arch', who:'her', act:'carry', cost:{ seed:4, moss:4, berry:2 }, mins:360, green:1, needs:['fest:green'], spot:'arch',
        blurb:'An arch of willow woven with wattle and paper daisies, for the way onto the green. (You know what it is really for.)' },
      { id:'fest:feast', name:'Help bake the festival feast', short:'baking the feast', who:'him', act:'carry', cost:{ bread:3, honey:2, berry:4 }, alt:{ seed:4, berry:6, water:2 }, mins:300, green:1, needs:['fest:table'], spot:'table',
        blurb:'Loaves, honey cakes, berry tarts and one enormous pie. Wendel is in charge of tasting.' },
    ],
    idea: { title:'A festival?', text:'The neighbours came up the path together this morning, which has never happened before, and stood in a row outside the stump house looking pleased with themselves. "The valley is green again," said {who}. "Every patch of it. That deserves a festival." Wendel was delighted. Hazel was already making a list. A Greening Festival, then: a mown green, a long table, bunting, lanterns, a flower arch and a feast.' },
    secret: { title:'A secret', text:'As the others went off arguing about bunting, {who} hung back and beckoned to you, the helper nobody quite sees. "They married on the road, those two," {who} whispered. "No feast. No flowers. No dancing. So this festival is going to be their wedding feast, and they are not to know until the night. Not a word." A pause. "And the flower arch is not for the gate."' },
    ready: 'Everything is ready on the green. The festival is {when}, from five o\'clock.',
    night: [
      { key:'fest-night', title:'The Greening Festival', text:'The lanterns came on one by one as the sun went down, and the whole village walked to the green in its best clothes. Wendel had combed his beard twice. Hazel had a sprig of wattle behind her ear. The table was so full that the benches creaked, and someone had to hold the pie down.' },
      { key:'fest-surprise', title:'The surprise', text:'Before anyone sat down, {who} climbed onto the bench and tapped a cup. "This is a festival for the valley," {who} said, "and it is also a wedding feast. Yours. A year late, and you are not getting out of it." Everyone turned to look at Wendel and Hazel, standing under the flower arch, which was suddenly, obviously, a wedding arch. Hazel put both hands over her mouth. Wendel said "Oh," and then nothing at all for quite a long time.' },
      { key:'fest-dance', title:'The first dance', text:'They danced on the green, badly and happily, while the neighbours clapped the time and the wisps came down out of the dark to watch. "You never told me you could dance," said Hazel. "I can\'t," said Wendel. "I\'m just holding on to you." Over the stump house, low and warm, the first star came out.' },
    ],
    end: { key:'fest-end', title:'The end of the beginning', text:'When you first came, this was a logged clearing with ruts in it, two small gnomes and a wheelbarrow. Now it is a village. This is not the end: the seasons will keep turning, visitors will keep coming, and Wendel and Hazel will keep growing older together, slowly, the way the trees do. Come and visit whenever you like. They will be glad to see you.' },
    reward: { light:5 },
    yearly: { title:'Another year', text:'The bunting came out of the chest again this morning, a little faded, and the lanterns went back up round the green. "{years}," said Hazel. "Doesn\'t feel like it," said Wendel. "Feels like longer," said Hazel, and kissed him, to show she meant it nicely. Tonight there is a festival on the green.' },
  },

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
      { id:'firstfire', weight:2, text:'The first proper fire of autumn. Wendel claimed the warm side. Hazel claimed Wendel.', hours:[17,22], seasons:['autumn'] },
      { id:'fog',       weight:2, text:'A thick winter fog. They found each other by following the smell of toast.', hours:[6,10], seasons:['winter'], give:{ water:2 } },
      { id:'puddles',   weight:2, text:'Rain all night. Hazel put out every pot they own. Wendel stepped in three of them.', seasons:['winter'], give:{ water:3 } },
      { id:'chicks',    weight:2, text:'Somewhere in the hedge, very small birds have started asking for breakfast all day long.', hours:[6,17], seasons:['spring'], stage:'green' },
      { id:'blossom',   weight:2, text:'Blossom from somewhere upstream floated past on the stream like confetti.', seasons:['spring'], stage:'meadow', give:{ seed:1 } },
      { id:'longeve',   weight:2, text:'A long, warm evening. They ate supper outside and stayed until the stars came.', hours:[18,21], seasons:['summer'] },
      { id:'windfall',  weight:2, text:'A windy night shook the last berries down. Breakfast, sorted.', seasons:['autumn'], give:{ berry:2 } },
      { id:'wash',      weight:2, text:'Washing day. Two tunics, one apron, a very small pair of socks. Dry by noon.', hours:[8,12], task:'clothesline' },
    ],
  },
};
