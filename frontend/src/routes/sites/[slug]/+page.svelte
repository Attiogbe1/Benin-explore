<script>
  import { page }        from '$app/stores';
  import { onMount }     from 'svelte';
  import { sitesApi }    from '$lib/api/sites.api.js';
  import { favoritesApi } from '$lib/api/favorites.api.js';
  import { authStore }   from '$lib/stores/auth.store.svelte.js';
  import { toastStore }  from '$lib/stores/toast.store.svelte.js';
  import { formatPrix, formatDate } from '$lib/utils/format.js';
  import ReviewForm from '$lib/components/reviews/ReviewForm.svelte';

  let site        = $state(null);
  let isFav       = $state(false);
  let activeImg   = $state(0);
  let imgErrCount = $state(0);
  let showReview  = $state(false);
  let isLoading   = $state(true);
  let brokenGallery = $state(new Set());

  const catFallbacks = {
    historique:    'https://voyageavecnous.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-06-a-15.34.01_422ced3c-1024x682.jpg',
    naturel:       'https://s.rfi.fr/media/display/b9bb7868-10b7-11ea-87b2-005056a99247/w:1024/p:16x9/parc-national-de-la-pendjari-au-benin_0.jpg',
    culturel:      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/11/0f/a0.jpg',
    plage:         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    religieux:     'https://kaleidos2.net/gallery/africa/benin/Atlantique/Ouidah/porte-non-retour/gallery_D-BEN-9929-75326.jpg',
    gastronomique: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  };

  function normalizeImageUrl(url) {
    if (typeof url !== 'string') return null;
    const cleaned = url.trim();
    return /^https?:\/\//i.test(cleaned) ? cleaned : null;
  }

  const heroImgs = $derived(
    (() => {
      const images = Array.from(new Set([...(site?.imagesCouverture ?? []), ...(site?.images ?? [])]
        .map(normalizeImageUrl)
        .filter(Boolean)));
      return images.length ? images : (site?.images ?? []);
    })()
  );

  const heroSrc = $derived(
    imgErrCount < heroImgs.length ? heroImgs[activeImg] ?? heroImgs[0] : null
  );

  const galleryImages = $derived(
    (() => {
      const images = Array.from(new Set([...(site?.imagesCouverture ?? []), ...(site?.images ?? [])]
        .map(normalizeImageUrl)
        .filter(Boolean)));
      return images.length
        ? images
        : (site?.category?.slug && catFallbacks[site.category.slug] ? [catFallbacks[site.category.slug]] : []);
    })()
  );

  function videoEmbedUrl(url) {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      }
      if (u.hostname === 'youtu.be' && u.pathname) {
        return `https://www.youtube.com/embed${u.pathname}`;
      }
    } catch {
      // keep original URL for non-standard links
    }
    return url;
  }

  // Formatage horaires (évite JSON.stringify brut)
  function horaireLines(h) {
    if (!h || typeof h !== 'object') return [];
    const labels = {
      ouverture:'Ouverture', fermeture:'Fermeture', lundi:'Lundi',
      mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi',
      samedi:'Samedi', dimanche:'Dimanche', autres:'Autres jours',
      lundi_samedi:'Lun – Sam', saison:'Saison'
    };
    return Object.entries(h).map(([k, v]) => ({ label: labels[k] ?? k, value: String(v) }));
  }

  // Formatage tarifs
  function tarifLines(t) {
    if (!t || typeof t !== 'object') return [];
    const labels = {
      adulte:'Adulte', enfant:'Enfant', entree:'Entrée',
      pirogue:'Pirogue', pirogueAller:'Pirogue (aller-retour)', vehicule:'Véhicule'
    };
    return Object.entries(t)
      .filter(([k]) => k !== 'devise' && typeof t[k] === 'number')
      .map(([k, v]) => ({ label: labels[k] ?? k, value: formatPrix(v, t.devise ?? 'XOF') }));
  }

  // Action scroll-reveal
  function reveal(node, delay = 0) {
    node.style.cssText += `;opacity:0;transform:translateY(28px);transition:opacity .6s ease ${delay}ms,transform .6s ease ${delay}ms`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        io.disconnect();
      }
    }, { threshold: 0.07 });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(async () => {
    try {
      site = await sitesApi.getBySlug($page.params.slug);
      if (authStore.isLoggedIn) {
        const r = await fetch(`/api/favorites/check/${site.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        isFav = (await r.json()).isFavorite;
      }
    } catch { toastStore.error('Site introuvable'); }
    finally { isLoading = false; }
  });

  async function toggleFav() {
    if (!authStore.isLoggedIn) return toastStore.info('Connectez-vous pour sauvegarder');
    try {
      const r = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${authStore.token}` },
        body: JSON.stringify({ siteId: site.id })
      });
      isFav = (await r.json()).isFavorite;
      toastStore.success(isFav ? 'Ajouté aux favoris ❤️' : 'Retiré des favoris');
    } catch { toastStore.error('Erreur'); }
  }
