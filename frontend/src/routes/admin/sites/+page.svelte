<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client.js';
  import { adminApi } from '$lib/api/admin.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';

  let sites     = $state([]);
  let regions   = $state([]);
  let categories = $state([]);
  let isLoading = $state(true);
  let search    = $state('');
  let showForm  = $state(false);
  let editingSite = $state(null);
  let isSaving  = $state(false);
  let deletingId = $state(null);

  const emptyForm = () => ({
    nom: '', descriptionFr: '', region: '', categorie: '',
    images: [''], latitude: '', longitude: '',
    adresse: '', horaires: '', entree: '', conseils: ''
  });

  let form = $state(emptyForm());

  onMount(async () => {
    try {
      const [sitesRes, regionsRes, catsRes] = await Promise.all([
        api.get('/sites?limit=200').catch(() => []),
        api.get('/regions').catch(() => []),
        api.get('/categories').catch(() => [])
      ]);
      sites      = Array.isArray(sitesRes) ? sitesRes : (sitesRes?.sites ?? []);
      regions    = Array.isArray(regionsRes) ? regionsRes : [];
      categories = Array.isArray(catsRes)   ? catsRes   : [];
    } catch { toastStore.error('Erreur chargement'); }
    finally   { isLoading = false; }
  });

  function openAdd() {
    editingSite = null;
    form        = emptyForm();
    showForm    = true;
  }

  function openEdit(s) {
    editingSite = s;
    form        = {
      nom:           s.nom           ?? '',
      descriptionFr: s.descriptionFr ?? '',
      region:        s.region?.nom   ?? s.region ?? '',
      categorie:     s.categorie?.nom ?? s.categorie ?? '',
      images:        s.images?.length ? [...s.images] : [''],
      latitude:      s.latitude  ?? '',
      longitude:     s.longitude ?? '',
      adresse:       s.adresse   ?? '',
      horaires:      s.horaires  ?? '',
      entree:        s.entree    ?? '',
      conseils:      s.conseils  ?? ''
    };
    showForm = true;
  }

  function cancel() { showForm = false; editingSite = null; }

  async function saveSite(e) {
    e.preventDefault();
    isSaving = true;
    const payload = {
      ...form,
      images:    form.images.filter(Boolean),
      latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null
    };
    try {
      if (editingSite) {
        const updated = await adminApi.updateSite(editingSite.id, payload);
        sites = sites.map(s => s.id === editingSite.id ? updated : s);
        toastStore.success('Site mis à jour !');
      } else {
        const created = await adminApi.createSite(payload);
        sites = [...sites, created];
        toastStore.success('Site créé !');
      }
      showForm = false; editingSite = null;
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
    } finally { isSaving = false; }
  }

  async function deleteSite(id) {
    if (deletingId !== id) { deletingId = id; return; }
    try {
      await adminApi.deleteSite(id);
      sites      = sites.filter(s => s.id !== id);
      deletingId = null;
      toastStore.success('Site désactivé');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
      deletingId = null;
    }
  }

  function addImg()      { form.images = [...form.images, '']; }
  function removeImg(i)  { form.images = form.images.filter((_, idx) => idx !== i); }
  function setImg(i, v)  { const a = [...form.images]; a[i] = v; form.images = a; }

  const filtered = $derived(sites.filter(s =>
    !search || s.nom?.toLowerCase().includes(search.toLowerCase())
  ));
</script>

<svelte:head><title>Sites touristiques — Admin</title></svelte:head>

