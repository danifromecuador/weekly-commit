"use client";

import { getMessages } from "@/lib/messages";
import { useWeeklyGridStore } from "@/store";

export function LanguageToggle() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const setLocale = useWeeklyGridStore((s) => s.setLocale);
  const m = getMessages(locale);

  const nextLocale = locale === "en" ? "es" : "en";
  const label = locale === "en" ? "EN" : "ES";
  const switchLabel =
    nextLocale === "en"
      ? m.controls.switchLanguageToEnglish
      : m.controls.switchLanguageToSpanish;

  return (
    <button
      type="button"
      className="wc-btn-icon inline-flex items-center justify-center px-2 sm:px-2.5"
      aria-label={switchLabel}
      title={`${m.controls.languageLabel}: ${label}`}
      onClick={() => setLocale(nextLocale)}
    >
      <span className="text-[0.6rem] font-semibold tracking-[0.1em] sm:text-[0.62rem] sm:tracking-[0.12em]">
        {label}
      </span>
    </button>
  );
}

