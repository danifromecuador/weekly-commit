import type { ThemeId } from "./themes";

/**
 * One Google Fonts stylesheet per UI theme so only the active theme’s faces
 * load. Weights are trimmed (one “bold” step per family where it mattered).
 */
export const THEME_GOOGLE_FONTS_CSS_URL: Record<ThemeId, string> = {
  "paper-planner":
    "https://fonts.googleapis.com/css2?family=Dancing+Script&family=Playfair+Display:wght@400;600&display=swap",
  graphite:
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono:wght@400&display=swap",
  "botanical-flow":
    "https://fonts.googleapis.com/css2?family=Sniglet:wght@800&family=Caveat:wght@400&family=Kalam:wght@400;700&family=Patrick+Hand&display=swap",
};

const LINK_ID = "wc-theme-fonts";

export function syncThemeFontStylesheet(themeId: ThemeId): void {
  if (typeof document === "undefined") return;
  const href = THEME_GOOGLE_FONTS_CSS_URL[themeId];
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.getAttribute("href") !== href) {
    link.setAttribute("href", href);
  }
}
