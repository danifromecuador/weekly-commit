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
    <main className="mx-auto flex w-full max-w-[72rem] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10">
      <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="order-2 flex-1 text-center sm:order-1">
          <h1 className="wc-title-script text-3xl sm:text-4xl md:text-5xl">{m.appTitle}</h1>
          <p className="wc-title-sub mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em]">
            {m.appSubtitle}
          </p>
        </div>
        <div className="order-1 flex flex-wrap items-center justify-center gap-2 sm:order-2 sm:justify-end sm:pt-1">
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
