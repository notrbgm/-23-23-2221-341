import { browser } from "$app/environment";
import { get } from "svelte/store";
import { providerUrls } from "$lib/stores/provider-urls";

export interface Provider {
  id: string;
  name: string;
  getEmbedUrl: (
    mediaId: string | number,
    type: "movie" | "tv",
    season?: number,
    episode?: number,
  ) => string;
}

export const providers: Provider[] = [
  {
    id: "vidsrc",
    name: "VidSrc",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls);
      if (!urls) return "";

      if (type === "movie") {
        return `${urls.vidsrc}/movie/${mediaId}?autoPlay=true`;
      } else {

        if (typeof season !== "undefined" && typeof episode !== "undefined") {
          return `${urls.vidsrc}/tv/${mediaId}/${season}/${episode}?autoPlay=true&autoNext=true`;
        }
        return `${urls.vidsrc}/tv/${mediaId}?autoPlay=true`;
      }
    },
  },
  {
    id: "vidsrcpro",
    name: "VidSrc Pro",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls);
      if (!urls) return "";

      if (type === "movie") {
        return `${urls.vidsrcpro}/movie/${mediaId}`;
      } else {

        if (typeof season !== "undefined" && typeof episode !== "undefined") {
          return `${urls.vidsrcpro}/tv/${mediaId}/${season}/${episode}`;
        }
        return `${urls.vidsrcpro}/tv/${mediaId}`;
      }
    },
  },
  {
    id: "embedsu",
    name: "Embed.su",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls);
      if (!urls) return "";

      if (type === "movie") {
        return `${urls.embedsu}/movie/${mediaId}`;
      } else {

        if (typeof season !== "undefined" && typeof episode !== "undefined") {
          return `${urls.embedsu}/tv/${mediaId}/${season}/${episode}`;
        }
        return `${urls.embedsu}/tv/${mediaId}`;
      }
    },
  },
];

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getDefaultProvider(): Provider {
  if (!browser) {
    return providers[0];
  }

  const savedProvider = localStorage.getItem("selectedProvider");
  if (savedProvider) {
    const provider = providers.find((p) => p.id === savedProvider);
    if (provider) return provider;
  }

  return providers.find((p) => p.id === "vidsrc") || providers[0];
}