<div class="admin-page">
  <div class="page-header">
    <h1>Sites touristiques <span class="count">({filtered.length})</span></h1>
    <div class="header-actions">
      <input class="search-input" placeholder="Rechercher…" bind:value={search} />
      <button class="btn btn-primary" onclick={openAdd}>+ Nouveau site</button>
    </div>
  </div>

  {#if showForm}
    <div class="card form-card">
      <h2>{editingSite ? `Modifier — ${editingSite.nom}` : 'Nouveau site touristique'}</h2>
      <form onsubmit={saveSite}>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom *</label>
            <input class="form-input" bind:value={form.nom} required />
          </div>
          <div class="form-group">
            <label class="form-label">Région *</label>
            <input class="form-input" list="regions-list" bind:value={form.region} required />
            <datalist id="regions-list">
              {#each regions as r}<option value={r.nom ?? r}></option>{/each}
            </datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Catégorie *</label>
            <input class="form-input" list="cats-list" bind:value={form.categorie} required />
            <datalist id="cats-list">
              {#each categories as c}<option value={c.nom ?? c}></option>{/each}
            </datalist>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea class="form-input" bind:value={form.descriptionFr} required rows="4"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input class="form-input" bind:value={form.adresse} />
          </div>
          <div class="form-group">
            <label class="form-label">Latitude</label>
            <input class="form-input" type="number" step="any" bind:value={form.latitude} />
          </div>
          <div class="form-group">
            <label class="form-label">Longitude</label>
            <input class="form-input" type="number" step="any" bind:value={form.longitude} />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Horaires</label>
            <input class="form-input" bind:value={form.horaires} placeholder="8h–18h" />
          </div>
          <div class="form-group">
            <label class="form-label">Entrée</label>
            <input class="form-input" bind:value={form.entree} placeholder="Gratuit / 2000 XOF" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Conseils</label>
          <textarea class="form-input" bind:value={form.conseils} rows="2"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Photos (URLs)</label>
          {#each form.images as img, i}
            <div class="img-row">
              <input class="form-input" value={img} oninput={(e) => setImg(i, e.target.value)} placeholder="https://…" />
              {#if img}<img src={img} alt="" class="img-thumb" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />{/if}
              <button type="button" class="btn-rm" onclick={() => removeImg(i)}>✕</button>
            </div>
          {/each}
          <button type="button" class="btn btn-outline btn-sm" onclick={addImg}>+ Photo</button>
        </div>
        <div class="form-footer">
          <button type="button" class="btn btn-ghost" onclick={cancel}>Annuler</button>
          <button type="submit" class="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Sauvegarde…' : editingSite ? '💾 Mettre à jour' : '🚀 Créer le site'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if isLoading}
    <div class="skeleton" style="height:300px;border-radius:var(--radius-lg)"></div>
  {:else}
    <div class="sites-grid">
      {#each filtered as s}
        <div class="site-card card">
          {#if s.images?.[0]}
            <img src={s.images[0]} alt={s.nom} class="site-img" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
          {:else}
            <div class="site-img-ph">🗺️</div>
          {/if}
          <div class="site-body">
            <div class="site-badges">
              {#if s.region?.nom ?? s.region}<span class="region-badge">{s.region?.nom ?? s.region}</span>{/if}
              {#if s.categorie?.nom ?? s.categorie}<span class="cat-badge">{s.categorie?.nom ?? s.categorie}</span>{/if}
            </div>
            <h3>{s.nom}</h3>
            <p class="site-desc">{(s.descriptionFr ?? '').slice(0, 80)}…</p>
            <div class="site-actions">
              <button class="btn-action" onclick={() => openEdit(s)}>✏️ Modifier</button>
              {#if deletingId === s.id}
                <button class="btn-action btn-danger-action" onclick={() => deleteSite(s.id)}>✓ Confirmer</button>
                <button class="btn-action" onclick={() => deletingId = null}>✕</button>
              {:else}
                <button class="btn-action btn-danger-action" onclick={() => deleteSite(s.id)}>🗑️ Supprimer</button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#if filtered.length === 0 && !isLoading}
      <div class="empty-table">Aucun site trouvé</div>
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
  .form-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
  .form-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }
  .img-row { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); }
  .img-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
  .btn-rm { flex-shrink: 0; width: 32px; height: 32px; background: none; border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer; font-size: 11px; color: var(--color-earth-light); }

  .sites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-5); }
  .site-card { overflow: hidden; padding: 0; }
  .site-img { width: 100%; height: 160px; object-fit: cover; display: block; }
  .site-img-ph { width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; background: var(--color-ivory-dark); font-size: 3rem; }
  .site-body { padding: var(--space-4); }
  .site-badges { display: flex; gap: var(--space-2); margin-bottom: var(--space-2); }
  .region-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(13,59,92,0.1); color: var(--color-ocean); }
  .cat-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(232,152,42,0.1); color: var(--color-gold); }
  .site-card h3 { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-1); }
  .site-desc { font-size: var(--text-sm); color: var(--color-earth-light); margin-bottom: var(--space-3); }
  .site-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .btn-action {
    padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm);
    border: 1px solid var(--color-border); background: white;
    font-size: var(--text-xs); font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: var(--transition);
  }
  .btn-action:hover { background: var(--color-ivory-dark); }
  .btn-danger-action { border-color: #fecaca; color: #dc2626; }
  .btn-danger-action:hover { background: #fee2e2; }
  .empty-table { text-align: center; padding: var(--space-10); color: var(--color-earth-light); }
</style>
