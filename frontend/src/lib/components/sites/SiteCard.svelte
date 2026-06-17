<script>
  import { formatPrix } from '$lib/utils/format.js';

  let { site, langue = 'fr', delay = 0 } = $props();

  const catPlaceholders = {
    historique:    'https://images.trvl-media.com/place/3000001219/29bec893-aed8-479e-ae0a-2564398ec47d.jpg',
    naturel:       'https://images.partir.com/3WyrelRrnOeUbsSJ4smYz6zsETY=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-chutes-kota-tanougou.jpg',
    culturel:      'https://images.trvl-media.com/place/3000449170/d8cbe128-8da7-400c-9e99-cebe305ae2c0.jpg',
    plage:         'https://images.partir.com/g0Hk8nXsvpa9v0dzyFYy4p8ucOs=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-plages-gran-popo.jpg',
    religieux:     'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/800px-Porte_du_non_retour_-_Ouidah.jpg',
    gastronomique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/800px-Ganvie_stilt_village%2C_Benin.jpg',
  };

  const iconEmojis = {
    landmark: '🏛️', trees: '🌳', palette: '🎨',
    waves: '🏖️', star: '⭐', utensils: '🍽️'
  };

  let imgError = $state(false);

  const nom         = $derived(langue === 'fr' ? site.nomFr : (site.nomEn || site.nomFr));
  const description = $derived(langue === 'fr' ? site.descriptionFr : (site.descriptionEn || site.descriptionFr));
  const coverImg    = $derived(site.imagesCouverture?.[0] || null);
  const fallbackImg = $derived(site.category?.slug ? (catPlaceholders[site.category.slug] ?? null) : null);
  const displayImg  = $derived(!imgError ? (coverImg || fallbackImg || null) : (fallbackImg || null));
  const initial     = $derived(nom?.[0]?.toUpperCase() ?? '?');
  const catColor    = $derived(site.category?.couleur ?? '#0D3B5C');
  const catIcon     = $derived(iconEmojis[site.category?.icone ?? ''] ?? '🏛️');

  function reveal(node, d = 0) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(36px)';
    node.style.transition = `opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${d}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${d}ms`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        io.disconnect();
      }
    }, { threshold: 0.08 });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<article class="site-card" use:reveal={delay}>
  <a href="/sites/{site.slug}" class="card-link">

    <!-- Image -->
    <div class="card-image" style="--cat-color:{catColor}">
      {#if displayImg}
        <img
          src={displayImg}
          alt={nom}
          referrerpolicy="no-referrer"
          loading="lazy"
          onerror={() => (imgError = true)}
        />
      {:else}
        <div class="img-placeholder" style="background:linear-gradient(145deg,{catColor} 0%,{catColor}88 100%)">
          <span class="ph-initial">{initial}</span>
          <span class="ph-icon">{catIcon}</span>
        </div>
      {/if}

      <!-- Gradient permanent en bas -->
      <div class="card-gradient" aria-hidden="true"></div>

      <!-- Hover overlay -->
      <div class="card-overlay" aria-hidden="true">
        <span class="overlay-btn">Explorer →</span>
      </div>

      <!-- Badges -->
      {#if site.estVedette}
        <span class="badge badge-vedette">⭐ Vedette</span>
      {/if}
      {#if site.gratuit}
        <span class="badge badge-gratuit">Gratuit</span>
      {/if}

      <!-- Catégorie sur l'image -->
      <span class="badge-cat" style="background:{catColor}ee">
        {catIcon} {site.category?.nomFr || ''}
      </span>
    </div>

    <!-- Corps -->
    <div class="card-body">
      <div class="card-region">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="{catColor}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
        {site.region?.nomFr || ''}
      </div>

      <h3 class="card-title">{nom}</h3>
      <p class="card-desc">{description?.slice(0, 95)}…</p>

      <div class="card-footer">
        <div class="rating">
          <span class="stars">{'★'.repeat(Math.round(site.noteMoyenne))}{'☆'.repeat(5 - Math.round(site.noteMoyenne))}</span>
          <span class="rating-num">{site.noteMoyenne?.toFixed(1) ?? '—'}</span>
          <span class="rating-count">({site.nombreAvis})</span>
        </div>
        {#if site.tarifs?.adulte}
          <span class="prix">À partir de {formatPrix(site.tarifs.adulte, site.tarifs.devise || 'XOF')}</span>
        {:else if site.tarifs?.entree}
          <span class="prix">À partir de {formatPrix(site.tarifs.entree, site.tarifs.devise || 'XOF')}</span>
        {/if}
      </div>
    </div>

    <!-- Accent coloré en bas -->
    <div class="card-accent" style="background:{catColor}"></div>
  </a>
</article>

<style>
  .site-card {
    height: 100%;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-white);
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.35s ease, transform 0.35s ease;
    will-change: transform;
  }
  .site-card:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-6px);
  }

  .card-link {
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column; height: 100%;
    position: relative;
  }

  /* ── Image ── */
  .card-image {
    position: relative; height: 240px; overflow: hidden;
    background: var(--color-ivory-dark);
    flex-shrink: 0;
  }
  .card-image img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .site-card:hover .card-image img { transform: scale(1.08); }

  .img-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.5rem;
  }
  .ph-initial { font-family: var(--font-display); font-size: 3.8rem; font-weight: 700; color: rgba(255,255,255,0.9); line-height:1; }
  .ph-icon { font-size: 1.5rem; opacity: 0.6; }

  /* Gradient permanent en bas de l'image */
  .card-gradient {
    position: absolute; bottom: 0; left: 0; right: 0; height: 70px;
    background: linear-gradient(to top, rgba(8,37,53,0.55) 0%, transparent 100%);
    pointer-events: none;
  }

  /* Overlay hover */
  .card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(8,37,53,0.75) 0%, rgba(8,37,53,0.1) 55%, transparent 100%);
    opacity: 0; transition: opacity 0.3s ease;
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 1.25rem;
    pointer-events: none;
  }
  .site-card:hover .card-overlay { opacity: 1; }
  .overlay-btn {
    background: var(--color-gold); color: white;
    padding: 0.4rem 1.2rem; border-radius: var(--radius-full);
    font-size: var(--text-xs); font-weight: 700;
    transform: translateY(8px); transition: transform 0.3s ease;
  }
  .site-card:hover .overlay-btn { transform: translateY(0); }

  /* Badges */
  .badge {
    position: absolute; top: 0.75rem;
    padding: 0.22rem 0.6rem; border-radius: var(--radius-full);
    font-size: 0.66rem; font-weight: 700; line-height: 1.4;
  }
  .badge-vedette { left: 0.75rem; background: var(--color-gold); color: white; }
  .badge-gratuit { right: 0.75rem; background: var(--color-forest); color: white; }

  /* Catégorie sur image */
  .badge-cat {
    position: absolute; bottom: 0.7rem; left: 0.75rem;
    color: white; padding: 0.2rem 0.65rem; border-radius: var(--radius-full);
    font-size: 0.65rem; font-weight: 600; backdrop-filter: blur(4px);
  }

  /* ── Corps ── */
  .card-body {
    padding: 1rem 1.25rem 1.1rem;
    flex: 1; display: flex; flex-direction: column; gap: 0.55rem;
  }
  .card-region {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: var(--text-xs); color: var(--color-earth-light);
    font-weight: 500;
  }
  .card-title {
    font-family: var(--font-display); font-size: 1.15rem;
    font-weight: 600; line-height: 1.3; margin: 0;
    color: var(--color-earth);
  }
  .card-desc {
    font-size: var(--text-sm); color: var(--color-earth-medium);
    flex: 1; line-height: 1.55;
  }
  .card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto; padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }
  .rating { display: flex; align-items: center; gap: 0.3rem; }
  .stars { color: var(--color-gold); font-size: 0.75rem; letter-spacing: 0.02em; }
  .rating-num { font-size: var(--text-xs); font-weight: 700; color: var(--color-earth); }
  .rating-count { font-size: var(--text-xs); color: var(--color-earth-light); }
  .prix { font-size: var(--text-xs); font-weight: 700; color: var(--color-ocean); white-space: nowrap; }

  /* Accent coloré tout en bas */
  .card-accent { height: 3px; flex-shrink: 0; }
</style>
