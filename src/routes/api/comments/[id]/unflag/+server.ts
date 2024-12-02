import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireAdmin } from "$lib/server/admin-middleware";
import { prisma } from "$lib/server/prisma";

export async function POST(event: RequestEvent) {
  await requireAdmin(event);

  const id = event.params.id;
  if (!id) {
    throw error(400, "Comment ID is required");
  }

  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    throw error(400, "Invalid comment ID");
  }

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      throw error(404, "Comment not found");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        flagged: false,
        flagReason: null,
        flaggedAt: null
      }
    });

    return json({
      success: true,
      comment: updatedComment
    });
  } catch (err) {
    console.error("Error unflagging comment:", err);
    throw error(500, "Failed to unflag comment");
  }
}
