import { browser } from "$app/environment";
import { watchlistStore } from "$lib/stores/watchlist";
import { authStore } from "$lib/stores/auth";
import { get } from "svelte/store";

export const load = async () => {
  if (browser) {
    const auth = get(authStore);
    if (auth.user) {
      try {
        await watchlistStore.getWatchlist();
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      }
    } else {

      watchlistStore.reset();
    }
  }
};
