<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let identifier = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleSubmit() {
    if (!identifier || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    error = '';

    try {
      const success = await authStore.login(identifier, password);
      if (success) {
        goto('/');
      } else {
        error = 'Invalid username/email or password';
      }
    } catch (err) {
      error = 'An error occurred during login';
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-center mb-8">Login</h1>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if error}
          <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        {/if}

        <div>
          <label for="identifier" class="block text-sm font-medium text-gray-300 mb-2">
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            bind:value={identifier}
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
            placeholder="Enter your username or email"
            autocomplete="username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>

        <div class="flex items-center justify-between">
          <a href="/reset-password" class="text-sm text-primary-400 hover:text-primary-300">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div class="text-center text-sm text-gray-400">
          Don't have an account?
          <a href="/register" class="text-primary-400 hover:text-primary-300">
            Register
          </a>
        </div>
      </form>
    </div>
  </div>
</div>
