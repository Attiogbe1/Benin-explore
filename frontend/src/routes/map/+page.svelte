<script>
  import { onMount, onDestroy } from 'svelte';
  import { sitesApi } from '$lib/api/sites.api.js';

  let mapContainer;
  let map;
  let sites = $state([]);
  let selectedSite = $state(null);

  onMount(async () => {
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    sites = await sitesApi.forMap();

    map = L.map(mapContainer, {
      center: [9.3, 2.3],
      zoom: 7,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const customIcon = (couleur) => L.divIcon({
      html: `<div style="background:${couleur || '#0D3B5C'};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    sites.forEach(site => {
      const marker = L.marker([site.latitude, site.longitude], {
        icon: customIcon(site.category?.couleur)
      }).addTo(map);

      marker.on('click', () => {
        selectedSite = site;
      });

      marker.bindTooltip(site.nomFr, { permanent: false, direction: 'top' });
    });
  });

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<svelte:head><title>Carte interactive — BeninExplore</title></svelte:head>

<div class="map-page">
  <div class="map-sidebar" class:has-site={selectedSite}>
    <div class="map-header">
      <h2>🗺️ Carte du Bénin</h2>
      <p>{sites.length} sites touristiques</p>
    </div>
    {#if selectedSite}
      <div class="site-preview card">
        <button class="close-preview" onclick={() => selectedSite = null}>✕</button>
        {#if selectedSite.imagesCouverture?.[0]}
          <img src={selectedSite.imagesCouverture[0]} alt={selectedSite.nomFr} class="preview-img" />
        {/if}
        <div class="preview-body">
          <span class="category-badge">{selectedSite.category?.nomFr}</span>
          <h3>{selectedSite.nomFr}</h3>
          <div class="stars">{'★'.repeat(Math.round(selectedSite.noteMoyenne))}{'☆'.repeat(5 - Math.round(selectedSite.noteMoyenne))}</div>
          <a href="/sites/{selectedSite.slug}" class="btn btn-primary btn-sm" style="margin-top: 0.75rem; display: inline-flex">
            Voir le détail →
          </a>
        </div>
      </div>
    {:else}
      <ul class="sites-list">
        {#each sites as site}
          <li>
            <button class="site-list-item" onclick={() => selectedSite = site}>
              <span class="site-dot" style="background: {site.category?.couleur || '#0D3B5C'}"></span>
              <span>{site.nomFr}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
  :global(body) { overflow: hidden; }
  .map-page {
    display: flex;
    height: calc(100vh - var(--nav-h));
    overflow: hidden;
  }
  .map-sidebar {
    width: 320px; flex-shrink: 0;
    background: var(--color-ivory); overflow-y: auto;
    border-right: 1px solid var(--color-border);
    display: flex; flex-direction: column;
  }
  .map-header { padding: var(--space-5); border-bottom: 1px solid var(--color-border); }
  .map-header h2 { font-size: var(--text-xl); margin-bottom: var(--space-1); }
  .map-header p { font-size: var(--text-sm); color: var(--color-earth-light); }
  .site-preview { margin: var(--space-4); position: relative; }
  .close-preview {
    position: absolute; top: 0.5rem; right: 0.5rem;
    background: rgba(0,0,0,0.4); color: white;
    border: none; width: 24px; height: 24px;
    border-radius: 50%; cursor: pointer; font-size: 0.7rem;
    z-index: 1;
  }
  .preview-img { height: 140px; width: 100%; object-fit: cover; }
  .preview-body { padding: var(--space-4); }
  .preview-body h3 { font-size: var(--text-lg); margin: var(--space-2) 0; }
  .stars { color: var(--color-gold); font-size: var(--text-sm); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
  .sites-list { list-style: none; padding: var(--space-3); }
  .site-list-item {
    display: flex; align-items: center; gap: var(--space-3);
    width: 100%; padding: var(--space-3) var(--space-2);
    background: none; border: none; cursor: pointer;
    text-align: left; font-family: var(--font-body); font-size: var(--text-sm);
    border-radius: var(--radius-sm); transition: var(--transition);
  }
  .site-list-item:hover { background: var(--color-ivory-dark); }
  .site-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .map-container { flex: 1; }
  @media (max-width: 768px) {
    .map-page { flex-direction: column; }
    .map-sidebar { width: 100%; height: 200px; }
    .map-container { flex: 1; }
  }
</style>
