import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { WeeklyCommitApp } from "@/components/weekly-commit-app";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import type { ActivityRow } from "@/lib/weekly-grid/types";
import type { DurationMinutes } from "@/lib/weekly-grid/constants";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, session.user.id))
    .orderBy(asc(activities.sortOrder));

  const initialActivities: ActivityRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    durationMinutes: r.durationMinutes as DurationMinutes | null,
    doneByDay: r.doneByDay as Record<string, boolean>,
  }));

  return <WeeklyCommitApp initialActivities={initialActivities} />;
}
