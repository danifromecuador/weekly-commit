import { THEME_GOOGLE_FONTS_CSS_URL } from "./theme-fonts";

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

export type AppearanceMode = "light" | "dark";

export const DEFAULT_APPEARANCE: AppearanceMode = "light";

/** Legacy key; still read for migration into the Zustand persist blob. */
export const THEME_STORAGE_KEY = "weekly-commit-theme";

/** Zustand `persist({ name })` — keep in sync with `store/index.ts`. */
export const WEEKLY_COMMIT_PERSIST_KEY = "weekly-commit";

export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "paper-planner", label: "Paper planner" },
  { id: "graphite", label: "Graphite" },
  { id: "botanical-flow", label: "Botanical flow" },
];

export const THEME_CHANGE_EVENT = "weekly-commit-theme";

export const APPEARANCE_CHANGE_EVENT = "weekly-commit-appearance";

function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

export function parseStoredTheme(raw: string | null): ThemeId {
  if (raw && isThemeId(raw)) return raw;
  return DEFAULT_THEME_ID;
}

export function parseAppearance(value: unknown): AppearanceMode {
  if (value === "dark") return "dark";
  return DEFAULT_APPEARANCE;
}

/** Apply light/dark on <html> (dark uses data-appearance; light clears it). */
export function applyAppearanceToDocument(appearance: AppearanceMode): void {
  if (typeof document === "undefined") return;
  if (appearance === "dark") {
    document.documentElement.dataset.appearance = "dark";
  } else {
    delete document.documentElement.dataset.appearance;
  }
}

/** Set `data-theme` and light/dark attributes on `<html>`. */
export function applyThemeAndAppearanceToDocument(
  themeId: ThemeId,
  appearance: AppearanceMode,
): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = themeId;
  applyAppearanceToDocument(appearance);
}

/**
 * Read theme + appearance from localStorage (same rules as the inline bootstrap
 * script). For use on the client after hydration so DOM stays in sync if React
 * strips unknown `data-*` on `<html>`.
 */
export function readPersistedThemeAppearanceFromLocalStorage(): {
  themeId: ThemeId;
  appearance: AppearanceMode;
} {
  if (typeof window === "undefined") {
    return { themeId: DEFAULT_THEME_ID, appearance: DEFAULT_APPEARANCE };
  }
  try {
    const merged = localStorage.getItem(WEEKLY_COMMIT_PERSIST_KEY);
    let themeId: ThemeId | null = null;
    let appearance: AppearanceMode = DEFAULT_APPEARANCE;
    if (merged) {
      const o = JSON.parse(merged) as {
        state?: { themeId?: unknown; appearance?: unknown };
      };
      const st = o?.state;
      if (
        st?.themeId != null &&
        isThemeId(String(st.themeId))
      ) {
        themeId = st.themeId as ThemeId;
      }
      appearance = parseAppearance(st?.appearance);
    }
    if (themeId == null) {
      themeId = parseStoredTheme(localStorage.getItem(THEME_STORAGE_KEY));
    }
    return { themeId, appearance };
  } catch {
    return { themeId: DEFAULT_THEME_ID, appearance: DEFAULT_APPEARANCE };
  }
}

/** Inline, blocking script: apply saved theme + appearance before paint. */
export function getThemeBootstrapScript(): string {
  const allowed = JSON.stringify([...THEME_IDS]);
  const persistKey = JSON.stringify(WEEKLY_COMMIT_PERSIST_KEY);
  const legacyKey = JSON.stringify(THEME_STORAGE_KEY);
  const defTheme = JSON.stringify(DEFAULT_THEME_ID);
  const fontUrls = JSON.stringify(THEME_GOOGLE_FONTS_CSS_URL);
  return `!function(){try{var a=${allowed};var pk=${persistKey};var lk=${legacyKey};var def=${defTheme};var fu=${fontUrls};var el=document.documentElement;var theme=null;var merged=localStorage.getItem(pk);if(merged){var o=JSON.parse(merged);if(o&&o.state){if(o.state.themeId&&a.indexOf(o.state.themeId)!==-1){theme=o.state.themeId;el.setAttribute("data-theme",theme);}if(o.state.appearance==="dark")el.setAttribute("data-appearance","dark");}}if(theme==null){var t=localStorage.getItem(lk);if(t&&a.indexOf(t)!==-1)el.setAttribute("data-theme",t);}if(!el.getAttribute("data-theme"))el.setAttribute("data-theme",def);var th=el.getAttribute("data-theme")||def;var u=fu[th]||fu[def];if(u){var id="wc-theme-fonts";var L=document.getElementById(id);if(L){if(L.getAttribute("href")!==u)L.setAttribute("href",u);}else{L=document.createElement("link");L.id=id;L.rel="stylesheet";L.href=u;document.head.appendChild(L);}}}catch(e){}}();`;
}
