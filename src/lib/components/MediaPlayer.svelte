<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let title: string;
  export let autoplay = false;
  export let controls = true;
  export let muted = false;

  let player: HTMLVideoElement;
  let volume = 1;

  onMount(() => {
    if (player) {
      player.volume = volume;
    }
  });

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        if (player) {
          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (player) player.currentTime -= 5;
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (player) player.currentTime += 5;
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (player) player.volume = Math.min(1, player.volume + 0.1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (player) player.volume = Math.max(0, player.volume - 0.1);
        break;
    }
  }
</script>

<div
  class="relative w-full h-full bg-black focus:outline-none focus:ring-2 focus:ring-primary-500"
  on:keydown={handleKeyDown}
  role="application"
  aria-label="Video player for {title}"
>
  <video
    bind:this={player}
    {src}
    class="w-full h-full"
    {autoplay}
    {controls}
    {muted}
  >
    <track kind="captions" />
  </video>
</div>
