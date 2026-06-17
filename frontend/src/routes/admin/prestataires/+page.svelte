<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatDate } from '$lib/utils/format.js';

  let providers  = $state([]);
  let isLoading  = $state(true);
  let search     = $state('');
  let verifFilter = $state('');
  let toggling   = $state(new Set());
  let deletingId = $state(null);

  onMount(async () => {
    try {
      const res = await adminApi.providers();
      providers  = Array.isArray(res) ? res : (res?.providers ?? []);
    } catch { toastStore.error('Erreur chargement prestataires'); }
    finally   { isLoading = false; }
  });

  async function toggleVerif(p) {
    toggling = new Set([...toggling, p.id]);
    try {
      await adminApi.verifyProvider(p.id, !p.estVerifie);
      providers = providers.map(pr => pr.id === p.id ? { ...pr, estVerifie: !pr.estVerifie } : pr);
      toastStore.success(p.estVerifie ? 'Vérification retirée' : 'Prestataire vérifié ✓');
    } catch { toastStore.error('Erreur'); }
    finally {
      toggling = new Set([...toggling].filter(id => id !== p.id));
    }
  }

  async function deleteProvider(id) {
    if (deletingId !== id) { deletingId = id; return; }
    try {
      await adminApi.deleteProvider(id);
      providers  = providers.filter(p => p.id !== id);
      deletingId = null;
      toastStore.success('Prestataire supprimé');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
      deletingId = null;
    }
  }

  const filtered = $derived(providers.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.nomEntreprise?.toLowerCase().includes(q)
      || p.email?.toLowerCase().includes(q)
      || p.telephone?.includes(q);
    const matchVerif = verifFilter === ''
      ? true
      : verifFilter === 'verifie' ? p.estVerifie : !p.estVerifie;
    return matchSearch && matchVerif;
  }));
</script>

