<script>
  import { onMount }       from 'svelte';
  import { page }          from '$app/stores';
  import { goto }          from '$app/navigation';
  import { api }           from '$lib/api/client.js';
  import { formatDate }    from '$lib/utils/format.js';

  let post      = $state(null);
  let related   = $state([]);
  let isLoading = $state(true);
  let notFound  = $state(false);

  const slug = $derived($page.params.slug);

  onMount(async () => {
    try {
      post = await api.get(`/blog/${slug}`);

      // Articles connexes de la même catégorie
      const res = await api.get(`/blog?limit=4`).catch(() => ({ data: [] }));
      related = (res.data ?? []).filter(p => p.slug !== slug).slice(0, 3);
    } catch (err) {
      if (err?.status === 404 || err?.message?.includes('404')) {
        notFound = true;
      } else {
        notFound = true;
      }
    } finally {
      isLoading = false;
    }
  });

  /* Convertit le contenu brut en paragraphes HTML */
  function renderContent(text) {
    if (!text) return '';
    return text
      .split('\n\n')
      .map(block => {
        const b = block.trim();
        if (!b) return '';
        if (b.startsWith('**') && b.endsWith('**') && !b.slice(2,-2).includes('\n')) {
          return `<h3>${b.slice(2,-2)}</h3>`;
        }
        // Transformer **gras** inline
        const withBold = b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return `<p>${withBold.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  function shareOn(platform) {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.titreFr ?? '');
    if (platform === 'facebook')  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    if (platform === 'twitter')   window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    if (platform === 'whatsapp')  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Lien copié !'));
    }
  }

  const catColors = {
    'Itinéraires':       '#0D3B5C',
    'Culture':           '#7C3AED',
    'Culture & Histoire':'#7C3AED',
    'Conseils':          '#1E5738',
    'Conseils pratiques':'#1E5738',
    'Gastronomie':       '#DC2626',
    'Activités':         '#E8982A',
    'Nature':            '#16a34a',
  };
</script>

<svelte:head>
  {#if post}
    <title>{post.titreFr} — Blog BeninExplore</title>
    <meta name="description" content={post.contenuFr?.slice(0, 160) ?? ''} />
    {#if post.imageCover}
      <meta property="og:image" content={post.imageCover} />
    {/if}
  {:else}
    <title>Article — Blog BeninExplore</title>
  {/if}
</svelte:head>

<!-- ── LOADING ──────────────────────────────────────────── -->
{#if isLoading}
  <div class="loading-hero">
    <div class="skeleton sk-hero"></div>
  </div>
  <div class="container article-layout">
    <div class="skeleton sk-title"></div>
    <div class="skeleton sk-meta"></div>
    {#each [1,2,3] as _}
      <div class="skeleton sk-para"></div>
    {/each}
  </div>

<!-- ── NOT FOUND ─────────────────────────────────────────── -->
{:else if notFound}
  <div class="not-found">
    <div class="nf-card">
      <div class="nf-icon">📰</div>
      <h1>Article introuvable</h1>
      <p>Cet article n'existe pas ou n'est plus disponible.</p>
      <div class="nf-actions">
        <a href="/blog" class="btn btn-primary">← Retour au blog</a>
        <a href="/"     class="btn btn-outline">Accueil</a>
      </div>
    </div>
  </div>

<!-- ── ARTICLE ────────────────────────────────────────────── -->
{:else if post}
  <!-- Hero image -->
  <div class="article-hero" style={post.imageCover ? `background-image:url('${post.imageCover}')` : ''}>
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <a href="/blog" class="back-link">← Blog & Itinéraires</a>
      {#if post.categorie}
        <span
          class="cat-badge"
          style="background:{catColors[post.categorie] ?? '#0D3B5C'}"
        >{post.categorie}</span>
      {/if}
      <h1>{post.titreFr}</h1>
      <div class="hero-meta">
        <span class="meta-author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          {post.auteur}
        </span>
        <span class="meta-dot">·</span>
        <span class="meta-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {formatDate(post.createdAt)}
        </span>
        <span class="meta-dot">·</span>
        <span class="meta-read">
          ⏱ {Math.max(1, Math.ceil((post.contenuFr?.length ?? 0) / 1200))} min de lecture
        </span>
      </div>
    </div>
  </div>

  <!-- Main layout -->
  <div class="container article-layout">
    <div class="article-main">

      <!-- Content -->
      <article class="article-body">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html renderContent(post.contenuFr)}
      </article>

      <!-- Share buttons -->
      <div class="share-section">
        <span class="share-label">Partager cet article :</span>
        <div class="share-btns">
          <button class="share-btn share-fb" onclick={() => shareOn('facebook')} aria-label="Partager sur Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Facebook
          </button>
          <button class="share-btn share-wa" onclick={() => shareOn('whatsapp')} aria-label="Partager sur WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            WhatsApp
          </button>
          <button class="share-btn share-tw" onclick={() => shareOn('twitter')} aria-label="Partager sur Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            Twitter
          </button>
          <button class="share-btn share-copy" onclick={() => shareOn('copy')} aria-label="Copier le lien">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Copier
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="article-sidebar">
      <!-- Related articles -->
      {#if related.length > 0}
        <div class="sidebar-widget">
          <h3 class="widget-title">📚 Autres articles</h3>
          <div class="related-list">
            {#each related as r}
              <a href="/blog/{r.slug}" class="related-item">
                {#if r.imageCover}
                  <img src={r.imageCover} alt={r.titreFr} referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
                {:else}
                  <div class="related-img-ph">📰</div>
                {/if}
                <div class="related-info">
                  <span class="related-cat" style="color:{catColors[r.categorie] ?? '#0D3B5C'}">{r.categorie}</span>
                  <h4>{r.titreFr}</h4>
                  <span class="related-date">{formatDate(r.createdAt)}</span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Back to blog -->
      <div class="sidebar-widget">
        <h3 class="widget-title">🗺️ Explorer le Bénin</h3>
        <div class="cta-links">
          <a href="/sites" class="cta-link">🏛 Sites touristiques</a>
          <a href="/prestataires" class="cta-link">🏢 Trouver un guide</a>
          <a href="/blog" class="cta-link">📰 Tous les articles</a>
        </div>
      </div>
    </aside>
  </div>
{/if}

<style>
  /* ── Loading skeletons ────────────────────────────── */
  .loading-hero { height: 420px; background: #e2e8f0; }
  .skeleton { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-md); }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .sk-hero  { height: 420px; border-radius: 0; }
  .sk-title { height: 48px; width: 70%; margin: var(--space-8) 0 var(--space-4); }
  .sk-meta  { height: 20px; width: 50%; margin-bottom: var(--space-6); }
  .sk-para  { height: 80px; margin-bottom: var(--space-4); }

  /* ── Not found ────────────────────────────────────── */
  .not-found {
    min-height: 70vh; display: flex; align-items: center; justify-content: center;
    padding: var(--space-8) var(--container-padding);
  }
  .nf-card { text-align: center; max-width: 480px; }
  .nf-icon { font-size: 4rem; margin-bottom: var(--space-4); }
  .nf-card h1 { font-size: var(--text-3xl); margin-bottom: var(--space-3); }
  .nf-card p  { color: var(--color-earth-medium); margin-bottom: var(--space-6); }
  .nf-actions { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; }

  /* ── Hero ─────────────────────────────────────────── */
  .article-hero {
    position: relative;
    min-height: 460px;
    background: var(--color-ocean-dark) center/cover no-repeat;
    display: flex; align-items: flex-end;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 100%);
  }
  .hero-content {
    position: relative; z-index: 1;
    padding-block: var(--space-10);
    max-width: 800px;
  }
  .back-link {
    display: inline-block;
    color: rgba(255,255,255,0.8);
    font-size: var(--text-sm); font-weight: 600;
    text-decoration: none; margin-bottom: var(--space-4);
    transition: color 0.2s;
  }
  .back-link:hover { color: white; }
  .cat-badge {
    display: inline-block;
    color: white; font-size: 11px; font-weight: 700;
    padding: 3px 12px; border-radius: var(--radius-full);
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: var(--space-3);
  }
  .hero-content h1 {
    color: white;
    font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
    line-height: 1.25;
    margin-bottom: var(--space-5);
  }
  .hero-meta {
    display: flex; align-items: center; gap: var(--space-3);
    color: rgba(255,255,255,0.8); font-size: var(--text-sm);
    flex-wrap: wrap;
  }
  .meta-author, .meta-date, .meta-read { display: flex; align-items: center; gap: var(--space-2); }
  .meta-dot { opacity: 0.5; }

  /* ── Layout ───────────────────────────────────────── */
  .article-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: var(--space-10);
    padding-block: var(--space-10);
    align-items: start;
  }

  /* ── Article body ─────────────────────────────────── */
  .article-body {
    font-size: var(--text-base);
    line-height: 1.8;
    color: var(--color-earth);
  }

  .article-body :global(h3) {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-ocean-dark);
    margin: var(--space-8) 0 var(--space-3);
    padding-left: var(--space-4);
    border-left: 4px solid var(--color-gold);
  }
  .article-body :global(p) {
    margin-bottom: var(--space-5);
    color: var(--color-earth-medium);
  }
  .article-body :global(strong) {
    color: var(--color-earth);
    font-weight: 700;
  }

  /* ── Share ────────────────────────────────────────── */
  .share-section {
    display: flex; align-items: center; gap: var(--space-4);
    flex-wrap: wrap;
    margin-top: var(--space-10);
    padding-top: var(--space-6);
    border-top: 2px solid var(--color-border);
  }
  .share-label { font-weight: 700; font-size: var(--text-sm); color: var(--color-earth-light); white-space: nowrap; }
  .share-btns { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .share-btn {
    display: flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border: none; border-radius: var(--radius-md);
    font-size: var(--text-sm); font-weight: 600;
    cursor: pointer; font-family: var(--font-body);
    transition: var(--transition); color: white;
  }
  .share-fb   { background: #1877f2; }
  .share-fb:hover { background: #0e64d8; }
  .share-wa   { background: #25d366; }
  .share-wa:hover { background: #1da850; }
  .share-tw   { background: #1da1f2; }
  .share-tw:hover { background: #0c85d0; }
  .share-copy { background: var(--color-earth-light); color: white; }
  .share-copy:hover { background: var(--color-earth); }

  /* ── Sidebar ──────────────────────────────────────── */
  .article-sidebar { display: flex; flex-direction: column; gap: var(--space-6); position: sticky; top: calc(var(--nav-h) + var(--space-4)); }
  .sidebar-widget { background: white; border-radius: var(--radius-lg); padding: var(--space-5); border: 1px solid var(--color-border); }
  .widget-title { font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4); }

  .related-list { display: flex; flex-direction: column; gap: var(--space-3); }
  .related-item { display: flex; gap: var(--space-3); text-decoration: none; border-radius: var(--radius-md); padding: var(--space-2); transition: var(--transition); }
  .related-item:hover { background: var(--color-ivory); }
  .related-item img, .related-img-ph {
    width: 72px; height: 56px; object-fit: cover; border-radius: var(--radius-sm);
    flex-shrink: 0;
  }
  .related-img-ph { background: var(--color-ivory-dark); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
  .related-info { flex: 1; min-width: 0; }
  .related-cat  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .related-info h4 {
    font-size: var(--text-sm); font-weight: 600; color: var(--color-earth);
    margin: 2px 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .related-date { font-size: 11px; color: var(--color-earth-light); }

  .cta-links { display: flex; flex-direction: column; gap: var(--space-2); }
  .cta-link {
    display: block; padding: var(--space-3) var(--space-4);
    background: var(--color-ivory); border-radius: var(--radius-md);
    font-size: var(--text-sm); font-weight: 600; text-decoration: none;
    color: var(--color-earth); transition: var(--transition);
  }
  .cta-link:hover { background: var(--color-ocean); color: white; }

  /* ── Responsive ───────────────────────────────────── */
  @media (max-width: 1023px) {
    .article-layout { grid-template-columns: 1fr; gap: var(--space-8); }
    .article-sidebar { position: static; }
  }
  @media (max-width: 640px) {
    .article-hero { min-height: 320px; }
    .hero-content h1 { font-size: var(--text-2xl); }
    .share-section { flex-direction: column; align-items: flex-start; }
  }
</style>
