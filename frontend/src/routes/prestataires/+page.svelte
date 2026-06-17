<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client.js';
  import { formatPrix } from '$lib/utils/format.js';

  let providers = $state([]);
  let isLoading = $state(true);
  let selectedType = $state('');
  let search = $state('');
  let searchInput = $state('');

  const types = [
    { value: '',            label: 'Tous'          },
    { value: 'HEBERGEMENT', label: '🏨 Hébergement' },
    { value: 'RESTAURANT',  label: '🍽️ Restaurant'  },
    { value: 'GUIDE',       label: '🧭 Guide'       },
    { value: 'TRANSPORT',   label: '🚗 Transport'   },
    { value: 'ACTIVITE',    label: '🎯 Activité'    }
  ];

  const typeColors = {
    HEBERGEMENT: '#0D3B5C', RESTAURANT: '#C4622D',
    GUIDE: '#2d7a4f', TRANSPORT: '#7c3aed', ACTIVITE: '#E8982A'
  };

  async function load() {
    isLoading = true;
    try {
      const params = {};
      if (selectedType) params.type = selectedType;
      if (search) params.search = search;
      const res = await api.get('/providers', params);
      providers = res.data ?? [];
    } catch {
      providers = [];
    } finally {
      isLoading = false;
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    search = searchInput;
    load();
  }

  onMount(load);

  function minPrix(services) {
    if (!services?.length) return null;
    return Math.min(...services.map(s => s.prix));
  }
</script>

<svelte:head><title>Prestataires — BeninExplore</title></svelte:head>

<div class="prest-hero">
  <div class="container hero-inner">
    <h1>Services touristiques du Bénin</h1>
    <p>Hébergements, guides, restaurants et activités — des prestataires locaux de confiance</p>
    <form class="search-bar" onsubmit={handleSearch}>
      <input
        class="search-input"
        bind:value={searchInput}
        placeholder="Rechercher un prestataire, une activité…"
      />
      <button type="submit" class="btn btn-primary">Rechercher</button>
    </form>
  </div>
</div>

<div class="container prest-page">
  <div class="type-filters">
    {#each types as t}
      <button
        class="type-btn"
        class:active={selectedType === t.value}
        onclick={() => { selectedType = t.value; load(); }}
      >{t.label}</button>
    {/each}
  </div>

  {#if isLoading}
    <div class="providers-grid">
      {#each Array(6) as _}
        <div class="skeleton" style="height:320px;border-radius:var(--radius-lg)"></div>
      {/each}
    </div>
  {:else if providers.length === 0}
    <div class="empty-state">
      <p style="font-size:3rem">🔍</p>
      <h3>Aucun prestataire trouvé</h3>
      <p>Essayez un autre filtre ou <a href="/devenir-prestataire">devenez prestataire</a> !</p>
    </div>
  {:else}
    <div class="providers-grid">
      {#each providers as provider}
        <a href="/prestataires/{provider.id}" class="provider-card card">
          <div class="provider-header">
            {#if provider.logo}
              <img src={provider.logo} alt={provider.nomEntreprise} class="provider-logo" referrerpolicy="no-referrer" />
            {:else}
              <div class="provider-logo-placeholder">{provider.nomEntreprise[0]}</div>
            {/if}
            <div>
              <h3>{provider.nomEntreprise}</h3>
              {#if provider.estVerifie}
                <span class="verified-badge">✓ Vérifié</span>
              {/if}
            </div>
          </div>
          <p class="provider-desc">{provider.descriptionFr?.slice(0, 100)}…</p>
          <div class="service-tags">
            {#each [...new Set(provider.services?.map(s => s.type) ?? [])] as type}
              <span class="service-tag" style="background:{typeColors[type]}20;color:{typeColors[type]}">
                {types.find(t => t.value === type)?.label ?? type}
              </span>
            {/each}
          </div>
          {#if minPrix(provider.services) !== null}
            <div class="provider-prix">
              À partir de <strong>{formatPrix(minPrix(provider.services))}</strong>
            </div>
          {/if}
          <div class="provider-cta">Voir les services →</div>
        </a>
      {/each}
    </div>
  {/if}

  <!-- CTA devenir prestataire -->
  <div class="become-banner">
    <div>
      <h3>Vous avez un service touristique à proposer ?</h3>
      <p>Rejoignez des dizaines de prestataires et touchez des milliers de voyageurs au Bénin.</p>
    </div>
    <a href="/devenir-prestataire" class="btn btn-primary btn-lg">Devenir prestataire →</a>
  </div>
</div>

<style>
  .prest-hero {
    background: linear-gradient(135deg, var(--color-ocean-dark), var(--color-ocean));
    color: white;
    padding: calc(var(--nav-h) + var(--space-12)) 0 var(--space-12);
    text-align: center;
  }
  .hero-inner { max-width: 640px; margin: 0 auto; }
  .prest-hero h1 { color: white; font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: var(--space-3); }
  .prest-hero p { opacity: 0.85; font-size: var(--text-lg); margin-bottom: var(--space-6); }
  .search-bar { display: flex; gap: var(--space-2); }
  .search-input {
    flex: 1; padding: var(--space-3) var(--space-5);
    border: none; border-radius: var(--radius-full);
    font-size: var(--text-base); font-family: var(--font-body);
    outline: none;
  }
  .search-input:focus { box-shadow: 0 0 0 3px rgba(232,152,42,0.5); }

  .prest-page { padding-block: var(--space-8); }
  .type-filters { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-8); }
  .type-btn {
    padding: var(--space-2) var(--space-5);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-full);
    background: white; cursor: pointer;
    font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
    transition: var(--transition);
  }
  .type-btn:hover { border-color: var(--color-ocean); color: var(--color-ocean); }
  .type-btn.active { background: var(--color-ocean); color: white; border-color: var(--color-ocean); }

  .providers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-12);
  }
  .provider-card {
    display: flex; flex-direction: column; gap: var(--space-4);
    padding: var(--space-6);
    text-decoration: none; color: inherit;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .provider-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .provider-header { display: flex; align-items: center; gap: var(--space-4); }
  .provider-logo { width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0; }
  .provider-logo-placeholder {
    width: 56px; height: 56px; border-radius: var(--radius-md);
    background: var(--color-ocean); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--text-2xl); font-weight: 700; flex-shrink: 0;
  }
  .provider-header h3 { font-size: var(--text-lg); margin-bottom: 4px; }
  .verified-badge { font-size: 11px; font-weight: 600; color: #22c55e; }
  .provider-desc { font-size: var(--text-sm); color: var(--color-earth-medium); flex: 1; }
  .service-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .service-tag {
    font-size: 11px; font-weight: 600;
    padding: 2px var(--space-3); border-radius: var(--radius-full);
  }
  .provider-prix { font-size: var(--text-sm); color: var(--color-earth-light); }
  .provider-prix strong { font-family: var(--font-display); font-size: var(--text-lg); color: var(--color-ocean); }
  .provider-cta { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); }

  .empty-state { text-align: center; padding: var(--space-16); }
  .empty-state a { color: var(--color-ocean); }

  .become-banner {
    display: flex; justify-content: space-between; align-items: center;
    gap: var(--space-6);
    background: linear-gradient(135deg, var(--color-gold) 0%, #f59e0b 100%);
    border-radius: var(--radius-xl);
    padding: var(--space-8) var(--space-10);
    color: var(--color-ocean-dark);
    margin-top: var(--space-8);
  }
  .become-banner h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); }
  .become-banner p { font-size: var(--text-sm); opacity: 0.85; }
  .btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-base); white-space: nowrap; }

  @media (max-width: 640px) {
    .search-bar { flex-direction: column; }
    .become-banner { flex-direction: column; text-align: center; }
  }
</style>
