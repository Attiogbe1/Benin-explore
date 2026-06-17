<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatDate } from '$lib/utils/format.js';

  let pendingReviews = $state([]);
  let isLoading      = $state(true);
  let approving      = $state(new Set());
  let deleting       = $state(new Set());

  onMount(async () => {
    try {
      const res = await adminApi.pendingReviews();
      pendingReviews = Array.isArray(res) ? res : (res?.reviews ?? []);
    } catch { toastStore.error('Erreur chargement avis'); }
    finally   { isLoading = false; }
  });

  async function approveReview(id) {
    approving = new Set([...approving, id]);
    try {
      await adminApi.approveReview(id);
      pendingReviews = pendingReviews.filter(r => r.id !== id);
      toastStore.success('Avis approuvé ✓');
    } catch { toastStore.error('Erreur'); }
    finally {
      approving = new Set([...approving].filter(i => i !== id));
    }
  }

  async function deleteReview(id) {
    deleting = new Set([...deleting, id]);
    try {
      await adminApi.deleteReview(id);
      pendingReviews = pendingReviews.filter(r => r.id !== id);
      toastStore.success('Avis supprimé');
    } catch { toastStore.error('Erreur'); }
    finally {
      deleting = new Set([...deleting].filter(i => i !== id));
    }
  }

  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
</script>

<svelte:head><title>Avis en attente — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>
      Modération des avis
      {#if pendingReviews.length > 0}
        <span class="pending-chip">{pendingReviews.length} en attente</span>
      {/if}
    </h1>
  </div>

  {#if isLoading}
    <div class="skeleton" style="height:300px;border-radius:var(--radius-lg)"></div>
  {:else if pendingReviews.length === 0}
    <div class="empty-state">
      <p style="font-size:4rem">✅</p>
      <h2>Aucun avis en attente</h2>
      <p>Tous les avis ont été modérés. Revenez plus tard.</p>
    </div>
  {:else}
    <p class="intro">Approuvez les avis conformes ou supprimez ceux qui violent les conditions d'utilisation.</p>

    <div class="reviews-list">
      {#each pendingReviews as r}
        <div class="review-card card">
          <div class="review-header">
            <div class="reviewer">
              <div class="rev-avatar">{r.user?.prenom?.[0]}{r.user?.nom?.[0]}</div>
              <div>
                <div class="rev-name">{r.user?.prenom} {r.user?.nom}</div>
                <div class="rev-date">{formatDate(r.createdAt)}</div>
              </div>
            </div>
            <div class="review-target">
              {#if r.touristSite?.nom}
                <span class="target-chip target-site">🗺️ {r.touristSite.nom}</span>
              {:else if r.service?.nomFr}
                <span class="target-chip target-service">🛎️ {r.service.nomFr}</span>
              {/if}
            </div>
            <div class="review-stars" title="{r.note}/5">
              {stars(r.note ?? 0)}
            </div>
          </div>
          {#if r.titre}
            <h4 class="rev-title">"{r.titre}"</h4>
          {/if}
          <p class="rev-body">{r.commentaire}</p>
          {#if r.photos?.length}
            <div class="rev-photos">
              {#each r.photos.slice(0, 4) as ph}
                <img src={ph} alt="" class="rev-photo" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
              {/each}
            </div>
          {/if}
          <div class="review-actions">
            <button
              class="btn btn-success-outline"
              disabled={approving.has(r.id)}
              onclick={() => approveReview(r.id)}
            >
              {approving.has(r.id) ? '…' : '✓ Approuver'}
            </button>
            <button
              class="btn btn-danger-outline"
              disabled={deleting.has(r.id)}
              onclick={() => deleteReview(r.id)}
            >
              {deleting.has(r.id) ? '…' : '🗑 Supprimer'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .admin-page h1 { margin: 0; display: flex; align-items: center; gap: var(--space-3); }
  .page-header { margin-bottom: var(--space-6); }
  .pending-chip {
    font-size: var(--text-sm); font-weight: 700;
    background: #fee2e2; color: #dc2626;
    padding: 2px 10px; border-radius: var(--radius-full);
  }
  .intro { color: var(--color-earth-medium); margin-bottom: var(--space-5); font-size: var(--text-sm); }

  .reviews-list { display: flex; flex-direction: column; gap: var(--space-4); }
  .review-card { padding: var(--space-5); }
  .review-header { display: flex; align-items: flex-start; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-4); }
  .reviewer { display: flex; align-items: center; gap: var(--space-3); flex: 1; }
  .rev-avatar {
    width: 40px; height: 40px; border-radius: 50%; background: var(--color-ocean);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .rev-name { font-weight: 600; font-size: var(--text-sm); }
  .rev-date { font-size: var(--text-xs); color: var(--color-earth-light); }

  .review-target { display: flex; align-items: center; }
  .target-chip { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: var(--radius-full); }
  .target-site    { background: rgba(13,59,92,0.1); color: var(--color-ocean); }
  .target-service { background: rgba(232,152,42,0.1); color: var(--color-gold); }

  .review-stars { font-size: var(--text-xl); color: var(--color-gold); letter-spacing: 2px; }

  .rev-title { font-size: var(--text-base); font-style: italic; margin-bottom: var(--space-2); }
  .rev-body  { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.6; margin-bottom: var(--space-4); }
  .rev-photos { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4); }
  .rev-photo  { width: 80px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); }

  .review-actions { display: flex; gap: var(--space-3); }
  .btn-success-outline {
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);
    border: 2px solid #22c55e; background: white; color: #16a34a;
    font-size: var(--text-sm); font-weight: 600; cursor: pointer; font-family: var(--font-body);
    transition: var(--transition);
  }
  .btn-success-outline:hover:not(:disabled) { background: #dcfce7; }
  .btn-danger-outline {
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);
    border: 2px solid #ef4444; background: white; color: #dc2626;
    font-size: var(--text-sm); font-weight: 600; cursor: pointer; font-family: var(--font-body);
    transition: var(--transition);
  }
  .btn-danger-outline:hover:not(:disabled) { background: #fee2e2; }
  .btn-success-outline:disabled, .btn-danger-outline:disabled { opacity: 0.5; cursor: not-allowed; }

  .empty-state { text-align: center; padding: var(--space-16); }
  .empty-state h2 { margin-bottom: var(--space-3); }
  .empty-state p  { color: var(--color-earth-light); }
</style>
