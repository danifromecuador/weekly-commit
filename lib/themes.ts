/**
 * Theme ids match `data-theme` on `<html>` and a `[data-theme="…"]` block in
 * `app/globals.css`.
 */
export const THEME_IDS = ["paper-planner", "graphite"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME_ID: ThemeId = "paper-planner";

export const THEME_STORAGE_KEY = "weekly-commit-theme";

export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "paper-planner", label: "Paper planner" },
  { id: "graphite", label: "Graphite" },
];

function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

export function parseStoredTheme(raw: string | null): ThemeId {
  if (raw && isThemeId(raw)) return raw;
  return DEFAULT_THEME_ID;
}

export const THEME_CHANGE_EVENT = "weekly-commit-theme";

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return parseStoredTheme(localStorage.getItem(THEME_STORAGE_KEY));
}

/** Updates <html data-theme>, localStorage, and notifies subscribers (same tab). */
export function applyTheme(id: ThemeId): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = id;
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }
}

export function subscribeTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

/** Inline, blocking script: apply saved theme before paint (reduces flash). */
export function getThemeBootstrapScript(): string {
  const allowed = JSON.stringify([...THEME_IDS]);
  return `!function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var a=${allowed};if(t&&a.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}}();`;
}