<svelte:head><title>Prestataires — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>Prestataires <span class="count">({filtered.length})</span></h1>
    <div class="filters">
      <input class="search-input" placeholder="Nom, email, téléphone…" bind:value={search} />
      <select class="filter-select" bind:value={verifFilter}>
        <option value="">Tous</option>
        <option value="verifie">Vérifiés</option>
        <option value="en-attente">En attente</option>
      </select>
    </div>
  </div>

  <!-- Summary chips -->
  <div class="summary-chips">
    <span class="chip chip-green">{providers.filter(p => p.estVerifie).length} vérifiés</span>
    <span class="chip chip-orange">{providers.filter(p => !p.estVerifie).length} en attente</span>
    <span class="chip chip-blue">{providers.reduce((s, p) => s + (p._count?.services ?? 0), 0)} services publiés</span>
  </div>

  {#if isLoading}
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  {:else}
    <div class="providers-list">
      {#each filtered as p}
        <div class="provider-card card">
          <div class="prov-header">
            <div class="prov-avatar">{p.nomEntreprise?.[0] ?? '?'}</div>
            <div class="prov-info">
              <div class="prov-name-row">
                <h3>{p.nomEntreprise}</h3>
                {#if p.estVerifie}
                  <span class="verif-badge">✓ Vérifié</span>
                {:else}
                  <span class="pending-badge">⏳ En attente</span>
                {/if}
              </div>
              <div class="prov-meta">
                <span>📞 {p.telephone}</span>
                <span>📧 {p.email}</span>
                {#if p.adresse}<span>📍 {p.adresse}</span>{/if}
              </div>
            </div>
            <div class="prov-stats">
              <div class="prov-stat">
                <strong>{p._count?.services ?? 0}</strong>
                <span>Services</span>
              </div>
              <div class="prov-stat">
                <strong>{p._count?.reservations ?? 0}</strong>
                <span>Réservations</span>
              </div>
            </div>
          </div>
          {#if p.description}
            <p class="prov-desc">{p.description.slice(0, 120)}…</p>
          {/if}
          <div class="prov-actions">
            <a href={`/prestataires/${p.id}`} target="_blank" class="btn-action">👁 Voir la page</a>
            <button
              class="btn-action"
              class:btn-verify={!p.estVerifie}
              class:btn-unverify={p.estVerifie}
              disabled={toggling.has(p.id)}
              onclick={() => toggleVerif(p)}
            >
              {toggling.has(p.id) ? '…' : p.estVerifie ? '⚠ Retirer vérification' : '✓ Vérifier'}
            </button>
            {#if deletingId === p.id}
              <button class="btn-action btn-danger-action" onclick={() => deleteProvider(p.id)}>✓ Confirmer suppression</button>
              <button class="btn-action" onclick={() => deletingId = null}>✕ Annuler</button>
            {:else}
              <button class="btn-action btn-danger-action" onclick={() => deleteProvider(p.id)}>🗑️ Supprimer</button>
            {/if}
          </div>
          <div class="prov-date">Inscrit le {formatDate(p.createdAt)}</div>
        </div>
      {/each}
    </div>
    {#if filtered.length === 0}
      <div class="empty-table">Aucun prestataire trouvé</div>
    {/if}
  {/if}
</div>

<style>
  .admin-page h1 { margin: 0; }
  .page-header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4); flex-wrap: wrap; }
  .count { font-size: var(--text-lg); color: var(--color-earth-light); font-weight: 400; }
  .filters { display: flex; gap: var(--space-3); }
  .search-input, .filter-select {
    padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border);
    border-radius: var(--radius-md); font-family: var(--font-body); font-size: var(--text-sm); background: white;
  }
  .search-input { min-width: 220px; }

  .summary-chips { display: flex; gap: var(--space-3); margin-bottom: var(--space-5); flex-wrap: wrap; }
  .chip { font-size: var(--text-xs); font-weight: 700; padding: var(--space-1) var(--space-4); border-radius: var(--radius-full); }
  .chip-green  { background: #dcfce7; color: #166534; }
  .chip-orange { background: #fef9c3; color: #854d0e; }
  .chip-blue   { background: #dbeafe; color: #1e40af; }

  .providers-list { display: flex; flex-direction: column; gap: var(--space-4); }
  .provider-card { padding: var(--space-5); }
  .prov-header { display: flex; gap: var(--space-4); align-items: flex-start; margin-bottom: var(--space-3); flex-wrap: wrap; }
  .prov-avatar {
    width: 52px; height: 52px; border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--color-ocean), var(--color-ocean-dark));
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: var(--text-2xl); font-weight: 700; flex-shrink: 0;
  }
  .prov-info { flex: 1; }
  .prov-name-row { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-2); }
  .prov-name-row h3 { margin: 0; font-size: var(--text-lg); }
  .verif-badge   { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: #dcfce7; color: #166534; }
  .pending-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: #fef9c3; color: #854d0e; }
  .prov-meta { display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--color-earth-light); flex-wrap: wrap; }
  .prov-stats { display: flex; gap: var(--space-5); }
  .prov-stat { text-align: center; }
  .prov-stat strong { display: block; font-size: var(--text-xl); font-weight: 700; color: var(--color-ocean); }
  .prov-stat span   { font-size: var(--text-xs); color: var(--color-earth-light); }
  .prov-desc  { font-size: var(--text-sm); color: var(--color-earth-medium); margin-bottom: var(--space-3); }
  .prov-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .prov-date  { font-size: var(--text-xs); color: var(--color-earth-light); margin-top: var(--space-3); }

  .btn-action {
    padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);
    border: 1px solid var(--color-border); background: white;
    font-size: var(--text-xs); font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: var(--transition); text-decoration: none; color: var(--color-earth);
    display: inline-flex; align-items: center;
  }
  .btn-action:hover { background: var(--color-ivory-dark); }
  .btn-verify   { border-color: #bbf7d0; color: #16a34a; }
  .btn-verify:hover { background: #dcfce7; }
  .btn-unverify { border-color: #fed7aa; color: #c2410c; }
  .btn-unverify:hover { background: #ffedd5; }
  .btn-danger-action { border-color: #fecaca; color: #dc2626; }
  .btn-danger-action:hover { background: #fee2e2; }
  .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
</style>
