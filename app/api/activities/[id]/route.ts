import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json() as Partial<{
    name: string;
    durationMinutes: number | null;
    doneByDay: Record<string, boolean>;
  }>;

  const [row] = await db
    .update(activities)
    .set(body)
    .where(and(eq(activities.id, id), eq(activities.userId, session.user.id)))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db
    .delete(activities)
    .where(and(eq(activities.id, id), eq(activities.userId, session.user.id)));

  return new Response(null, { status: 204 });
}
