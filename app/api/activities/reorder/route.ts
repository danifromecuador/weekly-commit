import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { orderedIds } = await request.json() as { orderedIds: string[] };

  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(activities)
        .set({ sortOrder: i })
        .where(
          and(
            eq(activities.id, orderedIds[i]),
            eq(activities.userId, session.user.id),
          ),
        );
    }
  });

  return new Response(null, { status: 204 });
}
