<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatPrix, formatDate } from '$lib/utils/format.js';

  let reservations = $state([]);
  let isLoading    = $state(true);
  let statusFilter = $state('');
  let search       = $state('');

  const statusLabels = {
    EN_ATTENTE: { label: 'En attente',  bg: '#fef9c3', color: '#854d0e' },
    CONFIRMEE:  { label: 'Confirmée',   bg: '#dcfce7', color: '#166534' },
    EN_COURS:   { label: 'En cours',    bg: '#dbeafe', color: '#1e40af' },
    TERMINEE:   { label: 'Terminée',    bg: '#f3f4f6', color: '#374151' },
    ANNULEE:    { label: 'Annulée',     bg: '#fee2e2', color: '#991b1b' },
    REFUSEE:    { label: 'Refusée',     bg: '#fee2e2', color: '#991b1b' }
  };

  onMount(async () => {
    try {
      const res = await adminApi.reservations();
      reservations = Array.isArray(res) ? res : (res?.reservations ?? []);
    } catch { toastStore.error('Erreur chargement réservations'); }
    finally   { isLoading = false; }
  });

  const filtered = $derived(reservations.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.user?.prenom?.toLowerCase().includes(q)
      || r.user?.nom?.toLowerCase().includes(q)
      || r.service?.nomFr?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.statut === statusFilter;
    return matchSearch && matchStatus;
  }));

  const total = $derived(filtered.reduce((s, r) => s + (r.prixTotal ?? 0), 0));
</script>

<svelte:head><title>Réservations — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <div>
      <h1>Réservations <span class="count">({filtered.length})</span></h1>
      {#if filtered.length > 0}
        <p class="total-revenus">Total : <strong>{formatPrix(total)}</strong></p>
      {/if}
    </div>
    <div class="filters">
      <input class="search-input" placeholder="Chercher client ou service…" bind:value={search} />
      <select class="filter-select" bind:value={statusFilter}>
        <option value="">Tous les statuts</option>
        {#each Object.entries(statusLabels) as [val, { label }]}
          <option value={val}>{label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Status counters -->
  <div class="status-counts">
    {#each Object.entries(statusLabels) as [val, { label, bg, color }]}
      {@const cnt = reservations.filter(r => r.statut === val).length}
      {#if cnt > 0}
        <button
          class="status-chip"
          style="background:{bg};color:{color}"
          class:active-filter={statusFilter === val}
          onclick={() => statusFilter = statusFilter === val ? '' : val}
        >
          {label} ({cnt})
        </button>
      {/if}
    {/each}
  </div>

  {#if isLoading}
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  {:else}
    <div class="card table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>Prestataire</th>
            <th>Date début</th>
            <th>Personnes</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Créée le</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as r}
            <tr>
              <td>
                <div class="user-mini">
                  <div class="mini-av">{r.user?.prenom?.[0]}{r.user?.nom?.[0]}</div>
                  <div>
                    <div>{r.user?.prenom} {r.user?.nom}</div>
                    {#if r.user?.telephone}<small>{r.user.telephone}</small>{/if}
                  </div>
                </div>
              </td>
              <td>{r.service?.nomFr ?? '—'}</td>
              <td>{r.service?.provider?.nomEntreprise ?? '—'}</td>
              <td>{r.dateDebut ? new Date(r.dateDebut).toLocaleDateString('fr-FR') : '—'}</td>
              <td style="text-align:center">{r.nombrePersonnes}</td>
              <td><strong>{formatPrix(r.prixTotal)}</strong></td>
              <td>
                <span class="status-badge" style="background:{statusLabels[r.statut]?.bg};color:{statusLabels[r.statut]?.color}">
                  {statusLabels[r.statut]?.label ?? r.statut}
                </span>
              </td>
              <td>{formatDate(r.createdAt)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if filtered.length === 0}
        <div class="empty-table">Aucune réservation trouvée</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .admin-page h1 { margin: 0; }
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4); flex-wrap: wrap; }
  .count { font-size: var(--text-lg); color: var(--color-earth-light); font-weight: 400; }
  .total-revenus { font-size: var(--text-sm); color: var(--color-earth-medium); margin: var(--space-1) 0 0; }
  .filters { display: flex; gap: var(--space-3); flex-wrap: wrap; }
  .search-input, .filter-select {
    padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border);
    border-radius: var(--radius-md); font-family: var(--font-body); font-size: var(--text-sm); background: white;
  }
  .search-input { min-width: 220px; }

  .status-counts { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-5); }
  .status-chip {
    padding: var(--space-1) var(--space-3); border-radius: var(--radius-full);
    font-size: var(--text-xs); font-weight: 700; cursor: pointer;
    border: 2px solid transparent; transition: var(--transition);
  }
  .status-chip.active-filter { border-color: currentColor; }

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

  .user-mini { display: flex; align-items: center; gap: var(--space-2); }
  .mini-av {
    width: 30px; height: 30px; border-radius: 50%; background: var(--color-ocean);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .mini-av + div small { font-size: var(--text-xs); color: var(--color-earth-light); }

  .status-badge {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full);
  }
  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
</style>
