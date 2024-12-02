<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let type: 'movie' | 'tv';
  export let selectedSort = 'trending';
  export let selectedGenre = '';
  export let selectedYear = '';

  const dispatch = createEventDispatcher<{
    filter: { sort: string; genre: string; year: string };
  }>();

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'now_playing', label: type === 'movie' ? 'Now Playing' : 'Currently Airing' },
    { value: 'upcoming', label: type === 'movie' ? 'Upcoming' : 'Upcoming Shows' }
  ];

  const genres = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science Fiction' },
    { id: '10770', name: 'TV Movie' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  function handleChange() {
    dispatch('filter', {
      sort: selectedSort,
      genre: selectedGenre,
      year: selectedYear
    });
  }
</script>

<div class="bg-gray-800 rounded-lg p-4 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label for="sort" class="block text-sm font-medium text-gray-300 mb-2">
        Sort By
      </label>
      <select
        id="sort"
        bind:value={selectedSort}
        on:change={handleChange}
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {#each sortOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="genre" class="block text-sm font-medium text-gray-300 mb-2">
        Genre
      </label>
      <select
        id="genre"
        bind:value={selectedGenre}
        on:change={handleChange}
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Genres</option>
        {#each genres as genre}
          <option value={genre.id}>{genre.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="year" class="block text-sm font-medium text-gray-300 mb-2">
        Year
      </label>
      <select
        id="year"
        bind:value={selectedYear}
        on:change={handleChange}
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Years</option>
        {#each years as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
