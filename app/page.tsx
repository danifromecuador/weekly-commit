import { ThemeSelector } from "@/components/theme-selector";
import { WeeklyGrid } from "@/components/WeeklyGrid";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-[52rem] flex-1 flex-col px-6 py-10 sm:px-10">
      <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="order-2 flex-1 text-center sm:order-1">
          <h1 className="wc-title-script text-4xl sm:text-5xl">Weekly Commit</h1>
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
