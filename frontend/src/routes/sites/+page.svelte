<script>
  import { onMount } from 'svelte';
  import SiteCard from '$lib/components/sites/SiteCard.svelte';
  import { sitesApi } from '$lib/api/sites.api.js';
  import { filtersStore } from '$lib/stores/filters.store.svelte.js';

  let sites = $state([]);
  let total = $state(0);
  let page = $state(1);
  let totalPages = $state(1);
  let isLoading = $state(true);
  let categories = $state([]);
  let regions = $state([]);

  async function loadSites() {
    isLoading = true;
    try {
      const res = await sitesApi.list({ ...filtersStore.params, page, limit: 12 });
      sites = res.data;
      total = res.total;
      totalPages = res.totalPages;
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    const [catsRes, regsRes] = await Promise.all([sitesApi.categories(), sitesApi.regions()]);
    categories = catsRes;
    regions = regsRes;
    await loadSites();
  });

  async function handleSearch(e) {
    e.preventDefault();
    page = 1;
    await loadSites();
  }
</script>

<svelte:head>
  <title>Destinations — BeninExplore</title>
</svelte:head>

<div class="page-header">
  <div class="container">
    <h1>Toutes les destinations</h1>
    <p>{total} site{total > 1 ? 's' : ''} touristique{total > 1 ? 's' : ''} au Bénin</p>
  </div>
</div>

<div class="container page-content">
  <!-- Filtres -->
  <form class="filters-bar" onsubmit={handleSearch}>
    <input
      type="search"
      class="form-input search-input"
      placeholder="Rechercher un site, une ville..."
      value={filtersStore.search}
      oninput={(e) => filtersStore.setSearch(e.target.value)}
    />
    <select class="form-input" onchange={(e) => { filtersStore.setCategorie(e.target.value); loadSites(); }}>
      <option value="">Toutes catégories</option>
      {#each categories as cat}
        <option value={cat.slug}>{cat.nomFr}</option>
      {/each}
    </select>
    <select class="form-input" onchange={(e) => { filtersStore.setRegion(e.target.value); loadSites(); }}>
      <option value="">Toutes régions</option>
      {#each regions as reg}
        <option value={reg.slug}>{reg.nomFr}</option>
      {/each}
    </select>
    <select class="form-input" onchange={(e) => { filtersStore.setSort(e.target.value); loadSites(); }}>
      <option value="popularite">Plus populaires</option>
      <option value="note">Mieux notés</option>
      <option value="recent">Récents</option>
      <option value="nom">A → Z</option>
    </select>
    <label class="filter-check">
      <input type="checkbox" checked={filtersStore.gratuit} onchange={(e) => { filtersStore.setGratuit(e.target.checked); loadSites(); }} />
      Gratuit
    </label>
    <button type="submit" class="btn btn-primary">Rechercher</button>
  </form>

  <!-- Grille sites -->
  {#if isLoading}
    <div class="sites-grid">
      {#each Array(12) as _}
        <div class="skeleton" style="height: 380px; border-radius: var(--radius-lg)"></div>
      {/each}
    </div>
  {:else if sites.length === 0}
    <div class="empty-state">
      <p class="empty-icon">🔍</p>
      <h3>Aucun site trouvé</h3>
      <p>Essayez d'autres filtres</p>
      <button class="btn btn-outline" onclick={() => { filtersStore.reset(); loadSites(); }}>Réinitialiser</button>
    </div>
  {:else}
    <div class="sites-grid">
      {#each sites as site, i}
        <SiteCard {site} delay={i * 70} />
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        <button class="btn btn-outline" disabled={page === 1} onclick={() => { page--; loadSites(); }}>← Précédent</button>
        <span>Page {page} / {totalPages}</span>
        <button class="btn btn-outline" disabled={page === totalPages} onclick={() => { page++; loadSites(); }}>Suivant →</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .page-header {
    background: var(--color-ocean); color: white;
    padding: var(--space-12) 0 var(--space-8);
  }
  .page-header h1 { color: white; margin-bottom: var(--space-2); }
  .page-header p { opacity: 0.8; }
  .page-content { padding-block: var(--space-8); }
  .filters-bar {
    display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;
    padding: var(--space-5); background: white; border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm); margin-bottom: var(--space-8);
  }
  .search-input { flex: 1; min-width: 200px; }
  .filter-check { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); cursor: pointer; white-space: nowrap; }
  .sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-6);
  }
  .empty-state { text-align: center; padding: var(--space-16); }
  .empty-icon { font-size: 3rem; margin-bottom: var(--space-4); }
  .pagination { display: flex; align-items: center; justify-content: center; gap: var(--space-6); margin-top: var(--space-10); }
  @media (max-width: 640px) {
    .filters-bar { flex-direction: column; }
    .search-input, .form-input { width: 100%; }
  }
</style>
