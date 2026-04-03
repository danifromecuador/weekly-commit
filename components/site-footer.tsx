"use client";

import { getMessages } from "@/lib/messages";
import { useWeeklyGridStore } from "@/store";

const LINKEDIN_HREF = "https://www.linkedin.com/in/danifromec/";
const STREAKS_HREF = "https://streaks-xekk.onrender.com/";
const PLANNYWISE_HREF = "https://plannywise.onrender.com/";

export function SiteFooter() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);

  return (
    <footer className="wc-site-footer mt-10 pt-6 sm:mt-12">
      <div className="flex flex-col items-center gap-3 text-center text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1 sm:gap-y-2">
        <p className="wc-muted-ink m-0">
          <span>{m.footer.by} </span>
          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="wc-footer-link font-medium"
            aria-label={m.footer.linkedInAria}
          >
            Dani Dev
          </a>
        </p>
        <span className="wc-footer-sep wc-muted-ink hidden select-none sm:inline" aria-hidden>
          ·
        </span>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
          aria-label={m.footer.relatedAppsNavAria}
        >
          <a
            href={STREAKS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="wc-footer-link"
            aria-label={m.footer.streaksAria}
          >
            {m.footer.streaks}
          </a>
          <span className="wc-muted-ink select-none" aria-hidden>
            ·
          </span>
          <a
            href={PLANNYWISE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="wc-footer-link"
            aria-label={m.footer.plannywiseAria}
          >
            {m.footer.plannywise}
          </a>
        </nav>
      </div>
    </footer>
  );
}
