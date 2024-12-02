import type { PageServerLoad } from "./$types";
import { TMDBService } from "$lib/services/tmdb";

const tmdb = new TMDBService();

export const load = (async ({ url }) => {
  const query = url.searchParams.get("query");
  const page = parseInt(url.searchParams.get("page") || "1");

  if (!query) {
    return { results: [], totalPages: 0 };
  }

  const data = await tmdb.searchMulti(query, page);
  const results = data.results.filter(
    (item) =>
      (item.media_type === "movie" || item.media_type === "tv") &&
      item.poster_path &&
      item.vote_average > 0
  );

  return {
    results,
    totalPages: Math.min(data.total_pages, 500),
  };
}) satisfies PageServerLoad;
