"use client";

import { Languages } from "lucide-react";

import { useWeeklyGridStore } from "@/store";

export function LanguageToggle() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const setLocale = useWeeklyGridStore((s) => s.setLocale);

  const nextLocale = locale === "en" ? "es" : "en";
  const label = locale === "en" ? "EN" : "ES";
  const nextLabel = nextLocale === "en" ? "English" : "Spanish";

  return (
    <button
      type="button"
      className="wc-btn-icon inline-flex items-center justify-center gap-1.5 px-2.5"
      aria-label={`Switch language to ${nextLabel}`}
      title={`Language: ${label}`}
      onClick={() => setLocale(nextLocale)}
    >
      <Languages className="size-[1rem] shrink-0" strokeWidth={2} aria-hidden />
      <span className="text-[0.65rem] font-semibold tracking-[0.12em]">{label}</span>
    </button>
  );
}

