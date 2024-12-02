import { prisma } from "$lib/server/prisma";

interface PrismaError extends Error {
  code?: string;
}

export class WatchlistService {
  private static instance: WatchlistService;

  private constructor() {}

  static getInstance(): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService();
    }
    return WatchlistService.instance;
  }

  async addToWatchlist(
    userId: number,
    mediaId: number,
    mediaType: "movie" | "tv",
    title: string,
    posterPath: string | null,
    voteAverage: number,
  ) {
    try {
      const watchlistItem = await prisma.watchlist.create({
        data: {
          userId,
          mediaId,
          mediaType,
          title,
          posterPath,
          voteAverage,
        },
      });
      return watchlistItem;
    } catch (error) {
      if ((error as PrismaError).code === "P2002") {
        throw new Error("Item already in watchlist");
      }
      throw error;
    }
  }

  async removeFromWatchlist(
    userId: number,
    mediaId: number,
    mediaType: "movie" | "tv",
  ) {
    return prisma.watchlist.deleteMany({
      where: {
        userId,
        mediaId,
        mediaType,
      },
    });
  }

  async getWatchlist(userId: number) {
    return prisma.watchlist.findMany({
      where: {
        userId,
      },
      orderBy: {
        addedAt: "desc",
      },
    });
  }

  async isInWatchlist(
    userId: number,
    mediaId: number,
    mediaType: "movie" | "tv",
  ) {
    const count = await prisma.watchlist.count({
      where: {
        userId,
        mediaId,
        mediaType,
      },
    });
    return count > 0;
  }

  async getWatchlistCount(userId: number) {
    return prisma.watchlist.count({
      where: {
        userId,
      },
    });
  }
}

export const watchlistService = WatchlistService.getInstance();
