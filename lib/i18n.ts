import { WEEKLY_COMMIT_PERSIST_KEY } from "./themes";

export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function parseLocale(value: unknown): Locale {
  if (value === "es") return "es";
  return DEFAULT_LOCALE;
}

export function applyLocaleToDocument(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

export function readPersistedLocaleFromLocalStorage(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const merged = localStorage.getItem(WEEKLY_COMMIT_PERSIST_KEY);
    if (!merged) return DEFAULT_LOCALE;
    const o = JSON.parse(merged) as { state?: { locale?: unknown } };
    return parseLocale(o?.state?.locale);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getLocaleBootstrapScript(): string {
  const persistKey = JSON.stringify(WEEKLY_COMMIT_PERSIST_KEY);
  const defaultLocale = JSON.stringify(DEFAULT_LOCALE);
  return `!function(){try{var pk=${persistKey};var d=${defaultLocale};var el=document.documentElement;var merged=localStorage.getItem(pk);var v=d;if(merged){var o=JSON.parse(merged);if(o&&o.state&&o.state.locale==="es")v="es";}el.lang=v;}catch(e){}}();`;
}

