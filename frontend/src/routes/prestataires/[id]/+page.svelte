<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api/client.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatPrix } from '$lib/utils/format.js';
  import StarRating from '$lib/components/reviews/StarRating.svelte';

  let provider = $state(null);
  let isLoading = $state(true);
  let activeImg = $state(0);
  let selectedService = $state(null);
  let showModal = $state(false);
  let form = $state({ dateDebut: '', dateFin: '', nombrePersonnes: 1, notes: '' });
  let isBooking = $state(false);
  let providerReviews = $state([]);
  let reviewsLoading = $state(false);

  const typeLabels = {
    HEBERGEMENT: '🏨 Hébergement', TRANSPORT: '🚗 Transport',
    GUIDE: '🧭 Guide', ACTIVITE: '🎯 Activité', RESTAURANT: '🍽️ Restaurant'
  };

  onMount(async () => {
    try {
      provider = await api.get(`/providers/${$page.params.id}`);
      reviewsLoading = true;
      providerReviews = await api.get(`/service-reviews/provider/${$page.params.id}`).catch(() => []);
    } catch {
      toastStore.error('Prestataire introuvable');
      goto('/prestataires');
    } finally {
      isLoading = false;
      reviewsLoading = false;
    }
  });

  const avgRating = $derived(
    providerReviews.length
      ? (providerReviews.reduce((s, r) => s + r.note, 0) / providerReviews.length)
      : 0
  );

  function openBook(service) {
    if (!authStore.isLoggedIn) return goto('/auth/login?redirect=/prestataires/' + $page.params.id);
    selectedService = service;
    form = { dateDebut: '', dateFin: '', nombrePersonnes: 1, notes: '' };
    showModal = true;
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!form.dateDebut) return toastStore.warning('Veuillez choisir une date');
    isBooking = true;
    try {
      await api.post('/reservations', {
        serviceId: selectedService.id,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin || undefined,
        nombrePersonnes: form.nombrePersonnes,
        notes: form.notes
      });
      toastStore.success('Demande envoyée ! Le prestataire a été notifié.');
      showModal = false;
      goto('/profil/reservations');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur lors de la réservation');
    } finally {
      isBooking = false;
    }
  }

  function getEmbedUrl(url) {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
    return null;
  }

  const total = $derived(selectedService ? selectedService.prix * form.nombrePersonnes : 0);
</script>

<svelte:head>
  <title>{provider?.nomEntreprise ?? 'Prestataire'} — BeninExplore</title>
</svelte:head>

