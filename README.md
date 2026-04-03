# Weekly Commit

App to plan weekly goals with a Monday-to-Saturday grid, activity duration control, and visual progress tracking.

## Features

- Weekly per-activity grid with completed-day checkboxes.
- Preset durations and totals per row, per day, and per week.
- Reorder goals by dragging from the **Goal** column handle (order is persisted with activities in `localStorage`; handle is hidden until hover on fine pointers).
- Empty grid: one row with a short message and an **Add** button; the icon-only add row appears once there is at least one activity.
- Themes (`paper-planner`, `graphite`, `botanical-flow`) and light/dark mode, with **distinct dark palettes** per theme (warm / cool slate / green earth).
- Persistence in `localStorage` (theme, appearance, locale, and valid activities—including row order).
- Test suite with **Vitest + Testing Library**:
  - 18 test files
  - 77 passing tests
  - coverage for nominal and edge cases (invalid parsing, SSR/no `window`, persisted-state merge, non-persistable drafts, empty grid UI, `reorderActivities`, etc.)

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- @dnd-kit (sortable drag-and-drop)
- Vitest + Testing Library

## Quickstart

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - development
- `npm run build` - production build
- `npm run start` - run the build
- `npm run lint` - eslint
- `npm run test` - vitest in watch mode
- `npm run test:run` - single vitest run

## Notes

- Private project (`package.json`).
- Main test config in `vitest.config.mts` and setup in `vitest.setup.ts`.
