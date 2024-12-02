import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ fetch, url }: RequestEvent) {
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const tmdbApiUrl = process.env.TMDB_API_URL;

  if (!tmdbApiKey || !tmdbApiUrl) {
    throw error(500, "TMDB API configuration missing");
  }

  try {
    const response = await fetch(
      `${tmdbApiUrl}/trending/tv/week?api_key=${tmdbApiKey}&language=en-US`,
    );

    if (!response.ok) {
      throw error(response.status, "Failed to fetch trending TV shows");
    }

    const data = await response.json();
    return json(data);
  } catch (err) {
    console.error("Error fetching trending TV shows:", err);
    throw error(500, "Failed to fetch trending TV shows");
  }
}
