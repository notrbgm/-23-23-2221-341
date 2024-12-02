import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { getSession } from "$lib/server/auth";

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const session = await getSession(cookies);
    if (!session?.userId) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await request.json();
    if (!commentId) {
      return json({ error: "Comment ID is required" }, { status: 400 });
    }


    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return json({ error: "Comment not found" }, { status: 404 });
    }


    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.userId,
          commentId,
        },
      },
    });

    if (existingLike) {

      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId: session.userId,
            commentId,
          },
        },
      });
    } else {

      await prisma.commentLike.create({
        data: {
          userId: session.userId,
          commentId,
        },
      });
    }


    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return json({
      isLiked: !existingLike,
      likeCount: updatedComment?._count.likes || 0,
    });
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return json(
      { error: "Failed to toggle like", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET({ url, cookies }: RequestEvent) {
  try {
    const session = await getSession(cookies);
    if (!session?.userId) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = url.searchParams.get("commentId");
    if (!commentId) {
      return json({ error: "Comment ID is required" }, { status: 400 });
    }

    const like = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.userId,
          commentId: parseInt(commentId),
        },
      },
    });

    const likeCount = await prisma.commentLike.count({
      where: {
        commentId: parseInt(commentId),
      },
    });

    return json({
      isLiked: !!like,
      likeCount,
    });
  } catch (error) {
    console.error("Error checking comment like:", error);
    return json(
      { error: "Failed to check like status", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
