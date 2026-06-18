<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client.js';
  import { formatDate } from '$lib/utils/format.js';

  let posts          = $state([]);
  let isLoading      = $state(true);
  let activeCategorie = $state('');

  const CATEGORIES = ['Itinéraires', 'Culture & Histoire', 'Conseils pratiques', 'Gastronomie', 'Activités'];

  const staticPosts = [
    {
      slug: 'guide-3-jours-ouidah',
      titreFr: '3 jours à Ouidah : la Route des Esclaves et ses mystères',
      categorie: 'Itinéraires',
      auteur: 'BeninExplore',
      imageCover: 'https://kaleidos2.net/gallery/africa/benin/Atlantique/Ouidah/porte-non-retour/gallery_D-BEN-9929-75326.jpg',
      extrait: 'Plongez dans l\'histoire de la traite négrière en visitant la Porte du Non-Retour, le Temple des Pythons et les plages mystiques de Ouidah.',
      createdAt: '2025-01-15', readTime: 8, isFeatured: true
    },
    {
      slug: 'ganvie-venise-afrique',
      titreFr: 'Ganvié, la Venise de l\'Afrique : tout savoir avant de visiter',
      categorie: 'Conseils pratiques',
      auteur: 'Marie Kouassi',
      imageCover: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/11/0f/a0.jpg',
      extrait: 'Comment se rendre à Ganvié, quoi emporter, les meilleurs moments pour visiter et les règles à respecter dans ce village lacustre unique.',
      createdAt: '2025-02-03', readTime: 6
    },
    {
      slug: 'cuisine-beninoise-top-10',
      titreFr: 'Les 10 plats incontournables de la cuisine béninoise',
      categorie: 'Gastronomie',
      auteur: 'Chef Kossi',
      imageCover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      extrait: 'Acarajé, pâte de crabe, ablo, tchoukoutou… Découvrez les saveurs authentiques du Bénin et où les déguster.',
      createdAt: '2025-02-18', readTime: 5
    },
    {
      slug: 'pendjari-safari-complet',
      titreFr: 'Safari au Pendjari : lions, éléphants et hippos du Bénin',
      categorie: 'Activités',
      auteur: 'Jean-Baptiste Alabi',
      imageCover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/African_Elephant_at_Pendjari.jpg/800px-African_Elephant_at_Pendjari.jpg',
      extrait: 'Guide complet pour planifier votre safari dans le Parc National de la Pendjari, l\'un des derniers écosystèmes préservés d\'Afrique de l\'Ouest.',
      createdAt: '2025-03-05', readTime: 10
    },
    {
      slug: 'vaudou-benin-initiatique',
      titreFr: 'Le vaudou au Bénin : démystification et voyage initiatique',
      categorie: 'Culture & Histoire',
      auteur: 'BeninExplore',
      imageCover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Abomey_bas-relief.jpg/800px-Abomey_bas-relief.jpg',
      extrait: 'Le vaudou béninois n\'a rien à voir avec les clichés hollywoodiens. Découvrez cette religion ancestrale riche en symboles et spiritualité.',
      createdAt: '2025-03-20', readTime: 12
    },
    {
      slug: 'plages-grand-popo-guide',
      titreFr: 'Grand-Popo : le guide complet des plages et de la détente',
      categorie: 'Activités',
      auteur: 'Sophie Atindehou',
      imageCover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      extrait: 'Séjour détente, sports nautiques, coucher de soleil sur le Mono : tout sur les plages de Grand-Popo.',
      createdAt: '2025-04-02', readTime: 7
    },
  ];

  onMount(async () => {
    try {
      const res = await api.get('/blog');
      posts = res.data?.length ? res.data : staticPosts;
    } catch {
      posts = staticPosts;
    } finally {
      isLoading = false;
    }
  });

  let displayPosts = $derived(
    activeCategorie ? posts.filter(p => p.categorie === activeCategorie) : posts
  );
  let featuredPost = $derived(posts.find(p => p.isFeatured) ?? posts[0]);
  let gridPosts    = $derived(
    activeCategorie
      ? displayPosts
      : displayPosts.filter(p => p !== featuredPost)
  );

  function revealOnScroll(node, delay = 0) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { node.style.opacity = '1'; node.style.transform = 'none'; io.disconnect(); }
    }, { threshold: 0.06 });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<svelte:head><title>Blog & Itinéraires — BeninExplore</title></svelte:head>

