# Art day 17: finish art day 16, round-six pictures (painted 2026-10-29)

Painted by Claude with Nano Banana (Gemini 3.6 Flash) in Bryce's Chrome on his Mac, straight through. Gallery: https://claude.ai/artifact/24hS5pwiP18Ftnh5QaV1uk (art day 16's first five are on https://claude.ai/artifact/5t8NsuwSeC59hsQFEk9rjq).

All pictures are on flat magenta (some sheets come out a slightly darker magenta, about 236,40,225; the usual key mag=(min(R,B)-G)/255 handles it). None are cut yet: a cloud chat cuts them and wires them in.

## Part 1: the 11 art day 16 pictures still to paint

Saved in `art-day-16/painted/` (prompts in `art-day-16/prompts/`, listed in docs/ART-DAY-16.md). Art day 16 had already painted m01, r01, r02 (the thin pebble line, `make-pebbleline`), r03 and r04.

| id | slots | notes |
|---|---|---|
| r05-wisp | vis-wisp | used the retry prompt; inked, unlit, one piece |
| r06-juniper-home | home-juniper | window dark with a curtain; tall portrait 1504x2758 |
| r07-mabel-bakehouse | bld-mabel | cold sooty oven, door half open |
| r08-festival | fest-lantern, pumpkin-3 | lantern hangs from a stick post (the post is part of the piece) |
| r09-lavender | farm-lavender-1..4 | violet, four steps left to right |
| d01-wishes-mabel-tobias | wish-* (6) | 2 rows of 3; bunting has faint flour-sack lettering |
| d02-wishes-fernsby-pebbleworth | wish-* (6) | 2 rows of 3 |
| d03-wishes-clem-barnaby | wish-* (6) | 2 rows of 3; the bee bath is a clay saucer |
| d04-wishes-nettle-juniper | wish-* (6) | 2 rows of 3 |
| d05-track-makes | make-* (6 track makes) | 2 rows of 3 |
| d06-garlands | make-dress_spring/summer/autumn/winter | 4 rows; the summer bunting's twine runs close to the autumn garland at the far left and right, cut by flood fill, not straight bands |

Order inside each wishes sheet follows the numbered list in that sheet's prompt (row 1 left to right, then row 2).

## Part 2: round six (`art-day-17/painted/`, prompts in `art-day-17/prompts/`, refs in `art-day-17/refs/`)

| id | slot(s) | what |
|---|---|---|
| n01-mouse-bottle | vis-mouse-stuck (left piece); right piece = the bottle neck alone, for when Hazel tips it off | second try kept (`n01-mouse-bottle-try1.jpg` had a cup-like glass) |
| n02-bug-bath | make-yardbath | one piece, stone dish on a short stone, pebbles, ladybird, bee |
| n03-stump-stages | stump stages for `drawStump` (dug round / rocked loose by its hole / chopped firewood / hole filled) | 4 pieces in a row, same scale |
| n04-campfire | campfire-bare (left) and a matching stone ring (right) | |
| n05-page-1-1 | page-1-1 (1200x670) | wagon taken apart: wheel door, plank walls, canvas roof, pots |
| n06-page-1-2 | page-1-2 (1200x670) | Wendel dowsing, Hazel at the spring between the stump's roots; the wagon-wheel home under its stump in the background, no fire ring (second try kept, `-try1` had the old fire ring and tent) |
| n07-stump-chopping | stump chopping stages (after "rocked loose") | 4 pieces: root end off / a third chopped, small heap / short stub, bigger heap / stump gone, hole + heap of rough rounds. Replaces n03's neat firewood stack (piece 3); n03 pieces 1, 2 and 4 still apply. Pieces 1 and 2 sit close: flood-fill cut |
| n07-him-chop | him-chop (act `chop`) | 4 frames, hatchet up / swing / strike with chips / lowered; frames include the chopping block. Frames 2 and 3 touch (about 100 px at x~1366): cut at x 705, 1366, 2096 or by flood fill |
| n08-him-carrylogs | him-carrylogs (act `carrylogs`) | 4-frame walk, chunky split logs |
| n09-her-chop | her-chop | as n07-him-chop, same tight spacing |
| n10-her-carrylogs | her-carrylogs | 4-frame walk; cap tips touch the top edge |

Every picture has a hidden snail except the wisp and the four animation strips.

Gemini used: 16 pictures, then the limit (reset 7:49 pm), then 11 more (27 in all including 3 retries); weekly allowance was at 6% before the second window.

## Test cut (2026-10-29, `tools/cut_blobs.py <sheet> <out> <id> --gap 20`)

Contact sheet of the trial cut on a dark ground: `art-day-17/contact-trial-cuts.jpg`. Everything keys cleanly. Two sheets need care:
- d04: the yarn posts split into 3 blobs (posts 1-2 touch, 3 and 4 alone); join blobs 0-2 back into one piece for the yarn-posts wish.
- d06 garlands: all four come out as one blob (bunting twine touches the others); split by row bands or flood fill.
Everything else is one blob per item, in the order of the prompt.
