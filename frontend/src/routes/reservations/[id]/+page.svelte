<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api/client.js';
  import { reservationsApi } from '$lib/api/reservations.api.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatPrix } from '$lib/utils/format.js';

  let service = $state(null);
  let form = $state({ dateDebut: '', dateFin: '', nombrePersonnes: 1, notes: '' });
  let isLoading = $state(false);
  let isLoadingService = $state(true);

  onMount(async () => {
    if (!authStore.isLoggedIn) return goto('/auth/login');
    try {
      service = await api.get(`/services/${$page.params.id}`);
    } catch {
      toastStore.error('Service introuvable');
      goto('/reservations');
    } finally {
      isLoadingService = false;
    }
  });

  async function handleReservation(e) {
    e.preventDefault();
    if (!form.dateDebut) return toastStore.warning('Veuillez choisir une date');
    isLoading = true;
    try {
      await reservationsApi.create({
        serviceId: service.id,
        ...form
      });
      toastStore.success('Réservation envoyée ! Vous recevrez une confirmation.');
      goto('/profil/reservations');
    } catch (e) {
      toastStore.error(e.message);
    } finally {
      isLoading = false;
    }
  }

  const total = $derived(service ? service.prix * form.nombrePersonnes : 0);
</script>

<svelte:head><title>Réserver — BeninExplore</title></svelte:head>

{#if isLoadingService}
  <div class="container" style="padding-block: var(--space-16)">
    <div class="skeleton" style="height: 300px; border-radius: var(--radius-lg)"></div>
  </div>
{:else if service}
  <div class="container resa-form-page">
    <div class="resa-layout">
      <div class="resa-form-section">
        <h1>Réserver : {service.nomFr}</h1>
        <form onsubmit={handleReservation} class="resa-form card">
          <div class="form-group">
            <label class="form-label">Date de début *</label>
            <input type="datetime-local" class="form-input" bind:value={form.dateDebut} required />
          </div>
          {#if service.type !== 'GUIDE'}
            <div class="form-group">
              <label class="form-label">Date de fin</label>
              <input type="datetime-local" class="form-input" bind:value={form.dateFin} />
            </div>
          {/if}
          <div class="form-group">
            <label class="form-label">Nombre de personnes</label>
            <input type="number" class="form-input" bind:value={form.nombrePersonnes} min="1" max={service.capacite || 20} />
          </div>
          <div class="form-group">
            <label class="form-label">Notes / Demandes spéciales</label>
            <textarea class="form-input" bind:value={form.notes} rows="3" placeholder="Allergies, besoins spéciaux..."></textarea>
          </div>
          <div class="price-summary">
            <span>{formatPrix(service.prix)} × {form.nombrePersonnes} pers.</span>
            <strong>{formatPrix(total)}</strong>
          </div>
          <button type="submit" class="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Envoi...' : `Confirmer (${formatPrix(total)})`}
          </button>
        </form>
      </div>

      <aside class="service-info card">
        {#if service.images?.[0]}
          <img src={service.images[0]} alt={service.nomFr} class="service-hero-img" referrerpolicy="no-referrer" onerror={(e) => e.currentTarget.style.display='none'} />
        {/if}
        <div class="service-info-body">
          <h3>{service.nomFr}</h3>
          <p class="provider-name">🏢 {service.provider?.nomEntreprise}</p>
          <p class="service-desc-full">{service.descriptionFr}</p>
          {#if service.duree}
            <p>⏱ Durée : {Math.floor(service.duree / 60)}h{service.duree % 60 > 0 ? service.duree % 60 + 'min' : ''}</p>
          {/if}
          {#if service.capacite}
            <p>👥 Capacité : {service.capacite} personnes max</p>
          {/if}
        </div>
      </aside>
    </div>
  </div>
{/if}

<style>
  .resa-form-page { padding-block: var(--space-8); }
  .resa-form-page h1 { margin-bottom: var(--space-8); }
  .resa-layout { display: grid; grid-template-columns: 1fr 380px; gap: var(--space-8); align-items: start; }
  .resa-form { padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-5); }
  .price-summary {
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-4); background: var(--color-ivory-dark);
    border-radius: var(--radius-md); font-size: var(--text-sm);
  }
  .price-summary strong { font-size: var(--text-xl); font-family: var(--font-display); color: var(--color-ocean); }
  .btn-block { width: 100%; justify-content: center; }
  .service-hero-img { width: 100%; height: 220px; object-fit: cover; }
  .service-info-body { padding: var(--space-5); }
  .service-info-body h3 { margin-bottom: var(--space-2); }
  .provider-name { font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-4); }
  .service-desc-full { font-size: var(--text-sm); color: var(--color-earth-medium); margin-bottom: var(--space-3); }
  @media (max-width: 1023px) { .resa-layout { grid-template-columns: 1fr; } }
</style>
