import { asc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, session.user.id))
    .orderBy(asc(activities.sortOrder));

  return Response.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as {
    id: string;
    name: string;
    durationMinutes: number | null;
    doneByDay: Record<string, boolean>;
    sortOrder: number;
  };

  const [row] = await db
    .insert(activities)
    .values({
      id: body.id,
      userId: session.user.id,
      name: body.name,
      durationMinutes: body.durationMinutes,
      doneByDay: body.doneByDay,
      sortOrder: body.sortOrder,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
