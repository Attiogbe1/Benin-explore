<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { servicesApi } from '$lib/api/services.api.js';
  import { providersApi } from '$lib/api/providers.api.js';
  import { api } from '$lib/api/client.js';
  import { formatPrix } from '$lib/utils/format.js';

  let provider    = $state(null);
  let reservations = $state([]);
  let services    = $state([]);
  let isLoading   = $state(true);
  let tab         = $state('reservations');

  // Service add
  let showAddService  = $state(false);
  let isSavingService = $state(false);
  let newService = $state({
    type: 'HEBERGEMENT', nomFr: '', nomEn: '', descriptionFr: '',
    prix: '', devise: 'XOF', capacite: '', duree: '', videoUrl: '', images: []
  });

  // Service edit
  let editingService = $state(null);

  // Service delete confirm
  let deletingId = $state(null);

  // Provider profile edit
  let editingProvider  = $state(false);
  let isSavingProvider = $state(false);
  let providerForm     = $state({});

  const statusColors = {
    EN_ATTENTE: { bg: '#fef9c3', color: '#854d0e', label: 'En attente'  },
    CONFIRMEE:  { bg: '#dcfce7', color: '#166534', label: 'Confirmée'   },
    EN_COURS:   { bg: '#dbeafe', color: '#1e40af', label: 'En cours'    },
    TERMINEE:   { bg: '#f3f4f6', color: '#374151', label: 'Terminée'    },
    ANNULEE:    { bg: '#fee2e2', color: '#991b1b', label: 'Annulée'     },
    REFUSEE:    { bg: '#fee2e2', color: '#991b1b', label: 'Refusée'     }
  };

  const typeLabels = {
    HEBERGEMENT: '🏨 Hébergement',
    TRANSPORT:   '🚗 Transport',
    GUIDE:       '🧭 Guide',
    ACTIVITE:    '🎯 Activité',
    RESTAURANT:  '🍽️ Restaurant'
  };

  const typeColors = {
    HEBERGEMENT: '#0D3B5C',
    TRANSPORT:   '#1E5738',
    GUIDE:       '#7C3AED',
    ACTIVITE:    '#E8982A',
    RESTAURANT:  '#DC2626'
  };

  onMount(async () => {
    if (!authStore.isLoggedIn)    return goto('/auth/login');
    if (!authStore.isPrestataire) return goto('/devenir-prestataire');
    try {
      const [providerRes, resaRes, servicesRes] = await Promise.all([
        providersApi.monProfil().catch(() => null),
        providersApi.mesReservations().catch(() => []),
        servicesApi.mesServices().catch(() => [])
      ]);
      provider     = providerRes;
      const raw    = resaRes;
      reservations = Array.isArray(raw?.reservations) ? raw.reservations
                   : Array.isArray(raw) ? raw : [];
      services     = Array.isArray(servicesRes) ? servicesRes
                   : (servicesRes?.services ?? []);
    } catch {
      toastStore.error('Erreur lors du chargement');
    } finally {
      isLoading = false;
    }
  });

  /* ── Reservations ───────────────────────────────── */
  async function updateStatus(reservationId, statut) {
    try {
      await api.patch(`/reservations/${reservationId}/statut`, { statut });
      reservations = reservations.map(r => r.id === reservationId ? { ...r, statut } : r);
      toastStore.success('Statut mis à jour');
    } catch {
      toastStore.error('Erreur lors de la mise à jour');
    }
  }

  /* ── Services : add ─────────────────────────────── */
  async function addService(e) {
    e.preventDefault();
    isSavingService = true;
    try {
      const payload = {
        ...newService,
        prix:     parseFloat(newService.prix),
        capacite: newService.capacite ? parseInt(newService.capacite) : null,
        duree:    newService.duree    ? parseInt(newService.duree)    : null,
        images:   newService.images.filter(Boolean)
      };
      const created = await servicesApi.create(payload);
      services     = [...services, created];
      showAddService = false;
      newService   = { type: 'HEBERGEMENT', nomFr: '', nomEn: '', descriptionFr: '', prix: '', devise: 'XOF', capacite: '', duree: '', videoUrl: '', images: [] };
      toastStore.success('Service publié !');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
    } finally {
      isSavingService = false;
    }
  }

  /* ── Services : edit ────────────────────────────── */
  function startEdit(s) {
    editingService = { ...s, images: [...(s.images ?? [])] };
    showAddService = false;
    deletingId     = null;
  }
  function cancelEdit() { editingService = null; }

  async function saveEdit(e) {
    e.preventDefault();
    isSavingService = true;
    try {
      const payload = {
        ...editingService,
        prix:     parseFloat(editingService.prix),
        capacite: editingService.capacite ? parseInt(editingService.capacite) : null,
        duree:    editingService.duree    ? parseInt(editingService.duree)    : null,
        images:   editingService.images.filter(Boolean)
      };
      const updated = await servicesApi.update(editingService.id, payload);
      services      = services.map(s => s.id === updated.id ? updated : s);
      editingService = null;
      toastStore.success('Service mis à jour !');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
    } finally {
      isSavingService = false;
    }
  }

  function addEditImg()        { editingService.images = [...editingService.images, '']; }
  function removeEditImg(i)    { editingService.images = editingService.images.filter((_, idx) => idx !== i); }
  function updateEditImg(i, v) { const a = [...editingService.images]; a[i] = v; editingService.images = a; }

  /* ── Services : toggle / delete ─────────────────── */
  async function toggleDisponible(service) {
    try {
      const updated = await servicesApi.toggleDisponibilite(service.id);
      services = services.map(s => s.id === service.id ? { ...s, disponible: updated.disponible } : s);
    } catch { toastStore.error('Erreur'); }
  }

  async function confirmDelete(id) {
    if (deletingId !== id) { deletingId = id; return; }
    try {
      await servicesApi.delete(id);
      services   = services.filter(s => s.id !== id);
      deletingId = null;
      toastStore.success('Service supprimé');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur suppression');
      deletingId = null;
    }
  }
  function cancelDelete() { deletingId = null; }

  /* ── New service image helpers ───────────────────── */
  function addImgField()       { newService.images = [...newService.images, '']; }
  function removeImg(i)        { newService.images = newService.images.filter((_, idx) => idx !== i); }
  function updateImg(i, v)     { const a = [...newService.images]; a[i] = v; newService.images = a; }

  /* ── Provider profile edit ───────────────────────── */
  function startEditProvider() {
    providerForm   = {
      nomEntreprise: provider.nomEntreprise ?? '',
      telephone:     provider.telephone     ?? '',
      email:         provider.email         ?? '',
      adresse:       provider.adresse       ?? '',
      siteWeb:       provider.siteWeb       ?? '',
      description:   provider.description   ?? ''
    };
    editingProvider = true;
  }
  function cancelEditProvider() { editingProvider = false; }

  async function saveProvider(e) {
    e.preventDefault();
    isSavingProvider = true;
    try {
      const updated = await providersApi.update(provider.id, providerForm);
      provider        = { ...provider, ...updated };
      editingProvider = false;
      toastStore.success('Profil mis à jour !');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur');
    } finally {
      isSavingProvider = false;
    }
  }

  /* ── Derived stats ───────────────────────────────── */
  const stats = $derived({
    total:     reservations.length,
    enAttente: reservations.filter(r => r.statut === 'EN_ATTENTE').length,
    confirmees: reservations.filter(r => r.statut === 'CONFIRMEE').length,
    revenus:   reservations
                .filter(r => ['CONFIRMEE','TERMINEE','EN_COURS'].includes(r.statut))
                .reduce((s, r) => s + (r.prixTotal ?? 0), 0)
  });
