<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { toastStore, type Toast } from '$lib/stores/toast';

  let toasts: Toast[] = [];
  toastStore.subscribe(value => {
    toasts = value;
  });

  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  function removeToast(id: string) {
    toastStore.remove(id);
  }
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {#each toasts as toast (toast.id)}
    <div
      class="flex items-center gap-3 min-w-[300px] max-w-md p-4 text-white rounded-lg shadow-lg"
      class:bg-green-500={toast.type === 'success'}
      class:bg-red-500={toast.type === 'error'}
      class:bg-yellow-500={toast.type === 'warning'}
      class:bg-blue-500={toast.type === 'info'}
      transition:fly={{ y: 50, duration: 200 }}
      role="alert"
    >
      <div class="flex-shrink-0">
        {@html icons[toast.type]}
      </div>
      <p class="flex-1">{toast.message}</p>
      <button
        class="flex-shrink-0 hover:opacity-75"
        on:click={() => removeToast(toast.id)}
        aria-label="Close notification"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/each}
</div>
