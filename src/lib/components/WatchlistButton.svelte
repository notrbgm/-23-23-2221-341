<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { watchlistStore } from '$lib/stores/watchlist';
  import { toastStore } from '$lib/stores/toast';
  import { authStore } from '$lib/stores/auth';

  export let id: number;
  export let type: string;
  export let title: string;
  export let posterPath: string | null;
  export let voteAverage: number;

  let inWatchlist = false;
  let loading = false;
  let mounted = false;

  async function checkWatchlistStatus() {
    if (!browser || !mounted || !$authStore.user) return;

    try {
      inWatchlist = await watchlistStore.isInWatchlist(id, type);
    } catch (error) {
      console.error('Failed to check watchlist status:', error);
    }
  }

  async function toggleWatchlist() {
    if (loading || !$authStore.user) {
      if (!$authStore.user) {
        toastStore.error('Please login to add to watchlist');
      }
      return;
    }

    loading = true;

    try {
      if (inWatchlist) {
        await watchlistStore.removeFromWatchlist(id, type);
        toastStore.success('Removed from watchlist');
      } else {
        await watchlistStore.addToWatchlist(id, type, title, posterPath, voteAverage);
        toastStore.success('Added to watchlist');
      }
      inWatchlist = !inWatchlist;
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      toastStore.error('Failed to update watchlist');
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    mounted = true;
    checkWatchlistStatus();
  });

  $: if ($authStore.user) {
    checkWatchlistStatus();
  }
</script>

<button
  type="button"
  class="p-2 rounded-full bg-gray-900/80 hover:bg-gray-900 transition-colors"
  on:click={toggleWatchlist}
  disabled={loading}
  aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
>
  <svg
    class="w-5 h-5"
    class:text-primary-400={inWatchlist}
    class:text-gray-400={!inWatchlist}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    {#if inWatchlist}
      <path
        d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
      />
    {:else}
      <path
        d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    {/if}
  </svg>
</button>
