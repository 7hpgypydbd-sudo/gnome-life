# The layout tool (v112, 2026-11-17)

Step 2 of the tile roadmap (`docs/TILE-ROADMAP.md`). A hidden drag-and-drop mode in the sandbox, so Bryce can place and size things himself on the MacBook instead of describing positions in notes.

## For Bryce

1. On the MacBook, open the sandbox address with `#layout` on the end: https://7hpgypydbd-sudo.github.io/gnome-life/?sandbox#layout
2. Pick a patch at the top of the panel (or the home yard). The `<` and `>` arrows step through the patch's stages, from bare to all jobs done.
3. Every thing you can move has a small dot. Drag a dot to move it. Tap one to pick it, then use Bigger, Smaller, Flip, Hide (or Remove, for something you added) and Put back.
4. "Add a painting": type a word (fern, flower, rock, log, rubbish...) and tap a painting. It drops in the middle of the view; drag it into place. On a patch it appears at the stage you are looking at.
5. Your changes show in the sandbox garden straight away and are kept on that computer.
6. "Save to a file" puts `gnome-layout.json` in Downloads. Then tell the project chat "I made a layout" and it gets put into the real game.

Nothing in the tool changes the sandbox garden's progress: the patches and wish-list makes are only shown done while you lay things out.

## For a chat putting a layout into the game

- Bryce's file is `~/Downloads/gnome-layout.json` on the Mac (a Mac chat reads it; Downloads is an approved folder). Copy its contents into `layout.js` as `window.LAYOUT = { ... };` (keep `v`, `heal`, `extra`, `makes`, `props`; drop `saved`). Merge with what is already in `layout.js` if Bryce did patches in separate sessions (his file holds everything he has done on that computer, so usually it simply replaces it).
- Bump the version as usual. Show Bryce a preview (it is a visible change), then merge.
- Check walking after a big move: walk.js still finds its own way and may route gnomes through a moved thing.
- Once a layout is in `layout.js`, Bryce's Mac sandbox keeps showing its own saved copy until he presses "Start again" in the tool (which then loads `layout.js`).

### What the file means

- `heal[kind][n]`: piece number `n` of `HEAL_LOOK[kind]` in index.html. `w` = which piece (pic or draw name; ignored if the list changed underneath it), `d` = move in tile units `[dx, dy]`, `s` = size, `flip`, `hide`. If someone reorders a `HEAL_LOOK` list, the `w` check stops a move landing on the wrong piece, but the move is lost: re-place it.
- `extra[kind]`: paintings Bryce added to a patch: `pic`, `h` (height), `at` (spot on the tile, 0 to 1), `from` (the job step it comes with; absent = always there), `flip`, `flat`. `extra.yard` uses home-grid `at`.
- `makes[id]`: a wish-list make: `at` (home grid), `s`, `flip`, `hide`.
- `props[name]`: a yard prop: `d`, `s`, `flip`, `hide`.

### Where it lives in the code

- `layout.js`: the data. `index.html`: `layoutData()` / `applyLayout()` (just above `HEAL_IDX`), `healLocal` adds `q.d`, `healItems` scales and flips, `propAlpha` and `layWrapItems` hide, `layExtraItems` draws yard additions. The sandbox reads `localStorage['gnomelife.sandbox.layout']` first; the real garden only reads `layout.js`.
- `layout-tool.js`: the tool. Loaded only on `?sandbox#layout` and run inside the main script (so it can reach the game's own functions). It turns off saving (`G.save`) and all windows (`window.LAYOUT_ON`), wakes every patch in memory and marks every make done.
- Not in v1: new paintings, words, jobs, walking paths.
