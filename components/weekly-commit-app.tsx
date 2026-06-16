"use client";

import { useEffect, useRef } from "react";

import { AppearanceToggle } from "@/components/appearance-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { ThemeSelector } from "@/components/theme-selector";
import { WeeklyGrid } from "@/components/WeeklyGrid";
import { getMessages } from "@/lib/messages";
import type { ActivityRow } from "@/lib/weekly-grid/types";
import { useWeeklyGridStore } from "@/store";
import { WEEKLY_COMMIT_PERSIST_KEY } from "@/lib/themes";
import { persistedActivitiesOnly } from "@/store/slices/activities-slice";

export function WeeklyCommitApp({
  initialActivities,
}: {
  initialActivities: ActivityRow[];
}) {
  const locale = useWeeklyGridStore((s) => s.locale);
  const loadActivities = useWeeklyGridStore((s) => s.loadActivities);
  const m = getMessages(locale);
  const migrated = useRef(false);

  useEffect(() => {
    loadActivities(initialActivities);

    if (migrated.current || initialActivities.length > 0) return;
    migrated.current = true;

    try {
      const raw = localStorage.getItem(WEEKLY_COMMIT_PERSIST_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        state?: { activities?: ActivityRow[] };
      };
      const local = persistedActivitiesOnly(parsed?.state?.activities ?? []);
      if (local.length === 0) return;

      void fetch("/api/activities/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local),
      }).then(async (res) => {
        if (!res.ok) return;
        const data = await res.json() as { migrated: number };
        if (data.migrated > 0) {
          loadActivities(local);
          const stored = JSON.parse(localStorage.getItem(WEEKLY_COMMIT_PERSIST_KEY) ?? "{}") as {
            state?: Record<string, unknown>;
          };
          if (stored.state) {
            delete stored.state.activities;
            localStorage.setItem(WEEKLY_COMMIT_PERSIST_KEY, JSON.stringify(stored));
          }
        }
      });
    } catch {
      // localStorage not available or parse error — skip migration
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
