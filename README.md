# shoplock

A fan-made browser for [Deadlock](https://www.playdeadlock.com/)'s in-game item shop, styled to match the game's own look and feel. Built with some AI assistance from Claude Code.

Item data (stats, costs, tooltips, upgrade paths, icons) is fetched live from the community [deadlock-api.com](https://deadlock-api.com) — there's no backend or bundled dataset, so the shop always reflects the current game data.

[Currently live on Cloudflare.](https://shoplock.sean-outhwaite.workers.dev/)

## Features

- **Browse by category and tier** — Weapon, Vitality, and Spirit items laid out in their tier boxes (1-4), each with a distinct background pattern (pinstripe, bullseye rings, polka dots) tinted to that category's color.
- **Search all items** — an "All" tab with a flat, filterable grid across every category.
- **Item tooltips** — hovering an item shows a popover with its cost, innate stats, and passive/active effects, including:
  - Highlighted stat boxes for an ability's key numbers (damage, duration, proc chance, etc.), matching the in-game tooltip layout
  - A cooldown badge inline with the "Passive"/"Active" header, where applicable
  - Status effect callouts (e.g. Stun) with their own icon
  - The items an item upgrades from
  - The popover repositions itself to avoid covering the hovered icon or overflowing the window edge
- **Upgrade path highlighting** — hovering an item dims everything except it and the items it upgrades from.
- **Build planner** — a bottom drawer for assembling a build:
  - Create named sections (e.g. "Laning", "Late game")
  - Click a section to make it active, then click items in the shop to add them to it
  - Drag items to reorder within a section or move them between sections
  - The build persists to `localStorage`, so it survives a page reload

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and bundling
- Plain CSS (no framework, no CSS-in-JS) — styling lives in `src/App.css` and `src/index.css`

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Other scripts

```bash
npm run build    # type-check and build for production
npm run lint     # run ESLint
npm run preview  # preview a production build locally
```

## Project structure

```
src/
  App.tsx                     # fetches item data, top-level layout and state
  App.css / index.css         # all styling
  types.ts                    # shared types, including the shop item + tooltip data model
  utils.tsx                   # small formatting/color helpers
  hooks/
    useBuild.ts                # build state (sections, active section, drawer open) + localStorage sync
  components/
    ItemCard.tsx                # a single item tile in the shop grid or a build slot
    ItemPreviewPopover.tsx      # the hover tooltip
    SearchTab.tsx                # the "All items" search grid
    BuildDrawer.tsx              # the bottom build-planner drawer
    BuildSection.tsx             # one section within the build drawer
``
```