<!-- ── Hero blog ─────────────────────────────────── -->
<section class="blog-hero">
  <div class="hero-overlay"></div>
  <div class="container hero-inner">
    <div class="ha-1">
      <div class="hero-badge">✍️ Blog & Itinéraires</div>
      <h1>Explorez le Bénin<br><em>avec nos experts</em></h1>
      <p>Guides de voyage, récits authentiques et itinéraires pour vivre le Bénin au-delà des clichés.</p>
    </div>
    <div class="hero-stats ha-2">
      {#each [['📄', '20+', 'Articles'], ['🗺️', '6', 'Régions couvertes'], ['✍️', '8', 'Auteurs locaux']] as [icon, val, lbl]}
        <div class="hstat">
          <span>{icon}</span>
          <strong>{val}</strong>
          <span>{lbl}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<div class="container blog-body">
  <!-- ── Filtres catégories ─── -->
  <div class="cat-tabs" use:revealOnScroll>
    <button class="cat-tab" class:active={activeCategorie === ''} onclick={() => activeCategorie = ''}>
      Tous les articles
    </button>
    {#each CATEGORIES as cat}
      <button class="cat-tab" class:active={activeCategorie === cat} onclick={() => activeCategorie = cat}>
        {cat}
      </button>
    {/each}
  </div>

  {#if isLoading}
    <div class="blog-grid">
      {#each Array(6) as _}
        <div class="skeleton" style="height:320px; border-radius:var(--radius-lg)"></div>
      {/each}
    </div>

  {:else if posts.length === 0}
    <div class="empty">
      <span>📖</span>
      <h3>Articles bientôt disponibles</h3>
      <p>Notre équipe prépare des guides et itinéraires exceptionnels sur le Bénin.</p>
    </div>

  {:else}
    <!-- ── Article vedette ────── -->
    {#if featuredPost && !activeCategorie}
      <article class="featured" use:revealOnScroll>
        <a href="/blog/{featuredPost.slug}" class="featured-img-wrap">
          {#if featuredPost.imageCover}
            <img src={featuredPost.imageCover} alt={featuredPost.titreFr} class="featured-img" referrerpolicy="no-referrer" onerror={(e) => e.currentTarget.style.display='none'} />
          {/if}
          <div class="featured-overlay"></div>
          <span class="featured-badge">⭐ À la une</span>
        </a>
        <div class="featured-body">
          <span class="post-cat">{featuredPost.categorie}</span>
          <h2><a href="/blog/{featuredPost.slug}">{featuredPost.titreFr}</a></h2>
          {#if featuredPost.extrait}
            <p class="featured-extrait">{featuredPost.extrait}</p>
          {/if}
          <div class="meta-row">
            <span>✍️ {featuredPost.auteur}</span>
            {#if featuredPost.createdAt}<span>📅 {formatDate(featuredPost.createdAt)}</span>{/if}
            {#if featuredPost.readTime}<span>⏱️ {featuredPost.readTime} min de lecture</span>{/if}
          </div>
          <a href="/blog/{featuredPost.slug}" class="btn btn-gold read-btn">Lire l'article →</a>
        </div>
      </article>
    {/if}

    <!-- ── Grille d'articles ─── -->
    {#if gridPosts.length > 0}
      <div class="blog-grid">
        {#each gridPosts as post, i}
          <article class="post-card card" use:revealOnScroll={i * 80}>
            <a href="/blog/{post.slug}" class="post-img-link" tabindex="-1">
              {#if post.imageCover}
                <img src={post.imageCover} alt={post.titreFr} class="post-img" referrerpolicy="no-referrer" onerror={(e) => e.currentTarget.style.display='none'} />
              {:else}
                <div class="post-img-ph">📖</div>
              {/if}
              <span class="cat-overlay">{post.categorie}</span>
            </a>
            <div class="post-body">
              <h3><a href="/blog/{post.slug}">{post.titreFr}</a></h3>
              {#if post.extrait}
                <p class="post-extrait">{post.extrait.slice(0,105)}…</p>
              {/if}
              <div class="meta-row">
                <span>✍️ {post.auteur}</span>
                {#if post.readTime}<span>⏱️ {post.readTime} min</span>{/if}
              </div>
              <a href="/blog/{post.slug}" class="read-more">Lire l'article →</a>
            </div>
          </article>
        {/each}
      </div>
    {/if}

    <!-- ── Partage social CTA ─── -->
    <div class="social-cta" use:revealOnScroll>
      <p>📢 Partagez ces conseils avec vos proches :</p>
      <div class="social-btns">
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://beninexplore.com/blog" target="_blank" rel="noopener" class="social-btn fb">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          Facebook
        </a>
        <a href="https://wa.me/?text=Découvrez%20le%20Bénin%20sur%20https://beninexplore.com/blog" target="_blank" rel="noopener" class="social-btn wa">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          WhatsApp
        </a>
        <a href="https://twitter.com/intent/tweet?text=Découvrez%20le%20Bénin%20&url=https://beninexplore.com/blog" target="_blank" rel="noopener" class="social-btn tw">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
          Twitter/X
        </a>
      </div>
    </div>
  {/if}
</div>

<style>
  /* ── Hero ──────────────────── */
  .blog-hero {
    min-height: 48vh;
    background: url('https://voyageavecnous.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-06-a-15.34.01_422ced3c-1024x682.jpg')
      center / cover no-repeat;
    position: relative; display: flex; align-items: center;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(30,87,56,0.92) 0%, rgba(8,37,53,0.85) 100%);
  }
  .hero-inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--space-12); padding-block: var(--space-16); flex-wrap: wrap; color: white;
  }
  .hero-badge {
    display: inline-flex; gap: var(--space-2);
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
    font-size: var(--text-sm); margin-bottom: var(--space-4); width: fit-content;
  }
  .hero-inner h1 { color: white; font-size: clamp(2rem,5vw,4rem); margin-bottom: var(--space-4); }
  .hero-inner h1 em { color: var(--color-gold-light); font-style: italic; }
  .hero-inner p  { opacity: 0.85; max-width: 440px; font-size: var(--text-lg); line-height: 1.7; }

  .hero-stats { display: flex; flex-direction: column; gap: var(--space-4); flex-shrink: 0; }
  .hstat {
    display: flex; align-items: center; gap: var(--space-4);
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
    border-radius: var(--radius-md); padding: var(--space-4) var(--space-6); color: white;
  }
  .hstat span:first-child { font-size: 1.6rem; }
  .hstat strong { font-family: var(--font-display); font-size: var(--text-2xl); color: var(--color-gold-light); }
  .hstat span:last-child  { font-size: var(--text-sm); opacity: 0.8; }

  .ha-1 { animation: fadeUp 0.7s ease 0.1s both; }
  .ha-2 { animation: fadeUp 0.7s ease 0.3s both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:none; } }

  /* ── Body ──────────────────── */
  .blog-body { padding-block: var(--space-10); }

  /* Category tabs */
  .cat-tabs { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-10); }
  .cat-tab {
    padding: var(--space-2) var(--space-5);
    border: 1.5px solid var(--color-border); border-radius: var(--radius-full);
    background: white; font-size: var(--text-sm); font-weight: 500;
    cursor: pointer; transition: var(--transition); color: var(--color-earth-medium);
  }
  .cat-tab:hover { border-color: var(--color-ocean); color: var(--color-ocean); }
  .cat-tab.active { background: var(--color-ocean); color: white; border-color: var(--color-ocean); }

  /* Featured */
  .featured {
    display: grid; grid-template-columns: 1fr 1fr;
    border-radius: var(--radius-xl); overflow: hidden;
    box-shadow: var(--shadow-lg); margin-bottom: var(--space-12);
    background: white; transition: var(--transition);
  }
  .featured:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
  .featured-img-wrap { position: relative; min-height: 380px; display: block; overflow: hidden; }
  .featured-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
  .featured-img-wrap:hover .featured-img { transform: scale(1.04); }
  .featured-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0));
    pointer-events: none;
  }
  .featured-badge {
    position: absolute; top: var(--space-5); left: var(--space-5);
    background: var(--color-gold); color: white;
    font-size: var(--text-xs); font-weight: 700;
    padding: var(--space-1) var(--space-4); border-radius: var(--radius-full);
  }
  .featured-body {
    padding: var(--space-10);
    display: flex; flex-direction: column; gap: var(--space-4); justify-content: center;
  }
  .post-cat {
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--color-forest);
  }
  .featured-body h2 { font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl)); }
  .featured-body h2 a { color: inherit; text-decoration: none; transition: color 0.2s; }
  .featured-body h2 a:hover { color: var(--color-ocean); }
  .featured-extrait { color: var(--color-earth-medium); line-height: 1.7; }
  .meta-row { display: flex; flex-wrap: wrap; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-earth-light); }
  .read-btn { align-self: flex-start; }

  /* Grid */
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-12);
  }
  .post-card { display: flex; flex-direction: column; }
  .post-img-link { position: relative; overflow: hidden; display: block; }
  .post-img { height: 210px; width: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .post-img-link:hover .post-img { transform: scale(1.06); }
  .post-img-ph { height: 210px; background: var(--color-ivory-dark); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
  .cat-overlay {
    position: absolute; bottom: var(--space-3); left: var(--space-3);
    background: rgba(30,87,56,0.85); color: white;
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    padding: 3px var(--space-3); border-radius: var(--radius-full);
  }
  .post-body { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); flex: 1; }
  .post-body h3 { font-size: var(--text-xl); }
  .post-body h3 a { color: inherit; text-decoration: none; transition: color 0.2s; }
  .post-body h3 a:hover { color: var(--color-ocean); }
  .post-extrait { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.65; flex: 1; }
  .read-more { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); margin-top: auto; }
  .read-more:hover { text-decoration: underline; }

  /* Social CTA */
  .social-cta {
    display: flex; align-items: center; gap: var(--space-6); flex-wrap: wrap;
    background: var(--color-ivory-dark); border-radius: var(--radius-lg);
    padding: var(--space-6) var(--space-8); margin-top: var(--space-4);
  }
  .social-cta p { font-weight: 600; font-size: var(--text-sm); }
  .social-btns { display: flex; gap: var(--space-3); flex-wrap: wrap; }
  .social-btn {
    display: inline-flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) var(--space-5); border-radius: var(--radius-full);
    font-size: var(--text-sm); font-weight: 600;
    text-decoration: none; transition: var(--transition);
  }
  .social-btn.fb { background: #1877F2; color: white; }
  .social-btn.fb:hover { background: #0a5dc1; }
  .social-btn.wa { background: #25D366; color: white; }
  .social-btn.wa:hover { background: #128C7E; }
  .social-btn.tw { background: #1DA1F2; color: white; }
  .social-btn.tw:hover { background: #0d8dda; }

  /* Empty state */
  .empty { text-align: center; padding: var(--space-20); }
  .empty span { font-size: 4rem; display: block; margin-bottom: var(--space-4); }
  .empty h3   { margin-bottom: var(--space-3); }
  .empty p    { color: var(--color-earth-medium); }

  /* Responsive */
  @media (max-width: 900px) {
    .hero-inner { flex-direction: column; }
    .hero-stats { flex-direction: row; flex-wrap: wrap; }
    .hstat { flex: 1; min-width: 140px; }
    .featured { grid-template-columns: 1fr; }
    .featured-img-wrap { min-height: 240px; }
    .featured-body { padding: var(--space-6); }
  }
  @media (max-width: 640px) {
    .blog-grid { grid-template-columns: 1fr; }
    .social-cta { flex-direction: column; align-items: flex-start; }
  }
</style>
