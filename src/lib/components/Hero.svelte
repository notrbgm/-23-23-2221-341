<script lang="ts">
  import { onMount } from 'svelte';
  import type { TMDBMediaResponse } from '$lib/types/tmdb';

  export let media: TMDBMediaResponse;
  export let type: 'movie' | 'tv';

  let backdropUrl = '';

  $: if (media?.backdrop_path) {
    backdropUrl = `/api/image/original${media.backdrop_path}`;
  }

  $: title = type === 'movie' ? media?.title : media?.name;
  $: href = `/media/${media?.id}?type=${type}`;
</script>

<div class="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
  {#if backdropUrl}
    <div class="absolute inset-0">
      <img
        src={backdropUrl}
        alt={title}
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80"></div>
    </div>
  {/if}

  <div class="absolute inset-0 flex items-end">
    <div class="container mx-auto px-4 pb-16">
      <div class="max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {#if media?.overview}
          <p class="text-lg text-gray-300 mb-6 line-clamp-3">
            {media.overview}
          </p>
        {/if}
        <div class="flex items-center gap-4">
          <a
            {href}
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Now
          </a>
          <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/80 text-white">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="font-bold">{media?.vote_average?.toFixed(1) || '0.0'}</span>
            <span class="text-gray-400">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