</script>

<svelte:head><title>Mon espace prestataire — BeninExplore</title></svelte:head>

<div class="dashboard-hero">
  <div class="container">
    <h1>Mon espace prestataire</h1>
    {#if provider}
      <p class="hero-sub">
        <strong>{provider.nomEntreprise}</strong>
        {#if provider.estVerifie}
          <span class="badge-verif">✓ Vérifié</span>
        {:else}
          <span class="badge-pending">⏳ En attente de vérification</span>
        {/if}
      </p>
    {/if}
  </div>
</div>

<div class="container dashboard">
  {#if isLoading}
    <div class="skeleton" style="height:200px;border-radius:var(--radius-lg)"></div>
  {:else}

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon">📬</div>
        <div class="stat-value">{stats.total}</div>
        <div class="stat-label">Réservations</div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">{stats.enAttente}</div>
        <div class="stat-label">En attente</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{stats.confirmees}</div>
        <div class="stat-label">Confirmées</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🛎️</div>
        <div class="stat-value">{services.length}</div>
        <div class="stat-label">Services publiés</div>
      </div>
      <div class="stat-card revenue">
        <div class="stat-icon">💰</div>
        <div class="stat-value">{formatPrix(stats.revenus)}</div>
        <div class="stat-label">Revenus confirmés</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" class:active={tab === 'reservations'} onclick={() => tab = 'reservations'}>
        📬 Réservations
        {#if stats.enAttente > 0}<span class="tab-badge">{stats.enAttente}</span>{/if}
      </button>
      <button class="tab" class:active={tab === 'services'} onclick={() => tab = 'services'}>
        🛎️ Mes services ({services.length})
      </button>
      {#if provider}
        <button class="tab" class:active={tab === 'profil'} onclick={() => tab = 'profil'}>
          🏢 Profil
        </button>
      {/if}
    </div>

    <!-- ══ RESERVATIONS ══════════════════════════════════════════════════ -->
    {#if tab === 'reservations'}
      {#if reservations.length === 0}
        <div class="empty-state">
          <p style="font-size:3rem">📭</p>
          <h3>Aucune réservation pour l'instant</h3>
          <p>Complétez votre profil et ajoutez vos services pour attirer des touristes.</p>
          <button class="btn btn-primary" onclick={() => tab = 'services'}>🛎️ Gérer mes services</button>
        </div>
      {:else}
        <div class="resa-list">
          {#each reservations as r}
            <div class="resa-card card">
              <div class="resa-head">
                <div class="resa-info">
                  <span class="status-badge" style="background:{statusColors[r.statut]?.bg};color:{statusColors[r.statut]?.color}">
                    {statusColors[r.statut]?.label ?? r.statut}
                  </span>
                  <h3>{r.service?.nomFr}</h3>
                  <div class="resa-meta">
                    <span>👤 {r.user?.prenom} {r.user?.nom}</span>
                    <span>📅 {new Date(r.dateDebut).toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
                    <span>👥 {r.nombrePersonnes} pers.</span>
                    {#if r.user?.telephone}<span>📞 {r.user.telephone}</span>{/if}
                  </div>
                </div>
                <div class="resa-prix">{formatPrix(r.prixTotal)}</div>
              </div>
              {#if r.notes}
                <div class="resa-notes">💬 {r.notes}</div>
              {/if}
              {#if r.statut === 'EN_ATTENTE'}
                <div class="resa-actions">
                  <button class="btn btn-success" onclick={() => updateStatus(r.id, 'CONFIRMEE')}>✓ Confirmer</button>
                  <button class="btn btn-danger"  onclick={() => updateStatus(r.id, 'REFUSEE')}>✕ Refuser</button>
                </div>
              {:else if r.statut === 'CONFIRMEE'}
                <div class="resa-actions">
                  <button class="btn btn-outline" onclick={() => updateStatus(r.id, 'EN_COURS')}>▶ Marquer en cours</button>
                  <button class="btn btn-outline" onclick={() => updateStatus(r.id, 'TERMINEE')}>✓ Terminée</button>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    <!-- ══ SERVICES ══════════════════════════════════════════════════════ -->
    {#if tab === 'services'}
      <div class="services-header">
        <h2>Mes services</h2>
        <button class="btn btn-primary" onclick={() => { showAddService = !showAddService; editingService = null; deletingId = null; }}>
          {showAddService ? '✕ Annuler' : '+ Nouveau service'}
        </button>
      </div>

      <!-- Add form -->
      {#if showAddService}
        <div class="service-form card">
          <h3>Publier un nouveau service</h3>
          <form onsubmit={addService}>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Type *</label>
                <select class="form-input" bind:value={newService.type}>
                  {#each Object.entries(typeLabels) as [val, lbl]}
                    <option value={val}>{lbl}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Nom (français) *</label>
                <input class="form-input" bind:value={newService.nomFr} required placeholder="Ex: Safari du Pendjari" />
              </div>
              <div class="form-group">
                <label class="form-label">Nom (anglais)</label>
                <input class="form-input" bind:value={newService.nomEn} placeholder="Pendjari Safari" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea class="form-input" bind:value={newService.descriptionFr} required rows="3" placeholder="Décrivez votre service en détail…"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Prix (XOF) *</label>
                <input class="form-input" type="number" bind:value={newService.prix} required min="0" placeholder="25000" />
              </div>
              <div class="form-group">
                <label class="form-label">Capacité (pers.)</label>
                <input class="form-input" type="number" bind:value={newService.capacite} min="1" placeholder="8" />
              </div>
              <div class="form-group">
                <label class="form-label">Durée (minutes)</label>
                <input class="form-input" type="number" bind:value={newService.duree} min="0" placeholder="480" />
              </div>
            </div>
            {#if ['HEBERGEMENT','RESTAURANT'].includes(newService.type)}
              <div class="form-group">
                <label class="form-label">📹 URL vidéo YouTube / Vimeo</label>
                <input class="form-input" bind:value={newService.videoUrl} placeholder="https://youtube.com/watch?v=…" />
              </div>
            {/if}
            <div class="form-group">
              <label class="form-label">Photos (URLs d'images)</label>
              {#each newService.images as img, i}
                <div class="img-row">
                  <input class="form-input" value={img} oninput={(e) => updateImg(i, e.target.value)} placeholder="https://…" />
                  {#if img}
                    <img src={img} alt="" class="img-thumb" onerror={(e) => e.target.style.display='none'} referrerpolicy="no-referrer" />
                  {/if}
                  <button type="button" class="btn-rm" onclick={() => removeImg(i)}>✕</button>
                </div>
              {/each}
              <button type="button" class="btn btn-outline btn-sm" onclick={addImgField}>+ Ajouter une photo</button>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-ghost" onclick={() => showAddService = false}>Annuler</button>
              <button type="submit" class="btn btn-primary" disabled={isSavingService}>
                {isSavingService ? 'Publication…' : '🚀 Publier le service'}
              </button>
            </div>
          </form>
        </div>
      {/if}

      <!-- Services list -->
      {#if services.length === 0 && !showAddService}
        <div class="empty-state">
          <p style="font-size:3rem">🛎️</p>
          <h3>Aucun service publié</h3>
          <p>Publiez votre premier service pour apparaître dans les résultats de recherche.</p>
          <button class="btn btn-primary" onclick={() => showAddService = true}>+ Publier un service</button>
        </div>
      {:else}
        <div class="services-list">
          {#each services as s}
            <div class="service-card card">
              {#if s.images?.[0]}
                <img src={s.images[0]} alt={s.nomFr} class="svc-img" referrerpolicy="no-referrer" onerror={(e) => e.target.style.display='none'} />
              {:else}
                <div class="svc-img-placeholder" style="background:{typeColors[s.type]}22">
                  <span style="font-size:2.5rem">{typeLabels[s.type]?.split(' ')[0]}</span>
                </div>
              {/if}
              <div class="svc-body">
                <div class="svc-top">
                  <span class="type-tag" style="background:{typeColors[s.type]}18;color:{typeColors[s.type]}">{typeLabels[s.type] ?? s.type}</span>
                  <div class="svc-actions">
                    <label class="toggle-wrap" title={s.disponible ? 'Rendre indisponible' : 'Rendre disponible'}>
                      <input type="checkbox" checked={s.disponible} onchange={() => toggleDisponible(s)} />
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label">{s.disponible ? 'En ligne' : 'Hors ligne'}</span>
                    <button class="btn-icon" onclick={() => startEdit(s)} title="Modifier">✏️</button>
                    {#if deletingId === s.id}
                      <button class="btn-icon btn-icon-danger" onclick={() => confirmDelete(s.id)} title="Confirmer la suppression">✓ Supprimer</button>
                      <button class="btn-icon" onclick={cancelDelete} title="Annuler">✕</button>
                    {:else}
                      <button class="btn-icon btn-icon-danger" onclick={() => confirmDelete(s.id)} title="Supprimer">🗑️</button>
                    {/if}
                  </div>
                </div>
                <h3 class="svc-name">{s.nomFr}</h3>
                <p class="svc-desc">{s.descriptionFr?.slice(0, 120)}{(s.descriptionFr?.length ?? 0) > 120 ? '…' : ''}</p>
                <div class="svc-meta">
                  <span class="svc-prix">{formatPrix(s.prix)}</span>
                  {#if s.capacite}<span>👥 {s.capacite} pers.</span>{/if}
                  {#if s.duree}<span>⏱ {s.duree >= 60 ? `${Math.floor(s.duree/60)}h${s.duree%60 ? s.duree%60+'min' : ''}` : `${s.duree} min`}</span>{/if}
                  {#if s.images?.length}<span>🖼 {s.images.length} photo{s.images.length > 1 ? 's' : ''}</span>{/if}
                </div>
              </div>
            </div>

            <!-- Edit form inline below the card -->
            {#if editingService?.id === s.id}
              <div class="service-form card edit-form">
                <h3>✏️ Modifier « {s.nomFr} »</h3>
                <form onsubmit={saveEdit}>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Type *</label>
                      <select class="form-input" bind:value={editingService.type}>
                        {#each Object.entries(typeLabels) as [val, lbl]}
                          <option value={val}>{lbl}</option>
                        {/each}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nom (français) *</label>
                      <input class="form-input" bind:value={editingService.nomFr} required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nom (anglais)</label>
                      <input class="form-input" bind:value={editingService.nomEn} />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Description *</label>
                    <textarea class="form-input" bind:value={editingService.descriptionFr} required rows="3"></textarea>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Prix (XOF) *</label>
                      <input class="form-input" type="number" bind:value={editingService.prix} required min="0" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Capacité (pers.)</label>
                      <input class="form-input" type="number" bind:value={editingService.capacite} min="1" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Durée (minutes)</label>
                      <input class="form-input" type="number" bind:value={editingService.duree} min="0" />
                    </div>
                  </div>
                  {#if ['HEBERGEMENT','RESTAURANT'].includes(editingService.type)}
                    <div class="form-group">
                      <label class="form-label">📹 URL vidéo YouTube / Vimeo</label>
                      <input class="form-input" bind:value={editingService.videoUrl} placeholder="https://youtube.com/watch?v=…" />
                    </div>
                  {/if}
                  <div class="form-group">
                    <label class="form-label">Photos</label>
                    {#each editingService.images as img, i}
                      <div class="img-row">
                        <input class="form-input" value={img} oninput={(e) => updateEditImg(i, e.target.value)} placeholder="https://…" />
                        {#if img}
                          <img src={img} alt="" class="img-thumb" onerror={(e) => e.target.style.display='none'} referrerpolicy="no-referrer" />
                        {/if}
                        <button type="button" class="btn-rm" onclick={() => removeEditImg(i)}>✕</button>
                      </div>
                    {/each}
                    <button type="button" class="btn btn-outline btn-sm" onclick={addEditImg}>+ Ajouter une photo</button>
                  </div>
                  <div class="form-footer">
                    <button type="button" class="btn btn-ghost" onclick={cancelEdit}>Annuler</button>
                    <button type="submit" class="btn btn-primary" disabled={isSavingService}>
                      {isSavingService ? 'Sauvegarde…' : '💾 Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    {/if}

    <!-- ══ PROFIL ═════════════════════════════════════════════════════════ -->
    {#if tab === 'profil' && provider}
      <div class="profil-section">
        {#if !editingProvider}
          <div class="profil-info card">
            <div class="profil-header">
              <h2>{provider.nomEntreprise}</h2>
              <button class="btn btn-outline" onclick={startEditProvider}>✏️ Modifier le profil</button>
            </div>
            <div class="profil-grid">
              <div class="profil-item">
                <span class="pi-label">Statut</span>
                <span>{provider.estVerifie ? '✓ Vérifié' : '⏳ En attente de vérification'}</span>
              </div>
              <div class="profil-item">
                <span class="pi-label">Téléphone</span>
                <span>{provider.telephone}</span>
              </div>
              <div class="profil-item">
                <span class="pi-label">Email</span>
                <span>{provider.email}</span>
              </div>
              <div class="profil-item">
                <span class="pi-label">Adresse</span>
                <span>{provider.adresse}</span>
              </div>
              {#if provider.siteWeb}
                <div class="profil-item">
                  <span class="pi-label">Site web</span>
                  <a href={provider.siteWeb} target="_blank" rel="noopener">{provider.siteWeb}</a>
                </div>
              {/if}
              {#if provider.description}
                <div class="profil-item" style="grid-column: 1 / -1">
                  <span class="pi-label">Description</span>
                  <p>{provider.description}</p>
                </div>
              {/if}
            </div>
            <div class="profil-actions">
              <a href={`/prestataires/${provider.id}`} class="btn btn-outline" target="_blank">
                Voir ma page publique →
              </a>
            </div>
          </div>
        {:else}
          <div class="service-form card">
            <h3>✏️ Modifier mon profil</h3>
            <form onsubmit={saveProvider}>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nom de l'entreprise *</label>
                  <input class="form-input" bind:value={providerForm.nomEntreprise} required />
                </div>
                <div class="form-group">
                  <label class="form-label">Téléphone *</label>
                  <input class="form-input" bind:value={providerForm.telephone} required />
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input class="form-input" type="email" bind:value={providerForm.email} required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Adresse *</label>
                <input class="form-input" bind:value={providerForm.adresse} required />
              </div>
              <div class="form-group">
                <label class="form-label">Site web</label>
                <input class="form-input" type="url" bind:value={providerForm.siteWeb} placeholder="https://…" />
              </div>
              <div class="form-group">
                <label class="form-label">Description de votre entreprise</label>
                <textarea class="form-input" bind:value={providerForm.description} rows="4" placeholder="Présentez votre entreprise…"></textarea>
              </div>
              <div class="form-footer">
                <button type="button" class="btn btn-ghost" onclick={cancelEditProvider}>Annuler</button>
                <button type="submit" class="btn btn-primary" disabled={isSavingProvider}>
                  {isSavingProvider ? 'Sauvegarde…' : '💾 Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        {/if}
      </div>
    {/if}

  {/if}
</div>

<style>
  /* ── Hero ─────────────────────────────────────── */
  .dashboard-hero {
    background: linear-gradient(135deg, var(--color-ocean-dark), var(--color-ocean));
    color: white;
    padding: calc(var(--nav-h) + var(--space-10)) 0 var(--space-10);
  }
  .dashboard-hero h1 { color: white; margin-bottom: var(--space-2); }
  .hero-sub { opacity: 0.9; font-size: var(--text-sm); display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
  .badge-verif   { background: #22c55e; color: white; padding: 2px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; }
  .badge-pending { background: rgba(255,255,255,0.2); color: white; padding: 2px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 600; }

  /* ── Layout ───────────────────────────────────── */
  .dashboard { padding-block: var(--space-8); }

  /* ── Stats ────────────────────────────────────── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4); margin-bottom: var(--space-8);
  }
  .stat-card {
    background: white; border-radius: var(--radius-lg);
    padding: var(--space-5); text-align: center;
    box-shadow: var(--shadow-sm); border: 1px solid var(--color-border);
    transition: var(--transition);
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .stat-card.highlight { border-color: var(--color-gold); background: rgba(232,152,42,0.05); }
  .stat-card.revenue   { border-color: var(--color-ocean); background: rgba(13,59,92,0.05); }
  .stat-icon  { font-size: 1.5rem; margin-bottom: var(--space-1); }
  .stat-value { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; color: var(--color-ocean); }
  .stat-label { font-size: var(--text-xs); color: var(--color-earth-light); margin-top: var(--space-1); }

  /* ── Tabs ─────────────────────────────────────── */
  .tabs {
    display: flex; gap: var(--space-2); margin-bottom: var(--space-6);
    border-bottom: 2px solid var(--color-border);
  }
  .tab {
    padding: var(--space-3) var(--space-5);
    background: none; border: none; border-bottom: 2px solid transparent;
    margin-bottom: -2px; cursor: pointer;
    font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
    color: var(--color-earth-light); transition: var(--transition);
    display: flex; align-items: center; gap: var(--space-2);
  }
  .tab:hover  { color: var(--color-ocean); }
  .tab.active { color: var(--color-ocean); border-bottom-color: var(--color-ocean); }
  .tab-badge {
    background: #ef4444; color: white;
    font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: var(--radius-full);
    min-width: 18px; text-align: center;
  }

  /* ── Reservations ─────────────────────────────── */
  .resa-list { display: flex; flex-direction: column; gap: var(--space-4); }
  .resa-card { padding: var(--space-5); }
  .resa-head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-3); }
  .resa-info { flex: 1; }
  .status-badge {
    display: inline-block; font-size: var(--text-xs); font-weight: 700;
    padding: 2px var(--space-3); border-radius: var(--radius-full); margin-bottom: var(--space-2);
  }
  .resa-head h3  { font-size: var(--text-lg); margin-bottom: var(--space-2); }
  .resa-meta     { display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--color-earth-light); flex-wrap: wrap; }
  .resa-prix     { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; color: var(--color-ocean); white-space: nowrap; }
  .resa-notes    { font-size: var(--text-sm); color: var(--color-earth-medium); background: var(--color-ivory); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-3); }
  .resa-actions  { display: flex; gap: var(--space-3); }
  .btn-success   { background: #22c55e; color: white; border: none; padding: var(--space-2) var(--space-5); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-family: var(--font-body); transition: var(--transition); }
  .btn-success:hover { background: #16a34a; }
  .btn-danger    { background: #ef4444; color: white; border: none; padding: var(--space-2) var(--space-5); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-family: var(--font-body); transition: var(--transition); }
  .btn-danger:hover  { background: #dc2626; }

  /* ── Service cards ────────────────────────────── */
  .services-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-5); }
  .services-header h2 { margin: 0; }
  .services-list { display: flex; flex-direction: column; gap: var(--space-4); }

  .service-card {
    display: grid; grid-template-columns: 160px 1fr;
    gap: 0; overflow: hidden; transition: var(--transition);
  }
  .service-card:hover { box-shadow: var(--shadow-md); }

  .svc-img {
    width: 160px; height: 140px; object-fit: cover;
    display: block; flex-shrink: 0;
  }
  .svc-img-placeholder {
    width: 160px; height: 140px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .svc-body   { padding: var(--space-4) var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); }
  .svc-top    { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
  .type-tag   { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-full); }
  .svc-actions { display: flex; align-items: center; gap: var(--space-3); }
  .svc-name   { font-size: var(--text-lg); font-weight: 600; margin: 0; }
  .svc-desc   { font-size: var(--text-sm); color: var(--color-earth-light); margin: 0; line-height: 1.5; }
  .svc-meta   { display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--color-earth-medium); flex-wrap: wrap; }
  .svc-prix   { font-family: var(--font-display); font-weight: 700; color: var(--color-ocean); font-size: var(--text-base); }

  /* ── Toggle ───────────────────────────────────── */
  .toggle-wrap   { display: flex; align-items: center; cursor: pointer; }
  .toggle-wrap input { position: absolute; opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    width: 36px; height: 20px; border-radius: 10px;
    background: var(--color-border); transition: background 0.2s; position: relative;
  }
  .toggle-slider::after {
    content: ''; position: absolute; top: 2px; left: 2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .toggle-wrap input:checked + .toggle-slider { background: #22c55e; }
  .toggle-wrap input:checked + .toggle-slider::after { transform: translateX(16px); }
  .toggle-label { font-size: var(--text-xs); color: var(--color-earth-medium); white-space: nowrap; }

  /* ── Icon buttons ─────────────────────────────── */
  .btn-icon {
    padding: 4px 8px; background: none;
    border: 1px solid var(--color-border); border-radius: var(--radius-sm);
    cursor: pointer; font-size: 13px; color: var(--color-earth-medium);
    transition: var(--transition);
  }
  .btn-icon:hover { background: var(--color-ivory-dark); }
  .btn-icon-danger { color: #ef4444; border-color: #fecaca; font-size: 11px; font-weight: 600; }
  .btn-icon-danger:hover { background: #fee2e2; }

  /* ── Service form ─────────────────────────────── */
  .service-form { padding: var(--space-6); margin-bottom: var(--space-4); }
  .service-form h3 { margin-bottom: var(--space-5); }
  .edit-form { border-left: 4px solid var(--color-ocean); margin-left: var(--space-4); }
  .form-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
  .form-footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }

  .img-row  { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); }
  .img-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
  .btn-rm {
    flex-shrink: 0; width: 32px; height: 32px;
    background: none; border: 1px solid var(--color-border);
    border-radius: var(--radius-sm); cursor: pointer; font-size: 11px; color: var(--color-earth-light);
  }

  /* ── Profile ──────────────────────────────────── */
  .profil-section { max-width: 800px; }
  .profil-info    { padding: var(--space-6); }
  .profil-header  { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
  .profil-header h2 { margin: 0; }
  .profil-grid    { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-5); }
  .profil-item    { display: flex; flex-direction: column; gap: var(--space-1); }
  .pi-label       { font-size: var(--text-xs); font-weight: 600; color: var(--color-earth-light); text-transform: uppercase; letter-spacing: 0.05em; }
  .profil-item a  { color: var(--color-ocean); }
  .profil-actions { margin-top: var(--space-6); padding-top: var(--space-5); border-top: 1px solid var(--color-border); }

  /* ── Empty ────────────────────────────────────── */
  .empty-state { text-align: center; padding: var(--space-16); }
  .empty-state h3 { margin-bottom: var(--space-3); }
  .empty-state p  { color: var(--color-earth-light); margin-bottom: var(--space-5); }

  @media (max-width: 640px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .tabs { overflow-x: auto; }
    .resa-head { flex-direction: column; }
    .service-card { grid-template-columns: 1fr; }
    .svc-img, .svc-img-placeholder { width: 100%; height: 180px; }
    .svc-top { flex-direction: column; align-items: flex-start; }
  }
</style>