{#if isLoading}
  <div class="container" style="padding-block:var(--space-16)">
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  </div>
{:else if provider}
  <!-- Hero -->
  <div class="provider-hero">
    {#if provider.images?.length}
      <div class="hero-gallery">
        <img src={provider.images[activeImg]} alt={provider.nomEntreprise} class="hero-img" referrerpolicy="no-referrer" />
        {#if provider.images.length > 1}
          <div class="hero-thumbs">
            {#each provider.images as img, i}
              <button class="thumb" class:active={activeImg === i} onclick={() => activeImg = i}>
                <img src={img} alt="" referrerpolicy="no-referrer" />
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="hero-placeholder">
        <span class="hero-letter">{provider.nomEntreprise[0]}</span>
      </div>
    {/if}
    <div class="hero-overlay">
      <div class="container">
        <a href="/prestataires" class="back-btn">← Retour</a>
        <div class="hero-info">
          {#if provider.logo}
            <img src={provider.logo} alt="Logo" class="hero-logo" referrerpolicy="no-referrer" />
          {/if}
          <div>
            <h1>{provider.nomEntreprise}</h1>
            {#if provider.estVerifie}
              <span class="verified">✓ Prestataire vérifié BeninExplore</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container provider-body">
    <div class="provider-layout">
      <!-- Main -->
      <main class="provider-main">
        <section class="section-card card">
          <h2>À propos</h2>
          <p>{provider.descriptionFr}</p>
        </section>

        <!-- Services -->
        <section>
          <h2 class="services-title">Nos services</h2>
          <div class="services-list">
            {#each provider.services ?? [] as service}
              {@const embedUrl = getEmbedUrl(service.videoUrl)}
              <div class="service-block card">
                <div class="service-media">
                  {#if embedUrl}
                    <div class="video-wrapper">
                      <iframe
                        src={embedUrl}
                        title={service.nomFr}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                  {:else if service.images?.[0]}
                    <img src={service.images[0]} alt={service.nomFr} class="service-img" referrerpolicy="no-referrer" />
                  {/if}
                </div>
                <div class="service-content">
                  <div class="service-top">
                    <span class="type-badge">{typeLabels[service.type] ?? service.type}</span>
                    {#if !service.disponible}
                      <span class="badge-unavail">Indisponible</span>
                    {/if}
                  </div>
                  <h3>{service.nomFr}</h3>
                  <p>{service.descriptionFr}</p>
                  <div class="service-meta">
                    {#if service.duree}
                      <span>⏱ {Math.floor(service.duree / 60)}h{service.duree % 60 > 0 ? service.duree % 60 + 'min' : ''}</span>
                    {/if}
                    {#if service.capacite}
                      <span>👥 {service.capacite} pers. max</span>
                    {/if}
                  </div>
                  <div class="service-footer">
                    <span class="service-prix">
                      {formatPrix(service.prix)}<small>/{service.type === 'HEBERGEMENT' ? 'nuit' : 'pers.'}</small>
                    </span>
                    <button
                      class="btn btn-primary"
                      disabled={!service.disponible}
                      onclick={() => openBook(service)}
                    >
                      {service.disponible ? 'Réserver' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Avis clients -->
        <section>
          <div class="reviews-header">
            <h2>Avis clients</h2>
            {#if providerReviews.length > 0}
              <div class="reviews-avg">
                <StarRating note={avgRating} size="md" />
                <span class="avg-num">{avgRating.toFixed(1)}/5</span>
                <span class="avg-count">({providerReviews.length} avis)</span>
              </div>
            {/if}
          </div>

          {#if reviewsLoading}
            <div class="skeleton" style="height:80px;border-radius:var(--radius-md)"></div>
          {:else if providerReviews.length === 0}
            <div class="no-reviews card">
              <p>⭐ Aucun avis pour l'instant.</p>
              <p class="no-reviews-sub">Réservez un service et partagez votre expérience !</p>
            </div>
          {:else}
            <div class="reviews-list">
              {#each providerReviews as review}
                <div class="review-card card">
                  <div class="review-top">
                    <div class="reviewer-av">{review.user.prenom?.[0]}{review.user.nom?.[0]}</div>
                    <div class="reviewer-info">
                      <strong>{review.user.prenom} {review.user.nom}</strong>
                      <span class="review-service">{review.service?.nomFr}</span>
                    </div>
                    <div class="review-right">
                      <StarRating note={review.note} size="sm" />
                      <time>{new Date(review.createdAt).toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}</time>
                    </div>
                  </div>
                  <p class="review-comment">{review.commentaire}</p>
                </div>
              {/each}
            </div>
          {/if}
        </section>
      </main>

      <!-- Sidebar -->
      <aside class="provider-sidebar">
        {#if providerReviews.length > 0}
          <div class="sidebar-card card rating-card">
            <div class="rating-big">{avgRating.toFixed(1)}</div>
            <StarRating note={avgRating} size="md" />
            <p class="rating-count">{providerReviews.length} avis vérifiés</p>
          </div>
        {/if}
        <div class="sidebar-card card">
          <h3>Informations de contact</h3>
          {#if provider.telephone}
            <p class="contact-item">📞 <a href="tel:{provider.telephone}">{provider.telephone}</a></p>
          {/if}
          {#if provider.email}
            <p class="contact-item">✉️ <a href="mailto:{provider.email}">{provider.email}</a></p>
          {/if}
          {#if provider.adresse}
            <p class="contact-item">📍 {provider.adresse}</p>
          {/if}
          {#if provider.siteWeb}
            <p class="contact-item">🌐 <a href={provider.siteWeb} target="_blank" rel="noopener">{provider.siteWeb}</a></p>
          {/if}
        </div>

        {#if (provider.services?.length ?? 0) > 0}
          <div class="sidebar-card card quick-reserve">
            <h3>Réserver rapidement</h3>
            {#each (provider.services ?? []).filter(s => s.disponible).slice(0, 3) as s}
              <button class="quick-btn" onclick={() => openBook(s)}>
                <span>{typeLabels[s.type]?.[0] ?? '•'} {s.nomFr}</span>
                <strong>{formatPrix(s.prix)}</strong>
              </button>
            {/each}
          </div>
        {/if}
      </aside>
    </div>
  </div>
{/if}

<!-- Booking Modal -->
{#if showModal && selectedService}
  <div class="modal-overlay" onclick={() => showModal = false}>
    <div class="modal-box" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h3>Réserver : {selectedService.nomFr}</h3>
        <button class="modal-close" onclick={() => showModal = false}>✕</button>
      </div>
      <div class="modal-body">
        <form onsubmit={submitBooking} class="book-form">
          <div class="form-group">
            <label class="form-label">Date de début *</label>
            <input type="datetime-local" class="form-input" bind:value={form.dateDebut} required />
          </div>
          {#if selectedService.type === 'HEBERGEMENT'}
            <div class="form-group">
              <label class="form-label">Date de départ</label>
              <input type="datetime-local" class="form-input" bind:value={form.dateFin} />
            </div>
          {/if}
          <div class="form-group">
            <label class="form-label">Nombre de personnes</label>
            <input type="number" class="form-input" bind:value={form.nombrePersonnes}
              min="1" max={selectedService.capacite ?? 50} />
          </div>
          <div class="form-group">
            <label class="form-label">Demandes spéciales</label>
            <textarea class="form-input" bind:value={form.notes} rows="3"
              placeholder="Allergies, besoins particuliers…"></textarea>
          </div>
          <div class="price-summary">
            <span>{formatPrix(selectedService.prix)} × {form.nombrePersonnes}</span>
            <strong>{formatPrix(total)}</strong>
          </div>
          <button type="submit" class="btn btn-primary btn-block" disabled={isBooking}>
            {isBooking ? 'Envoi…' : `Confirmer la demande — ${formatPrix(total)}`}
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Hero */
  .provider-hero { position: relative; height: 420px; overflow: hidden; background: var(--color-ocean-dark); }
  .hero-gallery { height: 100%; }
  .hero-img { width: 100%; height: 380px; object-fit: cover; }
  .hero-thumbs {
    position: absolute; bottom: 70px; right: var(--space-6);
    display: flex; gap: var(--space-2);
  }
  .thumb { width: 56px; height: 40px; border: 2px solid rgba(255,255,255,0.4); border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; opacity: 0.7; transition: var(--transition); }
  .thumb.active { border-color: white; opacity: 1; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .hero-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; }
  .hero-letter { font-size: 8rem; color: rgba(255,255,255,0.15); font-family: var(--font-display); font-weight: 700; }
  .hero-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
    padding-bottom: var(--space-6);
  }
  .back-btn {
    display: inline-block; color: rgba(255,255,255,0.8);
    text-decoration: none; font-size: var(--text-sm);
    margin-bottom: var(--space-4);
    transition: var(--transition);
  }
  .back-btn:hover { color: white; }
  .hero-info { display: flex; align-items: center; gap: var(--space-4); }
  .hero-logo { width: 64px; height: 64px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid white; }
  .hero-info h1 { color: white; font-size: clamp(1.5rem, 3vw, 2.2rem); }
  .verified { font-size: var(--text-sm); color: #86efac; font-weight: 500; }

  /* Layout */
  .provider-body { padding-block: var(--space-8); }
  .provider-layout { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-8); align-items: start; }
  .provider-main { display: flex; flex-direction: column; gap: var(--space-6); }
  .section-card { padding: var(--space-6); }
  .section-card h2 { margin-bottom: var(--space-3); }
  .services-title { margin-bottom: var(--space-5); }
  .services-list { display: flex; flex-direction: column; gap: var(--space-5); }

  /* Service block */
  .service-block { overflow: hidden; }
  .service-media { }
  .service-img { width: 100%; height: 220px; object-fit: cover; }
  .video-wrapper {
    position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
  }
  .video-wrapper iframe {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  }
  .service-content { padding: var(--space-5); }
  .service-top { display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-2); }
  .type-badge { font-size: var(--text-xs); font-weight: 700; color: var(--color-ocean); }
  .badge-unavail { font-size: var(--text-xs); background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: var(--radius-full); }
  .service-content h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); }
  .service-content p { font-size: var(--text-sm); color: var(--color-earth-medium); margin-bottom: var(--space-3); }
  .service-meta { display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-4); }
  .service-footer { display: flex; justify-content: space-between; align-items: center; }
  .service-prix { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; color: var(--color-ocean); }
  .service-prix small { font-family: var(--font-body); font-size: var(--text-sm); font-weight: 400; color: var(--color-earth-light); margin-left: 2px; }

  /* Sidebar */
  .provider-sidebar { position: sticky; top: calc(var(--nav-h) + var(--space-4)); display: flex; flex-direction: column; gap: var(--space-5); }
  .sidebar-card { padding: var(--space-5); }
  .sidebar-card h3 { font-size: var(--text-base); margin-bottom: var(--space-4); }
  .contact-item { font-size: var(--text-sm); margin-bottom: var(--space-2); }
  .contact-item a { color: var(--color-ocean); text-decoration: none; }
  .contact-item a:hover { text-decoration: underline; }
  .quick-reserve h3 { margin-bottom: var(--space-3); }
  .quick-btn {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-3) var(--space-4);
    background: var(--color-ivory); border: 1px solid var(--color-border);
    border-radius: var(--radius-md); cursor: pointer;
    font-family: var(--font-body); font-size: var(--text-sm);
    margin-bottom: var(--space-2); transition: var(--transition);
  }
  .quick-btn:hover { border-color: var(--color-ocean); background: rgba(13,59,92,0.04); }
  .quick-btn strong { font-family: var(--font-display); color: var(--color-ocean); }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-4);
    animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: white; border-radius: var(--radius-xl);
    width: 100%; max-width: 500px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    animation: slideUp 0.22s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  .modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-5) var(--space-6);
    border-bottom: 1px solid var(--color-border);
  }
  .modal-header h3 { font-size: var(--text-lg); }
  .modal-close { background: none; border: none; cursor: pointer; font-size: 1.2rem; color: var(--color-earth-light); }
  .modal-body { padding: var(--space-6); }
  .book-form { display: flex; flex-direction: column; gap: var(--space-4); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); }
  .price-summary {
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-4); background: var(--color-ivory-dark);
    border-radius: var(--radius-md); font-size: var(--text-sm);
  }
  .price-summary strong { font-family: var(--font-display); font-size: var(--text-xl); color: var(--color-ocean); }
  .btn-block { width: 100%; justify-content: center; }

  /* Reviews */
  .reviews-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-5); }
  .reviews-header h2 { margin: 0; }
  .reviews-avg { display: flex; align-items: center; gap: var(--space-2); }
  .avg-num { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; color: var(--color-ocean); }
  .avg-count { font-size: var(--text-sm); color: var(--color-earth-light); }
  .reviews-list { display: flex; flex-direction: column; gap: var(--space-4); }
  .review-card { padding: var(--space-5); }
  .review-top { display: flex; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-3); }
  .reviewer-av {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    background: var(--color-ocean); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--text-sm); font-weight: 700;
    text-transform: uppercase;
  }
  .reviewer-info { flex: 1; }
  .reviewer-info strong { display: block; font-size: var(--text-sm); margin-bottom: 2px; }
  .review-service { font-size: 11px; color: var(--color-earth-light); }
  .review-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
  .review-right time { font-size: 11px; color: var(--color-earth-light); }
  .review-comment { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.6; }
  .no-reviews { padding: var(--space-6); text-align: center; color: var(--color-earth-light); }
  .no-reviews-sub { font-size: var(--text-sm); margin-top: var(--space-2); }

  /* Sidebar rating card */
  .rating-card { text-align: center; padding: var(--space-5); }
  .rating-big { font-family: var(--font-display); font-size: 3rem; font-weight: 700; color: var(--color-ocean); line-height: 1; margin-bottom: var(--space-2); }
  .rating-count { font-size: var(--text-xs); color: var(--color-earth-light); margin-top: var(--space-2); }

  @media (max-width: 1023px) { .provider-layout { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .provider-hero { height: 300px; } .hero-img { height: 260px; } }
</style>
