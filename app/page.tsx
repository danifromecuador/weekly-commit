"use client";

import { AppearanceToggle } from "@/components/appearance-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeSelector } from "@/components/theme-selector";
import { SiteFooter } from "@/components/site-footer";
import { WeeklyGrid } from "@/components/WeeklyGrid";
import { getMessages } from "@/lib/messages";
import { useWeeklyGridStore } from "@/store";

export default function Page() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);

  return (
    <main className="mx-auto flex w-fit max-w-full min-w-0 flex-1 flex-col self-center px-3 py-5 sm:px-5 sm:py-7 md:px-7">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="order-2 min-w-0 shrink text-center sm:order-1">
          <h1 className="wc-title-script text-2xl sm:text-3xl md:text-4xl">{m.appTitle}</h1>
          <p className="wc-title-sub mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.22em] sm:mt-2.5 sm:text-[0.6rem] sm:tracking-[0.24em]">
            {m.appSubtitle}
          </p>
        </div>
        <div className="order-1 flex flex-wrap items-center justify-center gap-1.5 sm:order-2 sm:justify-end sm:gap-2 sm:pt-0.5">
          <LanguageToggle />
          <AppearanceToggle />
          <ThemeSelector />
        </div>
      </header>
      <div className="flex min-w-0 flex-1 flex-col">
        <WeeklyGrid />
      </div>
      <SiteFooter />
    </main>
  );
}
