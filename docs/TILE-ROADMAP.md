# Tile roadmap (developer coach, 2026-11-17)

Thread "Plan how every tile will look". Bryce felt overwhelmed: his playtests stall when they reach unfinished bits. This page is the map of every patch and the order to finish them, so a playtest never hits a raw bit. Picture page: https://claude.ai/artifact/Ckkh4tNL48zArLxFHppES7 (pictures also in `/mnt/project-files/tile-roadmap/`).

## The valley (game.js `tileKind`)

```
            x=-2            x=-1            x=0             x=1             x=2
y=-2   cracked earth   rubbish heap    cracked earth   old track       bare plain      (across the stream: waits for the bridge)
y=-1   dry creek       dry creek       dry creek       dry creek       dry creek       (the stream row)
y= 0   bare plain      rubbish heap    HOME YARD       OLD CAMP        bare plain
y= 1   rubbish heap    cracked earth   GARDEN          old track       cracked earth
y= 2   bare plain      cracked earth   cracked earth   old track       rubbish heap
```
Code names: cracked earth = `creature`, rubbish heap = `meadow`, bare plain = `nursery`, dry creek = `creek`, old track = `verge`, old camp = `camp`, garden = `garden`.
Counts: cracked earth 6, dry creek 5, bare plain 4, rubbish heap 4, old track 3. Five kinds cover all 22 wild tiles.

## What a player meets, and when (pretend player, 3 visits a day; measurements, never targets)

- Day 1: home yard, garden. Day 5: the old camp. All three FINISHED (designed with Bryce, painted, own story).
- Day 10, page 3.5 "Over the threshold": 1,1 old track, 0,2 cracked earth, 2,0 bare plain, 1,-1 dry creek wake together; Mabel arrives. THIS IS THE WALL: these patches still have the pre-rules design. Bare, they all look like the same dusty ground with rubbish; finished, they all look like the same meadow; the things the gnomes build are small and lost.
- Days 11 to 24: more of the same five kinds; Mabel (lot 2,0 in a typical game), Tobias (2,1), the Fernsbys (0,2). Bridge about day 30.
- Later / month two: the far side of the stream, Pebbleworths, Clem, Barnaby, festival green.

## Code-drawn pieces on the wild patches (not on the stand-in check, because they are not art slots)

`HEAL_DRAW` in index.html, with no painting behind them: old track `step` (stepping stones), `dots` (seed balls, also camp and meadow); cracked earth `cracks`, `clods`, `sprout`; bare plain `peg`, `hole`; dry creek `flatstones`, `pond` (frog pond, drawPond), `lily`, `slump` (kit picture); meadow `wet`, `balls`, `sprout`. (`grass`, `flowersv`, `wildpatch`, `campsprout`, `campbush`, bees, butterflies, dragonflies draw painted stickers; `tree` and the HEAL_PAINT list have paintings.)

## The roadmap (in order)

1. **A finish line inside the game** (small build, needs Bryce's OK as it is visible). The real garden only wakes finished patches. The story still reaches page 3.5 (moving in); then a gentle note says the rest of the valley is still dreaming and Mabel waits. Makes, wishes, crops and chores carry on, so nobody is idle. The sandbox keeps the whole valley for testing. Each finished patch moves the line out; it is removed before release.
2. **The drag-and-drop layout tool** (one build, Opus). A hidden layout mode in the sandbox (e.g. `?sandbox#layout`), used on the MacBook in Safari or Chrome. Pick a patch (or the home yard) and a stage (bare, first green, young meadow, young woodland); drag to move, bigger, smaller, flip, hide, drag in any painting from a tray. Gnomes stay in view for scale. Save keeps the layout in the Mac sandbox at once and downloads a small layout file; a chat then reads it from `~/Downloads` (already an approved folder) and writes it into the game (overrides for `HEAL_LOOK` pieces and yard `PROPS`). Not in v1: new paintings, words, jobs, walking paths (walk.js still finds its own way; check after). Reason: about a third of Bryce's notes are about where something sits or how big it is.
3. **Design the patches one at a time, in the order he meets them:** old track (with his path decision, see `old-track-rethink` memory), cracked earth, bare plain, dry creek, then Mabel's patch. Each goes round one loop: a one-page patch sheet with pictures (why it looks like this in the loggers' story; one signature thing you'd know it by from across the valley; bare, first green, young meadow, young woodland; a visible reason for every job) -> Bryce picks on cards -> he places things in the tool -> art day -> build -> the finish line moves out -> he plays to it. First thoughts on the picture page are only examples.
4. **The rest of month one:** rubbish-heap meadow, Tobias's and the Fernsbys' patches, the bridge. Then the finish line comes out and someone plays 30 days at real pace ("Month one, fully finished").

Round-fourteen notes carry on as normal alongside this. New ideas still go to the maybe pile.

## Models

Finish line: a normal thread (Opus medium) is plenty. Layout tool: Opus, high. Patch sheets: Opus high (design). Art days: as usual on the Mac.
