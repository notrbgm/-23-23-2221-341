import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
}

interface SeasonResponse {
  episodes: Episode[];
}

export async function GET({ params, fetch }: RequestEvent) {
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const tmdbApiUrl = process.env.TMDB_API_URL;

  if (!tmdbApiKey || !tmdbApiUrl) {
    throw error(500, "TMDB API configuration missing");
  }

  const { id, season } = params;

  try {
    const response = await fetch(
      `${tmdbApiUrl}/tv/${id}/season/${season}?api_key=${tmdbApiKey}&language=en-US`,
    );

    if (!response.ok) {
      throw error(response.status, "Failed to fetch season details");
    }

    const data: SeasonResponse = await response.json();


    const currentDate = new Date();
    const episodes = data.episodes.filter((episode: Episode) => {
      const airDate = new Date(episode.air_date);
      return airDate <= currentDate;
    });

    return json({ episodes });
  } catch (err) {
    console.error("Error fetching season episodes:", err);
    throw error(500, "Failed to fetch season episodes");
  }
}
