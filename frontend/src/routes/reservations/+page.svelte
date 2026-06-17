<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatPrix } from '$lib/utils/format.js';

  let services = $state([]);
  let isLoading = $state(true);
  let selectedType = $state('');

  const types = ['HEBERGEMENT', 'TRANSPORT', 'GUIDE', 'ACTIVITE', 'RESTAURANT'];
  const typeLabels = {
    HEBERGEMENT: '🏨 Hébergement', TRANSPORT: '🚗 Transport',
    GUIDE: '🧭 Guide', ACTIVITE: '🎯 Activité', RESTAURANT: '🍽️ Restaurant'
  };

  async function loadServices() {
    isLoading = true;
    try {
      const params = selectedType ? { type: selectedType } : {};
      const res = await api.get('/services', params);
      services = res.data;
    } finally {
      isLoading = false;
    }
  }

  onMount(loadServices);
</script>

<svelte:head><title>Réservations — BeninExplore</title></svelte:head>

<div class="page-header">
  <div class="container">
    <h1>Réservez vos services</h1>
    <p>Guides locaux, hébergements, transports et activités</p>
  </div>
</div>

<div class="container resa-index">
  <div class="type-filters">
    <button class="type-btn" class:active={!selectedType} onclick={() => { selectedType = ''; loadServices(); }}>
      Tous
    </button>
    {#each types as type}
      <button class="type-btn" class:active={selectedType === type} onclick={() => { selectedType = type; loadServices(); }}>
        {typeLabels[type]}
      </button>
    {/each}
  </div>

  {#if isLoading}
    <div class="services-grid">
      {#each Array(8) as _}
        <div class="skeleton" style="height: 300px; border-radius: var(--radius-lg)"></div>
      {/each}
    </div>
  {:else if services.length === 0}
    <div class="empty-state">
      <p style="font-size: 3rem">🔍</p>
      <h3>Aucun service disponible</h3>
    </div>
  {:else}
    <div class="services-grid">
      {#each services as service}
        <div class="service-card card">
          {#if service.images?.[0]}
            <img src={service.images[0]} alt={service.nomFr} class="service-img" />
          {:else}
            <div class="service-img-placeholder">{typeLabels[service.type]?.[0]}</div>
          {/if}
          <div class="service-body">
            <span class="type-badge">{typeLabels[service.type]}</span>
            <h3>{service.nomFr}</h3>
            <p class="service-provider">🏢 {service.provider?.nomEntreprise}</p>
            <p class="service-desc">{service.descriptionFr?.slice(0, 80)}…</p>
            <div class="service-footer">
              <span class="service-price">{formatPrix(service.prix)}</span>
              {#if service.duree}
                <span class="service-duration">⏱ {Math.floor(service.duree / 60)}h{service.duree % 60 > 0 ? service.duree % 60 + 'min' : ''}</span>
              {/if}
            </div>
            <a href="/reservations/{service.id}" class="btn btn-primary btn-block" style="margin-top: var(--space-4)">
              Réserver
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page-header { background: var(--color-ocean); color: white; padding: var(--space-12) 0 var(--space-8); }
  .page-header h1 { color: white; margin-bottom: var(--space-2); }
  .page-header p { opacity: 0.8; }
  .resa-index { padding-block: var(--space-8); }
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
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); }
  .service-img { height: 180px; width: 100%; object-fit: cover; }
  .service-img-placeholder { height: 180px; background: var(--color-ivory-dark); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
  .service-body { padding: var(--space-5); }
  .type-badge { font-size: var(--text-xs); font-weight: 700; color: var(--color-ocean); }
  .service-body h3 { font-size: var(--text-xl); margin: var(--space-2) 0; }
  .service-provider { font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-2); }
  .service-desc { font-size: var(--text-sm); color: var(--color-earth-medium); }
  .service-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-3); }
  .service-price { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; color: var(--color-ocean); }
  .service-duration { font-size: var(--text-sm); color: var(--color-earth-light); }
  .btn-block { width: 100%; justify-content: center; }
  .empty-state { text-align: center; padding: var(--space-16); }
</style>
