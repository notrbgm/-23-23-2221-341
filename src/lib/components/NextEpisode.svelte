<script lang="ts">
  import { onMount } from 'svelte';

  export let mediaId: number;
  export let currentSeason: number;
  export let currentEpisode: number;
  export let onSelect: (season: number, episode: number) => void;

  interface Episode {
    name: string;
    episode_number: number;
    season_number?: number;
  }

  interface Season {
    season_number: number;
  }

  let nextEpisode: Episode | null = null;
  let loading = true;

  async function loadNextEpisode() {
    loading = true;
    try {

      const response = await fetch(`/api/tv/${mediaId}/season/${currentSeason}`);
      if (response.ok) {
        const data = await response.json();
        const episodes = data.episodes || [];
        const nextInSeason = episodes.find((ep: Episode) => ep.episode_number === currentEpisode + 1);

        if (nextInSeason) {
          nextEpisode = { ...nextInSeason, season_number: currentSeason };
        } else {

          const seasonsResponse = await fetch(`/api/tv/${mediaId}/seasons`);
          if (seasonsResponse.ok) {
            const seasonsData = await seasonsResponse.json();
            const seasons = seasonsData.seasons.filter((s: Season) => s.season_number > 0);
            const nextSeason = seasons.find((s: Season) => s.season_number === currentSeason + 1);

            if (nextSeason) {
              const nextSeasonResponse = await fetch(`/api/tv/${mediaId}/season/${nextSeason.season_number}`);
              if (nextSeasonResponse.ok) {
                const nextSeasonData = await nextSeasonResponse.json();
                const firstEpisode = nextSeasonData.episodes[0];
                if (firstEpisode) {
                  nextEpisode = { ...firstEpisode, season_number: nextSeason.season_number };
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading next episode:', error);
    } finally {
      loading = false;
    }
  }

  function handleNextEpisode() {
    if (nextEpisode && nextEpisode.season_number) {
      onSelect(nextEpisode.season_number, nextEpisode.episode_number);
    }
  }

  onMount(() => {
    if (mediaId && currentSeason && currentEpisode) {
      loadNextEpisode();
    }
  });

  $: if (mediaId && currentSeason && currentEpisode) {
    if (typeof window !== 'undefined') {
      loadNextEpisode();
    }
  }
</script>

{#if !loading && nextEpisode}
  <button
    class="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors whitespace-nowrap flex items-center gap-2"
    on:click={handleNextEpisode}
  >
    <span>Next: {nextEpisode.season_number !== currentSeason ? `S${nextEpisode.season_number}E${nextEpisode.episode_number}` : `E${nextEpisode.episode_number}`}</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
{/if}
