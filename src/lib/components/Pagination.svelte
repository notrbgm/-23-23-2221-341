<script lang="ts">
  import { filters } from '$lib/stores/filters';

  export let totalPages: number;
  export let currentPage: number;
  export let onPageChange: (page: number) => void;

  $: pages = generatePageNumbers(currentPage, totalPages);

  function generatePageNumbers(current: number, total: number) {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }


    pages.push(1);


    let start = Math.max(2, current - 2);
    let end = Math.min(total - 1, current + 2);


    if (current <= 4) {
      end = 5;
    }


    if (current >= total - 3) {
      start = total - 4;
    }


    if (start > 2) {
      pages.push('...');
    }


    for (let i = start; i <= end; i++) {
      pages.push(i);
    }


    if (end < total - 1) {
      pages.push('...');
    }


    pages.push(total);

    return pages;
  }

  function handlePageChange(page: number) {
    if (page === currentPage) return;
    onPageChange(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<nav class="flex justify-center mt-8" aria-label="Pagination">
  <ul class="flex items-center gap-1">
    <!-- Previous Button -->
    <li>
      <button
        class="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        on:click={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </li>

    <!-- Page Numbers -->
    {#each pages as page}
      <li>
        {#if typeof page === 'string'}
          <span class="px-4 py-2 text-gray-400">
            {page}
          </span>
        {:else}
          <button
            class="min-w-[40px] px-4 py-2 rounded-lg {currentPage === page
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'}"
            on:click={() => handlePageChange(page)}
            aria-label="Page {page}"
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        {/if}
      </li>
    {/each}

    <!-- Next Button -->
    <li>
      <button
        class="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        on:click={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </li>
  </ul>
</nav>

{#if totalPages > 1}
  <div class="text-center mt-2 text-sm text-gray-400">
    Page {currentPage} of {totalPages}
  </div>
{/if}
