# Weekly Commit

App to plan weekly goals with a Monday-to-Saturday grid, activity duration control, and visual progress tracking.

## Features

- Weekly per-activity grid with completed-day checkboxes.
- Preset durations and totals per row, per day, and per week.
- Themes (`paper-planner`, `graphite`, `botanical-flow`) and light/dark mode.
- Persistence in `localStorage` (theme, appearance, and valid activities).
- Test suite with **Vitest + Testing Library**:
  - 11 test files
  - 57 passing tests
  - coverage for nominal and edge cases (invalid parsing, SSR/no `window`, persisted-state merge, non-persistable drafts, etc.)

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
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
