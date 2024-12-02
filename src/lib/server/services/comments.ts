import { prisma } from "$lib/server/prisma";

type MediaType = "movie" | "tv";

interface CreateCommentInput {
  userId: number;
  mediaId: number;
  mediaType: MediaType;
  content: string;
  parentId?: number | null;
}

interface CommentUser {
  username: string;
}

interface CommentCounts {
  likes: number;
  replies: number;
}

interface BaseComment {
  id: number;
  userId: number;
  mediaId: number;
  mediaType: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: number | null;
  flagged: boolean;
  flagReason?: string | null;
  flaggedAt?: Date | null;
}

export interface CommentWithDetails extends BaseComment {
  user: CommentUser;
  _count: CommentCounts;
  isLiked?: boolean;
}

export class CommentService {
  private static instance: CommentService;

  private constructor() {}

  static getInstance(): CommentService {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async createComment(input: CreateCommentInput): Promise<BaseComment> {
    return prisma.comment.create({
      data: {
        userId: input.userId,
        mediaId: input.mediaId,
        mediaType: input.mediaType,
        content: input.content,
        parentId: input.parentId,
      },
    });
  }

  async getComments(
    mediaId: number,
    mediaType: MediaType,
    currentUserId?: number | null,
    parentId: number | null = null,
    page = 1,
    limit = 10,
  ): Promise<{ comments: CommentWithDetails[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          mediaId,
          mediaType,
          parentId,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          mediaId,
          mediaType,
          parentId,
        },
      }),
    ]);

    if (currentUserId) {
      const likes = await prisma.commentLike.findMany({
        where: {
          userId: currentUserId,
          commentId: {
            in: comments.map(c => c.id),
          },
        },
        select: {
          commentId: true,
        },
      });

      const likedCommentIds = new Set(likes.map(l => l.commentId));
      comments.forEach(comment => {
        (comment as CommentWithDetails).isLiked = likedCommentIds.has(comment.id);
      });
    }

    return {
      comments: comments as CommentWithDetails[],
      total,
    };
  }

  async getFlaggedComments(
    page = 1,
    limit = 10,
  ): Promise<{ comments: CommentWithDetails[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          flagged: true,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: {
          flaggedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          flagged: true,
        },
      }),
    ]);

    return {
      comments: comments as CommentWithDetails[],
      total,
    };
  }

  async getReplies(
    commentId: number,
    currentUserId?: number | null,
    page = 1,
    limit = 5,
  ): Promise<{ replies: CommentWithDetails[]; total: number }> {
    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          parentId: commentId,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          parentId: commentId,
        },
      }),
    ]);

    if (currentUserId) {
      const likes = await prisma.commentLike.findMany({
        where: {
          userId: currentUserId,
          commentId: {
            in: replies.map(r => r.id),
          },
        },
        select: {
          commentId: true,
        },
      });

      const likedReplyIds = new Set(likes.map(l => l.commentId));
      replies.forEach(reply => {
        (reply as CommentWithDetails).isLiked = likedReplyIds.has(reply.id);
      });
    }

    return {
      replies: replies as CommentWithDetails[],
      total,
    };
  }

  async likeComment(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.create({
      data: {
        userId,
        commentId,
      },
    });
  }

  async unlikeComment(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }

  async updateComment(
    commentId: number,
    userId: number,
    content: string,
  ): Promise<BaseComment> {
    return prisma.comment.update({
      where: {
        id: commentId,
        userId,
      },
      data: {
        content,
      },
    });
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true }
    });

    if (comment.userId !== userId && !user?.isAdmin) {
      throw new Error("Unauthorized");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async flagComment(commentId: number, reason?: string): Promise<BaseComment> {
    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        flagged: true,
        flagReason: reason || "No reason provided",
        flaggedAt: new Date(),
      },
    });
  }

  async unflagComment(commentId: number): Promise<BaseComment> {
    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        flagged: false,
        flagReason: null,
        flaggedAt: null,
      },
    });
  }
}

export const commentService = CommentService.getInstance();
