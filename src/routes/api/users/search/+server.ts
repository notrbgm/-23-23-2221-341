import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export async function GET({ url, locals }: RequestEvent) {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }

  const query = url.searchParams.get("q");
  if (!query) {
    throw error(400, "Query parameter is required");
  }

  try {
    const users = await prisma.$queryRaw<
      Array<{ id: number; username: string }>
    >`
      SELECT id, username
      FROM users
      WHERE username LIKE ${`%${query}%`}
      AND id != ${locals.user.id}
      ORDER BY username ASC
      LIMIT 5
    `;

    return json(users);
  } catch (err) {
    console.error("Error searching users:", err);
    throw error(500, "Failed to search users");
  }
}
