import { count, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [{ count: existing }] = await db
    .select({ count: count() })
    .from(activities)
    .where(eq(activities.userId, session.user.id));

  if (existing > 0) {
    return Response.json({ migrated: 0 }, { status: 409 });
  }

  const body = await request.json() as Array<{
    id: string;
    name: string;
    durationMinutes: number | null;
    doneByDay: Record<string, boolean>;
  }>;

  const rows = body.map((a, i) => ({
    id: a.id,
    userId: session.user.id,
    name: a.name,
    durationMinutes: a.durationMinutes,
    doneByDay: a.doneByDay,
    sortOrder: i,
  }));

  if (rows.length > 0) {
    await db.insert(activities).values(rows);
  }

  return Response.json({ migrated: rows.length }, { status: 201 });
}
