import { afterEach, describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  getLocaleBootstrapScript,
  parseLocale,
  readPersistedLocaleFromLocalStorage,
} from "./i18n";
import { WEEKLY_COMMIT_PERSIST_KEY } from "./themes";

describe("i18n helpers", () => {
  afterEach(() => {
    localStorage.removeItem(WEEKLY_COMMIT_PERSIST_KEY);
  });

  it("parseLocale defaults to english", () => {
    expect(parseLocale(undefined)).toBe(DEFAULT_LOCALE);
    expect(parseLocale("pt")).toBe(DEFAULT_LOCALE);
  });

  it("reads locale from persisted store payload", () => {
    localStorage.setItem(
      WEEKLY_COMMIT_PERSIST_KEY,
      JSON.stringify({ state: { locale: "es" } }),
    );
    expect(readPersistedLocaleFromLocalStorage()).toBe("es");
  });

  it("returns default locale when persisted data is invalid", () => {
    localStorage.setItem(WEEKLY_COMMIT_PERSIST_KEY, "{bad json");
    expect(readPersistedLocaleFromLocalStorage()).toBe(DEFAULT_LOCALE);
  });

  it("emits a bootstrap script that sets document lang", () => {
    const script = getLocaleBootstrapScript();
    expect(script).toContain("document.documentElement");
    expect(script).toContain(".lang=");
  });
});

