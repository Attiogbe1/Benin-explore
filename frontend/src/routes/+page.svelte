<script>
  import { onMount } from 'svelte';
  import SiteCard from '$lib/components/sites/SiteCard.svelte';
  import { sitesApi } from '$lib/api/sites.api.js';
  import { api } from '$lib/api/client.js';

  let vedetteSites      = $state([]);
  let categories        = $state([]);
  let featuredServices  = $state([]);
  let isLoading         = $state(true);

  const serviceTypeLabels = {
    HEBERGEMENT: '🏨 Hébergement', TRANSPORT: '🚗 Transport',
    GUIDE: '🧭 Guide', ACTIVITE: '🎯 Activité', RESTAURANT: '🍽️ Restaurant'
  };
  const serviceTypeColors = {
    HEBERGEMENT: '#0D3B5C', RESTAURANT: '#C4622D',
    GUIDE: '#2d7a4f',       TRANSPORT: '#7c3aed',  ACTIVITE: '#E8982A'
  };

  function formatPrixLocal(prix) {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';
  }

  const heroStats = [
    { value: '20+',   label: 'Sites touristiques' },
    { value: '6',     label: 'Régions' },
    { value: '2000+', label: 'Touristes/an' },
    { value: '1',     label: 'Patrimoine UNESCO' }
  ];

  const catImages = {
    historique:    'https://voyageavecnous.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-06-a-15.34.01_422ced3c-1024x682.jpg',
    naturel:       'https://s.rfi.fr/media/display/b9bb7868-10b7-11ea-87b2-005056a99247/w:1024/p:16x9/parc-national-de-la-pendjari-au-benin_0.jpg',
    culturel:      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/11/0f/a0.jpg',
    plage:         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    religieux:     'https://kaleidos2.net/gallery/africa/benin/Atlantique/Ouidah/porte-non-retour/gallery_D-BEN-9929-75326.jpg',
    gastronomique: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  };

  const iconEmojis = {
    landmark: '🏛️', trees: '🌳', palette: '🎨',
    waves: '🏖️', star: '⭐', utensils: '🍽️'
  };

  const heroDests = [
    {
      img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/11/0f/a0.jpg',
      name: 'Ganvié', sub: 'Cité lacustre', href: '/sites/ganvie-cite-lacustre'
    },
    {
      img: 'https://kaleidos2.net/gallery/africa/benin/Atlantique/Ouidah/porte-non-retour/gallery_D-BEN-9929-75326.jpg',
      name: 'Porte du Non-Retour', sub: 'Ouidah — Mémorial UNESCO', href: '/sites/ouidah-route-esclaves'
    },
    {
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      name: 'Grand-Popo', sub: 'Plages & détente', href: '/sites/plages-grand-popo'
    },
  ];

  /* Scroll reveal — inline styles pour éviter tout conflit CSS/SSR */
  function revealOnScroll(node, delay = 0) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(26px)';
    node.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        io.disconnect();
      }
    }, { threshold: 0.06 });

    io.observe(node);
    return {
      update(d) { node.style.transition = `opacity 0.65s ease ${d}ms, transform 0.65s ease ${d}ms`; },
      destroy: () => io.disconnect()
    };
  }

  onMount(async () => {
    try {
      const [sitesRes, catsRes, servicesRes] = await Promise.all([
        sitesApi.list({ vedette: 'true', limit: 6 }),
        sitesApi.categories(),
        api.get('/services', { limit: 4 }).catch(() => ({ data: [] }))
      ]);
      vedetteSites     = sitesRes.data;
      categories       = catsRes;
      featuredServices = servicesRes.data ?? [];
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>BeninExplore — Découvrez le Bénin</title>
</svelte:head>

<!-- ── Hero ─────────────────────────────────── -->
<section class="hero">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="hero-pattern" aria-hidden="true"></div>

  <div class="container hero-wrapper">
    <!-- Texte gauche -->
    <div class="hero-content">
      <div class="hero-badge ha-1">
        <span>🇧🇯</span> Plateforme officielle tourisme Bénin
      </div>
      <h1 class="hero-title ha-2">
        Découvrez la Magie<br><em>du Bénin</em>
      </h1>
      <p class="hero-subtitle ha-3">
        Des palais d'Abomey aux eaux de Ganvié, explorez 20+ destinations
        exceptionnelles. Réservez vos guides et hébergements, planifiez avec
        notre chatbot IA.
      </p>

      <div class="hero-actions ha-4">
        <a href="/sites" class="btn btn-gold hero-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Explorer les destinations
        </a>
        <a href="/map" class="btn hero-btn-outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/>
          </svg>
          Carte interactive
        </a>
      </div>

      <div class="hero-stats ha-5">
        {#each heroStats as stat}
          <div class="stat">
            <span class="stat-value">{stat.value}</span>
            <span class="stat-label">{stat.label}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Cartes destination (desktop) -->
    <div class="hero-visual ha-l" aria-hidden="true">
      <div class="dest-stack">
        {#each heroDests as d, i}
          <a
            href={d.href}
            class="dest-card"
            class:dest-card--offset={i === 1}
            style="animation-delay: {i * 0.5}s"
          >
            <div class="dest-thumb">
              <img src={d.img} alt={d.name} loading="lazy" referrerpolicy="no-referrer" />
            </div>
            <div class="dest-info">
              <strong>{d.name}</strong>
              <span>{d.sub}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" class="dest-arr">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        {/each}
        <div class="dest-badge animate-float-d">
          <span>📍</span> 20+ destinations
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── Catégories ─────────────────────────────── -->
<section class="section section-sm">
  <div class="container">
    <div class="section-header" use:revealOnScroll>
      <h2>Explorer par catégorie</h2>
      <p>Des sites historiques aux plages sauvages</p>
    </div>
    <div class="categories-grid">
      {#each categories as cat, i}
        <a
          href="/sites?categorie={cat.slug}"
          class="cat-card"
          use:revealOnScroll={i * 65}
          style="--cat-color: {cat.couleur}"
        >
          <div class="cat-img-wrap">
            <img src={catImages[cat.slug]} alt="" aria-hidden="true" referrerpolicy="no-referrer" />
            <div class="cat-color-tint" style="background:{cat.couleur}"></div>
          </div>
          <div class="cat-icon-wrap" style="background:{cat.couleur}22; color:{cat.couleur}">
            {iconEmojis[cat.icone] || '🏛️'}
          </div>
          <span class="cat-name">{cat.nomFr}</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- ── Sites vedettes ─────────────────────────── -->
<section class="section" style="background: var(--color-ivory-dark)">
  <div class="container">
    <div class="section-header" use:revealOnScroll>
      <h2>Sites incontournables</h2>
      <p>Les destinations les plus appréciées par nos visiteurs</p>
      <a href="/sites" class="btn btn-outline">Voir tout →</a>
    </div>

    {#if isLoading}
      <div class="sites-grid">
        {#each Array(6) as _}
          <div class="skeleton" style="height:380px; border-radius:var(--radius-lg)"></div>
        {/each}
      </div>
    {:else}
      <div class="sites-grid" use:revealOnScroll>
        {#each vedetteSites as site, i}
          <SiteCard {site} delay={i * 80} />
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- ── CTA Chatbot ────────────────────────────── -->
<section class="section chatbot-cta">
  <div class="container">
    <div class="cta-card" use:revealOnScroll>
      <div class="cta-icon animate-float">🤖</div>
      <div class="cta-content">
        <h2>Votre guide IA personnel</h2>
        <p>BeninGuide connaît le Bénin sur le bout des doigts. Posez-lui vos questions sur les visas,
          la météo, les traditions, les itinéraires personnalisés et bien plus.</p>
        <p class="cta-powered">Propulsé par <strong>Claude AI</strong> (Anthropic)</p>
      </div>
      <div class="cta-actions">
        <button class="btn btn-gold"
          onclick={() => import('$lib/stores/chat.store.svelte.js').then(m => m.chatStore.open())}>
          Discuter avec BeninGuide
        </button>
        <a href="/urgence" class="btn btn-outline">Contacts d'urgence</a>
      </div>
    </div>
  </div>
</section>

<!-- ── Services prestataires ──────────────────── -->
<section class="section services-section">
  <div class="container">
    <div class="section-header" use:revealOnScroll>
      <h2>Services touristiques</h2>
      <p>Hébergements, guides locaux, restaurants et activités — réservez directement auprès de prestataires vérifiés</p>
      <a href="/prestataires" class="btn btn-outline">Voir tous les prestataires →</a>
    </div>

    {#if featuredServices.length > 0}
      <div class="services-grid" use:revealOnScroll={100}>
        {#each featuredServices as svc, i}
          <a href="/prestataires/{svc.provider?.id ?? ''}" class="svc-card card" use:revealOnScroll={i * 80}>
            <div class="svc-img-wrap">
              {#if svc.images?.[0]}
                <img src={svc.images[0]} alt={svc.nomFr} class="svc-img" referrerpolicy="no-referrer" />
              {:else}
                <div class="svc-img-fallback" style="background:{serviceTypeColors[svc.type]}22">
                  <span style="font-size:2.5rem">{serviceTypeLabels[svc.type]?.[0] ?? '🛎️'}</span>
                </div>
              {/if}
              <span class="svc-type-badge" style="background:{serviceTypeColors[svc.type]}">
                {serviceTypeLabels[svc.type] ?? svc.type}
              </span>
              {#if svc.videoUrl}
                <span class="svc-video-badge">📹 Vidéo</span>
              {/if}
            </div>
            <div class="svc-body">
              <p class="svc-provider">🏢 {svc.provider?.nomEntreprise ?? '—'}</p>
              <h3>{svc.nomFr}</h3>
              <p class="svc-desc">{svc.descriptionFr?.slice(0, 75)}…</p>
              <div class="svc-footer">
                <span class="svc-prix">{formatPrixLocal(svc.prix)}</span>
                <span class="svc-cta">Voir →</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else if !isLoading}
      <!-- Aucun service encore : montrer les types disponibles -->
      <div class="services-types-grid" use:revealOnScroll={100}>
        {#each [
          { type: 'HEBERGEMENT', icon: '🏨', titre: 'Hébergement',   desc: 'Hôtels, villas, guesthouses et campements écotouristiques' },
          { type: 'RESTAURANT',  icon: '🍽️', titre: 'Restauration',   desc: 'Restaurants, maquis locaux et traiteurs, cuisine béninoise authentique' },
          { type: 'GUIDE',       icon: '🧭', titre: 'Guides locaux',  desc: 'Guides touristiques certifiés pour découvrir chaque région' },
          { type: 'ACTIVITE',    icon: '🎯', titre: 'Activités',      desc: 'Sorties culturelles, sports nautiques, artisanat et plus' }
        ] as item, i}
          <a href="/prestataires?type={item.type}" class="stype-card" use:revealOnScroll={i * 70}
             style="--accent:{serviceTypeColors[item.type]}">
            <div class="stype-icon">{item.icon}</div>
            <h3>{item.titre}</h3>
            <p>{item.desc}</p>
            <span class="stype-link">Découvrir →</span>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- ── Bandeau Prestataire ─────────────────────── -->
<section class="section provider-banner-section" use:revealOnScroll>
  <div class="container">
    <div class="provider-banner">
      <div class="pb-deco">
        <span class="pb-emoji">🏢</span>
        <span class="pb-emoji pb-emoji--2">📹</span>
        <span class="pb-emoji pb-emoji--3">📬</span>
      </div>
      <div class="pb-content">
        <span class="pb-badge">Pour les professionnels du tourisme</span>
        <h2>Vous proposez des services touristiques ?</h2>
        <p>Rejoignez BeninExplore et touchez des milliers de voyageurs. Présentez votre hébergement ou restaurant en vidéo, recevez des réservations en temps réel et gérez tout depuis votre espace personnel.</p>
        <div class="pb-features">
          <span>✅ Inscription gratuite</span>
          <span>📹 Présentation vidéo YouTube / Vimeo</span>
          <span>📬 Notifications instantanées</span>
          <span>📊 Tableau de bord complet</span>
        </div>
      </div>
      <div class="pb-actions">
        <a href="/devenir-prestataire" class="btn btn-gold pb-btn">
          Devenir prestataire →
        </a>
        <a href="/prestataires" class="btn pb-btn-outline">
          Voir les prestataires
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ── Pourquoi BeninExplore ──────────────────── -->
<section class="section">
  <div class="container">
    <div class="section-header" use:revealOnScroll>
      <h2>Pourquoi BeninExplore ?</h2>
    </div>
    <div class="features-grid">
      {#each [
        { icon: '🗺️', title: 'Carte interactive', desc: 'Explorez tous les sites sur une carte OpenStreetMap avec filtres et détails.' },
        { icon: '🤖', title: 'Chatbot IA',         desc: 'BeninGuide répond à vos questions 24h/24 en 4 langues grâce à Claude AI.' },
        { icon: '🏨', title: 'Réservations',       desc: 'Réservez guides, hôtels, transports directement sur la plateforme.' },
        { icon: '📱', title: 'Hors-ligne',          desc: 'Accédez aux informations essentielles même sans connexion.' }
      ] as feature, i}
        <div class="feature-card" use:revealOnScroll={i * 90}>
          <span class="feature-icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Informations pratiques ─────────────────── -->
<section class="section infos-section">
  <div class="container">
    <div class="section-header" use:revealOnScroll>
      <h2>Informations pratiques</h2>
      <p>Tout ce qu'il faut savoir avant de partir au Bénin</p>
    </div>
    <div class="infos-grid">
      {#each [
        { icon: '🛂', titre: 'Visa e-Bénin',    desc: 'Obtenez votre visa en ligne en 48 h. Démarches 100 % numériques avant le départ.',     lien: '/urgence',  cta: 'Infos visa' },
        { icon: '💊', titre: 'Santé',            desc: 'Vaccin fièvre jaune obligatoire. Antipaludéens et assurance santé recommandés.',        lien: '/urgence',  cta: 'Conseils santé' },
        { icon: '💰', titre: 'Monnaie',          desc: 'Franc CFA (XOF). 1 € ≈ 655 XOF. Distributeurs à Cotonou, carte Visa acceptée.',        lien: null,        cta: null },
        { icon: '🌡️', titre: 'Météo',            desc: 'Meilleure saison : novembre–mars (saison sèche). Évitez juillet–août (grandes pluies).', lien: null,        cta: null },
        { icon: '🌐', titre: 'Langues',          desc: 'Français (officiel), Fon, Yoruba. Guides anglophones disponibles via BeninExplore.',    lien: null,        cta: null },
        { icon: '✈️', titre: 'Transport',        desc: 'Aéroport de Cotonou (COO). Taxis-motos (zemijans) et VTC pour les déplacements locaux.', lien: null,        cta: null },
      ] as info, i}
        <div class="info-card" use:revealOnScroll={i * 65}>
          <div class="info-icon">{info.icon}</div>
          <h3>{info.titre}</h3>
          <p>{info.desc}</p>
          {#if info.lien}
            <a href={info.lien} class="info-link">{info.cta} →</a>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Gamification ───────────────────────────── -->
<section class="section gamif-section">
  <div class="container">
    <div class="gamif-wrapper" use:revealOnScroll>
      <div class="gamif-text">
        <div class="gamif-label">🏆 Explorez &amp; Gagnez</div>
        <h2>Devenez un Explorateur du Bénin</h2>
        <p>Visitez des sites, laissez des avis et réservez des services pour gagner des points et débloquer des badges exclusifs.</p>
        <div class="badges-row">
          {#each [
            { icon: '🌟', name: 'Premier voyage' },
            { icon: '📸', name: 'Photographe'   },
            { icon: '🗺️', name: 'Explorateur'   },
            { icon: '👑', name: 'Ambassadeur'   },
          ] as b, i}
            <div class="badge-chip" style="animation-delay:{i * 0.12}s">
              <span class="badge-emoji">{b.icon}</span>
              <span class="badge-name">{b.name}</span>
            </div>
          {/each}
        </div>
        <a href="/auth/register" class="btn btn-gold gamif-cta">Commencer l'aventure →</a>
      </div>

      <div class="gamif-card" aria-hidden="true">
        <div class="gc-top">
          <span class="gc-title">🏅 Explorateur Bronze</span>
          <span class="gc-pts">1 250 pts</span>
        </div>
        <div class="gc-bar"><div class="gc-fill" style="width:62%"></div></div>
        <p class="gc-sub">62% vers le niveau Argent — encore 750 pts</p>
        <div class="gc-leaderboard">
          {#each [
            { pos: '🥇', name: 'Kofi A.',  pts: '4 820 pts', you: false },
            { pos: '🥈', name: 'Ama D.',   pts: '3 310 pts', you: false },
            { pos: '🥉', name: 'Vous',     pts: '1 250 pts', you: true  },
          ] as r}
            <div class="gc-rank" class:gc-you={r.you}>
              <span>{r.pos} {r.name}</span>
              <span>{r.pts}</span>
            </div>
          {/each}
        </div>
        <div class="gc-badges">
          {#each ['🌟','📸','🗺️'] as b}
            <span class="gc-badge-mini">{b}</span>
          {/each}
          <span class="gc-badge-lock">🔒</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Keyframe local pour garantir floatAnim dans le contexte scopé */
  @keyframes floatAnim {
    0%, 100% { transform: translateY(0);    }
    50%       { transform: translateY(-9px); }
  }

  /* ── Hero ─────────────────────────────────── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    position: relative;
    background:
      url('https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/11/0f/a0.jpg')
      center / cover no-repeat;
    overflow: hidden;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      135deg,
      rgba(8,37,53,0.92) 0%,
      rgba(13,59,92,0.83) 50%,
      rgba(26,74,110,0.78) 100%
    );
  }
  .hero-pattern {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: repeating-linear-gradient(45deg, #E8982A 0, #E8982A 1px, transparent 0, transparent 50%);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .hero-wrapper {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: var(--space-12);
    padding-block: var(--space-16);
    color: white;
  }

  /* Left — texte */
  .hero-badge {
    display: inline-flex; align-items: center; gap: var(--space-2);
    background: rgba(255,255,255,0.1);
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
    font-size: var(--text-sm); margin-bottom: var(--space-6);
    border: 1px solid rgba(255,255,255,0.2); width: fit-content;
  }
  .hero-title {
    font-size: clamp(2.4rem, 5vw, 4.5rem); font-weight: 600; line-height: 1.1;
    margin-bottom: var(--space-6);
  }
  .hero-title em { color: var(--color-gold); font-style: italic; }
  .hero-subtitle {
    font-size: var(--text-lg); opacity: 0.88;
    margin-bottom: var(--space-8); max-width: 520px; line-height: 1.7;
  }
  .hero-actions {
    display: flex; gap: var(--space-4); flex-wrap: wrap;
    margin-bottom: var(--space-12);
  }
  .hero-btn { padding: var(--space-4) var(--space-8); font-size: var(--text-base); }
  .hero-btn-outline {
    padding: var(--space-4) var(--space-8);
    border: 2px solid rgba(255,255,255,0.45); color: white;
    border-radius: var(--radius-md); font-size: var(--text-base); font-weight: 600;
    display: inline-flex; align-items: center; gap: var(--space-2);
    transition: var(--transition); background: transparent;
    text-decoration: none;
  }
  .hero-btn-outline:hover { background: rgba(255,255,255,0.15); }
  .hero-stats { display: flex; gap: var(--space-8); flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-value {
    display: block;
    font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 700;
    color: var(--color-gold);
  }
  .stat-label { font-size: var(--text-xs); opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em; }

  /* Right — cartes destination */
  .hero-visual { display: flex; align-items: center; justify-content: center; }
  .dest-stack {
    display: flex; flex-direction: column; gap: var(--space-3);
    width: 100%; max-width: 340px;
  }
  .dest-card {
    background: rgba(255,255,255,0.10);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: var(--radius-lg);
    padding: var(--space-3) var(--space-4);
    display: flex; align-items: center; gap: var(--space-3);
    color: white; text-decoration: none;
    transition: var(--transition);
    animation: floatAnim 5s ease-in-out infinite;
  }
  .dest-card:hover { background: rgba(255,255,255,0.2); transform: translateX(6px); }
  .dest-card--offset { margin-left: var(--space-8); animation-delay: 1.5s !important; }
  .dest-thumb {
    width: 46px; height: 46px; border-radius: var(--radius-md);
    overflow: hidden; flex-shrink: 0;
  }
  .dest-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .dest-info { flex: 1; }
  .dest-info strong { display: block; font-size: var(--text-sm); font-weight: 600; }
  .dest-info span { font-size: var(--text-xs); opacity: 0.68; }
  .dest-arr { opacity: 0.5; flex-shrink: 0; }
  .dest-badge {
    display: inline-flex; align-items: center; gap: var(--space-2);
    background: var(--color-gold); color: white;
    border-radius: var(--radius-full); padding: var(--space-2) var(--space-4);
    font-size: var(--text-xs); font-weight: 700;
    align-self: flex-start; margin-top: var(--space-2); margin-left: var(--space-4);
  }

  /* ── Sections communes ───────────────────── */
  .section-header { text-align: center; margin-bottom: var(--space-12); }
  .section-header p { color: var(--color-earth-medium); margin-top: var(--space-2); }
  .section-header a { margin-top: var(--space-4); }

  /* ── Catégories ───────────────────────────── */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-4);
  }
  .cat-card {
    display: flex; flex-direction: column; align-items: center;
    padding-bottom: var(--space-5);
    background: white; border-radius: var(--radius-lg);
    text-decoration: none; color: var(--color-earth);
    box-shadow: var(--shadow-sm); transition: var(--transition);
    text-align: center; overflow: hidden;
    gap: 0;
  }
  .cat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
  .cat-img-wrap {
    position: relative; width: 100%; height: 80px; overflow: hidden;
  }
  .cat-img-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease;
  }
  .cat-card:hover .cat-img-wrap img { transform: scale(1.1); }
  .cat-color-tint { position: absolute; inset: 0; opacity: 0.28; }
  .cat-icon-wrap {
    width: 44px; height: 44px; border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-top: var(--space-3);
    transition: transform 0.3s ease;
  }
  .cat-card:hover .cat-icon-wrap { transform: scale(1.15); }
  .cat-name { font-size: var(--text-sm); font-weight: 600; margin-top: var(--space-2); padding: 0 var(--space-2); }

  /* ── Sites grid ──────────────────────────── */
  .sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: var(--space-6);
  }

  /* ── CTA ─────────────────────────────────── */
  .chatbot-cta { background: var(--color-ocean); }
  .cta-card {
    display: flex; align-items: center; gap: var(--space-8);
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius-lg); padding: var(--space-10);
    color: white; flex-wrap: wrap;
  }
  .cta-icon { font-size: 3.5rem; flex-shrink: 0; }
  .cta-content { flex: 1; min-width: 240px; }
  .cta-content h2 { color: white; margin-bottom: var(--space-3); }
  .cta-content p { opacity: 0.85; margin-bottom: var(--space-2); }
  .cta-powered { font-size: var(--text-xs) !important; opacity: 0.6 !important; }
  .cta-powered strong { color: var(--color-gold-light); }
  .cta-actions { display: flex; flex-direction: column; gap: var(--space-3); min-width: 200px; }

  /* ── Features ────────────────────────────── */
  .features-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6);
  }
  .feature-card {
    text-align: center; padding: var(--space-8) var(--space-6);
    background: white; border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm); transition: var(--transition);
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .feature-icon { font-size: 2.4rem; display: block; margin-bottom: var(--space-4); }
  .feature-card h3 { font-size: var(--text-xl); margin-bottom: var(--space-3); }
  .feature-card p { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.6; }

  /* ── Responsive ──────────────────────────── */
  @media (max-width: 1024px) {
    .hero-wrapper { grid-template-columns: 1fr; }
    .hero-visual { display: none; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .hero-title { font-size: clamp(2rem, 8vw, 2.8rem); }
    .hero-subtitle { font-size: var(--text-base); }
    .hero-btn, .hero-btn-outline {
      padding: var(--space-3) var(--space-6);
      font-size: var(--text-sm); width: 100%; justify-content: center;
    }
    .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
    .stat-value { font-size: var(--text-2xl); }
    .categories-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
    .cat-img-wrap { height: 65px; }
    .sites-grid { grid-template-columns: 1fr; }
    .cta-card { flex-direction: column; text-align: center; padding: var(--space-8); gap: var(--space-6); }
    .cta-actions { width: 100%; }
    .features-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
    .feature-card { padding: var(--space-6) var(--space-4); }
    .feature-icon { font-size: 1.8rem; }
  }
  @media (max-width: 400px) {
    .features-grid { grid-template-columns: 1fr; }
    .services-types-grid { grid-template-columns: 1fr; }
    .hero-wrapper { padding-block: var(--space-12); }
  }

  /* ── Services section ─────────────────────── */
  .services-section { background: white; }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-6);
  }
  .svc-card {
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .svc-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
  .svc-img-wrap { position: relative; overflow: hidden; }
  .svc-img { width: 100%; height: 190px; object-fit: cover; display: block; }
  .svc-img-fallback {
    height: 190px; display: flex; align-items: center; justify-content: center;
  }
  .svc-type-badge {
    position: absolute; top: var(--space-3); left: var(--space-3);
    color: white; font-size: 11px; font-weight: 700;
    padding: 3px var(--space-3); border-radius: var(--radius-full);
  }
  .svc-video-badge {
    position: absolute; top: var(--space-3); right: var(--space-3);
    background: rgba(0,0,0,0.65); color: white;
    font-size: 11px; font-weight: 600;
    padding: 3px var(--space-3); border-radius: var(--radius-full);
    backdrop-filter: blur(4px);
  }
  .svc-body { padding: var(--space-5); flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
  .svc-provider { font-size: var(--text-xs); color: var(--color-earth-light); }
  .svc-body h3 { font-size: var(--text-lg); }
  .svc-desc { font-size: var(--text-sm); color: var(--color-earth-medium); flex: 1; }
  .svc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-2); }
  .svc-prix { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700; color: var(--color-ocean); }
  .svc-cta { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); }

  /* Services types (quand aucun service) */
  .services-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: var(--space-5);
  }
  .stype-card {
    display: flex; flex-direction: column; gap: var(--space-3);
    padding: var(--space-6);
    border: 2px solid var(--color-border); border-radius: var(--radius-lg);
    text-decoration: none; color: inherit;
    transition: var(--transition);
    background: white;
  }
  .stype-card:hover {
    border-color: var(--accent); transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .stype-icon { font-size: 2.5rem; }
  .stype-card h3 { font-size: var(--text-lg); }
  .stype-card p { font-size: var(--text-sm); color: var(--color-earth-medium); flex: 1; }
  .stype-link { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); }

  /* ── Informations pratiques ──────────────── */
  .infos-section { background: var(--color-ivory-dark); }
  .infos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
  }
  .info-card {
    background: white; border-radius: var(--radius-lg);
    padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3);
    box-shadow: var(--shadow-sm); transition: var(--transition);
  }
  .info-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .info-icon { font-size: 2.4rem; }
  .info-card h3 { font-size: var(--text-xl); }
  .info-card p  { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.65; flex: 1; }
  .info-link { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); margin-top: auto; }
  .info-link:hover { text-decoration: underline; }
  @media (max-width: 640px) { .infos-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 420px) { .infos-grid { grid-template-columns: 1fr; } }

  /* ── Gamification ─────────────────────────── */
  .gamif-section { background: var(--color-ocean-dark); }
  .gamif-wrapper {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: var(--space-16); align-items: center;
  }
  .gamif-label {
    display: inline-flex; gap: var(--space-2);
    background: rgba(232,152,42,0.2); border: 1px solid rgba(232,152,42,0.4);
    color: var(--color-gold-light); padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: 700;
    margin-bottom: var(--space-4);
  }
  .gamif-text h2 { color: white; margin-bottom: var(--space-4); font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl)); }
  .gamif-text p  { color: rgba(255,255,255,0.78); line-height: 1.7; margin-bottom: var(--space-6); }
  .badges-row { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-8); }
  .badge-chip {
    display: flex; align-items: center; gap: var(--space-2);
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
    animation: fadeUp 0.6s ease both;
  }
  .badge-emoji { font-size: 1.2rem; }
  .badge-name  { color: rgba(255,255,255,0.85); font-size: var(--text-xs); font-weight: 600; }
  .gamif-cta   { margin-top: var(--space-2); }

  .gamif-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: var(--radius-xl); padding: var(--space-8);
    display: flex; flex-direction: column; gap: var(--space-5); color: white;
  }
  .gc-top  { display: flex; justify-content: space-between; align-items: center; }
  .gc-title { font-weight: 700; font-size: var(--text-lg); }
  .gc-pts   { font-family: var(--font-display); font-size: var(--text-2xl); color: var(--color-gold-light); font-weight: 700; }
  .gc-bar   { height: 10px; background: rgba(255,255,255,0.12); border-radius: var(--radius-full); overflow: hidden; }
  .gc-fill  { height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-gold-light)); border-radius: var(--radius-full); }
  .gc-sub   { font-size: var(--text-xs); opacity: 0.65; }
  .gc-leaderboard { display: flex; flex-direction: column; gap: var(--space-2); }
  .gc-rank  {
    display: flex; justify-content: space-between;
    background: rgba(255,255,255,0.05); border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4); font-size: var(--text-sm);
  }
  .gc-you { background: rgba(232,152,42,0.2); border: 1px solid rgba(232,152,42,0.35); }
  .gc-badges { display: flex; gap: var(--space-3); }
  .gc-badge-mini {
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.12); font-size: 1.4rem;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s ease;
  }
  .gc-badge-mini:hover { transform: scale(1.15); }
  .gc-badge-lock { opacity: 0.3; }
  @media (max-width: 900px) { .gamif-wrapper { grid-template-columns: 1fr; gap: var(--space-10); } }

  /* ── Bandeau prestataire ──────────────────── */
  .provider-banner-section { background: var(--color-ivory-dark); }
  .provider-banner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-10);
    align-items: center;
    background: linear-gradient(135deg, var(--color-ocean-dark) 0%, var(--color-ocean) 55%, #1a7fa0 100%);
    border-radius: var(--radius-xl);
    padding: var(--space-10) var(--space-12);
    color: white;
    position: relative;
    overflow: hidden;
  }
  .provider-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .pb-deco { display: flex; flex-direction: column; gap: var(--space-2); position: relative; }
  .pb-emoji { font-size: 2.5rem; display: block; }
  .pb-emoji--2 { margin-left: var(--space-4); opacity: 0.7; }
  .pb-emoji--3 { margin-left: var(--space-2); opacity: 0.5; }
  .pb-content { position: relative; }
  .pb-badge {
    display: inline-block; font-size: var(--text-xs); font-weight: 700;
    background: rgba(232,152,42,0.25); border: 1px solid rgba(232,152,42,0.5);
    color: #fcd34d; padding: 3px var(--space-4); border-radius: var(--radius-full);
    margin-bottom: var(--space-4);
  }
  .pb-content h2 { color: white; font-size: clamp(1.3rem, 2.5vw, 1.8rem); margin-bottom: var(--space-3); }
  .pb-content p { opacity: 0.85; font-size: var(--text-sm); line-height: 1.7; margin-bottom: var(--space-4); }
  .pb-features { display: flex; flex-wrap: wrap; gap: var(--space-3); }
  .pb-features span { font-size: var(--text-xs); background: rgba(255,255,255,0.12); padding: 4px var(--space-3); border-radius: var(--radius-full); }
  .pb-actions { display: flex; flex-direction: column; gap: var(--space-3); position: relative; }
  .pb-btn {
    white-space: nowrap; padding: var(--space-4) var(--space-7);
    font-size: var(--text-base); font-weight: 700;
  }
  .pb-btn-outline {
    padding: var(--space-3) var(--space-6); font-size: var(--text-sm); font-weight: 600;
    border: 1.5px solid rgba(255,255,255,0.4); border-radius: var(--radius-md);
    color: white; text-decoration: none; text-align: center;
    transition: var(--transition);
  }
  .pb-btn-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }

  @media (max-width: 900px) {
    .provider-banner { grid-template-columns: 1fr; text-align: center; padding: var(--space-8); gap: var(--space-6); }
    .pb-deco { flex-direction: row; justify-content: center; }
    .pb-emoji--2, .pb-emoji--3 { margin: 0; }
    .pb-features { justify-content: center; }
    .pb-actions { align-items: center; }
  }
  @media (max-width: 640px) {
    .services-grid { grid-template-columns: 1fr; }
    .services-types-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
