<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { reservationsApi } from '$lib/api/reservations.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatDate, formatPrix } from '$lib/utils/format.js';
  import ReviewForm from '$lib/components/reviews/ReviewForm.svelte';
  import StarRating from '$lib/components/reviews/StarRating.svelte';

  let reservations = $state([]);
  let isLoading = $state(true);
  let reviewingId = $state(null); // id de la réservation dont on écrit l'avis

  const statusConfig = {
    EN_ATTENTE: { label: 'En attente',   color: '#F59E0B', icon: '⏳' },
    CONFIRMEE:  { label: 'Confirmée',    color: '#22A665', icon: '✅' },
    EN_COURS:   { label: 'En cours',     color: '#2563EB', icon: '▶️' },
    TERMINEE:   { label: 'Terminée',     color: '#6B7280', icon: '✓'  },
    ANNULEE:    { label: 'Annulée',      color: '#DC2626', icon: '✕'  },
    REFUSEE:    { label: 'Refusée',      color: '#DC2626', icon: '✕'  }
  };

  const typeLabels = {
    HEBERGEMENT: '🏨', TRANSPORT: '🚗',
    GUIDE: '🧭', ACTIVITE: '🎯', RESTAURANT: '🍽️'
  };

  onMount(async () => {
    if (!authStore.isLoggedIn) return goto('/auth/login');
    try {
      reservations = await reservationsApi.list();
    } finally {
      isLoading = false;
    }
  });

  async function cancel(id) {
    try {
      await reservationsApi.cancel(id);
      reservations = reservations.map(r => r.id === id ? { ...r, statut: 'ANNULEE' } : r);
      toastStore.success('Réservation annulée');
    } catch (e) {
      toastStore.error(e.message);
    }
  }

  function handleReviewSuccess(reservationId) {
    reservations = reservations.map(r =>
      r.id === reservationId ? { ...r, avisLaisse: true } : r
    );
    reviewingId = null;
    toastStore.success('Avis publié !');
  }

  const grouped = $derived({
    actives:   reservations.filter(r => ['EN_ATTENTE','CONFIRMEE','EN_COURS'].includes(r.statut)),
    terminees: reservations.filter(r => r.statut === 'TERMINEE'),
    autres:    reservations.filter(r => ['ANNULEE','REFUSEE'].includes(r.statut))
  });
</script>

<svelte:head><title>Mes réservations — BeninExplore</title></svelte:head>

