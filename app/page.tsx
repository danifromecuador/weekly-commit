import { ThemeSelector } from "@/components/theme-selector";
import { WeeklyGrid } from "@/components/WeeklyGrid";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-[72rem] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10">
      <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="order-2 flex-1 text-center sm:order-1">
          <h1 className="wc-title-script text-3xl sm:text-4xl md:text-5xl">Weekly Commit</h1>
          <p className="wc-title-sub mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em]">
            Achieve your goals one week at a time
          </p>
        </div>
        <div className="order-1 sm:order-2 sm:pt-1">
          <ThemeSelector />
        </div>
      </header>
      <div className="flex min-w-0 flex-1 flex-col">
        <WeeklyGrid />
      </div>
    </main>
  );
}
