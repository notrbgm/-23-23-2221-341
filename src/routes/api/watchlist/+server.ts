import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { watchlistService } from "$lib/server/services/watchlist";

export async function GET({ locals }: RequestEvent) {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await watchlistService.getWatchlist(locals.user.id);
    const total = await watchlistService.getWatchlistCount(locals.user.id);
    return json({ items, total });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return json({ error: message }, { status: 500 });
  }
}

export async function POST({ request, locals }: RequestEvent) {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mediaId, mediaType, title, posterPath, voteAverage } =
      await request.json();

    if (!mediaId || !mediaType || !title) {
      return json(
        { error: "Media ID, type, and title are required" },
        { status: 400 },
      );
    }

    if (!["movie", "tv"].includes(mediaType)) {
      return json({ error: "Invalid media type" }, { status: 400 });
    }

    const watchlistItem = await watchlistService.addToWatchlist(
      locals.user.id,
      mediaId,
      mediaType as "movie" | "tv",
      title,
      posterPath,
      voteAverage || 0,
    );

    return json(watchlistItem);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    const status = message === "Item already in watchlist" ? 400 : 500;
    return json({ error: message }, { status });
  }
}

export async function DELETE({ request, locals }: RequestEvent) {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mediaId, mediaType } = await request.json();

    if (!mediaId || !mediaType) {
      return json({ error: "Media ID and type are required" }, { status: 400 });
    }

    if (!["movie", "tv"].includes(mediaType)) {
      return json({ error: "Invalid media type" }, { status: 400 });
    }

    await watchlistService.removeFromWatchlist(
      locals.user.id,
      mediaId,
      mediaType as "movie" | "tv",
    );

    return json({ message: "Item removed from watchlist" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return json({ error: message }, { status: 500 });
  }
}
