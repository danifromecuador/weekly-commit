"use client";

import { getMessages } from "@/lib/messages";
import { useWeeklyGridStore } from "@/store";
import { authClient } from "@/lib/auth-client";

const LINKEDIN_HREF = "https://www.linkedin.com/in/danifromec/";
const STREAKS_HREF = "https://streaks-xekk.onrender.com/";
const PLANNYWISE_HREF = "https://plannywise.onrender.com/";

export function SiteFooter() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);

  return (
    <footer className="wc-site-footer mt-8 pt-5 sm:mt-10 sm:pt-6">
      <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2.5 sm:gap-y-1.5">
        <p className="wc-muted-ink m-0 inline-flex flex-wrap items-center justify-center gap-x-1.5">
          <span>{m.footer.by}</span>
          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="wc-footer-link"
            aria-label={m.footer.linkedInAria}
          >
            Dani Dev
          </a>
        </p>
        <span
          className="wc-muted-ink hidden shrink-0 select-none sm:inline"
          aria-hidden
        >
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
          <span className="wc-muted-ink shrink-0 select-none" aria-hidden>
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
          <button
            type="button"
            className="wc-footer-link wc-muted-ink  cursor-pointer"
            onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.href = "/login" } })}
          >
            {m.footer.signOut}
          </button>

        </nav>
      </div>
    </footer>
  );
}
