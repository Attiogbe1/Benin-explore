<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client.js';
  import { formatPrix, formatDate } from '$lib/utils/format.js';

  let stats = $state(null);
  let recentReservations = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const res = await api.get('/admin/stats');
      stats = res.stats;
      recentReservations = res.recentReservations;
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head><title>Dashboard Admin — BeninExplore</title></svelte:head>

<div class="admin-dashboard">
  <h1>Dashboard</h1>

  {#if isLoading}
    <div class="stats-grid">
      {#each Array(5) as _}
        <div class="skeleton" style="height: 120px; border-radius: var(--radius-lg)"></div>
      {/each}
    </div>
  {:else if stats}
    <div class="stats-grid">
      {#each [
        { icon: '👥', label: 'Utilisateurs', value: stats.users, color: '#0D3B5C' },
        { icon: '🗺️', label: 'Sites actifs', value: stats.sites, color: '#1E5738' },
        { icon: '🗓️', label: 'Réservations', value: stats.reservations, color: '#E8982A' },
        { icon: '⏳', label: 'Avis en attente', value: stats.pendingReviews, color: '#DC2626' },
        { icon: '💰', label: 'Revenus', value: formatPrix(stats.revenue), color: '#7C3AED' }
      ] as stat}
        <div class="stat-card card" style="border-top: 3px solid {stat.color}">
          <span class="stat-icon">{stat.icon}</span>
          <div>
            <div class="stat-value">{stat.value}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        </div>
      {/each}
    </div>

    <div class="admin-sections">
      <div class="recent-section card">
        <h2>Dernières réservations</h2>
        <table class="admin-table">
          <thead>
            <tr><th>Client</th><th>Service</th><th>Date</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {#each recentReservations as resa}
              <tr>
                <td>{resa.user.prenom} {resa.user.nom}</td>
                <td>{resa.service.nomFr}</td>
                <td>{formatDate(resa.createdAt)}</td>
                <td><span class="status-chip status-{resa.statut.toLowerCase()}">{resa.statut}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="quick-links card">
        <h2>Actions rapides</h2>
        <div class="quick-actions">
          <a href="/admin/utilisateurs" class="quick-action">👥 Gérer les utilisateurs</a>
          <a href="/admin/sites" class="quick-action">🗺️ Gérer les sites</a>
          <a href="/admin/reservations" class="quick-action">🗓️ Toutes les réservations</a>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .admin-dashboard h1 { margin-bottom: var(--space-8); }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-5); margin-bottom: var(--space-8);
  }
  .stat-card { padding: var(--space-5); display: flex; align-items: center; gap: var(--space-4); }
  .stat-icon { font-size: 2rem; }
  .stat-value { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; }
  .stat-label { font-size: var(--text-xs); color: var(--color-earth-light); text-transform: uppercase; }
  .admin-sections { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); }
  .recent-section, .quick-links { padding: var(--space-6); }
  .recent-section h2, .quick-links h2 { margin-bottom: var(--space-5); }
  .admin-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
  .admin-table th { text-align: left; padding: var(--space-3); border-bottom: 2px solid var(--color-border); font-size: var(--text-xs); text-transform: uppercase; color: var(--color-earth-light); }
  .admin-table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); }
  .status-chip { padding: 2px 8px; border-radius: var(--radius-full); font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: var(--color-ivory-dark); }
  .quick-actions { display: flex; flex-direction: column; gap: var(--space-3); }
  .quick-action {
    padding: var(--space-4); background: var(--color-ivory-dark);
    border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500;
    text-decoration: none; color: var(--color-earth);
    transition: var(--transition);
  }
  .quick-action:hover { background: var(--color-ocean); color: white; }
  @media (max-width: 1023px) { .admin-sections { grid-template-columns: 1fr; } }
</style>
