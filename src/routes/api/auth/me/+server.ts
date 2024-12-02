import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { getSession } from "$lib/server/auth";

export async function GET({ cookies }: RequestEvent) {
  try {
    const session = await getSession(cookies);
    if (!session?.userId) {
      return new Response(null, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new Response(null, { status: 401 });
    }

    return json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
