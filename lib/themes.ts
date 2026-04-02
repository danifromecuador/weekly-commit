/**
 * Theme ids match `data-theme` on `<html>` and a `[data-theme="…"]` block in
 * `app/globals.css`.
 */
export const THEME_IDS = [
  "paper-planner",
  "graphite",
  "botanical-flow",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME_ID: ThemeId = "paper-planner";

/** Legacy key; still read for migration into the Zustand persist blob. */
export const THEME_STORAGE_KEY = "weekly-commit-theme";

/** Zustand `persist({ name })` — keep in sync with `lib/weekly-grid/store.ts`. */
export const WEEKLY_COMMIT_PERSIST_KEY = "weekly-commit";

export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "paper-planner", label: "Paper planner" },
  { id: "graphite", label: "Graphite" },
  { id: "botanical-flow", label: "Botanical flow" },
];

export const THEME_CHANGE_EVENT = "weekly-commit-theme";

function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

export function parseStoredTheme(raw: string | null): ThemeId {
  if (raw && isThemeId(raw)) return raw;
  return DEFAULT_THEME_ID;
}

/** Inline, blocking script: apply saved theme before paint (reduces flash). */
export function getThemeBootstrapScript(): string {
  const allowed = JSON.stringify([...THEME_IDS]);
  const persistKey = JSON.stringify(WEEKLY_COMMIT_PERSIST_KEY);
  const legacyKey = JSON.stringify(THEME_STORAGE_KEY);
  return `!function(){try{var a=${allowed};var pk=${persistKey};var lk=${legacyKey};var theme=null;var merged=localStorage.getItem(pk);if(merged){var o=JSON.parse(merged);if(o&&o.state&&o.state.themeId&&a.indexOf(o.state.themeId)!==-1)theme=o.state.themeId;}if(theme==null){var t=localStorage.getItem(lk);if(t&&a.indexOf(t)!==-1)theme=t;}if(theme)document.documentElement.setAttribute("data-theme",theme);}catch(e){}}();`;
}
