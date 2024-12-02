<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string | null;
  export let alt: string;
  export let class_ = '';
  export let sizes = '100vw';

  let loaded = false;
  let error = false;
  let imageElement: HTMLImageElement;

  const placeholder = '/placeholder.jpg';

  function generateSrcSet(path: string): string {
    const widths = [300, 500, 700, 900, 1100];
    return widths
      .map(width => {
        const size = width <= 500 ? 'w500' : width <= 700 ? 'w780' : 'original';
        return `/api/image/${size}${path} ${width}w`;
      })
      .join(', ');
  }

  $: finalSrc = src ? `/api/image/w500${src}` : placeholder;
  $: srcset = src ? generateSrcSet(src) : '';

  function handleLoad() {
    loaded = true;
  }

  function handleError() {
    error = true;
    if (imageElement) {
      imageElement.src = placeholder;
    }
  }

  $: if (src) {
    loaded = false;
    error = false;
  }
</script>

<div class="relative overflow-hidden {class_}">
  <img
    bind:this={imageElement}
    src={finalSrc}
    {srcset}
    {sizes}
    {alt}
    class="w-full h-full object-cover transition-opacity duration-300"
    class:opacity-0={!loaded}
    class:opacity-100={loaded}
    loading="lazy"
    on:load={handleLoad}
    on:error={handleError}
  />

  {#if !loaded}
    <div class="absolute inset-0 bg-gray-800 animate-pulse"></div>
  {/if}
</div>
