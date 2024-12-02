import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { CommentService } from "$lib/services/comments";
import { requireAdmin } from "$lib/server/admin-middleware";

const commentService = new CommentService();

export async function GET(event: RequestEvent) {

  await requireAdmin(event);

  const page = parseInt(event.url.searchParams.get("page") || "1");
  const limit = parseInt(event.url.searchParams.get("limit") || "10");

  try {
    const { comments, total } = await commentService.getFlaggedComments(
      page,
      limit,
    );

    return json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Error fetching flagged comments:", err);
    throw error(500, "Failed to fetch flagged comments");
  }
}
