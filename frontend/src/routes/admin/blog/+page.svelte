<script>
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { formatDate } from '$lib/utils/format.js';

  let posts      = $state([]);
  let isLoading  = $state(true);
  let search     = $state('');
  let showForm   = $state(false);
  let editingPost = $state(null);
  let isSaving   = $state(false);
  let deletingId = $state(null);
  let toggling   = $state(new Set());

  const emptyPost = () => ({
    titre: '', contenu: '', extrait: '', categorie: '', auteur: '',
    imageUrl: '', tags: ''
  });
  let form = $state(emptyPost());

  const categories = ['Itinéraires', 'Culture', 'Conseils', 'Gastronomie', 'Activités', 'Nature'];

  onMount(async () => {
    try {
      const res = await adminApi.allPosts();
      posts     = Array.isArray(res) ? res : (res?.posts ?? []);
    } catch { toastStore.error('Erreur chargement articles'); }
    finally   { isLoading = false; }
  });

  function openAdd() {
    editingPost = null;
    form        = emptyPost();
    showForm    = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(p) {
    editingPost = p;
    form        = {
      titre:     p.titre     ?? '',
      contenu:   p.contenu   ?? '',
      extrait:   p.extrait   ?? '',
      categorie: p.categorie ?? '',
      auteur:    p.auteur    ?? '',
      imageUrl:  p.imageUrl  ?? '',
      tags:      Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags ?? '')
    };
    showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() { showForm = false; editingPost = null; }

  async function savePost(e) {
    e.preventDefault();
    isSaving = true;
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (editingPost) {
        const updated = await adminApi.updatePost(editingPost.id, payload);
        posts = posts.map(p => p.id === editingPost.id ? updated : p);
        toastStore.success('Article mis à jour !');
      } else {
        const created = await adminApi.createPost(payload);
        posts = [created, ...posts];
        toastStore.success('Article créé !');
      }
      showForm = false; editingPost = null;
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
    } finally { isSaving = false; }
  }

  async function togglePublish(p) {
    toggling = new Set([...toggling, p.id]);
    try {
      const updated = await adminApi.updatePost(p.id, { publie: !p.publie });
      posts = posts.map(pp => pp.id === p.id ? { ...pp, publie: updated.publie } : pp);
      toastStore.success(updated.publie ? 'Article publié' : 'Article dépublié');
    } catch { toastStore.error('Erreur'); }
    finally {
      toggling = new Set([...toggling].filter(id => id !== p.id));
    }
  }

  async function deletePost(id) {
    if (deletingId !== id) { deletingId = id; return; }
    try {
      await adminApi.deletePost(id);
      posts      = posts.filter(p => p.id !== id);
      deletingId = null;
      toastStore.success('Article supprimé');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
      deletingId = null;
    }
  }

  const filtered = $derived(posts.filter(p =>
    !search || p.titre?.toLowerCase().includes(search.toLowerCase())
  ));
</script>