<div class="container resa-page">
  <h1>🗓️ Mes réservations</h1>

  {#if isLoading}
    {#each Array(3) as _}
      <div class="skeleton" style="height: 120px; border-radius: var(--radius-lg); margin-bottom: var(--space-4)"></div>
    {/each}
  {:else if reservations.length === 0}
    <div class="empty-state">
      <p style="font-size: 3rem">📅</p>
      <h3>Aucune réservation</h3>
      <a href="/prestataires" class="btn btn-primary">Découvrir les services</a>
    </div>
  {:else}

    <!-- Réservations actives -->
    {#if grouped.actives.length > 0}
      <h2 class="group-title">En cours</h2>
      <div class="resa-list">
        {#each grouped.actives as resa}
          {@const sc = statusConfig[resa.statut]}
          <div class="resa-card card">
            <div class="resa-type-icon">{typeLabels[resa.service?.type] ?? '🛎️'}</div>
            <div class="resa-info">
              <h3>{resa.service?.nomFr}</h3>
              <p class="resa-provider">par {resa.provider?.nomEntreprise}</p>
              <div class="resa-meta">
                <span>📅 {formatDate(resa.dateDebut)}</span>
                <span>👥 {resa.nombrePersonnes} pers.</span>
                <span>💰 {formatPrix(resa.prixTotal)}</span>
              </div>
            </div>
            <div class="resa-actions">
              <span class="status-badge" style="background:{sc.color}18;color:{sc.color}">
                {sc.icon} {sc.label}
              </span>
              <button class="btn btn-outline btn-sm" onclick={() => cancel(resa.id)}>Annuler</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Réservations terminées — avec option avis -->
    {#if grouped.terminees.length > 0}
      <h2 class="group-title">Terminées</h2>
      <div class="resa-list">
        {#each grouped.terminees as resa}
          <div class="resa-card card" class:with-review={reviewingId === resa.id}>
            <div class="resa-type-icon">{typeLabels[resa.service?.type] ?? '🛎️'}</div>
            <div class="resa-info">
              <h3>{resa.service?.nomFr}</h3>
              <p class="resa-provider">par {resa.provider?.nomEntreprise}</p>
              <div class="resa-meta">
                <span>📅 {formatDate(resa.dateDebut)}</span>
                <span>👥 {resa.nombrePersonnes} pers.</span>
                <span>💰 {formatPrix(resa.prixTotal)}</span>
              </div>
            </div>
            <div class="resa-actions">
              <span class="status-badge done">✓ Terminée</span>
              {#if resa.avisLaisse}
                <span class="avis-done">⭐ Avis publié</span>
              {:else}
                <button
                  class="btn btn-gold btn-sm"
                  onclick={() => reviewingId = reviewingId === resa.id ? null : resa.id}
                >
                  {reviewingId === resa.id ? '✕ Annuler' : '⭐ Laisser un avis'}
                </button>
              {/if}
            </div>

            {#if reviewingId === resa.id}
              <div class="review-inline">
                <ReviewForm
                  reservationId={resa.id}
                  serviceName={resa.service?.nomFr}
                  onSuccess={() => handleReviewSuccess(resa.id)}
                />
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- Annulées / refusées -->
    {#if grouped.autres.length > 0}
      <h2 class="group-title">Annulées / Refusées</h2>
      <div class="resa-list">
        {#each grouped.autres as resa}
          {@const sc = statusConfig[resa.statut]}
          <div class="resa-card card cancelled">
            <div class="resa-type-icon">{typeLabels[resa.service?.type] ?? '🛎️'}</div>
            <div class="resa-info">
              <h3>{resa.service?.nomFr}</h3>
              <p class="resa-provider">par {resa.provider?.nomEntreprise}</p>
              <div class="resa-meta">
                <span>📅 {formatDate(resa.dateDebut)}</span>
                <span>💰 {formatPrix(resa.prixTotal)}</span>
              </div>
            </div>
            <span class="status-badge" style="background:{sc.color}18;color:{sc.color}">
              {sc.icon} {sc.label}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .resa-page { padding-block: var(--space-8); }
  .resa-page h1 { margin-bottom: var(--space-8); }
  .group-title { font-size: var(--text-base); font-weight: 700; color: var(--color-earth-light); text-transform: uppercase; letter-spacing: 0.06em; margin: var(--space-8) 0 var(--space-4); }
  .resa-list { display: flex; flex-direction: column; gap: var(--space-4); }
  .resa-card {
    padding: var(--space-5);
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: var(--space-4);
    align-items: center;
    transition: var(--transition);
  }
  .resa-card.with-review { grid-template-columns: 40px 1fr auto; }
  .review-inline {
    grid-column: 1 / -1;
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-2);
  }
  .resa-type-icon { font-size: 1.8rem; text-align: center; }
  .resa-info h3 { font-size: var(--text-lg); margin-bottom: var(--space-1); }
  .resa-provider { font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-2); }
  .resa-meta { display: flex; gap: var(--space-4); flex-wrap: wrap; font-size: var(--text-sm); color: var(--color-earth-medium); }
  .resa-actions { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-2); flex-shrink: 0; }
  .status-badge { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 700; white-space: nowrap; }
  .status-badge.done { background: #f3f4f6; color: #6b7280; }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
  .btn-gold { background: var(--color-gold); color: var(--color-ocean-dark); font-weight: 700; border: none; border-radius: var(--radius-md); cursor: pointer; font-family: var(--font-body); transition: var(--transition); }
  .btn-gold:hover { background: #d97706; }
  .avis-done { font-size: var(--text-xs); color: #f59e0b; font-weight: 600; }
  .cancelled { opacity: 0.65; }
  .empty-state { text-align: center; padding: var(--space-16); display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }

  @media (max-width: 640px) {
    .resa-card { grid-template-columns: 36px 1fr; }
    .resa-actions { grid-column: 1 / -1; flex-direction: row; align-items: center; justify-content: space-between; }
  }
</style>
