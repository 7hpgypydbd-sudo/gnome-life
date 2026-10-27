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
    // from the seed bed (pantry: shown on their own shelf in the pack; never offered by the land)
    carrot:  { name:'carrot',  icon:'🥕', pantry:true },
    lettuce: { name:'lettuce', icon:'🥬', pantry:true },
    bean:    { name:'beans',   icon:'🫛', pantry:true },
    pumpkin: { name:'pumpkin', icon:'🎃', pantry:true },
  },

  // What the land offers while you are away. One every offerEvery minutes, at most offerCap lying about.
  offerEvery: 20, offerCap: 8,
  offers: [ // weight by time of day: day / night
    { kind:'twig',  day:6, night:2 },
    { kind:'moss',  day:4, night:2 },
    { kind:'stone', day:5, night:1.5 },   // stones go into nearly every build (docs/PLAN.md "Progression review", fix 3): twice as common as before
    { kind:'acorn', day:1, night:1 },
    { kind:'seed',  day:1, night:0 },
    { kind:'water', day:3, night:1 },   // dew, mostly mornings (boosted in code before 10am)
    { kind:'light', day:0, night:5 },   // wisps of light only at night
    { kind:'berry',   day:1.5, night:0 },  // wild berries, daytime only
    { kind:'feather', day:0.5, night:0.5 },  // dropped by passing birds
  ],

  // Crops for the seed bed (Hazel's mother's seed tin, docs/STORY.md page 1.4). One crop fills the whole bed.
  // plant: what sowing costs; water: dew to start it growing; grow: minutes from watering to ready; harvest: what picking gives
  // (into the pantry, plus seed back); green: how much life it gives back to the land; needs: when it can be sown
  // (flag:x, a finished job id, or grown:n = after n harvests). free: the first sowing costs nothing (Wendel's one pumpkin seed).
  // look: how index.html draws it (drawCrop). Order here is the order in the seed bed menu.
  crops: {
    carrot:  { name:'carrots', look:'carrot', plant:{ seed:1 }, water:1, grow:180, harvest:{ carrot:3, seed:1 }, green:1,
               blurb:'Feathery tops and orange shoulders. The first thing from the tin, and the quickest to trust.' },
    lettuce: { name:'lettuces', look:'lettuce', plant:{ seed:1 }, water:1, grow:120, harvest:{ lettuce:2, seed:1 }, green:1, needs:['flag:firstpick'],
               blurb:'A pinch of lettuce seed. Up fast, soft green rosettes, and the rabbit has opinions about them.' },
    bean:    { name:'beans', look:'bean', plant:{ seed:2 }, water:1, grow:480, harvest:{ bean:4, seed:1 }, green:2, needs:['beanpoles'],
               lock:'Needs the bean poles first', blurb:'They climb the poles all day and hang their pods by evening. Pick them young.' },
    pumpkin: { name:'a pumpkin', look:'pumpkin', plant:{ seed:2 }, free:'pumpkin', water:2, grow:1440, harvest:{ pumpkin:1, seed:2 }, green:3, needs:['grown:3'],
               lock:'After three harvests', once:true, blurb:'Wendel\'s one enormous seed, saved "for something special". A whole day and night to swell, and it takes the whole bed.' },
  },

  // Gnome tasks: you give the materials, a gnome does it over real time.
  // who: which gnome walks over and works; spot: where (prop name); green: regrowth points for the home tile.
  // act: which painted action loop plays while working (dig, water, carry); if missing, the spot decides (wheelbarrow dig, seed bed and sapling water, otherwise carry).
  // The STORY decides what is offered, not the days you have visited (docs/PLAN.md "Progression review", fix 1). needs: a finished
  // job id, 'page:<id>' (that story page has come), 'flag:<x>', or 'stage:<key>' (the home yard has reached that land stage).
  // spine: the story's own jobs (the first chain, the roof, bench and oak, the house): offered as soon as their needs are met,
  // and shown at the top of Jobs. Every other job is offered a little at a time (game.js offerTick): at most two waiting to be
  // started, and at most one new one each visit. Jobs whose needs are not met yet are not listed at all.
  tasks: [
    // retired: no longer offered (Bryce, 2026-10-26: it had no reason to exist). Kept so old saves and the "after" jobs still
    // know it; its painted gully can come back later as a one-off storm-damage event (docs/PLAN.md).
    { id:'ruts',    name:'Fill the washed-out gully', short:'filling the gully',   retired:true, who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:3, twig:2 }, mins:120, green:1, magic:2,
      blurb:'Storm water has carved a muddy gully across the yard. Wendel will fill it with stones and twigs and level the ground, so the grass can creep back.' },

    // --- chapter one: the bare clearing. The first chain, two jobs at a time, one for each of them ---
    { id:'clear',   name:'Clear the ground', short:'clearing the ground', spine:true, who:'her', act:'carry', spot:'clearing', cost:{}, give:{ twig:3, stone:3 }, mins:90, green:0, magic:1,
      blurb:'Old tins, broken pots and loggers\' rubbish everywhere. Hazel carries it all off, one piece at a time, and piles the good sticks by the house for Wendel.' },
    { id:'woodpile', name:'Gather the fallen wood',    short:'gathering wood', spine:true, who:'him', act:'gather', spot:'firewood', cost:{}, give:{ twig:2 }, mins:60, green:0, magic:1,
      blurb:'Fallen branches lie all about the yard. Wendel gathers them up, odd sticks and all, and stacks a proper woodpile by the house, bark side up, for their first fire.' },
    { id:'bed',     name:'Dig a seed bed', short:'digging the bed', spine:true, who:'her', act:'dig', spot:'clearing', cost:{ twig:2 },  mins:120, green:0, magic:1,
      needs:['clear'], blurb:'Now the ground is clear, the earth can be turned. Hazel digs it over row by row, until there is a patch of soft dark soil.' },
    { id:'spring', name:'Look for water', short:'looking for water', spine:true, who:'him', act:'dig', spot:'spring', cost:{}, give:{ water:1 }, mins:60, green:1, magic:1,
      needs:['woodpile'], blurb:'The seed bed will need water, and the creek behind the house is bone dry. Wendel walks the yard, kneeling to feel the ground and listen. Somewhere under all that old rubbish there must be a spring.',
      doneNote:'Wendel found a spring choked with stones and dead leaves by the old stump. Clear water is trickling out again, the first in this valley for a long time.' },
    { id:'bedwater', name:'Fetch water for the seed bed', short:'fetching water', spine:true, who:'him', act:'water', spot:'spring', cost:{}, mins:45, green:0, magic:1,
      needs:['bed', 'spring'], blurb:'Can after can from the new spring pool, until the fresh soil is dark and damp. Then it is ready for seeds.' },
    { id:'feeder',  name:'Set out a feeding dish', short:'setting out the dish', spine:true, who:'her', act:'carry', spot:'feeder', cost:{ stone:2, twig:1 }, mins:45, green:0, magic:1, needs:['flag:rabbit'],   // Bryce: the dish is the compromise after the rabbit's raid, beside the fence
      blurb:'A flat stone dish on a stump. Put out seed or berries and see who comes. Some will come back.' },
    // the rabbit always comes for the first sprouts (game.js rabbitDue); only then is the fence offered
    { id:'fence', act:'build',   name:'Fence the seed bed', short:'fencing the bed', spine:true, who:'him', spot:'fence',       cost:{ twig:4 },           mins:120, green:0, magic:1,
      needs:['bed', 'flag:rabbit'], blurb:'That rabbit helped itself to the sprouts. A low woven fence all round the bed, with a little gate, and something put out for it instead. It is only hungry.' },

    // --- chapter two: putting down roots (from page 2.1, the first harvest). The roof first, then the bench, then the oak;
    // the small jobs come a couple at a time, in this order ---
    { id:'roof',    name:'Moss for the shelter roof', short:'mossing the roof', spine:true, who:'her', spot:'shelter',     cost:{ moss:4 },           needs:['page:2.1'], mins:180, green:0, magic:2,
      blurb:'The canvas leaks. A thick moss roof keeps the rain out and the warmth in.' },
    { id:'bench',   name:'Build a bench by the fire', short:'building a bench', spine:true, who:'him', act:'build', spot:'logseat',  cost:{ twig:3 },          needs:['page:2.2'], mins:60,  green:0, magic:1,
      blurb:'A plank on two stout legs by the campfire, just long enough for two gnomes of an evening.' },
    { id:'sapling', name:'Plant the sapling out', short:'planting the sapling', spine:true, who:'her', act:'water', spot:'sapling',     cost:{ water:2, moss:2 },  mins:360, green:2, magic:3,
      needs:['clear', 'page:2.3'], blurb:'The little oak they carried from their old home is ready for real ground. Trees bring life back faster than anything. It will outlive us all.' },
    { id:'doorstep', name:'Lay a flat-stone doorstep', short:'laying the doorstep', who:'him', act:'dig', spot:'shelter',     cost:{ stone:3 },          needs:['page:2.1'], mins:90,  green:0,
      blurb:'So the mud stays outside. Mostly.' },
    { id:'beanpoles', name:'Raise the bean poles', short:'raising bean poles',     who:'him', act:'build', spot:'seedbed',     cost:{ twig:5 },           mins:120, green:0, needs:['bed', 'page:2.1'],
      blurb:'For the beans, which have strong opinions about climbing.' },
    { id:'clothesline', act:'build', name:'String up a washing line', short:'stringing the line', who:'her', spot:'fire',      cost:{ twig:3, moss:1 },   needs:['page:2.1'], mins:60,  green:0,
      blurb:'Two tunics, one apron, a very small pair of socks. The sun can do the drying.' },
    { id:'stump', name:'Dig out the old stump', short:'digging out the stump', who:'either', act:'dig', spot:'lanternstump', cost:{}, give:{ twig:3 }, mins:60, green:0,
      needs:['woodpile', 'page:2.1'], blurb:'An old loggers\' stump, right where the fire wants room. Whoever is free digs round the roots, rocks it loose and chops it up for the woodpile.',
      doneNote:'The old stump is gone, chopped and stacked on the woodpile. There is room round the fire now.' },
    { id:'rainbarrel', name:'Scrub the rain barrel', short:'scrubbing the barrel',   who:'either', spot:'barrel',        cost:{ twig:2, stone:1 },  mins:60,  green:0, needs:['roof'],   // after the roof: it catches the rain off it (Bryce: why have a barrel at all?)
      blurb:'The old barrel by the fire is green with slime. Scrubbed clean, it catches the rain off the roof: a can of water every so often without the walk to the spring. Whoever is free will do it.' },
    { id:'herbs',   name:'Plant a herb corner', short:'planting herbs',        who:'her', act:'water', spot:'seedbed',     cost:{ seed:2, water:2, moss:1 }, mins:180, green:1, needs:['bed', 'page:2.1'],
      blurb:'Thyme, mint and the one parsley that will not die. Good for tea and for bees.' },
    { id:'compost', name:'Start a compost heap', short:'starting the compost',       who:'him', act:'dig', spot:'wheelbarrow', cost:{ twig:2, moss:3, water:1, carrot:1 }, mins:180, green:0, needs:['page:2.1'],
      blurb:'Peelings, leaves and patience. Dug into the seed bed, it makes the soil rich: one extra seed every harvest.' },
    { id:'springring', name:'Ring the spring with stones', short:'ringing the spring', who:'either', act:'dig', spot:'spring', cost:{ stone:5 }, mins:90, green:0, needs:['bedwater', 'page:2.1'],
      blurb:'Flat stones round the spring pool, so the edges don\'t crumble and the birds have somewhere to stand. Not a well. Wells are for villages.' },
    // parked (Bryce, 2026-10-26: the yard by the fire was cramped): the old stump and its lamp post are dug out instead. Kept so old saves still read.
    { id:'lantern', retired:true, act:'build', name:'Mend the old lantern', short:'mending the lantern',       who:'him', spot:'fire',        cost:{ twig:1, stone:1, light:1 }, needs:['flag:firstpick'], mins:90, green:0,
      blurb:'It needs a wisp of caught light, and a gnome who admits he is not good at wiring.' },

    // --- chapter three: a proper home (from page 3.0, after "Our first week"). The house is the story; the garden patch
    // appears beside the yard, and when it opens, the creature corner comes with it ---
    { id:'house1', name:'Hollow out the old stump', short:'hollowing the stump', spine:true, who:'him', act:'build', spot:'shelter', cost:{ twig:4, stone:3 }, mins:360, green:0, needs:['page:3.0', 'doorstep'],
      blurb:'The loggers left the stump; the gnomes will make it a home. Room for a bed, a hearth and, Wendel insists, a workbench.' },
    { id:'house2', name:'Fit a plank wall and windows', short:'fitting the windows', spine:true, who:'him', act:'build', spot:'shelter', cost:{ twig:6, moss:2, light:2 }, mins:360, green:0, needs:['house1'],
      blurb:'Planks across the gap, and two round windows with a wisp of light set in the glass so they never quite go dark.' },
    { id:'house3', name:'Raise the roof and chimney', short:'raising the roof', spine:true, who:'her', act:'build', spot:'shelter', cost:{ twig:8, moss:6, stone:4 }, mins:480, green:0, needs:['house2'],
      blurb:'Bark shingles instead of patched canvas, and a stone chimney for a real hearth. After this, it is a house.' },
    { id:'leanto',  name:'Raise Wendel\'s workshop lean-to', short:'raising the workshop', spine:true, who:'him', act:'build', spot:'shelter', cost:{ twig:8, moss:6, stone:4 }, mins:360, green:0, needs:['house1', 'page:3.4'],
      blurb:'A lean-to of his own against the side of the house, with a hook for every tool and a little window for the stars. His mess lives in here now. Hazel is delighted.' },
    { id:'path',    name:'Lay a stepping-stone path', short:'laying the path',  who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:6 },          mins:240, green:0, needs:['doorstep', 'page:3.0'],
      blurb:'From the doorstep to the fire, so the grass can grow where the feet used to go.' },
    { id:'wildmeadow', name:'Sow the meadow strip', short:'sowing the meadow',    who:'her', act:'water', spot:'wheelbarrow', cost:{ seed:5, water:3 },  mins:360, green:3, needs:['bedwater', 'page:3.0'],
      blurb:'A long ribbon of grasses and clover along the fence, left to grow wild.' },
    { id:'windowbox', name:'Hang a window box', short:'hanging the window box',        who:'her', act:'water', spot:'shelter',     cost:{ twig:2, moss:2, seed:1 }, mins:90, green:1, needs:['house3'],
      blurb:'Now there is a proper house with a proper window. A home is not a home until something is flowering under it.' },
    // the creature corner: comes with the garden (flag:garden = the garden patch has opened)
    { id:'birdbath', name:'Set a stone birdbath', short:'setting the birdbath',      who:'him', act:'water', spot:'stonebench',  cost:{ stone:4, water:2 }, mins:120, green:0, needs:['flag:garden'],
      blurb:'A hollow stone full of dew. Somebody small will want a wash.' },
    { id:'hedgehoghouse', name:'Build a leaf-pile shelter', short:'piling the leaves', who:'her', spot:'fence',  cost:{ twig:3, moss:3 },   mins:180, green:0, needs:['flag:garden'],
      blurb:'A heap of leaves and sticks in a quiet corner. Please do not tidy it.' },
    { id:'nestbox', name:'Nail up a nest box', short:'nailing up the nest box',         who:'him', spot:'fence',       cost:{ twig:3, feather:1, acorn:1 }, mins:180, green:0, needs:['fence', 'flag:garden'],
      blurb:'The hole must be the right size. Too big and the wrong sort of bird moves in.' },
    { id:'pond',    name:'Dig a little dew pond', short:'digging the pond',      who:'him', act:'dig', spot:'wheelbarrow', cost:{ stone:4, twig:2, water:3 }, mins:360, green:0, needs:['spring', 'flag:garden'],
      blurb:'Just big enough for a frog and a sky, in the corner of the garden, fed by a trickle from the spring. Lined with clay and lots of stones.' },
    { id:'berrybush', name:'Plant a berry bush', short:'planting the berry bush',       who:'her', act:'water', spot:'sapling',     cost:{ seed:2, water:2, moss:2 }, mins:300, green:2, needs:['bedwater', 'flag:garden'],
      blurb:'Berries for jam, and berries for the birds. Mostly the birds.' },
    { id:'beehive', name:'Hang a hollow-log bee house', short:'hanging the bee house', who:'him', spot:'fence',     cost:{ twig:4, moss:2, acorn:2 }, mins:240, green:0, needs:['herbs', 'flag:garden'],
      blurb:'For the little native bees who live alone and sting almost never.' },
    { id:'toadstools', name:'Coax a ring of toadstools', short:'coaxing toadstools', who:'her', act:'water', spot:'sapling',   cost:{ moss:4, water:2, light:2 }, mins:300, green:1, needs:['flag:garden'],
      blurb:'A little light, a lot of damp. The ring will be the best seat in the garden.' },

    // --- retired by the progression review (2026-10-27): no story around them (the seed tin is Hazel's mother's, page 1.4;
    // the path lights are Juniper's; the acorns became the one grove below). Kept so old saves still read.
    { id:'acornplant', retired:true, name:'Plant acorns for a grove', short:'planting acorns', who:'her', act:'dig', spot:'sapling',    cost:{ acorn:5, water:2 }, mins:360, green:2, needs:['sapling'],
      blurb:'Most will be eaten or forgotten. That is how a forest begins.' },
    { id:'seedsave', retired:true, name:'Keep a seed tin', short:'filling the seed tin',           who:'her', spot:'shelter',     cost:{ seed:4, twig:2 },   mins:180, green:0,
      blurb:'Labelled in her tiny handwriting. Next year starts with this year\'s best.' },
    { id:'lanternpath', retired:true, name:'Line the path with glow jars', short:'lining the path', who:'her', spot:'fence', cost:{ light:5, stone:2 }, mins:240, green:0, needs:['path'],
      blurb:'Wisps in jars, so nobody trips on the way back from the creek.' },
    // --- night lights: glow-worm lanterns and street lamps ---
    { id:'wormlantern', retired:true, name:'Hang glow-worm lanterns', short:'hanging the lanterns', who:'her', act:'carry', spot:'shelter', cost:{ twig:2, moss:2, light:1 }, mins:120, green:0,
      blurb:'Little glass jars with a few sleepy glow-worms and a scrap of moss. Hung by the door, they light the way home.' },
    { id:'wormlamp', retired:true, name:'Set glow-worm street lamps', short:'setting the lamps', who:'him', act:'carry', spot:'fence', cost:{ twig:4, stone:2, light:2 }, mins:240, green:0, needs:['wormlantern'],
      blurb:'Four little lamp posts along the yard, each with a jar of worms. Wendel named them all and will not say what the names are.' },
    // --- little makes (docs/DECORATIONS.md): each patch earns 4-5 small makes per land stage, paid with what you gather, so the pack never piles up.
    // make: which patch (yard = home tile 0,0; garden = the couple's garden 0,1). stage: the land stage of THAT patch they come with. at: their fixed
    // spot on that patch (yard layout plan); nothing to place or drag. Either gnome can make any of them, one job at a time. Only planted ones give green.
    // barrow, swing, sign and wildflowers were jobs before and keep their ids, so a garden that already made them still has them.
    { id:'barrow', make:'yard', stage:'barren', at:[0.85, 0.92], name:'Make a little wheelbarrow', short:'making a wheelbarrow', who:'either', act:'build', spot:'wheelbarrow', cost:{ twig:2, stone:1 }, mins:40, green:0,
      blurb:'The old one lost its wheel on the hill. This one is smaller, and mostly for Hazel\'s flowers.', doneNote:'The little wheelbarrow is done, and already full of moss.' },
    { id:'firering', make:'yard', stage:'barren', at:[0.52, 0.48], name:'Ring the fire with stones', short:'ringing the fire', who:'either', act:'dig', cost:{ stone:3 }, mins:30, green:0,
      blurb:'So the sparks stay where they\'re put.' },
    { id:'potstools', make:'yard', stage:'barren', at:[0.40, 0.53], name:'Two upturned-pot stools', short:'setting out the stools', who:'either', act:'carry', cost:{ twig:1, moss:1 }, mins:20, green:0,
      blurb:'They had a lot of pots. Now they have chairs.' },
    { id:'spinner', make:'yard', stage:'barren', at:[0.08, 0.30], name:'A tin-can wind spinner', short:'making the spinner', who:'either', act:'build', cost:{ twig:2, stone:1 }, mins:30, green:0,
      blurb:'Made from the loggers\' old tins. It squeaks. Wendel calls that music.' },
    { id:'scraper', make:'yard', stage:'barren', at:[0.29, 0.39], name:'A boot-scraper stone', short:'setting the scraper', who:'either', act:'dig', cost:{ stone:2 }, mins:20, green:0,
      blurb:'For the mud. Hazel\'s idea, Wendel\'s boots.' },

    { id:'doorpots', make:'yard', stage:'green', at:[0.41, 0.36], name:'Flower pots by the door', short:'potting flowers', who:'either', act:'water', cost:{ seed:2, water:2, moss:1 }, mins:30, green:1,
      blurb:'Three of the travelling pots, finally with something in them.' },
    { id:'doormat', make:'yard', stage:'green', at:[0.36, 0.35], name:'A woven grass doormat', short:'weaving the doormat', who:'either', act:'craft', cost:{ moss:3, twig:2 }, mins:40, green:0,
      blurb:'Wipe your feet. Yes, you.' },
    { id:'scarecrow', make:'yard', stage:'green', at:[0.60, 0.69], name:'A little scarecrow', short:'making the scarecrow', who:'either', act:'build', cost:{ twig:3, moss:1, feather:1 }, mins:40, green:0, needs:['bed'],
      blurb:'It does not scare the rabbit. The rabbit naps under it.' },
    { id:'pebbles', make:'yard', stage:'green', at:[0.58, 0.74], name:'Pebble edging round the seed bed', short:'edging the bed', who:'either', act:'dig', cost:{ stone:5 }, mins:45, green:0, needs:['bed'],
      blurb:'Little white pebbles, one at a time, all round the bed.' },
    { id:'daisypot', make:'yard', stage:'green', at:[0.75, 0.50], name:'A pot of daisies where the old stump stood', short:'potting daisies', who:'either', act:'water', cost:{ seed:2, water:1, moss:1 }, mins:25, green:1, needs:['stump'],
      blurb:'The spot where the old stump stood needed something to do.' },

    { id:'swing', make:'yard', stage:'meadow', at:[0.18, 0.80], name:'Hang a bark swing', short:'hanging the swing', who:'either', act:'build', cost:{ twig:4, moss:2, acorn:1 }, mins:45, green:0, needs:['sapling'],
      blurb:'From the lowest branch of the oak. For the afternoons when nothing needs doing.' },
    { id:'sundial', make:'yard', stage:'meadow', at:[0.87, 0.26], name:'A sundial', short:'setting the sundial', who:'either', act:'build', cost:{ stone:5, twig:2, feather:1 }, mins:45, green:0,
      blurb:'It\'s always teatime somewhere. Usually here.' },
    { id:'herbpots', make:'yard', stage:'meadow', at:[0.48, 0.26], name:'Herb pots by the rain barrel', short:'potting herbs', who:'either', act:'water', cost:{ seed:3, water:2, moss:2 }, mins:35, green:1,
      blurb:'Mint, because it will grow anywhere, and thyme, because Hazel insists.' },
    { id:'wreath', make:'yard', stage:'meadow', at:[0.36, 0.33], name:'A wattle wreath on the door', short:'weaving the wreath', who:'either', act:'craft', cost:{ twig:3, seed:2, berry:2 }, mins:30, green:0,
      blurb:'Golden and smelling of honey. It changes with the seasons.' },
    { id:'plank', make:'yard', stage:'meadow', at:[0.73, 0.25], name:'A plank over the spring trickle', short:'laying the plank', who:'either', act:'build', cost:{ twig:5, stone:2 }, mins:30, green:0, needs:['spring'],
      blurb:'So nobody has to hop.' },

    { id:'hammock', make:'yard', stage:'wood', at:[0.10, 0.70], name:'A hammock', short:'stringing the hammock', who:'either', act:'craft', cost:{ twig:6, moss:4, feather:2 }, mins:45, green:0, needs:['sapling'],
      blurb:'Built for one. Used by two.' },
    { id:'chime', make:'yard', stage:'wood', at:[0.42, 0.25], name:'A snail-shell wind chime', short:'stringing the chime', who:'either', act:'craft', cost:{ twig:4, stone:5, feather:2 }, mins:40, green:0,
      blurb:'Every shell was empty when they found it. They checked.' },
    { id:'nameboard', make:'yard', stage:'wood', at:[0.36, 0.33], name:'A name board over the door', short:'painting the name board', who:'either', act:'build', cost:{ twig:6, stone:2, berry:2, acorn:2 }, mins:45, green:0, needs:['house3'],
      blurb:'Hazel paints it in her best lettering: The Gnomestead. Wendel stands underneath and reads it aloud, twice.' },
    { id:'cushion', make:'yard', stage:'wood', at:[0.62, 0.40], name:'A moss cushion on the bench', short:'stuffing the cushion', who:'either', act:'craft', cost:{ moss:8, feather:2 }, mins:25, green:0, needs:['bench'],
      blurb:'Softer. Greener. Slightly damp.' },
    { id:'sign', make:'yard', stage:'wood', at:[0.90, 0.55], name:'Carve a welcome sign', short:'carving the sign', who:'either', act:'build', cost:{ twig:6, feather:2, berry:2, stone:2 }, mins:45, green:0,
      blurb:'"All Creatures Welcome. Please Wipe Paws." The second line took three tries.' },

    { id:'gstones', make:'garden', stage:'green', at:[0.45, 0.20], name:'Stepping stones into the garden', short:'laying stepping stones', who:'either', act:'dig', cost:{ stone:5 }, mins:45, green:0,
      blurb:'Flat stones, a gnome\'s stride apart. Wendel\'s stride.' },
    { id:'wicket', make:'garden', stage:'green', at:[0.46, 0.02], name:'A little wicket gate', short:'hanging the gate', who:'either', act:'build', cost:{ twig:5 }, mins:40, green:0,
      blurb:'Not to keep anyone out. Just to have a gate.' },
    { id:'mousering', make:'garden', stage:'green', at:[0.24, 0.78], name:'A pebble ring round the mouse house', short:'ringing the mouse house', who:'either', act:'dig', cost:{ stone:4, moss:1 }, mins:30, green:0, needs:['flag:toadWalk'],
      blurb:'So the mice have a front garden too.' },
    { id:'sitstone', make:'garden', stage:'green', at:[0.64, 0.40], name:'A sitting stone', short:'setting the sitting stone', who:'either', act:'dig', cost:{ stone:4, moss:2 }, mins:35, green:0,
      blurb:'Warm by noon. Hazel\'s thinking spot.' },
    { id:'wildflowers', make:'garden', stage:'green', at:[0.86, 0.14], name:'A wildflower patch', short:'scattering seed', who:'either', act:'water', cost:{ seed:3, water:2 }, mins:40, green:2,
      blurb:'Not in rows. Wildflowers choose their own places.' },

    { id:'border', make:'garden', stage:'meadow', at:[0.45, 0.26], name:'A flower border along the path', short:'planting the border', who:'either', act:'water', cost:{ seed:4, water:2, moss:2 }, mins:45, green:1,
      blurb:'Foxgloves at the back, daisies at the front, a wiggle in the middle.' },
    { id:'arch', make:'garden', stage:'meadow', at:[0.46, 0.09], name:'A sweet-pea arch', short:'bending the arch', who:'either', act:'build', cost:{ twig:5, seed:2, water:1 }, mins:45, green:1,
      blurb:'Bent willow and sweet peas. Smells like summer.' },
    { id:'mousetable', make:'garden', stage:'meadow', at:[0.33, 0.80], name:'A mouse-sized table and stools', short:'making a tiny table', who:'either', act:'craft', cost:{ acorn:4, twig:2 }, mins:25, green:0, needs:['flag:miceIn'],
      blurb:'Wendel made them from acorn cups. The mice approve.' },
    { id:'stonefrog', make:'garden', stage:'meadow', at:[0.17, 0.58], name:'A stone frog', short:'carving the stone frog', who:'either', act:'craft', cost:{ stone:6, moss:1 }, mins:40, green:0, needs:['pond'],
      blurb:'It doesn\'t croak. The real frog is unimpressed.' },
    { id:'birddish', make:'garden', stage:'meadow', at:[0.90, 0.56], name:'A bird dish on a post', short:'putting up the bird dish', who:'either', act:'build', cost:{ stone:3, twig:3, water:1 }, mins:30, green:0,
      blurb:'A saucer of dew up high, out of the rabbit\'s reach.' },

    { id:'logbench', make:'garden', stage:'wood', at:[0.26, 0.14], name:'A mossy log bench', short:'rolling the log bench', who:'either', act:'build', cost:{ twig:6, moss:6 }, mins:45, green:0,
      blurb:'An old log, a lot of moss, room for two and a rabbit.' },
    { id:'ferns', make:'garden', stage:'wood', at:[0.08, 0.30], name:'A fern corner', short:'planting ferns', who:'either', act:'water', cost:{ seed:4, moss:4, water:3 }, mins:40, green:1,
      blurb:'Ferns like the dark and the damp. So does Gerald.' },
    { id:'willowseat', make:'garden', stage:'wood', at:[0.40, 0.62], name:'A willow seat for two', short:'weaving the willow seat', who:'either', act:'craft', cost:{ twig:8, moss:2, feather:1 }, mins:45, green:0, needs:['pond'],
      blurb:'Woven by Hazel. Sat in mostly by Wendel.' },
    { id:'pebblepath', make:'garden', stage:'wood', at:[0.64, 0.59], name:'A painted pebble path to the creature corner', short:'painting pebbles', who:'either', act:'craft', cost:{ stone:8, berry:3, feather:1 }, mins:45, green:0,
      blurb:'Every pebble painted with a different animal. One is a snail.' },

    // --- the animals' side stories (docs/ANIMALS.md): homes and little kindnesses that come up as each animal's story goes on ---
    { id:'earthbank', make:'garden', stage:'green', at:[0.70, 0.74], name:'Heap a soft earth bank', short:'heaping the earth bank', who:'either', act:'dig', cost:{ stone:2, moss:1 }, mins:40, green:0, needs:['flag:rabbitTruce'],
      blurb:'A soft mound of loose earth in the creature corner. A rabbit should have a proper home, Wendel says.' },
    { id:'clover', make:'garden', stage:'green', at:[0.52, 0.82], name:'Sow a clover strip', short:'sowing clover', who:'either', act:'water', cost:{ seed:3 }, mins:30, green:0, needs:['flag:rabbitHome'],
      blurb:'Clover for the rabbit\'s side of the fence. Peace costs three seeds.' },
    { id:'mousedoor', make:'yard', stage:'barren', at:[0.62, 0.79], name:'Cut a mouse door in the fence', short:'cutting a mouse door', who:'either', act:'build', cost:{ twig:1 }, mins:20, green:0, needs:['flag:mouseGap'],
      blurb:'A bark flap on a leather hinge, low in the seed bed fence, so the mouse children can come and go without making new holes.' },
    { id:'owlbox', make:'yard', stage:'wood', at:[0.12, 0.74], name:'Put up an owl box by the oak', short:'putting up the owl box', who:'either', act:'build', cost:{ twig:4, moss:2, feather:1 }, mins:180, green:0, needs:['sapling'],
      blurb:'The little oak is not big enough to hold one yet, so Wendel sets a tall post beside it. A box with a round hole, just so, for the owl.' },

    // --- with the neighbours: jobs that use what they make (each waits for that neighbour's trade building) ---
    { id:'workbench', name:'Fit Wendel a proper workbench', short:'fitting the workbench', who:'him', spot:'shelter', cost:{ plank:4, stone:2 }, mins:240, green:0, needs:['trade:tobias', 'leanto'],
      blurb:'In his workshop: real planks, a vice, and a drawer for the things he swears he will tidy away.' },
    { id:'quilt', name:'Knit a winter quilt', short:'knitting the quilt', who:'her', act:'sit', spot:'shelter', cost:{ yarn:4, moss:2 }, mins:300, green:0, needs:['trade:nettle'],
      blurb:'Square by square, of an evening. Wendel holds the wool and talks too much.' },
    { id:'pantry', name:'Fill the pantry for winter', short:'filling the pantry', who:'her', spot:'shelter', cost:{ bread:2, honey:1, carrot:3, bean:3 }, mins:180, green:0, needs:['trade:mabel', 'trade:clem'],
      blurb:'Jars, sacks and one very good cake tin. Let it snow. (It will not snow. But still.)' },
    { id:'bridge', name:'Build a bridge at the stepping stones', short:'building the bridge', who:'him', act:'build', cost:{ plank:4, stone:4, twig:4 }, mins:420, green:0, needs:['trade:tobias'], needsTile:'1,-1',
      blurb:'Tobias draws it, Wendel builds it, and the far side of the stream can finally be reached with dry feet.' },

    // --- the grove: one moment, once the yard is young woodland and the little oak is in ---
    { id:'greatgrove', name:'Plant the grove', short:'planting the grove',         who:'her', act:'dig', spot:'sapling',     cost:{ acorn:8, seed:4, water:4 }, mins:360, green:3, needs:['sapling', 'stage:wood'],
      blurb:'Oaks, wattles and one very hopeful fig, round the little oak so it has company. They will not see it finished. Someone will.' },
    { id:'picnic', retired:true, name:'A thank-you picnic for the garden', short:'laying the picnic', who:'her', spot:'stonebench', cost:{ berry:4, moss:2, acorn:2 }, mins:120, green:0,
      blurb:'Crumbs for the ants, berries for the birds, one slice of cake for the gnomes.' },
  ],

  // Regrowing a neighbouring tile: the old single job, kept only so a garden that was half-way through it can finish (see heal below).
  regrow: { name:'Coax the land next door', short:'coaxing the land', who:'her', cost:{ seed:3, moss:3, water:2 }, mins:360, magic:4, minLevel:2,
            blurb:'Seeds, moss and dew, and a little of their magic, and the bare ground next door will green.' },

  // Healing the bare tiles (docs/PLAN.md "Healing the bare tiles", Bryce 2026-10-27). Every bare tile beyond home has a kind
  // (game.js tileKind) and its own chain of jobs, one after another, like the home yard. Either gnome can do any of them.
  // Putting right the hurt (clearing, forking, building homes) gives 0 green; only life gives green, often a while later:
  // later: [{ after: minutes after the job is done, green, note, ev: what appears (index.html HEAL_LOOK) }].
  // wait: the next job waits this long after this one (seedlings growing). spell: the kind's Wood spirit spell helps this job.
  // needsFlow: the water must be able to reach this stretch (a flowing stretch next door, or the home spring just above).
  // once: done once for the whole valley (the nursery shelf at home). atHome: the job is done at home, not on the patch.
  // A tile moves through the same land stages as home (4 / 12 / 26). On a lot where a neighbour settles, or the couple's
  // garden (0,1), the chain stops at first green and the home or garden takes over.
  heal: {
    kinds: {
      meadow: { name:'The rubbish heap', patch:'the old rubbish heap', spell:'wind',
        card:{ who:'her', text:'Loggers\' junk and a fence that fences nothing. Clear it, soften the ground, and let the wildflowers have it. They\'ll know what to do.' },
        lesson:{ title:'Ask the wind', text:`"Seeds are travellers. They only need a lift. The wind goes everywhere and sees everything, and it loves to be asked a favour. Throw your seeds, little luck, and ask the wind to carry them to the corners nobody can reach."` },
        steps:[
          { id:'rubbish', name:'Pick up the loggers\' rubbish', short:'picking up rubbish', cost:{}, give:{ twig:2, stone:2 }, mins:60, act:'pickup',
            blurb:'Rusty tins, a cracked teacup, coils of old wire. Piece by piece it goes. Some of it might come in useful one day, or so Wendel says about everything.' },
          { id:'fence', name:'Pull out the old fence', short:'pulling out the fence', cost:{}, give:{ twig:2 }, mins:90, act:'gather',
            blurb:'A fence round nothing, keeping nobody out. Post by post it comes up, and the good posts are stacked to use again.' },
          { id:'fork', name:'Fork the trampled ground', short:'forking the ground', cost:{ twig:1 }, mins:120, act:'dig',
            blurb:'Boots and cart wheels have pressed this earth as hard as a plate. Patch by patch it is forked loose until it is soft and dark.' },
          { id:'water', name:'Water the forked earth', short:'watering the earth', cost:{ water:2 }, mins:60, act:'water',
            blurb:'Two or three trips from the spring with the can. Soft wet earth is how old seeds know it is safe to wake.',
            later:[ { after:30, green:4, ev:'haze', note:'Old seeds that had waited years in the hard ground have woken in the soft wet earth. There is a haze of green by the old rubbish heap.' } ] },
          { id:'roll', name:'Roll seed balls', short:'rolling seed balls', cost:{ seed:2, water:1, moss:1 }, mins:45, act:'dig', atHome:true,
            blurb:'Back at home: mud, a little moss and wildflower seed, rolled between the palms into balls the size of a pea. Messy, and very satisfying.' },
          { id:'toss', name:'Toss the seed balls', short:'tossing seed balls', cost:{}, mins:90, act:'toss', spell:true,
            blurb:'A handful here, a handful there, never in rows. Wherever one lands, something will come up.',
            later:[ { after:120, green:1, ev:'sprout1', note:'The first seed balls have sprouted on the rubbish heap patch.' }, { after:240, green:1, ev:'sprout2' }, { after:360, green:1, ev:'sprout3' },
                    { after:480, green:1, ev:'sprout4' }, { after:600, green:1, ev:'sprout5' }, { after:720, green:1, ev:'sprout6', note:'Every seed ball by the old rubbish heap has come up. It is starting to look like a meadow.' } ] },
          { id:'logpile', name:'Stack a beetle log pile', short:'stacking a log pile', cost:{ twig:2 }, mins:60, act:'build',
            blurb:'The old fence posts, stacked loosely in the shade with gaps between. Beetles like gaps. So do the things that like beetles.',
            later:[ { after:120, green:2, ev:'beetles', note:'Beetles have moved into the old fence posts. The ground round the log pile is waking up.' },
                    { after:600, green:2, ev:'skink', note:'A skink has moved in under the log pile and suns itself on top every morning.' } ] },
          { id:'sapling', name:'Plant a sapling at the meadow\'s edge', short:'planting a sapling', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2, tree:'gum',
            blurb:'One young gum where the meadow meets the bare ground, with a ring of sticks round it so nobody nibbles it.',
            later:[ { after:720, green:2, ev:'knee', note:'The sapling by the meadow is knee-high now.' }, { after:2880, green:2, ev:'tall', note:'The sapling by the meadow is taller than a gnome.' } ] },
          { id:'beestone', name:'Set a bee stone', short:'setting a bee stone', cost:{ stone:2, water:1 }, mins:45, act:'dig',
            blurb:'A flat stone in the sun with a shallow dish of water, so the bees have somewhere to drink without drowning.',
            later:[ { after:180, green:2, ev:'bees', note:'Bees have found the meadow by the old rubbish heap. You can hear it before you see it.' },
                    { after:600, green:2, ev:'butterflies', note:'Butterflies over the meadow. Clem says the honey tastes of it.' },
                    { after:1200, green:2, ev:'flowers', note:'Wildflowers have seeded themselves round the bee stone.' } ] },
        ] },
      creature: { name:'The cracked earth', patch:'the cracked earth', spell:'cloud',
        card:{ who:'him', text:'Poor old ground, cracked like a dry loaf. We can\'t fix it on our own, love. But we know some diggers who could, if we make them welcome.' },
        lesson:{ title:'Call a rain cloud', text:`"See how the ground has split, like lips that have gone too long without a drink? Ask a small cloud to stop over it. Only one, only for a while. The cracks will close themselves once they have something to close round."` },
        steps:[
          { id:'branches', name:'Clear the dead branches', short:'clearing branches', cost:{}, give:{ twig:3 }, mins:60, act:'pickup',
            blurb:'The old tree has dropped its limbs everywhere. They go into a heap at the edge. The tree itself stays: something will want to live in it.' },
          { id:'stump', name:'Dig out the rotten stump', short:'digging out a stump', cost:{ twig:1 }, give:{ twig:1 }, mins:120, act:'dig',
            blurb:'Soft as cake inside and full of ants who are very cross about it. It comes out in chunks, and leaves good loose earth behind.' },
          { id:'mulch', name:'Spread leaf mulch over the cracks', short:'spreading mulch', cost:{ moss:2 }, mins:120, act:'water', spell:true,
            blurb:'Basket after basket of leaf litter and bark from the edge of the wood, tipped into the cracks to keep the ground from drying out again.' },
          { id:'log', name:'Build a hollow-log home', short:'building a log home', cost:{ twig:3, moss:1 }, mins:90, act:'build',
            blurb:'A hollow log rolled in beside the stick heap and bedded in with moss. Somebody large and sleepy might like it.',
            later:[ { after:240, green:2, ev:'wombat', note:'A wombat has moved into the hollow log. It digs, very slowly and very thoroughly, and the ground behind it is soft.' },
                    { after:600, green:2, ev:'burrow', note:'The wombat\'s digging has loosened the cracked earth. A haze of green has come up along its tracks.' } ] },
          { id:'rocks', name:'Make a rock pile in the sun', short:'making a rock pile', cost:{ stone:3 }, mins:60, act:'dig',
            blurb:'Flat stones set in a warm pile, with gaps for a small someone to slip into when a shadow passes.',
            later:[ { after:180, green:2, ev:'skink', note:'A skink has moved into the rock pile. It suns itself on the top stone and pretends not to see anyone.' } ] },
          { id:'nestbox', name:'Hang a nest box in the dead tree', short:'hanging a nest box', cost:{ twig:2 }, mins:60, act:'build',
            blurb:'A little wooden box with a round door, pegged to the old tree. A dead tree is not finished: it is a block of flats waiting for tenants.',
            later:[ { after:360, green:2, ev:'possum', note:'A possum has moved into the old tree. Somebody has fitted a tiny brass knocker to the hollow, and nobody will admit to it.' } ] },
          { id:'dish', name:'Put a seed dish on the low stump', short:'putting out seed', cost:{ seed:2, stone:1 }, mins:45, act:'pickup',
            blurb:'A flat stone dish of seed on the low stump. Birds come to eat, and they drop more than they eat. That is rather the point.',
            later:[ { after:240, green:2, ev:'birdsprouts', note:'The birds at the seed dish have been dropping seeds. Little sprouts are coming up under their perch.' },
                    { after:720, green:2, ev:'birdsprouts2' } ] },
          { id:'saplings', name:'Plant two saplings', short:'planting saplings', cost:{ acorn:2, water:2 }, mins:120, act:'dig', green:4, tree:'wattle',
            blurb:'A wattle and a gum, each with a ring of sticks round it. One day the old tree will have company.',
            later:[ { after:720, green:2, ev:'knee', note:'The two saplings on the cracked earth are knee-high.' }, { after:2880, green:2, ev:'tall', note:'The saplings on the cracked earth are taller than a gnome now.' } ] },
          { id:'ferns', name:'Bring fern spores from the creek', short:'fetching fern spores', cost:{ moss:2, water:1 }, mins:60, act:'pickup',
            blurb:'Fern spores shaken from the creek bank onto a leaf, carried over very carefully, and scattered in the shade of the young trees.',
            later:[ { after:240, green:3, ev:'ferns1', note:'Ferns are uncurling in the shade on the old cracked earth.' }, { after:720, green:3, ev:'ferns2' } ] },
        ] },
      nursery: { name:'The bare plain', patch:'the bare plain', spell:'seedwake',
        card:{ who:'him', text:'Nothing here at all, not even a stump. That\'s all right. It just needs trees, and trees we can grow. I\'ll find each of them a good spot.' },
        lesson:{ title:'Wake a sleeping seed', text:`"A seed is a little sleeper with its whole tree folded up inside. Some wake in a day, some in ten years, some never, because nobody asked. Ask them. Gently. Like waking somebody you love on a cold morning."` },
        steps:[
          { id:'shelf', name:'Build a nursery shelf', short:'building a shelf', cost:{ twig:3 }, mins:60, act:'build', atHome:true, once:'nurseryShelf',
            blurb:'A plank shelf on two stumps by Hazel\'s growing corner at home, for pots of tree seedlings. Every wood starts somewhere.' },
          { id:'gather', name:'Gather tree seeds', short:'gathering tree seeds', cost:{}, mins:60, act:'pickup', atHome:true,
            blurb:'Gumnuts, wattle pods and the odd acorn from round the edges of the yard. Each one a whole tree, folded up very small.' },
          { id:'pot', name:'Pot the tree seeds', short:'potting seeds', cost:{ seed:1, water:1 }, mins:45, act:'dig', atHome:true, wait:720, spell:true,
            blurb:'Into the old travelling pots they go, one seed each, with a drink. Seedlings take about half a day to be ready.' },
          { id:'walk', name:'Walk the patch and peg it out', short:'pegging the patch', cost:{}, mins:60, act:{ him:'dowse', her:'pickup' },
            blurb:'Up and down the bare patch, feeling for the good deep soil, and a little peg wherever a tree should go.' },
          { id:'stones', name:'Clear the stones into a wall', short:'clearing stones', cost:{}, give:{ stone:4 }, mins:90, act:'pickup',
            blurb:'Stones out of the planting spots and into a low wall along the edge. Lizards love a wall.' },
          { id:'holes', name:'Dig the planting holes', short:'digging holes', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'One hole at each peg, deep and wide, with the good soil heaped beside it.' },
          { id:'plant1', name:'Carry out the first seedling', short:'planting a seedling', cost:{ water:1 }, mins:60, act:'dig', green:2, tree:'gum',
            blurb:'The strongest seedling, carried out in its pot, planted, watered and given a ring of sticks. Wendel has already named it.',
            later:[ { after:60, green:2, ev:'haze', note:'Grass seed from the pot\'s soil has come up round the first tree. There is green on the bare plain.' },
                    { after:1440, green:1, ev:'knee1', note:'The first tree on the plain is knee-high.' }, { after:4320, green:2, ev:'tall1', note:'The first tree on the plain is taller than a gnome.' } ] },
          { id:'plant2', name:'Plant a gum and a wattle', short:'planting seedlings', cost:{ water:2 }, mins:120, act:'dig', green:4, tree:'wattle',
            blurb:'Two more seedlings out of the nursery, each to its hole, each watered and named.',
            later:[ { after:1440, green:1, ev:'knee2' }, { after:4320, green:2, ev:'tall2', note:'All three trees on the plain are taller than a gnome now.' } ] },
          { id:'grass', name:'Scatter grass seed between the trees', short:'scattering grass seed', cost:{ seed:2 }, mins:60, act:'pickup',
            blurb:'Kangaroo grass and wallaby grass, scattered thin between the young trees, to hold the soil while they grow.',
            later:[ { after:120, green:1, ev:'grass1' }, { after:360, green:1, ev:'grass2' }, { after:720, green:1, ev:'grass3' }, { after:1080, green:1, ev:'grass4', note:'The grass has come up thick between the young trees on the plain.' } ] },
          { id:'birdbath', name:'Build a bird bath on the wall', short:'building a bird bath', cost:{ stone:2, water:1 }, mins:60, act:'build',
            blurb:'A hollowed stone set on the stone wall and filled with water. The wrens will find it before it is even full.',
            later:[ { after:240, green:2, ev:'wrens', note:'A pair of fairy-wrens has moved into the stone wall by the bird bath on the plain.' } ] },
          { id:'mulch', name:'Mulch round the trees', short:'mulching the trees', cost:{ moss:3 }, mins:90, act:'pickup',
            blurb:'A ring of leaf litter round each tree to keep its feet cool. Moss and ferns come up in the shade.',
            later:[ { after:360, green:3, ev:'moss', note:'Moss and little ferns have come up in the shade of the young trees on the plain.' }, { after:1440, green:3, ev:'moss2' } ] },
        ] },
      creek: { name:'The dry creek', patch:'the dry creek', spell:'sing',
        card:{ who:'her', text:'There was water here once. You can see where it ran. The spring at home wants to come this way, I\'m sure of it. We just need to clear its path.' },
        lesson:{ title:'Sing the water on', text:`"Water is shy. It will turn back at the first stone if it thinks nobody wants it. Hum to it. It doesn't matter what. Your Wendel hums all day and the spring loves him for it."` },
        steps:[
          { id:'junk', name:'Pull the rubbish out of the creek bed', short:'clearing the creek bed', cost:{}, give:{ twig:1, stone:2 }, mins:60, act:'pickup',
            blurb:'A rusty tin, a broken bucket, an old cart wheel. Wendel keeps the wheel. He will think of something.' },
          { id:'stones', name:'Roll away the damming stones', short:'rolling stones away', cost:{}, mins:90, act:'gather', spell:true, needsFlow:true, green:1,
            blurb:'Stones and silt have choked the creek. Roll them aside one by one and the trickle from the spring can find its way along.' },
          { id:'channel', name:'Dig a channel where the bank fell in', short:'digging a channel', cost:{ twig:1 }, mins:90, act:'dig', green:1,
            blurb:'The bank has slumped across the bed. A short channel through it, and the trickle runs the whole length of the stretch.',
            later:[ { after:120, green:2, ev:'haze', note:'The first reeds have sprouted by themselves at the wet edge of the creek.' } ] },
          { id:'reeds', name:'Plant reeds and rushes along the banks', short:'planting reeds', cost:{ seed:1, moss:1 }, mins:90, act:'dig', green:2,
            blurb:'Clumps of reeds and rushes along both banks to hold the soil and slow the water down.',
            later:[ { after:360, green:2, ev:'reeds2', note:'The reeds along the creek have filled out.' } ] },
          { id:'flat', name:'Lay flat stones in the water', short:'laying stones', cost:{ stone:3 }, mins:60, act:'dig',
            blurb:'A few flat stones bedded in the bed, so the water burbles over them. Water that sings is happy water.',
            later:[ { after:480, green:2, ev:'wetmoss', note:'Moss has come up on the wet stones in the creek.' } ] },
          { id:'pond', name:'Scoop out a frog pond at the bend', short:'scooping a pond', cost:{ twig:1 }, mins:120, act:'dig',
            blurb:'A little pool scooped at the bend where the water slows, edged with stones and a reed or two.',
            later:[ { after:180, green:2, ev:'frogs', note:'Frogs have moved into the pond on the creek. They sing about it all night.' },
                    { after:600, green:2, ev:'dragonflies', note:'Dragonflies over the frog pond on the creek.' },
                    { after:1200, green:2, ev:'lilies', note:'A waterlily has opened on the frog pond.' } ] },
          { id:'sapling', name:'Plant a creekside sapling', short:'planting a sapling', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2, tree:'wattle',
            blurb:'A young tree on the bank, where it can drink all it likes. One day it will shade the pond.',
            later:[ { after:720, green:2, ev:'knee', note:'The sapling by the creek is knee-high.' }, { after:2880, green:2, ev:'tall', note:'The sapling by the creek is taller than a gnome.' } ] },
          { id:'perch', name:'Set a perching stick over the water', short:'setting a perch', cost:{ twig:2 }, mins:30, act:'build',
            blurb:'A forked stick pushed into the bank, leaning out over the water. Then the waiting, which is the best bit.',
            later:[ { after:240, green:2, ev:'kingfisher', note:'A kingfisher has taken the perch over the creek.' }, { after:720, green:2, ev:'heron', note:'A heron stands in the shallows of the creek on one leg, perfectly still, like a grey thought.' } ] },
        ] },
      verge: { name:'The old track', patch:'the old track', spell:null,
        card:{ who:'him', text:'The loggers\' track. Ruts you could lose a gnome in. We\'ll mend it into a proper little lane, with flowers either side.' },
        steps:[
          { id:'ruts', name:'Fill the cart ruts', short:'filling ruts', cost:{ stone:2, twig:1 }, mins:90, act:'dig',
            blurb:'Stones in the bottom, earth on top, trodden down. The track stops being a trap for small feet.' },
          { id:'stones', name:'Lay stepping stones along the track', short:'laying stones', cost:{ stone:3 }, mins:90, act:'dig',
            blurb:'Flat stones bedded in a gnome\'s stride apart, so nobody has to walk in mud.' },
          { id:'balls', name:'Toss seed balls along the verges', short:'tossing seed balls', cost:{ seed:2, water:1 }, mins:60, act:'toss',
            blurb:'Both edges of the track get a sprinkle of wildflower seed balls. In a few weeks it will be a lane.',
            later:[ { after:120, green:1, ev:'verge1' }, { after:240, green:1, ev:'verge2' }, { after:360, green:1, ev:'verge3' }, { after:480, green:1, ev:'verge4', note:'Flowers along both edges of the old track. It looks like a lane now.' } ] },
          { id:'sapling', name:'Plant a sapling at the bend', short:'planting a sapling', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2, tree:'gum',
            blurb:'A young gum at the bend of the track, where one day it will shade whoever stops to rest.',
            later:[ { after:720, green:2, ev:'knee', note:'The sapling by the track is knee-high.' }, { after:2880, green:2, ev:'tall', note:'The sapling by the track is taller than a gnome.' } ] },
          { id:'birdbox', name:'Put up a bird box on a post', short:'putting up a bird box', cost:{ twig:2 }, mins:45, act:'build',
            blurb:'A little box on top of an old fence post by the track, facing the morning sun.',
            later:[ { after:300, green:2, ev:'robins', note:'Robins have moved into the bird box by the old track.' } ] },
          { id:'hedge', name:'Plant a wattle hedge along the verge', short:'planting a hedge', cost:{ acorn:1, seed:1, water:1 }, mins:120, act:'dig', green:2,
            blurb:'Three little wattles in a loose line along one side of the lane. In spring they will be pure gold.',
            later:[ { after:1440, green:2, ev:'hedge2', note:'The wattle hedge by the old track has filled out.' } ] },
        ] },
    },
    
    // the land card for a tile reaching a new stage ({patch} = that kind's patch name)
    stageText: {
      green:  'A haze of green on {patch}. You would have to kneel to see it, but it is there, and it is staying.',
      meadow: 'Grass and flowers on {patch} now, and things living in it. The ground there remembers how to grow.',
      wood:   'The young trees on {patch} are taller than a gnome. It is not bare ground any more. It is the edge of a wood.',
    },
    // Wendel names every tree he plants (shown on the patch card)
    treeNames: ['Old Bert', 'Clementine', 'Little Tom', 'Aunt Myrtle', 'Wattlebury', 'Gus', 'Primrose', 'Sir Reginald', 'Dot', 'Barnacle', 'Mabel the Younger', 'Pip', 'Grandfather Gum', 'Fern', 'Biscuit', 'Hazelnut'],
  },

  // Home tile regrowth stages by green points.
  landStages: [
    { at:0, key:'barren', name:'bare ground',  sub:'a bare patch of ground, waiting' },
    { at:4, key:'green',  name:'first green',  sub:'a haze of green over the bare earth',
      explain:`You'd have to kneel down to see it: a haze of green over the bare brown earth, so faint that Hazel thought it was her eyes. It isn't. Every living thing the gnomes grow here teaches the soil to grow again. The spring brought the water back, and each crop leaves a little more life behind. Keep things growing, and the green will spread.` },
    { at:12,key:'meadow', name:'young meadow', sub:'grass, clover and the first daisies',
      explain:`One morning there was grass round the house. Not a haze any more, but real grass, with clover in it, and the first daisies, and a magpie strutting about as if he had planted it all himself. The ground remembers now. Plant things that stay, like trees and bushes and flowers, and the woods will start to come home.` },
    { at:26,key:'wood',   name:'young woodland', sub:'young trees coming up all round',
      explain:`Young trees are coming up all round the yard now, some planted and some that came by themselves, and the little oak has a new crown of leaves. The creatures who left long ago are finding their way back, one by one, following the green. This isn't a clearing any more. It's the beginning of a wood.` },
  ],

  // Magic grows with the days you visit (level by distinct days visited). It only grows the magic: spells, and jobs go a little faster. The story decides the jobs.
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
    // taught by the Wood spirit the first time each kind of bare tile appears (CONTENT.heal); each helps one job that is already under way
    wind:  { name:'Ask the wind', cost:{ light:2 }, heal:'meadow', blurb:'While the seed balls are being tossed, the wind carries them into the far corners. The job goes twice as fast.' },
    cloud: { name:'Call a rain cloud', cost:{ light:2 }, heal:'creature', blurb:'A soft shower over the cracked earth only, while the mulch goes down. The cracks close twice as fast.' },
    seedwake: { name:'Wake a sleeping seed', cost:{ light:2 }, heal:'nursery', blurb:'The tree seedlings in their pots wake up and are ready to plant out now.' },
    sing:  { name:'Sing the water on', cost:{ light:2 }, heal:'creek', blurb:'Hum the trickle round the last stones while they are being rolled away. Twice as fast.' },
    legs: { name:'Give the toadstool legs', cost:{ light:2 }, blurb:'The big red toadstool is in the way of the garden. A little magic and it sprouts root legs and walks off to the garden\'s far corner.', special:true },   // only shown while the toadstool still blocks the open garden
  },

  // Visitors for the journal. hours: [from,to) 24h; stage: min land stage key; task: only after that task is done.
  // h: height on screen in world pixels (a gnome is about 120). faces: which way the painted picture looks (L/R), so it can be mirrored.
  // icon: stand-in (journal and garden) until a painting exists (art slot vis-<id>; the six old paintings are already in).
  // fly: hovers that high off the ground (lands to eat). eats: what it takes from the feeding dish (seed / berry).
  // nest: a fed regular eventually settles nearby (nest | burrow | leafpile | stones). trouble: a small fix; by: the gnome who walks over and does it once your luck catches their eye (her/him), or 'luck' (a little luck does it, no hands); earns light.
  visitors: [
    { id:'robin',    name:'Robin',       hours:[6,18],  weight:4, h:44, faces:'L', icon:'🐦', speed:0.25, eats:['seed'], nest:'nest',
      note:'Hops after the digging, hoping for worms.' },
    { id:'mouse',    name:'Field mouse', hours:[0,24],  weight:3, h:80, faces:'L', icon:'🐭', speed:0.06, eats:['seed'],
      note:'Keeps a close eye on the seed bed.',
      trouble:{ text:'has got its head stuck in an old loggers\' bottle.', by:'her', act:'Tip the bottle', thanks:'Hazel tipped the bottle up, very gently. Out popped the mouse, whiskers first, and sat washing its face as if nothing had happened.' } },
    { id:'hedgehog', name:'Hedgehog',    hours:[17,24], weight:3, h:50, faces:'R', icon:'🦔', speed:0.05, eats:['berry'], nest:'leafpile',
      note:'Snuffles along the fence line at dusk.',
      trouble:{ text:'has a dry leaf stuck on nearly every spine.', by:'her', act:'Pick the leaves off', thanks:'Hazel picked the leaves off one by one. The hedgehog snuffled, very politely, and trundled off a good deal lighter.' } },
    { id:'owl',      name:'Tawny owl',   hours:[19,24], weight:2, h:72, faces:'L', icon:'🦉', speed:0.3, alsoHours:[0,5], note:'Watches from the top of the woodpile. Says nothing.' },
    { id:'ladybird', name:'Ladybird',    hours:[8,17],  weight:3, h:18, faces:'R', icon:'🐞', speed:0.05, stage:'green', note:'Only came once there was something green to land on.' },
    // the Wood spirit only comes to teach (game.js spiritLesson); never as a random night visitor. Kept for its journal entry.
    { id:'spirit',   name:'Wood spirit', hours:[0,0], weight:0, h:84, faces:'R', icon:'✨', fly:30, speed:0.06, note:'Soft and green, like a handful of new leaves that forgot to fall. It comes when there is something to teach, and the gnomes cannot see it.' },
    { id:'wren',      name:'Fairy-wren',     hours:[6,17],  weight:3, h:26, icon:'🐦', fly:14, speed:0.2, task:'birdbath', eats:['seed'], nest:'nest',
      note:'A tiny blue flicker with a cocked tail. It bathed, looked at everyone, and left.',
      trouble:{ text:'is caught in a loop of the loggers\' old string.', by:'him', act:'Untangle it', thanks:'Wendel knelt, and with one careful tug the wren was free. It scolded everybody, then sang.' } },
    { id:'rosella',   name:'Crimson rosella', hours:[6,11], weight:2, h:40, icon:'🦜', fly:12, speed:0.25, stage:'green', alsoHours:[15,18], eats:['seed'],
      note:'Red and blue and very sure of itself. Cracked every seed in the dish, then checked under it for more.' },
    { id:'butterfly', name:'Butterfly',      hours:[9,17],  weight:3, h:20, icon:'🦋', fly:26, speed:0.1, stage:'meadow', note:'Landed on a daisy and stayed so still the gnomes held their breath.',
      trouble:{ text:'has dew on one wing and cannot lift off.', by:'luck', act:'A breath of warm air', thanks:'A breath of warm air came out of nowhere. The wing dried, opened, and off it went, a little crooked at first. Hazel saw it go and smiled at nobody in particular.' } },
    { id:'snail',     name:'Garden snail',   hours:[5,10],  weight:2, h:18, icon:'🐌', speed:0.015, note:'Left a silver trail across the doorstep. Entirely unapologetic.',
      trouble:{ text:'is halfway across the path, right where Wendel walks.', by:'him', act:'Carry it to the clover', thanks:'Wendel saw it just in time, and carried it to the clover. It did not say thank you. Snails never do.' } },
    { id:'frog',      name:'Green tree frog', hours:[19,24], weight:3, h:24, icon:'🐸', speed:0.05, task:'pond', alsoHours:[0,4], note:'Moved in the first night the pond held water. Sings off-key and with total confidence.' },
    { id:'dragonfly', name:'Dragonfly',      hours:[10,16], weight:2, h:18, icon:'🪰', fly:30, speed:0.3, task:'pond', stage:'green', note:'Zipped over the pond and hovered like a tiny helicopter.' },
    { id:'possum',    name:'Brushtail possum', hours:[20,24], weight:2, h:62, icon:'🐿️', speed:0.05, alsoHours:[0,4], stage:'green', eats:['berry'],
      note:'Huge ears, huge eyes, and a firm belief that the fruit is for it.',
      trouble:{ text:'has climbed the woodpile and is too proud to climb down.', by:'him', act:'Lean a twig ladder', thanks:'Wendel leaned a twig ladder on the woodpile. The possum came down it backwards, very slowly, pretending that was the plan all along.' } },
    { id:'bluetongue', name:'Blue-tongue lizard', hours:[10,16], weight:2, h:22, icon:'🦎', speed:0.04, stage:'green', eats:['berry'], nest:'stones',
      note:'Sunbathed on the doorstep. Stuck out a blue tongue. The gnomes are still discussing it.',
      trouble:{ text:'is too cold to move, stuck in a patch of shade.', by:'luck', act:'A patch of sun', thanks:'The clouds shifted, and a patch of sun found it just where it lay. It warmed until it could blink again, then wandered off, much obliged.' } },
    { id:'echidna',   name:'Echidna',        hours:[6,10],  weight:1, h:36, icon:'🦔', speed:0.04, stage:'meadow', alsoHours:[16,19], note:'A walking pincushion on a mission to find ants. It found them.',
      trouble:{ text:'has its nose stuck in an old tin can.', by:'her', act:'Ease the tin off', thanks:'Hazel eased the tin off. Pop. One very surprised echidna, and one tin for the scrap pile.' } },
    { id:'bandicoot', name:'Bandicoot',      hours:[18,24], weight:2, h:34, icon:'🐭', speed:0.07, stage:'green', alsoHours:[0,5], eats:['berry'], nest:'burrow',
      note:'Dug little cone-shaped holes all over the lawn. Every one was a favour.',
      trouble:{ text:'has fallen into one of its own holes.', by:'him', act:'Lift it out', thanks:'Wendel lifted it out and dusted it off, and it went straight back to digging. Some creatures never learn. Good.' } },
    { id:'frogmouth', name:'Tawny frogmouth', hours:[19,24], weight:1, h:60, icon:'🦉', speed:0.2, stage:'meadow', alsoHours:[0,5], note:'Pretended to be a broken branch. A very convincing broken branch.' },
    { id:'kookaburra', name:'Kookaburra',    hours:[5,9],   weight:1, h:56, icon:'🐦', speed:0.25, stage:'meadow', alsoHours:[16,19], note:'Laughed at the fence. The fence did not laugh back. Everyone else did.' },
    { id:'nativebee', name:'Native bee',     hours:[9,16],  weight:2, h:12, icon:'🐝', fly:20, speed:0.15, task:'beehive', note:'A small, shiny, round bee. Moved into the log house and did not ask for a lease.' },
    { id:'glowworm',  name:'Glow-worm',      hours:[20,24], weight:1, h:10, icon:'✨', speed:0.01, stage:'meadow', alsoHours:[0,4], note:'A single point of cool blue-green light under the fern. It seems to be waiting for someone.' },
    { id:'moth',      name:'Bogong moth',    hours:[20,24], weight:2, h:20, icon:'🦋', fly:24, speed:0.12, alsoHours:[0,4], note:'Drawn to the firelight. Told firmly to stay away from the flames. Mostly did.',
      trouble:{ text:'is fluttering against the shelter canvas, lost in the firelight.', by:'luck', act:'A puff of night air', thanks:'A puff of night air drew it away from the firelight. It found the open dark again and went off towards the mountains, where the bogongs go every year.' } },
    // seasonal visitors (southern hemisphere seasons; seasons: only then)
    { id:'silvereye', name:'Silvereye',      hours:[7,17],  weight:3, h:26, faces:'L', icon:'🐤', speed:0.2, eats:['berry'], seasons:['autumn','winter'],
      note:'Turns up in a chattering little flock when the weather cools, every one of them wearing a neat white ring round the eye, like spectacles.' },
    { id:'kingfisher', name:'Sacred kingfisher', hours:[6,16], weight:2, h:36, faces:'L', icon:'🐦', speed:0.18, seasons:['spring','summer'], stage:'green',
      note:'Back from the north for the warm months, turquoise as the stream. Sits very still on the fence and waits for something to move.' },
    { id:'beetle',    name:'Christmas beetle', hours:[18,23], weight:2, h:16, icon:'🪲', fly:20, speed:0.1, seasons:['summer'],
      note:'A clumsy, shining gold-green beetle that blundered into the firelight, apologised, and did it again.' },
    { id:'cockatoo',  name:'Yellow-tailed black cockatoo', hours:[7,16], weight:1, h:60, faces:'L', icon:'🐦‍⬛', fly:36, speed:0.15, seasons:['winter'], stage:'meadow',
      note:'A slow pair came over, wailing. Old gnomes say that means rain. It rained.' },
    // the platypus (docs/ANIMALS.md section 8): never spawned like the others (hours 0-0). It only glides past on the last healed
    // stretch of the creek at dawn, once the whole creek is healed (index.html PLATY). It never moves in, eats nothing, gives no gift.
    { id:'platypus', name:'Platypus', hours:[0,0], weight:0, h:22, faces:'L', icon:'🦫', speed:0.05, dawn:true,
      note:'Seen once. Will not be rushed.' },
    { id:'lyrebird',  name:'Superb lyrebird', hours:[7,16], weight:1, h:70, icon:'🐦', speed:0.12, seasons:['winter'], stage:'meadow',
      note:'A shy brown bird that stepped out of the ferns, raised a tail like a silver harp over its head, and danced on the bare earth as if nobody were watching.' },
    { id:'wisp',      name:'Will-o\'-wisp', hours:[21,24], weight:1, h:30, icon:'💫', fly:40, speed:0.08, stage:'green', alsoHours:[0,4], spirit:true,
      note:'A small cold light that bobbed just out of reach and left a little brighter than it came.' },
  ],
  // the rabbit (game.js rabbitDue/rabbitRaid): a cheeky regular that always comes for the first sprouts. after = minutes the seedlings are up before it comes (it empties the dish first, if there is food in it).
  barrel: { every: 480, give: { water: 1 } },   // the scrubbed rain barrel fills every `every` minutes and tops up the gnomes' store by itself
  pantry: { cap: 12, seedTin: 30, meals: [[7, 8], [18, 19]] },   // the pantry shelf holds about a dozen of each; at breakfast and supper the gnomes eat one thing from it (fix 3)
  rabbit: { after: 2,
    dish: 'A rabbit hopped up to the feeding dish and ate every last bit. Then it looked about for more.',
    raid: 'The rabbit hopped into the seed bed and nibbled the tops off a few sprouts before Wendel could gently shoo it off. "Oh, you poor hungry thing," said Wendel. "All right. A fence, then, so we can share."',
    away: 'A rabbit came while you were away and nibbled a few of the sprouts. Wendel is already drawing a fence, a kind one, with a gate.',
    visits: [ 'The rabbit is back, nose pressed to the fence, looking at the sprouts.', 'The rabbit is asleep in the sun by the woodpile. Gerald the beetle does not approve.', 'The rabbit pinched a berry from the dish and sat there eating it, bold as anything.' ] },
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
    firstAfter: 'page:3.5',   // the first traveller comes up the old track the night they move into the stump house (page 3.5)
    // each traveller names the patch they would like to live on (game.js wishLot); it comes out of the mist if it was still dark,
    // and their home job opens once it has grown to young meadow. {who} = their short name, {patch} and {where} = the patch.
    wish: '{Who} has taken a fancy to {patch}, {where}. "If that ground came back to life," says {who}, "I could be very happy there."',
    wishReady: '{Patch} has grown to young meadow. {Who} is already measuring it with a piece of string.',
    gapDays: 4,               // days after one neighbour moves in before the next traveller comes
    waveGapDays: 1,           // after waving a traveller on, someone else comes after about this long
    favourEvery: 360,         // minutes between small favours (only one waiting at a time)
    questAfterDays: 1,        // a neighbour's story begins about a day after their trade building is finished
    // where homes go, nearest first: plain tiles (not the stream row or the old track). A home needs its patch grown to young meadow.
    lots: ['-1,0', '-1,1', '2,0', '-2,0', '2,1', '-2,1', '0,2', '-1,2', '0,-2', '-1,-2', '2,-2', '-2,-2', '2,2', '-2,2'],
    order: ['mabel', 'tobias', 'fernsby', 'pebbleworth', 'clem', 'barnaby', 'nettle', 'juniper'],   // who comes next (waved-on travellers go to the back)
  },
  // look: stand-in colouring of Wendel's (base him) or Hazel's (base her) painted walk: hat and coat hues (0-360), grey hair, size.
  // members: extra gnomes who live in the same home (the family). home: stand-in kind (stump | root | log | hollow), door colour.
  // Steps of a story quest: say (what is happening) plus one of: give (hand things over), job (a gnome works on it, in Jobs),
  // find (something to spot on the land and tap; hours = only then), wait (minutes of real time). Then the story page.
  folk: [
    { id:'mabel', name:'Mabel Crumb', short:'Mabel', trade:'the baker', base:'her', look:{ hat:8, coat:205, s:1.04 }, home:'stump', door:'#b5532f', icon:'🍞',
      intro:'A round little gnome with flour to her elbows came up the path today, pushing a barrow of warm loaves. "I go where an oven is needed," she said, "and you two, my dears, have no oven at all." She has put up a patched tent by the path, and the whole clearing smells of bread.',
      build:{ cost:{ twig:6, stone:4, moss:4 }, mins:420, who:'him', blurb:'A snug stump home with a wide door, so a gnome with a tray of buns can get through it sideways.' },
      movedIn:'Mabel stood in her new doorway and cried a little into her apron. "A home," she said, "and neighbours, and not a single oven in sight. We shall see about that." That evening there were buns on everyone\'s step.',
      sayings:['Nothing a warm loaf cannot mend. Well, nearly nothing.', 'You two are too thin. Here.', 'Bread is just patience you can eat.', 'Hazel says he snores. I say, find me a husband who doesn\'t.', 'The trick with dough is the same as with gnomes: warmth, and leave it alone a while.'],
      building:{ name:'Build Mabel\'s bread oven', short:'building the oven', who:'him', act:'carry', cost:{ stone:8, moss:3, water:2 }, mins:300,
        blurb:'A round clay oven beside her door, with a stone floor and a little chimney. After this, there is bread.', gift:{ bread:1 }, giftText:'A warm loaf on Mabel\'s step, wrapped in a cloth.' },
      favours:[ { ask:'The oven is hungry this morning. Could you spare 3 twigs?', cost:{ twig:3 }, thanks:'Bless you. The first bun out is yours.' },
                { ask:'I\'m trying a seed loaf. Have you 2 seeds to spare?', cost:{ seed:2 }, thanks:'There. It will be lumpy and wonderful.' },
                { ask:'A drop of honey would make this cake sing. Just 1?', cost:{ honey:1 }, thanks:'Oh, that\'s the stuff. Come by later.' },
                { ask:'Carrot cake today, if your bed can spare 3 carrots. Crooked ones are fine. Crooked ones are better.', cost:{ carrot:3 }, thanks:'You\'ll get the first slice, dear. The crooked bit.' } ],
      quest:{ name:'The forgotten day', steps:[
        { say:'Mabel catches Wendel by the oven, flour to her elbows. "It is a month this week since you two came up that hill," she says. "Hazel mentioned it to me, very lightly. You have not mentioned it at all." Wendel opens his mouth, and shuts it again. He had forgotten. A cake would help, Mabel says. She needs 3 seeds and 2 berries.', give:{ seed:3, berry:2 } },
        { say:'"Now the hard part," says Mabel. "Hazel\'s mother wrote her a honey-seed cake recipe on the back of a letter, and it blew away on the road here. She has never said, but she misses it." Look for a scrap of paper caught somewhere on the land.', find:{ name:'a scrap of old letter', icon:'📜' } },
        { say:'The recipe! Wendel goes pink, then very determined. He and Mabel bake it together in secret, late, by the oven.', job:{ name:'Bake the secret cake with Mabel', short:'baking in secret', who:'him', act:'carry', mins:180, cost:{ water:1 } } } ],
        story:{ title:'The forgotten day', text:'He had forgotten. He admitted it at once, standing in the doorway with the cake held out like a shield. Hazel looked at the cake, and at the familiar slanting handwriting propped beside it, and sat down rather suddenly. "That\'s Mum\'s," she said. They ate it on the step, all three of them, and Wendel was forgiven by the second slice.' },
        reward:{ light:3, bread:2 } } },

    { id:'tobias', name:'Tobias Burl', short:'Tobias', trade:'the carpenter', base:'him', look:{ hat:205, coat:28, s:1.1 }, home:'log', door:'#5a7a3a', icon:'🪚',
      intro:'A broad, loud gnome with sawdust in his beard and a toolbox on his back strode into the clearing, looked at the stump house and said, "Who did those windows? Not bad. Not good, but not bad." He is camping by the path and has already mended the wheelbarrow without asking.',
      build:{ cost:{ twig:8, stone:3, moss:4 }, mins:420, who:'him', blurb:'A hollow fallen log for a home, with a round door at one end. Tobias says he will do the fiddly bits himself.' },
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
      build:{ cost:{ twig:8, stone:4, moss:6 }, mins:480, who:'her', blurb:'A roomy burrow under arching roots, with a round door and a little window for each twin.' },
      movedIn:'The Fernsbys moved in under the roots, and that night the clearing was louder and happier than it had ever been. Hazel watched the twins chase fireflies and said nothing, and Wendel watched Hazel.',
      sayings:['Have you seen the twins? No? Good, that means they\'re hiding properly.', 'There\'s water under here. There\'s water under everywhere, if you\'re patient.', 'Pip! Put the frog down!', 'You two make it look easy. Being married, I mean.', 'Posy says your garden is the best garden. Posy has seen two gardens.'],
      building:{ name:'Dig the village well', short:'digging the well', who:'him', act:'dig', cost:{ stone:10, twig:4 }, mins:420,
        blurb:'Rowan has found water. A ring of stones, a little roof and a bucket on a rope. After this, nobody carries dew in their hat.', gift:{ water:2, feather:1 }, giftText:'A bucket of well water by the roots, and a feather the twins found.', site:'well' },
      favours:[ { ask:'The twins want a picnic. Could you spare 2 berries?', cost:{ berry:2 }, thanks:'They\'ve eaten them already. Thank you anyway!' },
                { ask:'Posy has built a tiny house for a beetle. It needs 2 twigs for a roof.', cost:{ twig:2 }, thanks:'The beetle has moved in. Posy is unbearable about it.' },
                { ask:'Rowan has worn through his socks again. A bit of yarn? Just 1.', cost:{ yarn:1 }, thanks:'Ivy says she\'ll darn them. Ivy says that every time.' },
                { ask:'The twins will eat anything in a sandwich. 2 lettuces?', cost:{ lettuce:2 }, thanks:'They picked the lettuce out. They ate the bread. It\'s a start.' } ],
      quest:{ name:'Hide and seek', steps:[
        { say:'Ivy and Rowan need an afternoon to dig, and Hazel offers to mind the twins. "How hard can it be?" says Wendel. The twins vanish almost at once. Look for Pip somewhere on the land.', find:{ name:'Pip, hiding', icon:'🧒' } },
        { say:'One found. Posy is better at hiding. Look again; she likes high places.', find:{ name:'Posy, up a stump', icon:'👧' } },
        { say:'Both twins found, both muddy, both starving. A picnic on the grass will settle everyone: 2 bread and 2 berries.', give:{ bread:2, berry:2 } } ],
        story:{ title:'Someday', text:'The twins fell asleep in the grass with jam on their faces. Wendel lay back and looked at the clouds. "Exhausting," he said. "Completely exhausting." Hazel was quiet for a moment. "Someday?" she said. Wendel turned his head and looked at her for a long time. "Someday," he said, and he was smiling.' },
        reward:{ light:3, berry:3 } } },

    { id:'pebbleworth', name:'Bert and Mags Pebbleworth', short:'the Pebbleworths', trade:'the orchard keepers', base:'him', look:{ hat:250, coat:100, grey:true, s:0.95 }, home:'hollow', door:'#4a6a3a', icon:'🍎',
      members:[ { base:'her', look:{ hat:330, coat:260, grey:true, s:0.92 } } ],
      intro:'An old couple came slowly up the path today, arm in arm, pulling a little cart of fruit-tree cuttings wrapped in wet moss. "Fifty-one years married," said Mags, before anyone asked. "Fifty-two," said Bert. "Fifty-one," said Mags, and he winked at Wendel. They have put up a tent by the path and are sharing an apple on the step.',
      build:{ cost:{ twig:6, stone:4, moss:6 }, mins:420, who:'her', blurb:'A cosy home in a hollow tree, with two chairs by one window. They do not need much; they need each other.' },
      movedIn:'Bert carried Mags over the threshold of the hollow tree, very slowly, and they both laughed so much they had to sit down. Hazel watched from the path with her hand on her heart. "That will be us," said Wendel. "You will drop me," said Hazel.',
      sayings:['Fifty-one years, and he still brings me the first apple.', 'The secret? Say sorry first, even when you\'re right. Especially then.', 'An orchard is a promise to people you will never meet.', 'Your Wendel looks at the stars the way Bert used to look at me. Still does, the old fool.', 'Don\'t tell Mags, but I let her win at cards.'],
      building:{ name:'Plant the Pebbleworths\' orchard', short:'planting the orchard', who:'her', act:'dig', cost:{ seed:3, water:4, moss:3 }, mins:360,
        blurb:'A little ring of young fruit trees from their cuttings, staked and mulched. After this, there is fruit.', gift:{ berry:2 }, giftText:'A basket of windfall fruit by the Pebbleworths\' door.' },
      favours:[ { ask:'Bert\'s knees are complaining. Could you spare 2 moss for a cushion?', cost:{ moss:2 }, thanks:'He says thank you. He says it from the cushion.' },
                { ask:'The young trees are thirsty. 3 dew, dear?', cost:{ water:3 }, thanks:'Listen to them drink.' },
                { ask:'Mags wants a loaf, and Bert wants to be the one who brings it. Just 1?', cost:{ bread:1 }, thanks:'Bert is very pleased with himself.' },
                { ask:'Bean soup for Bert\'s knees. Mags swears by it. 3 beans?', cost:{ bean:3 }, thanks:'Bert says his knees feel better already. He hasn\'t had the soup yet.' } ],
      quest:{ name:'A star for Hazel', steps:[
        { say:'Bert tells Wendel that, as a young gnome, he named a star for Mags and has shown it to her every anniversary since. Wendel has gone very thoughtful. He wants to do the same for Hazel, and Bert says they will need to chart the sky properly, with good quills: 3 feathers.', give:{ feather:3 } },
        { say:'They must sit up through the night to find the right star: one that rises over the stump house.', job:{ name:'Sit up for the stars with Bert', short:'watching the stars', who:'him', act:'sit', mins:240, cost:{ light:1 } } },
        { say:'They have found it. Bert copies the chart out neatly, by daylight, with Mags correcting his spelling.', wait:360 } ],
        story:{ title:'Hazel\'s Lamp', text:'Wendel took her up the rise after supper and pointed. "That one. Low, warm, over our roof. It\'s on Bert\'s chart now, and it says Hazel\'s Lamp." Hazel looked at it for a long while. "You know it was always there," she said. "I know," said Wendel. "But now it\'s yours." A little way off, on their bench, Bert and Mags very carefully looked the other way, holding hands.' },
        reward:{ light:4 } } },

    { id:'clem', name:'Clementine Bramblewick', short:'Clem', trade:'the beekeeper', base:'her', look:{ hat:45, coat:45, s:0.98 }, home:'root', door:'#d4a020', icon:'🐝',
      intro:'A freckled gnome in a wide straw hat came up the path humming, with a woven skep on her back and a little cloud of bees around her like a veil. "They don\'t sting," she said. "Well. They don\'t sting me." She has camped well away from the path, which everyone appreciates.',
      build:{ cost:{ twig:6, stone:3, moss:6, seed:2 }, mins:420, who:'her', blurb:'A cosy root home with a flower-covered roof, so the bees have something to do on the way in.' },
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
      build:{ cost:{ twig:8, stone:5, moss:4 }, mins:480, who:'him', blurb:'A tall stump home with a crooked chimney. Barnaby ducks to get in; he does not seem to mind.' },
      movedIn:'Barnaby moved into his stump and slept for most of a day. When he woke, he and Wendel sat on the doorstep and drew mill wheels in the dirt with sticks until it was dark, and Hazel brought them both soup.',
      sayings:['Mm.', 'Water does the work. A miller just listens.', 'Wendel\'s a good lad. Asks a lot.', 'Hazel makes a fine soup. Don\'t tell Mabel I said so.', 'A full sack for winter is the best sound there is.'],
      building:{ site:'stream', name:'Build Barnaby\'s little water mill', short:'building the mill', who:'him', act:'carry', cost:{ twig:8, stone:8, water:3 }, mins:420,
        blurb:'A little mill house with a turning water wheel. After this, sacks of seed for sowing.', gift:{ seed:2 }, giftText:'A little sack of seed by Barnaby\'s door.' },
      favours:[ { ask:'Mm. Wheel\'s squeaking. 2 moss?', cost:{ moss:2 }, thanks:'Mm. Better.' },
                { ask:'Need a plank for the sluice. Just 1.', cost:{ plank:1 }, thanks:'That\'ll hold.' },
                { ask:'Stones for the mill race. 3, if you have them.', cost:{ stone:3 }, thanks:'Good stones. Thank you.' },
                { ask:'Mm. Carrots. 2.', cost:{ carrot:2 }, thanks:'Mm. For the horse. (There is no horse.)' } ],
      quest:{ name:'Winter stores', steps:[
        { say:'The nights are drawing in, and Hazel has started counting the pantry jars twice a day. Wendel has noticed, and is worried that she is worried. Barnaby says, "Mm. Mill\'s stuck. Fix it, and there\'ll be plenty." The wheel is jammed with river stones.', job:{ name:'Free the jammed mill wheel', short:'freeing the wheel', who:'him', act:'dig', mins:240, cost:{ twig:2 } } },
        { say:'The wheel turns again, but the mill race needs shoring up before the winter rains: 4 stones and 2 twigs.', give:{ stone:4, twig:2 } },
        { say:'Barnaby mills through the night, slow and steady, and Wendel stays to help carry the sacks.', wait:420 } ],
        story:{ title:'A full pantry', text:'They brought the sacks home on the wheelbarrow, Wendel pushing and Barnaby, for once, talking. Hazel stood in the doorway and counted them, and then stopped counting. "You knew I was worried," she said. "You count the jars in your sleep," said Wendel. She threw a handful of flour at him. He threw one back. Barnaby, very quietly, went home.' },
        reward:{ light:3, seed:4 } } },

    { id:'nettle', name:'Nettle Thimble', short:'Nettle', trade:'the weaver', base:'her', look:{ hat:300, coat:180, grey:true, s:0.95 }, home:'log', door:'#3a6a7a', icon:'🧶',
      intro:'A thin, sharp-eyed gnome with a loom strapped to her back came up the path, looked Hazel up and down, and said, "Who darned that apron? Dreadful." Hazel has not quite forgiven her. She is camped by the path, weaving something blue, and pretending not to care what anyone thinks.',
      build:{ cost:{ twig:8, moss:6, stone:3 }, mins:420, who:'her', blurb:'A neat log home with a big window, for light to weave by. Nettle has sent back the first plan.' },
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
      build:{ cost:{ twig:6, stone:4, moss:6, light:2 }, mins:420, who:'her', blurb:'A little home in a hollow tree, with a round window at the top for a lamp that never goes out.' },
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

  // ---------- the neighbours' farms (docs/PLAN.md "Neighbour farms"; built 2026-10-27) ----------
  // Farming only happens where neighbours live. Once a neighbour's trade building is up, their lot gets a farm that suits
  // their trade, in its own shape (patches, a curve, a few trees; never the oval). Three jobs in order (dig, plant, then
  // something for the wild things round its edge), either gnome. Digging gives 0 green; the planting and the edge give the
  // green, mostly later, as things grow (later: like the bare tiles). That takes the lot on from first green to young woodland.
  // Once the farm has grown, "pick" comes back once a day: the gnomes help pick, and the neighbour pays them back (give).
  // swap: a pantry swap, once a day, from the farm card (this is where the seed bed's veg gets used).
  // look: how index.html draws it (FARM_LOOK). hours: pick only then (the moonflowers open at dusk).
  farms: {
    pickEvery: 1440,   // minutes between pickings (once a day)
    list: {
      mabel: { name:'Mabel\'s herb and rhubarb patch', patch:'Mabel\'s herb patch', look:'herbs',
        card:'Three little beds by the oven: thyme and sage and parsley, and in the biggest one, rhubarb. "For pies," says Mabel, "and for anybody who looks peaky."',
        steps:[
          { id:'dig', name:'Dig Mabel\'s herb beds', short:'digging herb beds', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'Three small beds by the oven, each a different shape, because Mabel says herbs do not like to be bossed about.' },
          { id:'plant', name:'Plant the herbs and rhubarb crowns', short:'planting herbs', cost:{ water:2, seed:1 }, mins:120, act:'dig', green:2,
            blurb:'Cuttings from Mabel\'s travelling pots, and three knobbly rhubarb crowns she has carried all the way in her apron.',
            later:[ { after:180, green:3, ev:'sprout', note:'The herbs in Mabel\'s beds have taken. The whole patch smells of thyme when the sun is on it.' },
                    { after:1440, green:5, ev:'grown', note:'Mabel\'s rhubarb has come up red and enormous. She has started talking about pies.' },
                    { after:2880, green:4, ev:'full', note:'The herbs by Mabel\'s oven are in flower, and the bees have found them.' } ] },
          { id:'edge', name:'Plant a lemon myrtle hedge behind the beds', short:'planting a hedge', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2,
            blurb:'A row of little lemon myrtles behind the herb beds, to keep the wind off and give the wrens a hedge to live in.',
            later:[ { after:360, green:3, ev:'edge1', note:'A pair of wrens has moved into the lemon myrtle hedge by Mabel\'s herb beds.' },
                    { after:1440, green:3, ev:'edge2', note:'The lemon myrtle hedge has filled out. Mabel puts a leaf in her tea.' } ] } ],
        pick:{ name:'Help Mabel pick rhubarb and herbs', short:'picking rhubarb', cost:{}, mins:60, act:'pickup', give:{ bread:2 },
          blurb:'Pull the rhubarb, never cut it; snip the herbs, never pull them. Mabel explains this every time, and bakes a pie with it.',
          thanks:'Mabel sent the gnomes home with a rhubarb pie, still warm, and a bunch of thyme for Hazel.' },
        swap:{ give:{ carrot:3 }, get:{ bread:2 }, text:'Three carrots from the seed bed, and Mabel bakes a carrot cake. Two slices for Wendel and Hazel, one for the baker.' } },

      tobias: { name:'Tobias\'s willow bed', patch:'Tobias\'s willow bed', look:'willow',
        card:'A handful of willow stools by the workshop, cut back every year for wands. "Willow is the only wood that grows faster than I can use it," says Tobias, "and believe me, I have tried."',
        steps:[
          { id:'dig', name:'Dig the soft ground for Tobias\'s willow', short:'digging for the willow', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'Willow likes its feet wet. A long, curving patch of soft ground, dug deep and watered well.' },
          { id:'plant', name:'Push in the willow whips', short:'planting willow', cost:{ water:3 }, mins:90, act:'dig', green:2,
            blurb:'Bare willow sticks pushed straight into the wet earth. It looks like nothing at all. It is not nothing.',
            later:[ { after:180, green:3, ev:'sprout', note:'Every one of Tobias\'s willow sticks has sprouted leaves. He pretends he never doubted it.' },
                    { after:1440, green:5, ev:'grown', note:'Tobias\'s willows are taller than a gnome, all long whippy wands.' },
                    { after:2880, green:4, ev:'full', note:'Catkins on Tobias\'s willows, soft as mouse ears.' } ] },
          { id:'edge', name:'Plant sedges and a tea-tree round the willow', short:'planting sedges', cost:{ seed:1, water:1 }, mins:90, act:'dig', green:2,
            blurb:'Tussocks of sedge and one little tea-tree at the wet end, for the frogs and the small brown birds.',
            later:[ { after:360, green:3, ev:'edge1', note:'Frogs have moved into the sedges round Tobias\'s willow bed.' },
                    { after:1440, green:3, ev:'edge2', note:'The tea-tree by the willow bed is in flower, white as frost.' } ] } ],
        pick:{ name:'Cut willow wands with Tobias', short:'cutting willow', cost:{}, mins:60, act:'gather', give:{ twig:3, plank:1 },
          blurb:'The longest wands cut low and tied in bundles. The stools will grow back by tomorrow, near enough.',
          thanks:'Tobias kept the wands for baskets and gave the gnomes the offcuts, and a plank he said was "in the way".' },
        swap:{ give:{ carrot:2 }, get:{ plank:1 }, text:'Two carrots for Tobias, who eats them like a horse, and a good plank in return.' } },

      fernsby: { name:'The Fernsbys\' family veg patch', patch:'the Fernsbys\' veg patch', look:'veg',
        card:'Four little patches of everything, because every Fernsby has a favourite, and a scarecrow the twins made that looks quite a lot like Wendel.',
        steps:[
          { id:'dig', name:'Dig the Fernsbys\' veg patches', short:'digging veg patches', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'Four small patches, one for each Fernsby. The twins help. The twins help a great deal. Meanwhile, they make a scarecrow.' },
          { id:'plant', name:'Sow the Fernsbys\' patches', short:'sowing veg', cost:{ seed:2, water:2 }, mins:120, act:'dig', green:2,
            blurb:'Cabbages for Rowan, peas for Ivy, strawberries for Posy, and for Pip, an entire patch of radishes, because Pip likes saying "radish".',
            later:[ { after:180, green:3, ev:'sprout', note:'The Fernsbys\' veg patches are up. Pip has counted every radish twice.' },
                    { after:1440, green:5, ev:'grown', note:'The Fernsbys\' cabbages are as round as the twins.' },
                    { after:2880, green:4, ev:'full', note:'Strawberries in Posy\'s patch. She has eaten most of them.' } ] },
          { id:'edge', name:'Dig the twins a frog puddle', short:'digging a frog puddle', cost:{ stone:2, water:2 }, mins:90, act:'dig', green:2,
            blurb:'A little puddle at the corner of the veg patch, lined with stones. Frogs eat the slugs. The twins watch the frogs. Everyone is busy.',
            later:[ { after:360, green:3, ev:'edge1', note:'Frogs have found the twins\' puddle by the veg patch. Pip has named all of them Pip.' },
                    { after:1440, green:3, ev:'edge2', note:'Reeds round the frog puddle, and a dragonfly that Posy says is hers.' } ] } ],
        pick:{ name:'Help the Fernsbys pick', short:'picking with the twins', cost:{}, mins:60, act:'pickup', give:{ berry:2, water:1 },
          blurb:'Ivy picks, Rowan carries, and the twins pick one, eat one. The gnomes are given a punnet for their trouble.',
          thanks:'Ivy sent the gnomes home with a punnet of strawberries and a jug of well water. Two strawberries were missing. Nobody knows anything.' },
        swap:{ give:{ lettuce:2 }, get:{ berry:2, feather:1 }, text:'Two lettuces for the twins\' sandwiches, and back come strawberries and a feather the twins found.' } },

      pebbleworth: { name:'The Pebbleworths\' orchard', patch:'the Pebbleworths\' orchard', look:'orchard',
        card:'Three more fruit trees beyond the first ring, apple and pear and a plum for Mags. "We will not see them at their best," says Bert. "That is not what an orchard is for."',
        steps:[
          { id:'dig', name:'Dig holes for the Pebbleworths\' fruit trees', short:'digging tree holes', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'Three wide holes, well apart, so the trees will have room to grow old. Bert supervises from a chair.' },
          { id:'plant', name:'Plant the apple, the pear and the plum', short:'planting fruit trees', cost:{ water:3, moss:2 }, mins:120, act:'dig', green:2,
            blurb:'Three young trees from the cuttings Bert and Mags carried here in wet moss, staked and mulched and watered in.',
            later:[ { after:180, green:3, ev:'sprout', note:'The Pebbleworths\' new fruit trees are in leaf.' },
                    { after:1440, green:5, ev:'grown', note:'Blossom on the Pebbleworths\' fruit trees. Mags sat under them all afternoon.' },
                    { after:2880, green:4, ev:'full', note:'The first fruit on the Pebbleworths\' trees, and two old ladders leaning in them already.' } ] },
          { id:'edge', name:'Sow clover under the fruit trees', short:'sowing clover', cost:{ seed:2 }, mins:60, act:'pickup', green:2,
            blurb:'White clover under the trees, to feed the soil and the bees, and to make the orchard soft to sit in.',
            later:[ { after:360, green:3, ev:'edge1', note:'Clover has come up under the Pebbleworths\' fruit trees, and the bees with it.' },
                    { after:1440, green:3, ev:'edge2', note:'A ringtail possum has moved into the Pebbleworths\' orchard. Bert says it may have one pear. One.' } ] } ],
        pick:{ name:'Help the Pebbleworths pick fruit', short:'picking fruit', cost:{}, mins:60, act:'pickup', give:{ berry:3 },
          blurb:'Up the old ladders for the high ones, gently, one hand for the tree. Bert holds the ladder. Mags holds Bert.',
          thanks:'Mags sent the gnomes home with a basket of fruit, and the first apple for Hazel, because Bert says the first one always goes to the lady.' },
        swap:{ give:{ bean:3 }, get:{ berry:3 }, text:'Three beans for Bert\'s bean soup, which is good for knees, and a basket of windfalls back.' } },

      clem: { name:'Clem\'s lavender', patch:'Clem\'s lavender', look:'lavender',
        card:'Lavender in long curving rows round the skeps, so the bees step straight out of the door into breakfast.',
        steps:[
          { id:'dig', name:'Dig Clem\'s lavender rows', short:'digging lavender rows', cost:{ twig:1, stone:1 }, mins:90, act:'dig',
            blurb:'Two long curves round the skeps, dug light and stony, because lavender likes its feet dry and its head in the sun.' },
          { id:'plant', name:'Plant out the lavender', short:'planting lavender', cost:{ water:2, seed:1 }, mins:120, act:'dig', green:2,
            blurb:'Little grey-green bushes from Clem\'s cuttings, set out along the curves a gnome\'s stride apart.',
            later:[ { after:180, green:3, ev:'sprout', note:'Clem\'s lavender has rooted. It smells of summer already.' },
                    { after:1440, green:5, ev:'grown', note:'The first purple spikes on Clem\'s lavender. The bees have stopped going anywhere else.' },
                    { after:2880, green:4, ev:'full', note:'Clem\'s lavender rows are a haze of purple, humming.' } ] },
          { id:'edge', name:'Plant a bottlebrush for Clem\'s bees', short:'planting a bottlebrush', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2,
            blurb:'A bottlebrush at the end of the rows, for the bees in the months the lavender rests, and for the honeyeaters all year.',
            later:[ { after:360, green:3, ev:'edge1', note:'A honeyeater has found Clem\'s bottlebrush, and is very rude to the bees about it.' },
                    { after:1440, green:3, ev:'edge2', note:'Clem\'s bottlebrush is in flower, red as a robin.' } ] } ],
        pick:{ name:'Help Clem cut lavender', short:'cutting lavender', cost:{}, mins:60, act:'pickup', give:{ honey:1, seed:1 },
          blurb:'Only half of every bush, so the bees are not cross. Bunches hung up to dry in Clem\'s doorway.',
          thanks:'Clem gave the gnomes a pot of lavender honey and a little bag of seed heads for Hazel\'s pillow.' },
        swap:{ give:{ bean:2 }, get:{ honey:1 }, text:'Two beans, because bean flowers are her bees\' favourite, she says, and a pot of honey back.' } },

      barnaby: { name:'Barnaby\'s wheat', patch:'Barnaby\'s wheat', look:'wheat',
        card:'Two long golden strips beside his stump, for flour. "Mabel bakes it. I grind it. Wheat grows it," says Barnaby. "Mm." That is the most he has ever said about anything.',
        steps:[
          { id:'dig', name:'Turn the ground for Barnaby\'s wheat', short:'turning the ground', cost:{ twig:2 }, mins:90, act:'dig',
            blurb:'Two long curving strips, turned over and raked fine. Barnaby walks up and down them, nodding.' },
          { id:'plant', name:'Sow Barnaby\'s wheat', short:'sowing wheat', cost:{ seed:3, water:1 }, mins:90, act:'pickup', green:2,
            blurb:'Seed scattered from the hand in wide sweeps, the old way, and raked in. The birds watch with interest.',
            later:[ { after:180, green:3, ev:'sprout', note:'A green fuzz on Barnaby\'s wheat strips. He stood and looked at it for a long time.' },
                    { after:1440, green:5, ev:'grown', note:'Barnaby\'s wheat is up to the gnomes\' knees and rippling.' },
                    { after:2880, green:4, ev:'full', note:'Barnaby\'s wheat has turned gold. Mabel came to look at it and went all quiet.' } ] },
          { id:'edge', name:'Sow wildflowers along the wheat', short:'sowing wildflowers', cost:{ seed:2 }, mins:60, act:'pickup', green:2,
            blurb:'Paper daisies and blue bells along the field edges, for the beetles that keep the wheat clean.',
            later:[ { after:360, green:3, ev:'edge1', note:'Paper daisies along the edge of Barnaby\'s wheat. He said "Mm," but nicely.' },
                    { after:1440, green:3, ev:'edge2', note:'A quail and her chicks are living in the edge of Barnaby\'s wheat. He walks round them.' } ] } ],
        pick:{ name:'Help Barnaby cut the wheat', short:'cutting wheat', cost:{}, mins:90, act:'gather', give:{ seed:3, bread:1 },
          blurb:'A strip cut and stood in sheaves, and the rest left to grow on. Barnaby says thank you with his eyebrows.',
          thanks:'Barnaby gave the gnomes a sack of seed and a loaf Mabel had made from last time\'s flour. "Mm," he said. It meant a lot.' },
        swap:{ give:{ bean:2 }, get:{ seed:3 }, text:'Two beans for Barnaby\'s soup, and back comes a little sack of seed.' } },

      nettle: { name:'Nettle\'s flax and dye plants', patch:'Nettle\'s dye garden', look:'flax',
        card:'Flax for linen, and the plants for colour: woad for blue, weld for yellow, and a native indigo bush. "Colours do not come from nowhere," says Nettle. "They come from here. Do not touch."',
        steps:[
          { id:'dig', name:'Dig Nettle\'s flax patch', short:'digging the flax patch', cost:{ twig:1 }, mins:90, act:'dig',
            blurb:'One long patch for the flax and two small beds for the dye plants, all exactly where Nettle has drawn them.' },
          { id:'plant', name:'Sow the flax and the dye plants', short:'sowing flax', cost:{ seed:2, water:2 }, mins:120, act:'pickup', green:2,
            blurb:'Flax seed sown thick, and the dye plants set out in their beds. Nettle checks every one and moves two.',
            later:[ { after:180, green:3, ev:'sprout', note:'Nettle\'s flax is up, thin and green as grass.' },
                    { after:1440, green:5, ev:'grown', note:'Nettle\'s flax is tall and swaying, and the woad has gone yellow with flowers.' },
                    { after:2880, green:4, ev:'full', note:'The flax in Nettle\'s patch is in flower, the palest blue. Even Nettle smiled.' } ] },
          { id:'edge', name:'Plant a native indigo bush', short:'planting the indigo', cost:{ acorn:1, water:1 }, mins:90, act:'dig', green:2,
            blurb:'A native indigo at the corner of the dye garden, with its little purple pea flowers. It gives a blue, and a home to butterflies.',
            later:[ { after:360, green:3, ev:'edge1', note:'Blue butterflies on the native indigo by Nettle\'s dye garden.' },
                    { after:1440, green:3, ev:'edge2', note:'The native indigo by Nettle\'s dye garden has filled out. She has called it "adequate".' } ] } ],
        pick:{ name:'Help Nettle pull flax', short:'pulling flax', cost:{}, mins:60, act:'gather', give:{ yarn:1, seed:1 },
          blurb:'Flax is pulled, not cut, roots and all, and laid out in rows. Nettle inspects every row. Most of them pass.',
          thanks:'Nettle gave the gnomes a skein of yarn and the flax seed for next time. "Use it properly," she said, which from Nettle is a hug.' },
        swap:{ give:{ carrot:2 }, get:{ yarn:1 }, text:'Two carrots, because carrot tops make a good yellow-green, and a ball of yarn dyed with them.' } },

      juniper: { name:'Juniper\'s moonflowers', patch:'Juniper\'s moonflower garden', look:'moon',
        card:'A little trellis of moonflowers by the hollow tree. They open at dusk, white and wide, when Juniper goes out with her jars. Pale, never glowing: they just catch the light.',
        steps:[
          { id:'dig', name:'Dig Juniper\'s moonflower bed', short:'digging the bed', cost:{ twig:1 }, mins:60, act:'dig',
            blurb:'A curved bed along a little stick trellis by the hollow tree, so the vines have something to climb.' },
          { id:'plant', name:'Plant the moonflower seeds', short:'planting moonflowers', cost:{ seed:2, water:2 }, mins:90, act:'dig', green:2,
            blurb:'Big pale seeds soaked overnight in a jar, then planted by the trellis feet. Juniper whispers to each one.',
            later:[ { after:180, green:3, ev:'sprout', note:'Juniper\'s moonflowers are up and reaching for the trellis.' },
                    { after:1440, green:5, ev:'grown', note:'Juniper\'s moonflowers have climbed the trellis. Big buds, waiting for dusk.' },
                    { after:2880, green:4, ev:'full', note:'Juniper\'s moonflowers opened at dusk, all at once, white as plates. Moths came.' } ] },
          { id:'edge', name:'Sow evening primroses by the trellis', short:'sowing primroses', cost:{ seed:1, water:1 }, mins:60, act:'pickup', green:2,
            blurb:'Evening primroses along the bed, pale yellow, that also open at dusk, so the moths have more than one supper.',
            later:[ { after:360, green:3, ev:'edge1', note:'Moths at dusk round Juniper\'s evening primroses, big soft ones.' },
                    { after:1440, green:3, ev:'edge2', note:'A little owlet-nightjar sits on Juniper\'s trellis at dusk and watches the moths.' } ] } ],
        pick:{ name:'Gather moonflower seed with Juniper', short:'gathering at dusk', cost:{}, mins:60, act:'pickup', give:{ light:1, seed:1 }, hours:[17, 22], hoursWhy:'the moonflowers only open at dusk',
          blurb:'At dusk, when the moonflowers open, the old seed pods are gathered and a little of the evening light caught in a jar.',
          thanks:'Juniper gave the gnomes a jar with a little evening light in it, and a few moonflower seeds for their own fence.' },
        swap:{ give:{ lettuce:2 }, get:{ light:1 }, text:'Two lettuces, so Juniper remembers to eat, and a wisp of light back in a jar.' } },
    },
  },

  // ---------- seasons (southern hemisphere, from the phone's date) ----------
  // Code tints and drifting things in index.html (SEASON_LOOK); seasonal visitors (seasons on a visitor) and events (seasons on an event).
  seasons: {
    spring: { name:'Spring', arrive:'Spring has come to the valley. Wattle on the wind, blossom on the stream, and everything in a hurry to grow.' },
    summer: { name:'Summer', arrive:'Summer. Long golden evenings, the cicadas tuning up, and Hazel insisting on hats.' },
    autumn: { name:'Autumn', arrive:'Autumn. The light has gone soft and amber, the leaves are letting go, and Wendel has found his scarf.' },
    winter: { name:'Winter', arrive:'Winter. Mist in the hollows, frost on the moss at dawn, and the fire never quite goes out.' },
  },

  // ---------- the festival: the soft ending (decided by Bryce 2026-10-25) ----------
  // Once enough neighbours live here, they propose a Greening Festival for the healing valley, and plot among themselves (you
  // overhear; the couple must not) that it is really the wedding feast Wendel and Hazel never had. Festival jobs get the green ready; then, on the next evening, the
  // night itself plays as story pages, the couple dance on the green, and an "end of the beginning" page closes the main story.
  // The world keeps going after that, and the festival comes back on the same date every year.
  // {who} = the neighbour who has lived here longest. alt = cost used if nobody in the village makes one of the goods in cost.
  festival: {
    name: 'The Greening Festival',
    needFolk: 6,              // neighbours living here before the festival is proposed (Bryce 2026-10-25: 6 minimum)
    hours: [17, 23],          // the festival evening (the couple dance on the green; the neighbours gather at the table)
    jobs: [
      { id:'fest:green', name:'Mow a green for the festival', short:'mowing the green', who:'her', act:'dig', cost:{ twig:2, stone:2 }, mins:240, green:0, claims:true, spot:'green',
        blurb:'A soft, mown green on a healed patch with no home on it, with room for a long table and a little dancing.' },
      { id:'fest:table', name:'Build the long table', short:'building the long table', who:'him', act:'carry', cost:{ plank:4, twig:4 }, alt:{ twig:10, stone:4 }, mins:360, green:0, needs:['fest:green'], spot:'table',
        blurb:'One long table and two benches, long enough for the whole village and somebody\'s cousin.' },
      { id:'fest:bunting', name:'Sew the bunting', short:'sewing bunting', who:'her', act:'carry', cost:{ yarn:3, feather:3 }, alt:{ moss:4, feather:4 }, mins:300, green:0, needs:['fest:green'], spot:'bunting',
        blurb:'Little cloth flags on a string from pole to pole, every one a different colour. Hazel has opinions about the order.' },
      { id:'fest:lanterns', name:'Hang lanterns round the green', short:'hanging lanterns', who:'him', act:'carry', cost:{ light:4, twig:4, stone:2 }, mins:300, green:0, needs:['fest:green'], spot:'lanterns',
        blurb:'Paper lanterns on poles round the green, each with a wisp of light inside, so the dancing can go on after dark.' },
      { id:'fest:arch', name:'Weave a flower arch', short:'weaving the arch', who:'her', act:'carry', cost:{ seed:4, moss:4, berry:2 }, mins:360, green:0, needs:['fest:green'], spot:'arch',
        blurb:'An arch of willow woven with wattle and paper daisies, for the way onto the green. (You know what it is really for.)' },
      { id:'fest:feast', name:'Help bake the festival feast', short:'baking the feast', who:'him', act:'carry', cost:{ bread:3, honey:2, pumpkin:1, bean:2 }, alt:{ seed:4, berry:6, water:2 }, mins:300, green:0, needs:['fest:table'], spot:'table',
        blurb:'Loaves, honey cakes, berry tarts and one enormous pie. Wendel is in charge of tasting.' },
    ],
    idea: { title:'A festival?', text:'The neighbours came up the path together this morning, which has never happened before, and stood in a row outside the stump house looking pleased with themselves. "The valley is coming back to life," said {who}. "Patch by patch. That deserves a festival." Wendel was delighted. Hazel was already making a list. A Greening Festival, then: a mown green, a long table, bunting, lanterns, a flower arch and a feast.' },
    secret: { title:'A secret', text:'Later, well out of Wendel and Hazel\'s hearing, the neighbours put their heads together by the path. Nobody saw the luck that drifted close to listen. "They married on the road, those two," {who} whispered. "No feast. No flowers. No dancing. So this festival is going to be their wedding feast, and they are not to know until the night. Not a word." A pause. "And the flower arch is not for the gate."' },
    ready: 'Everything is ready on the green. The festival is {when}, from five o\'clock.',
    night: [
      { key:'fest-night', title:'The Greening Festival', text:'The lanterns came on one by one as the sun went down, and the whole village walked to the green in its best clothes. Wendel had combed his beard twice. Hazel had a sprig of wattle behind her ear. The table was so full that the benches creaked, and someone had to hold the pie down.' },
      { key:'fest-surprise', title:'The surprise', text:'Before anyone sat down, {who} climbed onto the bench and tapped a cup. "This is a festival for the valley," {who} said, "and it is also a wedding feast. Yours. Late, and you are not getting out of it." Everyone turned to look at Wendel and Hazel, standing under the flower arch, which was suddenly, obviously, a wedding arch. Hazel put both hands over her mouth. Wendel said "Oh," and then nothing at all for quite a long time.' },
      { key:'fest-dance', title:'The first dance', text:'They danced on the green, badly and happily, while the neighbours clapped the time and the wisps came down out of the dark to watch. "You never told me you could dance," said Hazel. "I can\'t," said Wendel. "I\'m just holding on to you." Over the stump house, low and warm, the first star came out.' },
    ],
    end: { key:'fest-end', title:'The end of the beginning', text:'When you first came, this was a logged clearing full of rubbish, two small gnomes and a wheelbarrow. Now it is a village. This is not the end: the seasons will keep turning, visitors will keep coming, and Wendel and Hazel will keep growing older together, slowly, the way the trees do. Come back whenever you like. There will always be something growing, and they will always be glad of a little luck.' },
    reward: { light:5 },
    yearly: { title:'Another year', text:'The bunting came out of the chest again this morning, a little faded, and the lanterns went back up round the green. "{years}," said Hazel. "Doesn\'t feel like it," said Wendel. "Feels like longer," said Hazel, and kissed him, to show she meant it nicely. Tonight there is a festival on the green.' },
  },

  // The welcome screen, before page 1.1 (docs/STORY.md "Before chapter one"): what this is, who you are, how to play.
  // Words only; index.html draws the screen. how: one line each, may hold <b>.
  welcome: {
    title: `Welcome to Gnome Life`,
    text: [
      `This is a little storybook that grows a page at a time, a little more each day you visit.`,
      `It is about two gnomes, Wendel and Hazel. They have just been married, and they have come to live on a bare hillside where the loggers cut down every tree. Over many days they will dig and plant and build, and slowly turn it back into a green, cosy home, and one day a whole village.`,
      `<b>And you?</b> You are the luck of this place. The gnomes can't see you, and they will never quite know you are there, but they feel it whenever things go their way. You don't dig or carry: Wendel and Hazel do all of that themselves. You gather the little things the land leaves lying about, you choose what they work on next, and later a spirit of the woods will teach you a little gentle magic.` ],
    howTitle: `How to play`,
    how: [
      `👆 <b>Swipe</b> to look around. <b>Pinch</b> to zoom in close.`,
      `✨ <b>Tap the little things lying about</b> (twigs, stones, seeds). Your luck carries them to the gnomes' store (🧺 Store).`,
      `🔨 <b>Jobs shows what they can do next.</b> If you are ever unsure what to do, look in Jobs. A dot on it means a job is ready to start.`,
      `👀 <b>Tap anything</b>, the gnomes included, to see what it is.`,
      `🕰️ <b>Jobs take real time.</b> Start one, put your phone down, and come back later. A short visit or two a day is plenty.`,
      `🌿 <b>There is no hurry</b>, and nothing can go wrong. Nothing dies and nobody loses.` ],
    button: `Open the story`,
    after: `Wendel and Hazel are waiting to start. Open 🔨 Jobs to see what they can do first.`,   // a small pointer once page 1.1 closes
  },

  // Side mystery placeholder: a magic staff one of the gnomes finds. Bryce is writing this story himself;
  // nothing here is plot, only the shape: ordered beats with a trigger and a flag the engine can set.
  // The first month's story (docs/STORY.md is the master for the words). Each page opens once, from something the player
  // already does (when: see game.js storyDue), at most one at a time and never over an open menu; all are kept in the Journal.
  // Pages come in book order: a page waits for the page before it (after: the pages it waits for instead), and the jobs that
  // come next wait for the pages (tasks needs 'page:<id>'), so the story is in charge of what unlocks.
  // text: paragraphs; a paragraph may be { if:'taskId' | 'flag:x' | 'season:a|b', text, else } (left out until that has happened). pic: a creature
  // portrait as the stand-in picture until the page is painted (art slot page-<id with a dash>, e.g. page-1-1); else the couple.
  story: { beats: [ /* { id:'staff-found', when:{ landStage:'green' }, text:'...', sets:'staffFound' } */ ],
    chapters: { 1:'Chapter one: The bare clearing', 2:'Chapter two: Putting down roots', 3:'Chapter three: A proper home' },
    pages: [
      { id:'1.1', ch:1, when:'welcome', title:'The end of the road', button:`Let's begin`, text:[
        `They came up the old logging track at the end of a long, hot afternoon, with the cicadas going like tiny saws in the grass. Wendel pushed the wheelbarrow. Hazel carried the little oak in its pot, and talked to it now and then to keep its spirits up. Everything they owned was in that barrow, and most of it was pots.`,
        `Twenty steps from the top, the wheel came off. It bowled away down the hill, bouncing as it went, and they stood and watched it go. Then they carried the rest.`,
        `The clearing at the top was not what the travelling pedlar had promised. The loggers had taken every tree but the stumps and left their rubbish behind: rusty tins, broken crates, a cartwheel with no cart. Nothing grew. The creek was a dry bed of stones, and not one bird was singing.`,
        `Wendel looked at it all for a long while. "Well," he said gently. "It's got a lovely view."`,
        `Hazel slipped her hand into his. "It's got us now, too," she said. She set the little oak down beside the biggest stump, and that was where they would make their home.`,
        `Gnomes have a gift, you see. Wherever they live and dig and plant, the land slowly remembers how to be alive. But it is slow work for two small gnomes on a very bare hill, and so they were not quite alone. Something had followed them up the track that evening: a small, kindly luck, the sort that makes a stick turn up just when you need one. They could not see it, and they would never quite know it was there. That luck is you.` ] },
      { id:'1.2', ch:1, when:'evening:woodpile', title:'The first fire', button:'Goodnight, you two', text:[
        `They had lit a fire the moment they arrived, in the loggers' old ring of stones, but it was a poor, smoky thing made of whatever sticks were lying about. Tonight was different. Tonight there was a woodpile.`,
        `Wendel had stacked it bark side up, the way his grandfather used to, and while he stood back to admire it, Hazel quietly laid the fire, because she knew how much he had been looking forward to this. It caught at once and crackled, as if it knew it was the first real fire in their first real home.`,
        `They sat on an upturned pot each and shared the last of the travelling bread. A beetle came out of the woodpile to see what all the fuss was about. Wendel bowed to him and named him Gerald.`,
        `"I had a speech," said Wendel, patting his pockets. "About new beginnings. I wrote it down. I think it's with my pipe."`,
        `Hazel took his pipe out of her apron pocket, where it had been since the bottom of the hill, and gave it to him. "Do the speech, love," she said.`,
        `He looked at the fire, and at the first stars coming out over the stumps, and at her. "We're here," he said. That was the whole speech. Hazel said it was the best one she had ever heard.` ] },
      { id:'1.3', ch:1, when:'done:spring', title:'Water under the rubbish', button:`Things can grow now`, text:[
        `Wendel walked the whole clearing with a forked twig held out in front of him, eyes half shut, the way his grandfather had taught him. Hazel walked softly behind with the trowel, because dowsing wants quiet, and every gnome knows it.`,
        `Under the very last of the loggers' crates, the twig gave a twitch.`,
        `"There," he whispered. "Water. I can feel it."`,
        `Hazel was already on her knees with the trowel. "Then let's say hello to it," she said.`,
        `Three stones and a great deal of mud later, a thread of clear water came up out of the ground, cold as a secret. It filled a hollow no bigger than a teacup, then a saucer, then a little pool with the sky in it.`,
        `They knelt on either side of it, muddy to the elbows, and watched it the way you might watch a sleeping baby. It was the first water this hill had held in years. And where there is water, things can grow. Somewhere deep down, very faintly, the land noticed.` ] },
      { id:'1.4', ch:1, when:'seedlings', title:'Rows and wiggles', button:'Grow, little ones', text:[
        `On planting day, Hazel opened the seed tin her mother had pressed into her hands the morning they set off. Inside, in little twists of paper, were carrots, beans, a pinch of lettuce, and one enormous pumpkin seed. Wendel took that one out and put it in his top pocket. "For something special," he said.`,
        `"Rows," said Hazel, drawing a straight line in the soil with her finger.`,
        `"Wiggles," said Wendel, drawing a curly one beside it.`,
        `So they planted in rows, with one wiggle at the end, and both of them were happy, which is how most marriages work.`,
        `By evening the bed lay dark and damp and very still. By morning it was not. Tiny green shoots stood up all over it, looking surprised to be there, and Wendel went along the rows on his knees, saying good morning to each one.` ] },
      { id:'1.5', ch:1, when:'flag:rabbit', pic:'rabbit', title:'The thief', button:`Fair's fair`, text:[
        [ `Somebody had been in the seed bed. Somebody with long ears, a white tail and no manners at all.`, { if:'flag:rabbitDish', text:`The feeding dish was licked clean, and three of the sprouts were nibbled down to nothing.`,
          else:`Three of the little sprouts were nibbled down to nothing.` } ],
        `Wendel knelt by the bitten stalks with a sad face. Then he noticed the footprints in the soft earth: tiny ones, close together, going round and round, as if whoever made them had been too hungry to decide where to start.`,
        `Hazel had seen it from the shelter: a rabbit as thin as a rake, sitting up with a sprout in its mouth, chewing as fast as it could in case someone took it away.`,
        `"Poor thing's starving, love," she said. "Same as we were when we got here."`,
        `"Then we'll share," said Wendel at once. He gathered up a few straight sticks and began to measure. "A little fence round the bed, with a gate. We'll put something out for the rabbit, and just ask it, nicely, to leave the carrots for us."` ] },
      { id:'2.1', ch:2, when:'flag:firstpick', title:'Supper from our own ground', button:'About that roof', text:[
        `The first carrots came out of the ground small and crooked and very, very orange. One of them had two legs. Wendel held it up and said it looked like him. Hazel said it was better looking.`,
        `They washed them in the spring and ate them by the fire with a pinch of salt. Nothing had ever tasted so good, because nothing had ever been so much their own. And where the carrots had grown, the soil was a little darker than before, as if it had learned something.`,
        `Wendel put the carrot tops aside for the rabbit. Hazel licked her fingers and looked over at the old canvas shelter, which sagged in the middle like a tired hammock.`,
        `"Now then," she said. "About that roof."` ] },
      { id:'2.2', ch:2, when:'done:roof', title:'The night it rained', button:'Snug at last', text:[
        `It rained the night before the new roof was finished. Not a gentle rain: a proper hill rain, sideways and cheerful, that found every hole in the old canvas and came through all of them at once.`,
        `They ended up squashed together in the one dry corner under Hazel's shawl, with every pot they owned set out to catch the drips. Plink, went the pots. Plonk. Plink.`,
        `"This is the worst night of our marriage," said Wendel.`,
        `"It's the only night of our marriage under this roof," said Hazel. "Give it time." And then they were both laughing too hard to hear the drips. Out in the dark, the thirsty ground drank every drop.`,
        `In the morning Hazel laid the moss on thick, green and springy, and Wendel handed it up to her a piece at a time. The shelter has not leaked since. They keep one pot by the door anyway, for luck.` ] },
      { id:'2.3', ch:2, when:'done:bench', title:'Room for two', button:'Shuffle up', text:[
        `All afternoon Wendel had been busy behind the woodpile, and every time Hazel came near he said it was "nothing, just a stick thing, go away".`,
        `It was a bench: one good plank on two stout legs, set by the fire, just long enough for two gnomes if they did not mind sitting close.`,
        `She sat on it. It wobbled. He wedged a flat stone under one leg. It stopped wobbling.`,
        `"Do you like it?" he asked, a little anxiously.`,
        `"No," said Hazel. That is what she says when she likes something so much she cannot talk about it, and Wendel knew it. He sat down beside her, and they stayed there until the fire was only embers and Gerald had gone to bed.` ] },
      { id:'2.4', ch:2, when:'done:sapling', title:'The little oak', button:'Grow tall', text:[
        `The little oak had come a long way in its pot. Hazel had picked up the acorn by the roadside on the morning they were married, carried it in her pocket all day, and planted it that night in a teacup.`,
        `Now, at last, it went into real ground at the front corner of the yard. Hazel dug the hole and set it in, Wendel brought spring water in the can, and then they knelt and patted the soil down round it, both together.`,
        `"It'll outlive us," said Wendel softly.`,
        `"That's the idea," said Hazel. "One day some other gnome will sit under it and wonder who planted it."`,
        `"We could carve our names on it."`,
        `"Not on the tree, love," said Hazel. "It's got enough to do." But she let him scratch a very small W and H on the empty pot, and he has kept it ever since.` ] },
      { id:'2.5', ch:2, when:'week', title:'Our first week', sub:`in Hazel's handwriting`, button:'Turn the page', journal:true, text:[
        [ `Seven days.`, { if:'roof', text:`We have a roof (moss, no leaks).` }, { if:'woodpile', text:`We have a fire every night (Wendel's woodpile, he is very proud of it).` }, { if:'spring', text:`We have a spring we found ourselves (Wendel found it, he would like that written down).` }, { if:'bed', text:`We have a seed bed, and we have eaten from it.` }, { if:'fence', text:`We have a fence, and a rabbit who thinks the fence is a suggestion.` } ],
        `And the land is waking. There's a haze of green at the edges now. Wendel says he can smell it coming, like rain.`,
        `I think somebody is helping us. Things turn up just where we need them: twigs by the door, stones by the bed, dew in the morning. I don't know who you are, or what you are. But thank you.`,
        { margin:true, text:`Best week of my life. Lost my pipe four times. Found it in her apron four times.` } ] },
      { id:'3.0', ch:3, when:'next', title:'A house for winter', button:`Let's build a house`, quest:true, text:[
        { if:'season:spring|summer', text:`It was a grey morning, the first in weeks. Not cold, just damp enough that the canvas sagged and dripped. Wendel's cold toes found Hazel's under the blanket, and she let them stay.`,
          else:`It was the first cold morning. Not very cold: just enough that Hazel's breath made a little cloud in the air. Wendel's cold toes found hers under the blanket, and she let them stay.` },
        `Hazel sat up and looked at the drooping canvas, and the moss roof, and the big old stump the shelter leaned against.`,
        `"Wendel," she said. "That stump is hollow."`,
        `"Mm," said Wendel, mostly asleep.`,
        { if:'season:winter', text:`"A stump that size could be a house. A real one, with a door and windows and a chimney. Before this winter gets any colder."`,
          else:`"A stump that size could be a house. A real one, with a door and windows and a chimney. Before the winter comes."` },
        `Wendel sat up so fast he took the whole blanket with him. He had been waiting all his life for someone to say those words, and he already knew where the round windows would go.` ] },
      { id:'3.1', ch:3, when:'garden', title:'Next door', button:'Hello there', text:[
        `Hazel stood at the edge of the yard with her hands on her hips, looking at the patch of land next door. A week ago it had been grey and bare. Now it was, very definitely, green.`,
        `"A garden," she said. "A real one. Flowers along the path. A corner for the creatures. Somewhere to sit that isn't next to your woodpile."`,
        `"What's wrong with my woodpile?"`,
        `"Gerald lives in it."`,
        `There was just one problem. Right in the middle of her garden stood the biggest, reddest, most settled toadstool either of them had ever seen. Hazel gave it a careful tug. Wendel gave it a polite push. It did not so much as wobble.`,
        `"Sorry, old fellow," said Wendel, patting its cap. "We don't mean to be rude. It's only that you're right where the roses want to go."`,
        `Neither of them saw what drifted out of the trees just then, soft and green as new leaves, and settled beside the toadstool as if it had been waiting for this very moment. But you did.` ] },
      { id:'3.2', ch:3, when:'toadWalked', title:'The toadstool takes a walk', button:'Just a little magic', text:[
        `It isn't every day you see a toadstool get up.`,
        `First it shivered. Then four knobbly root legs wriggled out from under its cap, tested the ground one at a time, and stood it up with a creak. It looked about, the way you do when you have slept too long. Then off it went, wobble, wobble, wobble, to the far corner of the garden, where it sat down with a sigh of deep content.`,
        `Wendel's pipe fell out of his mouth. Hazel picked it up and put it back without looking.`,
        `"Did you do that?" Wendel whispered.`,
        `"No," said Hazel. She looked round at the empty air, the way you look for someone who has just stepped out of the room, and she smiled. "There's a luck about this place," she said. "A kind one. I'm sure of it."`,
        `It was you, of course. But we won't tell them.` ] },
      { id:'3.3', ch:3, when:'flag:miceIn', pic:'mouse', title:`Somebody's moved in`, button:'Welcome home, mice', text:[
        `On the morning after the toadstool grew its little door, there was a tiny line of washing strung between its stalk and a blade of grass.`,
        { if:'helped:mouse', text:`The field mouse they had once helped out of a bottle had moved in, and brought her family: one husband, very polite, and three small mice who had already found their way into the seed bed. Hazel let them off, the first time.`,
          else:`A field mouse who had been watching from the long grass had moved in, and brought her family: one husband, very polite, and three small mice who had already found their way into the seed bed. Hazel let them off, the first time.` },
        `"Our first neighbours!" said Wendel, delighted, and went straight off to find them a crumb of carrot.`,
        `"Our first tenants," said Hazel. "They can pay their rent in being sweet." They are very good at it.`,
        `And here is a thing worth knowing: wherever a creature makes its home, the land takes heart. By lunchtime the grass round the toadstool was greener than anywhere else in the garden.` ] },
      { id:'3.4', ch:3, when:'done:house1', title:'Big plans', button:'Back to work', text:[
        `The old stump was hollow now, with room inside for a bed, a hearth and a table. Wendel had drawn up the plans. There were a great many of them.`,
        `There was a tower, for looking at the stars. A round room at the top with a telescope. A workbench in the kitchen, "so I can be near you, love", with all his bits and pieces on the shelf where the plates should go.`,
        `Hazel looked at the plans for a long time. Then she said, "No." It was not her happy no.`,
        `Wendel looked at the plans again, and then at her face, and understood. "You wanted somewhere for us," he said quietly. "Not somewhere for my bits and pieces." They ate supper without saying much, but it was a thinking sort of quiet, not a cross one.`,
        `In the morning she found him outside already, drawing again. This time it was a little lean-to against the side of the house, all his own: a workbench, a hook for every tool, and a small window that looked at the stars.`,
        `"Your bits and pieces can live in there," said Hazel, and kissed the top of his head. "And the spare room stays spare."`,
        `"What's it for?"`,
        `"You never know," said Hazel.` ] },
      { id:'3.5', ch:3, when:'done:house3', title:'Over the threshold', button:'The end of chapter three', text:[
        `The last shingle went on at sunset. The chimney drew on the very first try. The round windows glowed gold.`,
        `Wendel wanted to do it properly. He scooped Hazel up at the doorstep, took one grand step, caught his toe on the doorstep he had laid himself, and they both went through the door in a heap. They lay on the new floor and laughed until they cried.`,
        `"Welcome home, my love," said Wendel, from somewhere underneath her skirts.`,
        `"Welcome home, you great lump," said Hazel.`,
        `Neither of them had noticed the little board over the door yet. Hazel had painted it in her best lettering: THE GNOMESTEAD, with a tiny snail underneath, taking the last letter very slowly.`,
        `That night, for the first time, they slept under a real roof in a real house, on a hillside that was learning to be green again. And far down the old track, a small lantern was bobbing up the hill. Somebody else was coming.` ] },
    ],
    // the stump house quest, started by page 3.0 and shown at the top of the Journal
    quest: { name:'A proper home', steps:[ ['house1', 'Hollow out the old stump'], ['house2', 'Fit a plank wall and windows'], ['house3', 'Raise the roof and chimney'], ['page:3.5', 'Move in'] ] },
    // The Wood spirit comes five times in the first month, always in this order (game.js spiritLesson), and floats by what it is
    // teaching about until you tap it. Then it comes back to teach each new kind of bare patch. Its one lesson: magic is for
    // asking, not pushing. The gnomes cannot see it; it is the only one who ever talks to you.
    spiritFirst: `Something soft and green drifts out of the trees, like a handful of new leaves that forgot to fall. It turns and looks straight at you, as if it has always known you were there. The gnomes can't see it. But you can.`,
    lessons: [
      { n:1, at:'seedbed', spell:'coax', title:'Coax a sprout', text:`"Hello, little luck. I've been watching you help them. The glimmers you gather, the dew and the wisps, are light, and light is your magic. It can't make anything grow. Nothing can. But it can whisper to a seed that is already trying, and tell it to hurry, because somebody is hungry."` },
      { n:2, at:'spring', spell:'rain', title:'Call soft rain', text:`"The clouds pass over this hill without stopping. They think nothing lives here any more. Ask them nicely to look down, and they might. But never ask for a storm, little luck. A garden wants a drink, not a bath."` },
      { n:3, at:'toadstool', spell:'legs', title:'Give the toadstool legs', text:`"Big, isn't he? And very settled. You could push him all day and he wouldn't mind you one bit. But ask him kindly, give him a little light, and he'll find his own legs. He might even like the corner better."` },
      { n:4, at:'edge', spell:'wake', title:'Wake the land', text:`"See out there, past the garden, where the land is still dark? It isn't dead. It's only asleep, dreaming of what it used to be. When the gnomes have done their part, you can help it wake a little sooner. Only a little. Waking up is not something you rush."` },
      { n:5, at:'fire', spell:null, title:'A bright fire', text:`"Your light is strong now, little luck, stronger than mine was at your age. There's nothing new to teach you today. Only this: you'll find light in the dark, in wisps and dew, and you'll find it every time you are kind. Help the small ones when they're in trouble. That is the brightest magic there is."`,
        after:`"I'll be about. Whenever this hill needs something new, I'll come and show you."` },
    ],
    // creatures moving into a home the gnomes made bring the land back too (+1 green each), a while after the home is made
    moveIns: [
      { id:'nestbox', job:'nestbox', note:'The robins have moved into the nest box. The grass by the fence looks greener this morning.' },
      { id:'leafpile', job:'hedgehoghouse', note:'Something prickly has moved into the leaf pile. The ground round it is waking up.' },
      { id:'beehouse', job:'beehive', note:'The little native bees have moved into the log house. The herbs are humming, and the land is the better for it.' },
      { id:'pond', job:'pond', note:'A frog has moved into the pond, and the land is the better for it.' },
      { id:'mice', flag:'miceIn', garden:true, note:'The mice have moved into the toadstool. Wherever someone makes a home, the land takes heart.' },
      { id:'burrow', job:'earthbank', garden:true, after:2880, note:'The rabbit has dug a burrow into the earth bank. Wherever someone makes a home, the land takes heart.' },
      { id:'owlbox', job:'owlbox', after:2880, note:'The owl has moved into the owl box. The land is the better for it.' },
    ],
    moveInAfter: 720,   // minutes after the home is made before someone moves in (after: a move-in's own wait)
    // "All done for now": once a visit, when both gnomes are busy (or nothing more can be started) and nothing is left lying about.
    // {time} is when their next job finishes. They are talking to each other: they feel a kindly luck about, but never see you.
    allDone: {
      busy: [ ['her', `That's us busy till about {time}, love. Nothing to do till then but the doing.`], ['him', `Nothing more to start till about {time}. Then we'll see what we've made.`], ['her', `Leave it be, Wendel. A watched seed bed never sprouts.`] ],
      nothing: [ ['him', `We'll need a few more bits before the next job. The land always leaves something out, if you wait.`], ['her', `That's all we can do today. It's enough. A little each day, that's the trick.`] ],
      evening: [ ['her', `Kettle's on, the fire's lit, and we're stopping. Come and sit, love.`], ['him', `I'm putting my feet up. Don't tell anyone I said that before six.`] ],
      night: [ ['her', `He's asleep already. There'll be dew in the morning.`], ['him', `Goodnight, valley. Goodnight, Gerald. Goodnight, whatever luck lives here.`] ],
      bigDay: [ ['her', `What a day. I think we've earned a sit down, love.`] ],
    },
  },

  // Little makes (docs/DECORATIONS.md): when a patch reaches a new land stage, Hazel says what they could make now (a small card);
  // the makes themselves are in tasks (make: yard | garden). Lines by patch and stage.
  makes: {
    yard: { name:'The yard', tile:'0,0', lines:{
      barren:`Now we've eaten from our own ground, let's make this place ours. A ring of stones for the fire, something to sit on, and a scraper for your boots, Wendel.`,
      green:`Now the yard's greening, I'd love some flower pots by the door.`,
      meadow:`Grass round the house! A swing for the oak, a sundial, herbs by the barrel. Oh, the things we could make now.`,
      wood:`It's a proper wood now. A house in a wood should have a name, don't you think? And a hammock. Definitely a hammock.` } },
    garden: { name:'The garden', tile:'0,1', lines:{
      green:`A garden of our own. Stepping stones first, so we don't tread on anything, then a gate, then somewhere to sit and think.`,
      meadow:`The garden's filling out. It wants flowers along the path, and an arch to walk under on the way in.`,
      wood:`Ferns in the shady corner, a log to sit on under the trees, and a seat for two by the pond.` } },
  },

  lines: {
    him: ["Bare as a baker's elbow. We'll fix that.", "Did you see? A sprout. Right in the middle.", "There's a beetle living in the woodpile now. I've called him Gerald.", "Kettle's on.", "Tomorrow we dig the bed properly.", "I remember when all this was ferns.",
          "Our own front door. Well, our own front hole.", "She said yes. I still can't quite believe it.", "I've measured twice and I'm still wrong. Don't tell her.", "Did you know worms are basically farmers?",
          "Every stump was once a tree that had a view.", "I'm going to build her a garden bench. I haven't told her.", "One acorn, one oak. That's the maths.", "Look at that moss. Doing it all without being asked.",
          "Marriage tip: never say 'just a quick job'.", "The soil's coming back. Smell that? That's life.", "We're not saving the world. We're saving this corner of it.", "I think the fence is leaning on me.",
          "That robin is judging my digging.", "Let's leave the long grass long. Somebody lives in it.", "Tea first. Heroics after."],
    her: ["I left a crumb on the step for the luck. Don't laugh.", "The sapling wants water, not wishes.", "Isn't it quiet without the trees?", "I've put the moss aside for the roof.", "A little each day, that's the trick.", "Listen… was that a robin?",
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
  // ---------- the animals' side stories (docs/ANIMALS.md; game.js animalTick) ----------
  // Each animal's story goes on over real days: at most one beat a day, each waiting for its moment (when). A beat opens as a small
  // card (kind 'card', with the animal's portrait) or a storybook page (kind 'page', painting slot page-a-<id>), and sets
  // flags.<id> so the picture and the jobs can follow. Closing beats leave a doorstep gift the next morning (gifts).
  // when: after (another beat, done) · days (since that beat, or since moved/done/met) · done (a job) · moved (a creature moved in)
  //       · flag · met (a creature in the journal) · nest (it lives nearby) · rabbitFed (days the rabbit ate at the dish after the fence)
  //       · season (southern hemisphere, by the phone's date) · hours [from, to) (may wrap past midnight)
  animals: {
    chapter: `The animals' stories`,
    rabbitName: 'Clover',   // Hazel names the rabbit on the babies page (Bryce to confirm)
    doorstep: [0.27, 0.28],   // where gifts are left (home tile, just in front of the door)
    gifts: {
      rabbit:     { name:'A dandelion clock', line:'Left very carefully, so as not to blow it.', give:{ seed:3 } },
      mouse:      { name:'A tiny shiny button', line:'Hazel has decided it is a plate.', give:{ light:1 } },
      owl:        { name:'A single feather', line:'Not a word. Just the feather.', give:{ feather:1 } },
      hedgehog:   { name:'An acorn cap of dried berries', line:'Saved for winter, then shared anyway.', give:{ berry:2 } },
      robin:      { name:'A red thread end', line:`Hazel's own colour, frayed from the nest.`, give:{ moss:1 } },
      wren:       { name:'A blue tail-feather', line:'One. He has plenty.', give:{ feather:1 } },
      frog:       { name:'A pebble worn smooth', line:'From the bottom of the pond. It sang while it brought it.', give:{ stone:1 } },
      bluetongue: { name:'A shed, perfect leaf skin', line:'Do not ask.', give:{ moss:1 } },
      lyrebird:   { name:'One long tail feather', line:'Shaped like a little harp. Wendel hums at it.', give:{ feather:1 } },
    },
    beats: [
      // the rabbit: "that rabbit"
      { id:'rabbitTruce', who:'rabbit', kind:'card', when:{ done:'fence', rabbitFed:3 }, title:'The truce', button:'Good rabbit', text:[
        `The rabbit sat by the gate for a whole hour, as good as gold, nose twitching, not so much as glancing at the carrots.`,
        `Wendel is very proud of it. He has started saving it the outside leaves of the lettuces, and telling it about his day.` ] },
      { id:'rabbitHome', who:'rabbit', kind:'card', when:{ moved:'burrow' }, title:'A hole of its own', button:'Welcome home', text:[
        `Hazel patted the earth bank flat for the third time. Wendel said a rabbit ought to have the very best home, and patted it a fourth time, just to be sure, and Hazel laughed and let him.`,
        `In the morning there was a round door in the side of it, and from somewhere inside came the thump, thump of somebody very pleased with themselves.` ] },
      { id:'rabbitBabies', who:'rabbit', kind:'page', gift:'rabbit', when:{ after:'rabbitHome', days:21, season:'spring', hours:[5, 11] }, title:'Four small noses', button:'Not the lettuce', text:[
        `Dawn, and four tiny rabbits sat in a row along the garden fence, noses poking through the gaps, gazing at the vegetables. Their mother sat behind them, looking proud and a little embarrassed.`,
        `Wendel counted them twice. Hazel counted them once and put the kettle on. "They'll be wanting something," she said. "Then we'll plant extra," said Wendel, beaming.`,
        `"She ought to have a name," said Hazel over her tea, "now that she's a mother." She thought about it for a while. "{rabbit}."`,
        `"{rabbit}," said Wendel at once, as if it had always been her name. He has never called her anything else since.`,
        `The smallest of the four had a dandelion seed stuck to one ear and did not know. It was the best morning of the whole spring.` ] },

      // the field mouse family: "tenants"
      { id:'mouseGap', who:'mouse', kind:'card', when:{ moved:'mice', days:3, done:'fence' }, title:'A gap in the fence', button:'Oh, mice', text:[
        `The mouse children have found a gap in the seed bed fence. Wendel mended it with a stick, saying sorry to the gap as he did.`,
        `In the morning there was a brand new gap, with three small mice sitting in it, looking hopeful.` ] },
      { id:'mouseDoor', who:'mouse', kind:'card', when:{ done:'mousedoor' }, title:'Rent', button:'Mind the step', text:[
        `Wendel mended the fence three times, saying sorry to the gap each time. On the fourth morning Hazel cut a small door in it herself, and Wendel held the little bark flap while she tied on the hinge.`,
        `"There," said Hazel. "Now they can knock."` ] },
      { id:'mouseSock', who:'mouse', kind:'card', when:{ moved:'mice', days:7 }, title:'One sock', button:'Leave it', text:[
        `"Have you seen my other sock?" said Wendel, scratching his head by the washing line.`,
        `Hazel did not look up. "Leave it, love," she said. Beside the toadstool house, strung between two grass stalks, a small grey sock is swinging gently in the breeze. The littlest of the mouse babies is curled up inside it, snug as anything, with just its ears poking out of the top.` ] },
      { id:'mouseWinter', who:'mouse', kind:'page', gift:'mouse', when:{ after:'mouseSock', moved:'mice', days:14, season:'winter', hours:[16, 23] }, title:'The window with the sock in it', button:'Goodnight, tenants', text:[
        `It was the first really cold night, and there was a light in the toadstool. The sock hammock had gone from the grass. Through the tiny window they could see the littlest mouse, tucked into one grey sock like a sleeping bag, with the rest of the family curled up round it.`,
        `Wendel stood with his hands in his pockets for a long time. "It's a good sock," he said at last. "It's doing very well."`,
        `In the morning, someone had left a single button on the doorstep.` ] },

      // the tawny owl: "says nothing"
      { id:'owlSapling', who:'owl', kind:'card', when:{ done:'sapling', met:'owl', hours:[19, 5] }, title:'The inspector', button:'Carry on', text:[
        `The owl has taken to sitting on the little oak's stake at night, looking down at it very seriously.`,
        `It has not yet said whether it approves.` ] },
      { id:'owlHome', who:'owl', kind:'card', when:{ moved:'owlbox' }, title:'An owl box', button:'Sleep well', text:[
        `Wendel put the box up just so. The owl looked at it for three nights. On the fourth night it was inside, fast asleep and as round as a cushion.`,
        `"Now that," said Hazel, "is a tenant who knows what they want."` ] },
      { id:'owlHoo', who:'owl', kind:'page', gift:'owl', when:{ after:'owlHome', season:'winter', hours:[23, 5] }, title:'Hoo', button:'Goodnight, owl', text:[
        `Wendel had stayed out to look at the stars, and had meant to come in an hour ago. Hazel came out with a blanket instead, and sat beside him on the bench, and for a long time neither of them said anything at all.`,
        `Above them, the owl opened one eye. "Hoo," it said, very softly, and closed it again.`,
        `It was the only thing it ever said, and it said it just right.` ] },

      // the hedgehog: "the leaf coat"
      { id:'hogShopping', who:'hedgehog', kind:'page', when:{ moved:'leafpile', season:'autumn', hours:[16, 23] }, title:'It was shopping', button:'Of course', text:[
        `At dusk the hedgehog came trundling up the path wearing a thick coat of dry leaves on its spines. It went straight into the leaf pile and shook them all off into a neat little heap.`,
        `"It wasn't stuck at all," said Hazel. "It was shopping."`,
        `Wendel remembered picking those leaves off, ever so carefully, one evening not long ago. "Oh dear," he said. "I took its groceries." And he put an extra berry in the dish to say sorry.` ] },
      { id:'hogAsleep', who:'hedgehog', kind:'card', when:{ after:'hogShopping', season:'winter' }, title:'Do not disturb', button:'Shh', text:[
        `The hedgehog has stopped coming out. Wendel made a sign in his best handwriting and propped it by the leaf pile. It said ASLEEP.`,
        `Hazel said it was the best sign she had ever seen, and helped him paint a little leaf on it.` ] },
      { id:'hogSpring', who:'hedgehog', kind:'page', gift:'hedgehog', when:{ after:'hogAsleep', season:'spring', hours:[5, 11] }, title:'Thin and cross', button:'Eat up', text:[
        `It came out at six one morning, as thin as a stick with prickles on, and went straight to the dish without so much as a good morning.`,
        `Hazel filled the dish twice. Wendel took down the sign, dusted it off and put it away carefully. "For next year," he said.` ] },

      // the lyrebird: a rare winter visitor
      { id:'lyreHum', who:'lyrebird', kind:'card', gift:'lyrebird', when:{ met:'lyrebird', season:'winter', hours:[7, 17] }, title:'The dance', button:'Bravo', text:[
        `The lyrebird scratched itself a little round stage in the earth, threw its tail up over its head like a silver harp, and danced.`,
        `Wendel and Hazel watched from behind the woodpile, hardly breathing. When it finished, Hazel clapped before she could stop herself. The lyrebird looked straight at her and bowed (they both swear it bowed). Then it strolled back into the ferns.` ] },

      // short arcs: one small closing moment each
      { id:'robinChicks', who:'robin', kind:'card', gift:'robin', when:{ nest:'robin', met:'robin', days:14, season:'spring', hours:[6, 18] }, title:'A red thread', button:'Lovely', text:[
        `Hazel's red thread has turned up in the robins' nest, woven in very neatly. She says that is a compliment.`,
        `Two chicks peep out of it now, beaks wide open, all day long.` ] },
      { id:'wrenPair', who:'wren', kind:'card', gift:'wren', when:{ nest:'wren', season:'spring', hours:[6, 17] }, title:'Practising', button:'Sing on', text:[
        `The little wren bathed for ten minutes, then sang, then bathed again. Wendel says he is practising for someone.`,
        `This morning there were two of them hopping across the yard together: him bright blue, her soft brown.` ] },
      { id:'frogSong', who:'frog', kind:'card', gift:'frog', when:{ moved:'pond', days:14, hours:[19, 5] }, title:'Off-key', button:'Hum along', text:[
        `The frog sings off-key, and with total confidence. Wendel has started humming along. Hazel hums too, when she thinks he isn't listening.`,
        `Tonight, a second small voice answered from the reeds.` ] },
      { id:'lizardSkin', who:'bluetongue', kind:'card', gift:'bluetongue', when:{ nest:'bluetongue', hours:[9, 17] }, title:'Stepped over', button:'Do not ask', text:[
        `The blue-tongue lizard sunbathed on the doorstep for so long that Hazel simply stepped over it. Then Wendel did too, saying "excuse me".`,
        `This morning there was a shed skin on the doorstep, perfect and papery, like a little leaf.` ] },
    ],
    // little moments that come round more than once (no card; a line at the bottom of the screen)
    owlCompany: [ `Wendel gave the owl a nod. The owl gave him nothing.`, `"He's looking at me again," said Wendel. "He's looking at the fire," said Hazel.`, `Hazel says the owl is good company if you do not ask it for conversation.` ],
    lyreMimic: [ `The lyrebird is scratching the ground into a little stage. Something is about to happen.`, `The lyrebird has thrown its tail up over its head like a silver harp. Wendel has stopped work to watch.` ],
    rabbitGate: 'The rabbit is sitting by the gate, perfectly good.',
    rabbitSeed: 'The rabbit had the seed from the dish, very neatly, and washed its face after.',
    babyTap: 'Still wearing it.',
    knock: 'A tiny sign on the toadstool door: "Please do not knock."',
  },

  // little finds: tiny painted secrets tucked into the healed land now and then (sprites/kit/secrets-*). Tap one to press it into the journal.
  // size = how wide it is drawn on the land (a gnome is about 120). Nothing here is part of the story.
  secretEvery: [180, 360],   // minutes between new ones (random in this range); at most two are out at once
  secrets: [
    { id:'clover',   pic:'nature-01',    size:20, name:'a four-leaf clover', note:'Hazel says it\'s luck. Wendel says it\'s just a clover that tried harder. They pressed it anyway.' },
    { id:'cicada',   pic:'nature-02',    size:16, name:'an empty cicada shell', note:'Still hanging on to its grass stem. The cicada climbed out and flew off singing. Summer\'s coming.' },
    { id:'ring',     pic:'nature-03',    size:34, name:'a fairy ring', note:'A circle of tiny white mushrooms, overnight. Wendel walked all the way round it, just in case.' },
    { id:'heart',    pic:'nature-05',    size:18, name:'a heart-shaped pebble', note:'Grey and smooth and very nearly a heart. It went straight into Hazel\'s apron pocket.' },
    { id:'holed',    pic:'nature-06',    size:20, name:'a stone with a hole', note:'Look through the hole with one eye closed and the valley looks a little more magic. It works.' },
    { id:'egg',      pic:'nature-07',    size:16, name:'a speckled eggshell', note:'Half a pale blue shell. Somebody small hatched nearby and is already peeping for breakfast.' },
    { id:'snail',    pic:'nature-08',    size:15, name:'an empty snail shell', note:'The snail moved out. Wendel thinks it would make a fine ear trumpet. Hazel thinks not.' },
    { id:'cockatoo', pic:'nature-09',    size:34, name:'a black cockatoo feather', note:'Long and black with a band of yellow. The cockatoos flew over yesterday, wailing like old gates.' },
    { id:'chrysalis',pic:'nature-10',    size:28, name:'a green chrysalis', note:'Hanging very still from a twig, flecked with gold. Hazel has been checking on it every morning.' },
    { id:'bluefeather', pic:'nature-11', size:14, name:'a little blue feather', note:'Blue as the sky after rain. A fairy-wren must have dropped it showing off.' },
    { id:'bower',    pic:'nature-12',    size:16, name:'a bowerbird\'s treasures', note:'Blue feather, blue berry, blue shard, laid out just so. Best not to tell the bowerbird.' },
    { id:'thimble',  pic:'treasures-01', size:13, name:'a brass thimble', note:'Far too big for a gnome finger. Hazel uses it as a cup for the sugar.' },
    { id:'mitten',   pic:'treasures-02', size:18, name:'a red mitten', note:'A big folk\'s mitten, lost in some long-ago winter. It makes a very warm sleeping bag.' },
    { id:'carved',   pic:'treasures-03', size:20, name:'a carved wooden heart', note:'Somebody carved this a long time ago and gave it to somebody. Wendel hung it over the door.' },
    { id:'pipe',     pic:'treasures-04', size:24, name:'Wendel\'s pipe', note:'There it is! He\'s been looking for it for days. He swears he left it on the table.' },
    { id:'grassring',pic:'treasures-05', size:16, name:'a ring of plaited grass', note:'Plaited by hand, just the size of Hazel\'s finger. Wendel went very pink and said nothing.' },
    { id:'letter',   pic:'treasures-06', size:18, name:'a note sealed with red wax', note:'Hazel\'s name on the front, in Wendel\'s loopy writing. Best tuck it on her pillow and say nothing.' },
    { id:'top',      pic:'treasures-07', size:13, name:'a wooden spinning top', note:'It still spins. Wendel timed it: forty-one heartbeats. He wants a rematch.' },
    { id:'teacup',   pic:'treasures-08', size:18, name:'an acorn-cup teacup', note:'A teacup made from an acorn cup, saucer and all. Exactly the right size for one sip of tea.' },
    { id:'yarn',     pic:'treasures-09', size:24, name:'a hank of green yarn', note:'Enough for a scarf, or two hats, or one very long sock. Hazel has plans.' },
    { id:'flowerstone', pic:'treasures-10', size:15, name:'a painted pebble', note:'Someone painted a yellow flower on it. It sits on the windowsill now, where the real ones can see it.' },
    { id:'bell',     pic:'treasures-11', size:12, name:'a tiny brass bell', note:'Ting! Wendel tied it to the gate so you can hear who\'s coming.' },
    { id:'button',   pic:'treasures-12', size:14, name:'a wooden button', note:'A big round button with four holes. Hazel says a table. Wendel says a wheel. It\'s still being argued about.' },
  ],
};