<svelte:head><title>Blog — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>Blog <span class="count">({filtered.length} articles)</span></h1>
    <div class="header-actions">
      <input class="search-input" placeholder="Rechercher…" bind:value={search} />
      <button class="btn btn-primary" onclick={openAdd}>+ Nouvel article</button>
    </div>
  </div>

  {#if showForm}
    <div class="card form-card">
      <h2>{editingPost ? `Modifier — ${editingPost.titre}` : 'Nouvel article'}</h2>
      <form onsubmit={savePost}>
        <div class="form-row">
          <div class="form-group" style="grid-column: 1 / -1">
            <label class="form-label">Titre *</label>
            <input class="form-input" bind:value={form.titre} required placeholder="Ex: Les 7 merveilles du Bénin" />
          </div>
          <div class="form-group">
            <label class="form-label">Catégorie *</label>
            <select class="form-input" bind:value={form.categorie} required>
              <option value="">— Choisir —</option>
              {#each categories as c}<option value={c}>{c}</option>{/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Auteur</label>
            <input class="form-input" bind:value={form.auteur} placeholder="Prénom NOM" />
          </div>
          <div class="form-group">
            <label class="form-label">Image de couverture (URL)</label>
            <input class="form-input" bind:value={form.imageUrl} placeholder="https://…" />
          </div>
          <div class="form-group">
            <label class="form-label">Tags (séparés par des virgules)</label>
            <input class="form-input" bind:value={form.tags} placeholder="bénin, voodoo, culture" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Extrait / Introduction</label>
          <textarea class="form-input" bind:value={form.extrait} rows="3" placeholder="Résumé de l'article affiché dans les cartes…"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Contenu *</label>
          <textarea class="form-input" bind:value={form.contenu} required rows="12" placeholder="Contenu complet de l'article (Markdown supporté)…"></textarea>
        </div>
        <div class="form-footer">
          <button type="button" class="btn btn-ghost" onclick={cancel}>Annuler</button>
          <button type="submit" class="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Sauvegarde…' : editingPost ? '💾 Mettre à jour' : '🚀 Créer'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if isLoading}
    <div class="skeleton" style="height:300px;border-radius:var(--radius-lg)"></div>
  {:else}
    <div class="posts-list">
      {#each filtered as p}
        <div class="post-row card">
          {#if p.imageUrl}
            <img src={p.imageUrl} alt={p.titre} class="post-img" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
          {:else}
            <div class="post-img-ph">📰</div>
          {/if}
          <div class="post-body">
            <div class="post-top">
              {#if p.categorie}<span class="cat-chip">{p.categorie}</span>{/if}
              <span class="publish-status" class:published={p.publie}>
                {p.publie ? '● Publié' : '○ Brouillon'}
              </span>
            </div>
            <h3>{p.titre}</h3>
            {#if p.extrait}<p class="post-excerpt">{p.extrait.slice(0, 120)}…</p>{/if}
            <div class="post-meta">
              {#if p.auteur}<span>✍ {p.auteur}</span>{/if}
              <span>📅 {formatDate(p.createdAt)}</span>
              {#if p.slug}<span>🔗 /{p.slug}</span>{/if}
            </div>
          </div>
          <div class="post-actions">
            <button
              class="btn-action"
              class:btn-publish={!p.publie}
              class:btn-unpublish={p.publie}
              disabled={toggling.has(p.id)}
              onclick={() => togglePublish(p)}
            >
              {toggling.has(p.id) ? '…' : p.publie ? '⏸ Dépublier' : '▶ Publier'}
            </button>
            <button class="btn-action" onclick={() => openEdit(p)}>✏️ Modifier</button>
            {#if deletingId === p.id}
              <button class="btn-action btn-danger-action" onclick={() => deletePost(p.id)}>✓ Confirmer</button>
              <button class="btn-action" onclick={() => deletingId = null}>✕</button>
            {:else}
              <button class="btn-action btn-danger-action" onclick={() => deletePost(p.id)}>🗑️</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    {#if filtered.length === 0 && !isLoading}
      <div class="empty-table">
        <p style="font-size:3rem">📝</p>
        <p>Aucun article. Créez le premier !</p>
        <button class="btn btn-primary" onclick={openAdd}>+ Rédiger un article</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .admin-page h1 { margin: 0; }
  .page-header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap; }
  .count { font-size: var(--text-lg); color: var(--color-earth-light); font-weight: 400; }
  .header-actions { display: flex; gap: var(--space-3); align-items: center; }
  .search-input {
    padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border);
    border-radius: var(--radius-md); font-family: var(--font-body); font-size: var(--text-sm); background: white; min-width: 200px;
  }

  .form-card { padding: var(--space-6); margin-bottom: var(--space-6); }
  .form-card h2 { margin-bottom: var(--space-5); }
  .form-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
  .form-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }

  .posts-list { display: flex; flex-direction: column; gap: var(--space-3); }
  .post-row { display: grid; grid-template-columns: 120px 1fr auto; gap: 0; overflow: hidden; padding: 0; align-items: start; }
  .post-img { width: 120px; height: 90px; object-fit: cover; display: block; }
  .post-img-ph { width: 120px; height: 90px; display: flex; align-items: center; justify-content: center; background: var(--color-ivory-dark); font-size: 2rem; }
  .post-body { padding: var(--space-4); }
  .post-top { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2); }
  .cat-chip { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(232,152,42,0.1); color: var(--color-gold); }
  .publish-status { font-size: var(--text-xs); font-weight: 600; color: #94a3b8; }
  .publish-status.published { color: #16a34a; }
  .post-body h3 { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-1); }
  .post-excerpt { font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-2); }
  .post-meta { display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--color-earth-light); flex-wrap: wrap; }
  .post-actions { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border-left: 1px solid var(--color-border); align-items: stretch; }

  .btn-action {
    padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);
    border: 1px solid var(--color-border); background: white;
    font-size: var(--text-xs); font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: var(--transition); white-space: nowrap;
  }
  .btn-action:hover { background: var(--color-ivory-dark); }
  .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-publish { border-color: #bbf7d0; color: #16a34a; }
  .btn-publish:hover { background: #dcfce7; }
  .btn-unpublish { border-color: #e2e8f0; color: #64748b; }
  .btn-unpublish:hover { background: #f1f5f9; }
  .btn-danger-action { border-color: #fecaca; color: #dc2626; }
  .btn-danger-action:hover { background: #fee2e2; }
  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
  @media (max-width: 640px) {
    .post-row { grid-template-columns: 1fr; }
    .post-img, .post-img-ph { width: 100%; height: 160px; }
    .post-actions { flex-direction: row; border-left: none; border-top: 1px solid var(--color-border); }
  }
</style>
