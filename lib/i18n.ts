export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function parseLocale(value: unknown): Locale {
  if (value === "es") return "es";
  return DEFAULT_LOCALE;
}