</script>

<svelte:head>
  {#if site}<title>{site.nomFr} — BeninExplore</title>{/if}
</svelte:head>

{#if isLoading}
  <div class="loading-page">
    <div class="skeleton hero-skeleton"></div>
    <div class="container load-body">
      <div class="skeleton" style="height:2rem; width:60%; border-radius:8px"></div>
      <div class="skeleton" style="height:1rem; width:40%; border-radius:8px; margin-top:.75rem"></div>
      <div class="skeleton" style="height:120px; border-radius:12px; margin-top:2rem"></div>
    </div>
  </div>

{:else if site}

  <!-- ── HERO ──────────────────────────────────────────── -->
  <div class="hero-wrap">
    <!-- Image principale -->
    <div class="hero-img-wrap">
      {#if heroSrc}
        <img
          class="hero-img"
          src={heroSrc}
          alt={site.nomFr}
          referrerpolicy="no-referrer"
          onerror={() => imgErrCount++}
        />
      {:else if catFallbacks[site.category?.slug]}
        <img
          class="hero-img"
          src={catFallbacks[site.category?.slug]}
          alt={site.nomFr}
          referrerpolicy="no-referrer"
        />
      {:else}
        <div class="hero-placeholder">🇧🇯</div>
      {/if}
      <div class="hero-overlay" aria-hidden="true"></div>
    </div>

    <!-- Barre de navigation + actions -->
    <div class="hero-topbar">
      <a href="/sites" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Toutes destinations
      </a>
      <button class="fav-btn" onclick={toggleFav} aria-label="Favori" title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
        {isFav ? '❤️' : '🤍'}
      </button>
    </div>

    <!-- Infos sur l'image -->
    <div class="hero-info container">
      <div class="hero-meta">
        <span class="hbadge" style="background:{site.category?.couleur}22; color:{site.category?.couleur}; border:1px solid {site.category?.couleur}44">
          {site.category?.nomFr}
        </span>
        <span class="hloc">📍 {site.region?.nomFr}</span>
        {#if site.estVedette}<span class="hbadge hbadge-gold">⭐ Vedette</span>{/if}
      </div>
      <h1 class="hero-title">{site.nomFr}</h1>
      <div class="hero-rating">
        <span class="stars">{'★'.repeat(Math.round(site.noteMoyenne))}{'☆'.repeat(5 - Math.round(site.noteMoyenne))}</span>
        <span class="rnum">{site.noteMoyenne?.toFixed(1)}/5</span>
        <span class="rcount">— {site.nombreAvis} avis</span>
      </div>
    </div>
  </div>

  <!-- ── GALERIE MINIATURES ────────────────────────────── -->
  {#if site.imagesCouverture?.length > 1}
    <div class="thumbs-strip" use:reveal={0}>
      {#each site.imagesCouverture as img, i}
        <button
          class="thumb"
          class:thumb-active={i === activeImg}
          onclick={() => { activeImg = i; imgErrCount = 0; }}
          aria-label="Image {i + 1}"
        >
          <img src={img} alt="" referrerpolicy="no-referrer" loading="lazy" />
          {#if i === activeImg}<div class="thumb-ring" aria-hidden="true"></div>{/if}
        </button>
      {/each}
    </div>
  {/if}

  <!-- ── CONTENU ───────────────────────────────────────── -->
  <div class="container detail-layout">

    <!-- COLONNE PRINCIPALE -->
    <main class="detail-main">

      <!-- Description -->
      <section class="detail-section" use:reveal={80}>
        <h2 class="section-title">
          <span class="section-accent" style="background:{site.category?.couleur}"></span>
          À propos
        </h2>
        <p class="detail-text">{site.descriptionFr}</p>
        {#if site.histoireFr}
          <h3 class="subsection-title">Histoire</h3>
          <p class="detail-text">{site.histoireFr}</p>
        {/if}
      </section>

      <!-- Grille d'images et vidéo -->
      {#if galleryImages.length || site.videoUrl}
        <section class="detail-section" use:reveal={120}>
          <h2 class="section-title">
            <span class="section-accent" style="background:{site.category?.couleur}"></span>
            Galerie photos & vidéo
          </h2>

          {#if site.videoUrl}
            <div class="video-card">
              <div class="video-label">🎥 Vidéo de présentation</div>
              <div class="video-frame-wrap">
                <iframe
                  class="video-frame"
                  src={videoEmbedUrl(site.videoUrl)}
                  title="Vidéo de la destination"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          {/if}

          {#if galleryImages.length}
            <div class="img-grid">
              {#each galleryImages as img, i}
                <div class="img-grid-item" style="animation-delay:{i*80}ms">
                  <img
                    src={brokenGallery.has(img) ? (catFallbacks[site.category?.slug] ?? img) : img}
                    alt=""
                    referrerpolicy="no-referrer"
                    loading="lazy"
                    onerror={() => {
                      if (!brokenGallery.has(img)) {
                        brokenGallery = new Set([...brokenGallery, img]);
                      }
                    }}
                  />
                </div>
              {/each}
            </div>
          {/if}
        </section>
      {/if}

      <!-- Avis -->
      <section class="detail-section reviews-section" use:reveal={160}>
        <div class="reviews-header">
          <h2 class="section-title" style="margin-bottom:0">
            <span class="section-accent" style="background:{site.category?.couleur}"></span>
            Avis des visiteurs
            <span class="reviews-count">{site.nombreAvis}</span>
          </h2>
          {#if authStore.isLoggedIn}
            <button class="btn btn-outline btn-sm" onclick={() => showReview = !showReview}>
              {showReview ? 'Annuler' : '+ Mon avis'}
            </button>
          {/if}
        </div>

        {#if showReview}
          <div class="review-form-wrap">
            <ReviewForm siteId={site.id} onSuccess={() => showReview = false} />
          </div>
        {/if}

        {#if site.reviews?.length}
          <div class="reviews-list">
            {#each site.reviews as review, i}
              <div class="review-card" style="animation-delay:{i*60}ms" use:reveal={i * 60}>
                <div class="review-head">
                  <div class="reviewer-av">{review.user.prenom[0]}{review.user.nom[0]}</div>
                  <div class="reviewer-info">
                    <strong>{review.user.prenom} {review.user.nom}</strong>
                    <div class="stars">{'★'.repeat(review.note)}{'☆'.repeat(5 - review.note)}</div>
                  </div>
                  <time class="review-date">{formatDate(review.createdAt)}</time>
                </div>
                <p class="review-text">{review.commentaire}</p>
              </div>
            {/each}
          </div>
        {:else}
          <p class="no-reviews">Aucun avis pour l'instant. Soyez le premier !</p>
        {/if}
      </section>
    </main>

    <!-- SIDEBAR -->
    <aside class="detail-sidebar" use:reveal={200}>

      <!-- Infos pratiques -->
      <div class="info-card">
        <h3 class="info-card-title">Infos pratiques</h3>

        {#if site.horaires}
          <div class="info-block">
            <div class="info-icon-wrap" style="background:{site.category?.couleur}18; color:{site.category?.couleur}">🕐</div>
            <div class="info-content">
              <strong>Horaires</strong>
              {#each horaireLines(site.horaires) as line}
                <div class="info-line">
                  <span class="info-key">{line.label}</span>
                  <span class="info-val">{line.value}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if site.gratuit}
          <div class="info-block">
            <div class="info-icon-wrap" style="background:#1e573820; color:#1E5738">💚</div>
            <div class="info-content">
              <strong>Entrée gratuite</strong>
              <p>Accès libre pour tous</p>
            </div>
          </div>
        {:else if tarifLines(site.tarifs).length}
          <div class="info-block">
            <div class="info-icon-wrap" style="background:{site.category?.couleur}18; color:{site.category?.couleur}">💰</div>
            <div class="info-content">
              <strong>Tarifs</strong>
              {#each tarifLines(site.tarifs) as t}
                <div class="info-line">
                  <span class="info-key">{t.label}</span>
                  <span class="info-val">{t.value}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if site.avecGuide}
          <div class="info-block">
            <div class="info-icon-wrap" style="background:#e8982a20; color:#E8982A">🧭</div>
            <div class="info-content">
              <strong>Guide recommandé</strong>
              <p>Un guide local enrichira votre visite</p>
            </div>
          </div>
        {/if}

        {#if site.enfants}
          <div class="info-block">
            <div class="info-icon-wrap" style="background:#2563eb20; color:#2563EB">👶</div>
            <div class="info-content">
              <strong>Adapté aux enfants</strong>
              <p>Convient aux familles</p>
            </div>
          </div>
        {/if}

        <div class="info-block">
          <div class="info-icon-wrap" style="background:{site.category?.couleur}18; color:{site.category?.couleur}">📍</div>
          <div class="info-content">
            <strong>Adresse</strong>
            <p>{site.adresse}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <a href="/reservations" class="btn btn-primary btn-block">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
        Réserver un guide
      </a>
      <a
        href="https://www.openstreetmap.org/?mlat={site.latitude}&mlon={site.longitude}#map=14/{site.latitude}/{site.longitude}"
        target="_blank"
        rel="noopener"
        class="btn btn-outline btn-block"
        style="margin-top:.75rem"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/></svg>
        Voir sur la carte
      </a>
    </aside>
  </div>
{/if}

<style>
  /* ── Loading ── */
  .loading-page { padding-bottom: 4rem; }
  .hero-skeleton { height: 480px; border-radius: 0; }
  .load-body { padding-top: 2rem; display: flex; flex-direction: column; gap: .5rem; }

  /* ── Hero ── */
  .hero-wrap {
    position: relative;
    height: 500px;
    overflow: hidden;
    background: var(--color-ocean-dark);
  }
  @media (max-width: 640px) { .hero-wrap { height: 320px; } }

  .hero-img-wrap { position: absolute; inset: 0; }
  .hero-img {
    width: 100%; height: 100%; object-fit: cover;
    transform: scale(1.03);
    animation: heroZoom 12s ease-in-out infinite alternate;
  }
  @keyframes heroZoom {
    from { transform: scale(1.03); }
    to   { transform: scale(1.10); }
  }
  .hero-placeholder { height: 100%; display:flex; align-items:center; justify-content:center; font-size: 5rem; }

  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(8,37,53,0.90) 0%,
      rgba(8,37,53,0.45) 50%,
      rgba(8,37,53,0.20) 100%
    );
  }

  /* Topbar */
  .hero-topbar {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.25rem var(--container-padding);
    z-index: 2;
    background: linear-gradient(to bottom, rgba(8,37,53,0.5) 0%, transparent 100%);
  }
  .back-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    color: rgba(255,255,255,0.85); font-size: var(--text-sm); font-weight: 600;
    transition: var(--transition); text-decoration: none;
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    padding: .45rem 1rem; border-radius: var(--radius-full);
    border: 1px solid rgba(255,255,255,0.2);
  }
  .back-btn:hover { background: rgba(255,255,255,0.22); color: white; }
  .fav-btn {
    font-size: 1.5rem; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2); border-radius: 50%;
    width: 42px; height: 42px; display: flex; align-items:center; justify-content:center;
    cursor: pointer; transition: var(--transition);
  }
  .fav-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }

  /* Info overlay */
  .hero-info {
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; z-index: 2;
    padding-bottom: 2rem;
    animation: fadeUp .75s cubic-bezier(.4,0,.2,1) .2s both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateX(-50%) translateY(20px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
  .hero-meta { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-bottom: .6rem; }
  .hbadge {
    padding: .2rem .7rem; border-radius: var(--radius-full);
    font-size: .7rem; font-weight: 700;
  }
  .hbadge-gold { background: var(--color-gold) !important; color: white !important; border-color: transparent !important; }
  .hloc { color: rgba(255,255,255,0.7); font-size: var(--text-sm); }
  .hero-title {
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    color: white; line-height: 1.15; margin-bottom: .5rem;
    text-shadow: 0 2px 12px rgba(0,0,0,.4);
  }
  .hero-rating { display: flex; align-items: center; gap: .4rem; color: white; }
  .stars { color: var(--color-gold); font-size: .85rem; letter-spacing: .04em; }
  .rnum { font-weight: 700; font-size: var(--text-sm); }
  .rcount { opacity: .65; font-size: var(--text-sm); }

  /* ── Galerie miniatures ── */
  .thumbs-strip {
    display: flex; gap: .5rem; padding: .75rem var(--container-padding);
    background: var(--color-ocean-dark); overflow-x: auto;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.2) transparent;
  }
  .thumb {
    flex-shrink: 0; width: 88px; height: 60px;
    border-radius: var(--radius-sm); overflow: hidden;
    border: 2px solid transparent; cursor: pointer; padding: 0;
    position: relative; transition: transform .2s ease;
  }
  .thumb:hover { transform: scale(1.05); }
  .thumb-active { border-color: var(--color-gold); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-ring {
    position: absolute; inset: 0;
    box-shadow: inset 0 0 0 2px var(--color-gold);
    border-radius: calc(var(--radius-sm) - 1px);
    pointer-events: none;
  }

  /* ── Layout ── */
  .detail-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2.5rem;
    padding-block: 2.5rem;
    align-items: start;
  }
  @media (max-width: 1024px) { .detail-layout { grid-template-columns: 1fr; } }

  /* ── Sections ── */
  .detail-section { margin-bottom: 2.5rem; }
  .section-title {
    font-family: var(--font-display); font-size: 1.55rem; font-weight: 600;
    margin-bottom: 1rem; display: flex; align-items: center; gap: .65rem;
  }
  .section-accent { display: inline-block; width: 4px; height: 1.2em; border-radius: 2px; flex-shrink: 0; }
  .subsection-title {
    font-family: var(--font-display); font-size: 1.2rem; font-weight: 600;
    margin-top: 1.5rem; margin-bottom: .6rem;
    color: var(--color-earth-medium);
  }
  .detail-text { font-size: var(--text-base); line-height: 1.75; color: var(--color-earth-medium); }

  /* ── Galerie photos & vidéo ── */
  .video-card {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: var(--radius-md);
    background: linear-gradient(145deg, rgba(13,59,92,0.06), rgba(13,59,92,0.02));
    border: 1px solid var(--color-border);
  }
  .video-label {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-ocean);
    margin-bottom: .75rem;
  }
  .video-frame-wrap {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: #000;
  }
  .video-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: .5rem;
  }
  .img-grid-item {
    border-radius: var(--radius-md); overflow: hidden;
    aspect-ratio: 4/3;
    animation: scaleIn .5s ease both;
  }
  .img-grid-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
  .img-grid-item:hover img { transform: scale(1.06); }
  @keyframes scaleIn { from { opacity:0; transform: scale(.92); } to { opacity:1; transform: scale(1); } }

  /* ── Avis ── */
  .reviews-section { border-top: 1px solid var(--color-border); padding-top: 2rem; }
  .reviews-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
  .reviews-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--color-ivory-dark); color: var(--color-earth-medium);
    border-radius: var(--radius-full);
    font-size: var(--text-sm); font-weight: 700;
    width: 1.75rem; height: 1.75rem; font-family: var(--font-body);
  }
  .btn-sm { padding: .35rem .8rem; font-size: var(--text-xs); }
  .review-form-wrap { margin-bottom: 1.5rem; }
  .reviews-list { display: flex; flex-direction: column; gap: .75rem; }
  .review-card {
    padding: 1.1rem 1.25rem; background: var(--color-ivory-dark);
    border-radius: var(--radius-md); border-left: 3px solid var(--color-gold);
  }
  .review-head { display: flex; align-items: center; gap: .75rem; margin-bottom: .65rem; }
  .reviewer-av {
    width: 36px; height: 36px; background: var(--color-ocean); color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: .7rem; font-weight: 700; text-transform: uppercase; flex-shrink: 0;
  }
  .reviewer-info { flex: 1; }
  .reviewer-info strong { display: block; font-size: var(--text-sm); }
  .stars { color: var(--color-gold); font-size: .75rem; }
  .review-date { font-size: var(--text-xs); color: var(--color-earth-light); white-space: nowrap; }
  .review-text { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.6; }
  .no-reviews { color: var(--color-earth-light); font-style: italic; padding: 1rem 0; }

  /* ── Sidebar ── */
  .detail-sidebar { position: sticky; top: calc(var(--nav-h) + 1.5rem); }
  .info-card {
    background: white; border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md); padding: 1.5rem;
    margin-bottom: 1rem;
  }
  .info-card-title {
    font-family: var(--font-display); font-size: 1.2rem; font-weight: 600;
    margin-bottom: 1.25rem; padding-bottom: .75rem;
    border-bottom: 1px solid var(--color-border);
  }
  .info-block {
    display: flex; gap: .75rem; padding: .75rem 0;
    border-bottom: 1px solid var(--color-ivory-dark);
  }
  .info-block:last-child { border-bottom: none; padding-bottom: 0; }
  .info-icon-wrap {
    width: 36px; height: 36px; border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .info-content { flex: 1; }
  .info-content strong { display: block; font-size: var(--text-sm); color: var(--color-earth); margin-bottom: .2rem; }
  .info-content p { font-size: var(--text-xs); color: var(--color-earth-medium); line-height: 1.5; }
  .info-line {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: .5rem; margin-top: .25rem;
  }
  .info-key { font-size: var(--text-xs); color: var(--color-earth-light); }
  .info-val { font-size: var(--text-xs); font-weight: 600; color: var(--color-earth); }

  .btn-block { width: 100%; justify-content: center; }
</style>
