import { error } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import { TMDBService } from "$lib/services/tmdb";
import type { TMDBMovie, TMDBTVShow } from "$lib/types/tmdb";

interface PageData {
  media: TMDBMovie | TMDBTVShow;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

export const load: ServerLoad = async ({ params, url }) => {
  const tmdb = new TMDBService();
  const mediaType = url.searchParams.get("type") || "movie";
  const season = url.searchParams.get("season");
  const episode = url.searchParams.get("episode");
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    throw error(400, "Invalid media ID");
  }

  try {
    if (mediaType === "movie") {
      const movie = await tmdb.getMovieDetails(id);
      return {
        media: movie,
        type: "movie",
      } satisfies PageData;
    } else {
      const show = await tmdb.getTVShowDetails(id);
      return {
        media: show,
        type: "tv",
        season: season ? parseInt(season) : 1,
        episode: episode ? parseInt(episode) : 1,
      } satisfies PageData;
    }
  } catch (e) {
    console.error("Failed to load media details:", e);
    throw error(500, "Failed to load media details");
  }
};
