export type SortOrder = "asc" | "desc";
export type SortBy = "popularity" | "rating" | "release_date" | "title";
export type MediaType = "movie" | "tv";
export type WatchStatus = "all" | "watching" | "completed" | "planned";

export interface Genre {
  id: number;
  name: string;
}

export interface FilterOptions {
  query?: string;
  genres?: number[];
  year?: number;
  rating?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  watchStatus?: WatchStatus;
  page?: number;
  limit?: number;
}

export interface FilterState extends FilterOptions {
  availableGenres: Genre[];
  totalResults: number;
  totalPages: number;
}

export const defaultFilterState: FilterState = {
  query: "",
  genres: [],
  sortBy: "popularity",
  sortOrder: "desc",
  watchStatus: "all",
  page: 1,
  limit: 20,
  availableGenres: [],
  totalResults: 0,
  totalPages: 0,
};

export const sortOptions: { value: SortBy; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release_date", label: "Release Date" },
  { value: "title", label: "Title" },
];

export const watchStatusOptions: { value: WatchStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "planned", label: "Plan to Watch" },
];

export const yearOptions: { value: number; label: string }[] = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push({ value: year, label: year.toString() });
  }
  return years;
})();

export const ratingOptions: { value: number; label: string }[] = [
  { value: 9, label: "9+ Rating" },
  { value: 8, label: "8+ Rating" },
  { value: 7, label: "7+ Rating" },
  { value: 6, label: "6+ Rating" },
  { value: 5, label: "5+ Rating" },
  { value: 0, label: "All Ratings" },
];

export function createQueryString(filters: FilterOptions): string {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("query", filters.query);
  }

  if (filters.genres && filters.genres.length > 0) {
    params.set("genres", filters.genres.join(","));
  }

  if (filters.year) {
    params.set("year", filters.year.toString());
  }

  if (filters.rating) {
    params.set("rating", filters.rating.toString());
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  if (filters.watchStatus && filters.watchStatus !== "all") {
    params.set("watchStatus", filters.watchStatus);
  }

  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }

  if (filters.limit && filters.limit !== 20) {
    params.set("limit", filters.limit.toString());
  }

  return params.toString();
}

export function parseQueryString(queryString: string): FilterOptions {
  const params = new URLSearchParams(queryString);
  const filters: FilterOptions = {};

  const query = params.get("query");
  if (query) {
    filters.query = query;
  }

  const genres = params.get("genres");
  if (genres) {
    filters.genres = genres.split(",").map(Number);
  }

  const year = params.get("year");
  if (year) {
    filters.year = parseInt(year);
  }

  const rating = params.get("rating");
  if (rating) {
    filters.rating = parseInt(rating);
  }

  const sortBy = params.get("sortBy") as SortBy;
  if (sortBy) {
    filters.sortBy = sortBy;
  }

  const sortOrder = params.get("sortOrder") as SortOrder;
  if (sortOrder) {
    filters.sortOrder = sortOrder;
  }

  const watchStatus = params.get("watchStatus") as WatchStatus;
  if (watchStatus) {
    filters.watchStatus = watchStatus;
  }

  const page = params.get("page");
  if (page) {
    filters.page = parseInt(page);
  }

  const limit = params.get("limit");
  if (limit) {
    filters.limit = parseInt(limit);
  }

  return filters;
}
