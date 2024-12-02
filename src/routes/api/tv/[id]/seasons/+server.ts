import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params, fetch }: RequestEvent) {
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const tmdbApiUrl = process.env.TMDB_API_URL;

  if (!tmdbApiKey || !tmdbApiUrl) {
    throw error(500, "TMDB API configuration missing");
  }

  const { id } = params;

  try {
    const response = await fetch(
      `${tmdbApiUrl}/tv/${id}?api_key=${tmdbApiKey}&language=en-US`,
    );

    if (!response.ok) {
      throw error(response.status, "Failed to fetch TV show details");
    }

    const data = await response.json();
    return json({ seasons: data.seasons });
  } catch (err) {
    console.error("Error fetching TV show seasons:", err);
    throw error(500, "Failed to fetch TV show seasons");
  }
}
