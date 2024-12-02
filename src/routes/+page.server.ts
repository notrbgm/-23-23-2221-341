import type { ServerLoad } from "@sveltejs/kit";
import { TMDBService } from "$lib/services/tmdb";

export const load = (async () => {
  const tmdb = new TMDBService();

  const [trendingMovies, trendingTVShows] = await Promise.all([
    tmdb.getTrendingMovies(),
    tmdb.getTrendingTVShows(),
  ]);

  return {
    trendingMovies: trendingMovies.results.slice(0, 12),
    trendingTVShows: trendingTVShows.results.slice(0, 12),
  };
}) satisfies ServerLoad;
