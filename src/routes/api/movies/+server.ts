import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ fetch, url }: RequestEvent) {
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const tmdbApiUrl = process.env.TMDB_API_URL;

  if (!tmdbApiKey || !tmdbApiUrl) {
    throw error(500, "TMDB API configuration missing");
  }

  const page = url.searchParams.get("page") || "1";
  const sort = url.searchParams.get("sort") || "trending";
  const genre = url.searchParams.get("genre");
  const year = url.searchParams.get("year");

  try {
    let apiUrl: string;
    const baseParams = `api_key=${tmdbApiKey}&language=en-US&page=${page}&vote_average.gte=0.1`;

    switch (sort) {
      case "trending":
        apiUrl = `${tmdbApiUrl}/trending/movie/week?${baseParams}`;
        break;
      case "popular":
        apiUrl = `${tmdbApiUrl}/movie/popular?${baseParams}`;
        break;
      case "top_rated":
        apiUrl = `${tmdbApiUrl}/movie/top_rated?${baseParams}`;
        break;
      case "now_playing":
        apiUrl = `${tmdbApiUrl}/movie/now_playing?${baseParams}`;
        break;
      case "upcoming":
        apiUrl = `${tmdbApiUrl}/movie/upcoming?${baseParams}`;
        break;
      default:
        apiUrl = `${tmdbApiUrl}/discover/movie?${baseParams}`;
    }


    if (genre || year) {
      apiUrl = `${tmdbApiUrl}/discover/movie?${baseParams}`;
      if (genre) apiUrl += `&with_genres=${genre}`;
      if (year) apiUrl += `&primary_release_year=${year}`;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw error(response.status, "Failed to fetch movies");
    }

    const data = await response.json();


    data.results = data.results.filter((movie: any) => movie.vote_average > 0);

    return json(data);
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw error(500, "Failed to fetch movies");
  }
}
