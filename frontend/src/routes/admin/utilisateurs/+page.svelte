<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatDate } from '$lib/utils/format.js';

  let users     = $state([]);
  let isLoading = $state(true);
  let search    = $state('');
  let roleFilter = $state('');
  let toggling  = $state(new Set());

  onMount(async () => {
    try {
      const res = await adminApi.users();
      users = Array.isArray(res) ? res : (res?.users ?? []);
    } catch { toastStore.error('Erreur chargement utilisateurs'); }
    finally   { isLoading = false; }
  });

  async function toggleStatus(user) {
    toggling = new Set([...toggling, user.id]);
    try {
      await adminApi.toggleUserStatus(user.id);
      users = users.map(u => u.id === user.id ? { ...u, actif: !u.actif } : u);
      toastStore.success(user.actif ? 'Compte désactivé' : 'Compte réactivé');
    } catch { toastStore.error('Erreur'); }
    finally {
      toggling = new Set([...toggling].filter(id => id !== user.id));
    }
  }

  const roleColors = {
    ADMIN:       '#7C3AED',
    PRESTATAIRE: '#E8982A',
    TOURISTE:    '#1E5738',
    VISITEUR:    '#64748b'
  };

  const filtered = $derived(users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.prenom?.toLowerCase().includes(q) || u.nom?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole   = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  }));
</script>

<svelte:head><title>Utilisateurs — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>Utilisateurs <span class="count">({filtered.length})</span></h1>
    <div class="filters">
      <input class="search-input" placeholder="Rechercher…" bind:value={search} />
      <select class="filter-select" bind:value={roleFilter}>
        <option value="">Tous les rôles</option>
        <option value="ADMIN">Admin</option>
        <option value="PRESTATAIRE">Prestataire</option>
        <option value="TOURISTE">Touriste</option>
        <option value="VISITEUR">Visiteur</option>
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
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Inscrit le</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as u}
            <tr class:inactive={!u.actif}>
              <td>
                <div class="user-cell">
                  <div class="avatar">{u.prenom?.[0]}{u.nom?.[0]}</div>
                  <div>
                    <div class="user-name">{u.prenom} {u.nom}</div>
                    {#if u.telephone}<div class="user-phone">{u.telephone}</div>{/if}
                  </div>
                </div>
              </td>
              <td>{u.email}</td>
              <td>
                <span class="role-badge" style="background:{roleColors[u.role]}22;color:{roleColors[u.role]}">
                  {u.role}
                </span>
              </td>
              <td>{formatDate(u.createdAt)}</td>
              <td>
                <span class="status-dot" class:active={u.actif}>
                  {u.actif ? 'Actif' : 'Désactivé'}
                </span>
              </td>
              <td>
                {#if u.role !== 'ADMIN'}
                  <button
                    class="btn-action"
                    class:btn-danger={u.actif}
                    class:btn-success-sm={!u.actif}
                    disabled={toggling.has(u.id)}
                    onclick={() => toggleStatus(u)}
                  >
                    {toggling.has(u.id) ? '…' : u.actif ? 'Désactiver' : 'Réactiver'}
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if filtered.length === 0}
        <div class="empty-table">Aucun utilisateur trouvé</div>
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
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--color-border); border-radius: var(--radius-md);
    font-family: var(--font-body); font-size: var(--text-sm); background: white;
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
  .admin-table tr.inactive td { opacity: 0.5; }
  .admin-table tr:hover td { background: var(--color-ivory); }

  .user-cell { display: flex; align-items: center; gap: var(--space-3); }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--color-ocean); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .user-name  { font-weight: 600; }
  .user-phone { font-size: var(--text-xs); color: var(--color-earth-light); }

  .role-badge {
    font-size: 10px; font-weight: 700; padding: 2px 8px;
    border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.04em;
  }
  .status-dot {
    font-size: var(--text-xs); font-weight: 600; color: #dc2626;
  }
  .status-dot.active { color: #16a34a; }

  .btn-action {
    padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm);
    border: 1px solid var(--color-border); background: white;
    font-size: var(--text-xs); font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: var(--transition);
  }
  .btn-action.btn-danger { border-color: #fecaca; color: #dc2626; background: #fff; }
  .btn-action.btn-danger:hover { background: #fee2e2; }
  .btn-action.btn-success-sm { border-color: #bbf7d0; color: #16a34a; background: #fff; }
  .btn-action.btn-success-sm:hover { background: #dcfce7; }
  .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
</style>
