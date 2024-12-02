import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireAdmin } from "$lib/server/admin-middleware";
import { prisma } from "$lib/server/prisma";

export async function DELETE(event: RequestEvent) {
  const user = event.locals.user;
  if (!user) {
    throw error(401, "Unauthorized");
  }

  const id = event.params.id;
  if (!id) {
    throw error(400, "Comment ID is required");
  }

  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    throw error(400, "Invalid comment ID");
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw error(404, "Comment not found");
    }

    if (!user.isAdmin && comment.userId !== user.id) {
      await requireAdmin(event);
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: user.isAdmin ? "Comment deleted by admin" : "Comment deleted by user",
        flagged: false,
        flagReason: null,
        flaggedAt: null
      }
    });

    if (user.isAdmin) {
      console.log(`Admin ${user.username} deleted comment ${commentId} at ${new Date().toISOString()}`);
    }

    return json({ success: true, comment: updatedComment });
  } catch (err) {
    console.error("Error updating comment:", err);
    throw error(500, "Failed to update comment");
  }
}
