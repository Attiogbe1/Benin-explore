<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatPrix } from '$lib/utils/format.js';

  let services   = $state([]);
  let isLoading  = $state(true);
  let search     = $state('');
  let typeFilter = $state('');
  let deletingId = $state(null);

  const typeLabels = {
    HEBERGEMENT: '🏨 Hébergement',
    TRANSPORT:   '🚗 Transport',
    GUIDE:       '🧭 Guide',
    ACTIVITE:    '🎯 Activité',
    RESTAURANT:  '🍽️ Restaurant'
  };

  const typeColors = {
    HEBERGEMENT: '#0D3B5C',
    TRANSPORT:   '#1E5738',
    GUIDE:       '#7C3AED',
    ACTIVITE:    '#E8982A',
    RESTAURANT:  '#DC2626'
  };

  onMount(async () => {
    try {
      const res = await adminApi.services();
      services   = Array.isArray(res) ? res : (res?.services ?? []);
    } catch { toastStore.error('Erreur chargement services'); }
    finally   { isLoading = false; }
  });

  async function deleteService(id) {
    if (deletingId !== id) { deletingId = id; return; }
    try {
      await adminApi.deleteService(id);
      services   = services.filter(s => s.id !== id);
      deletingId = null;
      toastStore.success('Service supprimé');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur suppression');
      deletingId = null;
    }
  }

  const filtered = $derived(services.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || s.nomFr?.toLowerCase().includes(q)
      || s.provider?.nomEntreprise?.toLowerCase().includes(q);
    const matchType = !typeFilter || s.type === typeFilter;
    return matchSearch && matchType;
  }));
</script>

<svelte:head><title>Services — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>Services <span class="count">({filtered.length})</span></h1>
    <div class="filters">
      <input class="search-input" placeholder="Nom, prestataire…" bind:value={search} />
      <select class="filter-select" bind:value={typeFilter}>
        <option value="">Tous les types</option>
        {#each Object.entries(typeLabels) as [val, lbl]}
          <option value={val}>{lbl}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if isLoading}
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  {:else}
    <div class="card table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Type</th>
            <th>Prestataire</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Réservations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as s}
            <tr>
              <td>
                <div class="svc-cell">
                  {#if s.images?.[0]}
                    <img src={s.images[0]} alt="" class="svc-thumb" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
                  {:else}
                    <div class="svc-thumb-ph" style="background:{typeColors[s.type]}18">
                      <span>{typeLabels[s.type]?.split(' ')[0]}</span>
                    </div>
                  {/if}
                  <div>
                    <div class="svc-name">{s.nomFr}</div>
                    {#if s.descriptionFr}
                      <div class="svc-desc-short">{s.descriptionFr.slice(0, 60)}…</div>
                    {/if}
                  </div>
                </div>
              </td>
              <td>
                <span class="type-chip" style="background:{typeColors[s.type]}18;color:{typeColors[s.type]}">
                  {typeLabels[s.type] ?? s.type}
                </span>
              </td>
              <td>{s.provider?.nomEntreprise ?? '—'}</td>
              <td><strong>{formatPrix(s.prix)}</strong></td>
              <td>
                <span class="status-dot" class:available={s.disponible}>
                  {s.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </td>
              <td style="text-align:center">{s._count?.reservations ?? 0}</td>
              <td>
                {#if deletingId === s.id}
                  <button class="btn-action btn-confirm" onclick={() => deleteService(s.id)}>✓</button>
                  <button class="btn-action" onclick={() => deletingId = null}>✕</button>
                {:else}
                  <button class="btn-action btn-del" onclick={() => deleteService(s.id)} title="Supprimer">🗑️</button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if filtered.length === 0}
        <div class="empty-table">Aucun service trouvé</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .admin-page h1 { margin: 0; }
  .page-header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap; }
  .count { font-size: var(--text-lg); color: var(--color-earth-light); font-weight: 400; }
  .filters { display: flex; gap: var(--space-3); }
  .search-input, .filter-select {
    padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border);
    border-radius: var(--radius-md); font-family: var(--font-body); font-size: var(--text-sm); background: white;
  }
  .search-input { min-width: 200px; }

  .table-card { overflow: hidden; padding: 0; }
  .admin-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
  .admin-table th {
    text-align: left; padding: var(--space-3) var(--space-4);
    background: var(--color-ivory); border-bottom: 2px solid var(--color-border);
    font-size: var(--text-xs); text-transform: uppercase; color: var(--color-earth-light); font-weight: 700;
  }
  .admin-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: var(--color-ivory); }

  .svc-cell { display: flex; align-items: center; gap: var(--space-3); }
  .svc-thumb {
    width: 48px; height: 40px; object-fit: cover;
    border-radius: var(--radius-sm); flex-shrink: 0;
  }
  .svc-thumb-ph {
    width: 48px; height: 40px; border-radius: var(--radius-sm); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  }
  .svc-name { font-weight: 600; }
  .svc-desc-short { font-size: 11px; color: var(--color-earth-light); margin-top: 2px; }
  .type-chip { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); white-space: nowrap; }
  .status-dot { font-size: var(--text-xs); font-weight: 600; color: #dc2626; }
  .status-dot.available { color: #16a34a; }

  .btn-action {
    padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm);
    border: 1px solid var(--color-border); background: white;
    font-size: 12px; cursor: pointer; font-family: var(--font-body); transition: var(--transition);
  }
  .btn-action:hover { background: var(--color-ivory-dark); }
  .btn-del:hover { background: #fee2e2; border-color: #fecaca; }
  .btn-confirm { color: #dc2626; border-color: #fecaca; font-size: 11px; font-weight: 700; }
  .btn-confirm:hover { background: #fee2e2; }
  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
</style>
