import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { THEME_GOOGLE_FONTS_CSS_URL } from "./theme-fonts";
import { syncThemeFontStylesheet } from "./theme-fonts";

const LINK_ID = "wc-theme-fonts";

describe("syncThemeFontStylesheet", () => {
  beforeEach(() => {
    document.getElementById(LINK_ID)?.remove();
  });

  afterEach(() => {
    document.getElementById(LINK_ID)?.remove();
  });

  it("creates a link with the correct href for each theme", () => {
    syncThemeFontStylesheet("paper-planner");
    const link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.getAttribute("href")).toBe(
      THEME_GOOGLE_FONTS_CSS_URL["paper-planner"],
    );
  });

  it("updates href when theme changes", () => {
    syncThemeFontStylesheet("graphite");
    const link = document.getElementById(LINK_ID) as HTMLLinkElement;
    expect(link.getAttribute("href")).toBe(THEME_GOOGLE_FONTS_CSS_URL.graphite);
    syncThemeFontStylesheet("botanical-flow");
    expect(link.getAttribute("href")).toBe(
      THEME_GOOGLE_FONTS_CSS_URL["botanical-flow"],
    );
  });

  it("does not duplicate link elements on repeated calls", () => {
    syncThemeFontStylesheet("graphite");
    syncThemeFontStylesheet("graphite");
    expect(document.querySelectorAll(`#${LINK_ID}`).length).toBe(1);
  });
});
