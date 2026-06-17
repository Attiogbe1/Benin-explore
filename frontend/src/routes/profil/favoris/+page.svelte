<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { favoritesApi } from '$lib/api/favorites.api.js';
  import SiteCard from '$lib/components/sites/SiteCard.svelte';

  let favorites = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    if (!authStore.isLoggedIn) return goto('/auth/login');
    try {
      favorites = await favoritesApi.list();
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head><title>Mes favoris — BeninExplore</title></svelte:head>

<div class="container favoris-page">
  <h1>❤️ Mes favoris</h1>
  {#if isLoading}
    <div class="sites-grid">
      {#each Array(4) as _}
        <div class="skeleton" style="height: 380px; border-radius: var(--radius-lg)"></div>
      {/each}
    </div>
  {:else if favorites.length === 0}
    <div class="empty-state">
      <p style="font-size: 3rem">🔍</p>
      <h3>Aucun favori pour l'instant</h3>
      <a href="/sites" class="btn btn-primary">Découvrir des sites</a>
    </div>
  {:else}
    <div class="sites-grid">
      {#each favorites as fav}
        <SiteCard site={fav.site} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .favoris-page { padding-block: var(--space-8); }
  .favoris-page h1 { margin-bottom: var(--space-8); }
  .sites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); }
  .empty-state { text-align: center; padding: var(--space-16); display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
</style>
