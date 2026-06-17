<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api/client.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';

  let step = $state(1); // 1 = profil entreprise, 2 = premier service
  let isLoading = $state(false);
  let providerId = $state(null);

  let profile = $state({
    nomEntreprise: '',
    descriptionFr: '',
    telephone: '',
    email: authStore.user?.email ?? '',
    adresse: '',
    siteWeb: ''
  });

  let service = $state({
    type: 'HEBERGEMENT',
    nomFr: '',
    nomEn: '',
    descriptionFr: '',
    prix: '',
    devise: 'XOF',
    capacite: '',
    duree: '',
    videoUrl: '',
    images: []
  });

  const types = [
    { value: 'HEBERGEMENT', label: '🏨 Hébergement', desc: 'Hôtel, villa, auberge, camping…' },
    { value: 'RESTAURANT',  label: '🍽️ Restaurant',  desc: 'Restauration, traiteur, maquis…' },
    { value: 'GUIDE',       label: '🧭 Guide',       desc: 'Guide touristique, excursion…' },
    { value: 'TRANSPORT',   label: '🚗 Transport',   desc: 'Taxi, location, transfert…' },
    { value: 'ACTIVITE',    label: '🎯 Activité',    desc: 'Sport, culture, divertissement…' }
  ];

  onMount(() => {
    if (!authStore.isLoggedIn) goto('/auth/login?redirect=/devenir-prestataire');
  });

  async function submitProfile(e) {
    e.preventDefault();
    isLoading = true;
    try {
      const provider = await api.post('/providers', profile);
      providerId = provider.id;
      authStore.updateUser({ role: 'PRESTATAIRE' });
      toastStore.success('Profil créé ! Ajoutez maintenant votre premier service.');
      step = 2;
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur lors de la création du profil');
    } finally {
      isLoading = false;
    }
  }

  async function submitService(e) {
    e.preventDefault();
    isLoading = true;
    try {
      const payload = {
        ...service,
        prix: parseFloat(service.prix),
        capacite: service.capacite ? parseInt(service.capacite) : null,
        duree: service.duree ? parseInt(service.duree) : null,
        images: service.images.filter(Boolean)
      };
      await api.post('/services', payload);
      toastStore.success('Service ajouté ! Votre espace prestataire est prêt.');
      goto('/profil/prestataire');
    } catch (err) {
      toastStore.error(err.message ?? 'Erreur lors de la création du service');
    } finally {
      isLoading = false;
    }
  }

  function addImageField() {
    service.images = [...service.images, ''];
  }
  function removeImage(i) {
    service.images = service.images.filter((_, idx) => idx !== i);
  }
  function updateImage(i, val) {
    const arr = [...service.images];
    arr[i] = val;
    service.images = arr;
  }

  const needsVideo = $derived(['HEBERGEMENT', 'RESTAURANT'].includes(service.type));
</script>

<svelte:head><title>Devenir prestataire — BeninExplore</title></svelte:head>

<div class="prest-hero">
  <div class="container prest-hero-inner">
    <div class="prest-badge">Rejoignez l'écosystème touristique du Bénin</div>
    <h1>Devenez prestataire</h1>
    <p>Proposez vos services à des milliers de voyageurs et développez votre activité touristique.</p>
    <div class="benefits">
      <span>✅ Gratuit</span>
      <span>📬 Notifications en temps réel</span>
      <span>📹 Présentation vidéo</span>
      <span>🌍 Visibilité internationale</span>
    </div>
  </div>
</div>

<div class="container prest-container">
  <!-- Stepper -->
  <div class="stepper">
    <div class="step-item" class:active={step >= 1} class:done={step > 1}>
      <div class="step-circle">1</div>
      <span>Profil entreprise</span>
    </div>
    <div class="step-line" class:done={step > 1}></div>
    <div class="step-item" class:active={step >= 2}>
      <div class="step-circle">2</div>
      <span>Premier service</span>
    </div>
  </div>

  {#if step === 1}
    <div class="prest-form card">
      <h2>Votre profil d'entreprise</h2>
      <p class="form-subtitle">Ces informations seront visibles par les touristes.</p>
      <form onsubmit={submitProfile}>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom de l'entreprise *</label>
            <input class="form-input" bind:value={profile.nomEntreprise} required placeholder="Ex : Chez Alphonse Guesthouse" />
          </div>
          <div class="form-group">
            <label class="form-label">Téléphone *</label>
            <input class="form-input" bind:value={profile.telephone} required placeholder="+229 XX XX XX XX" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description de votre activité *</label>
          <textarea class="form-input" bind:value={profile.descriptionFr} required rows="4"
            placeholder="Décrivez vos services, votre expérience, ce qui vous rend unique…"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email professionnel *</label>
            <input class="form-input" type="email" bind:value={profile.email} required />
          </div>
          <div class="form-group">
            <label class="form-label">Site web</label>
            <input class="form-input" bind:value={profile.siteWeb} placeholder="https://…" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse *</label>
          <input class="form-input" bind:value={profile.adresse} required placeholder="Quartier, ville, commune…" />
        </div>
        <button type="submit" class="btn btn-primary btn-lg" disabled={isLoading}>
          {isLoading ? 'Création…' : 'Créer mon profil →'}
        </button>
      </form>
    </div>

  {:else}
    <div class="prest-form card">
      <h2>Votre premier service</h2>
      <p class="form-subtitle">Vous pourrez en ajouter d'autres depuis votre espace prestataire.</p>
      <form onsubmit={submitService}>
        <!-- Type de service -->
        <div class="form-group">
          <label class="form-label">Type de service *</label>
          <div class="type-grid">
            {#each types as t}
              <label class="type-card" class:selected={service.type === t.value}>
                <input type="radio" name="type" value={t.value} bind:group={service.type} class="sr-only" />
                <strong>{t.label}</strong>
                <small>{t.desc}</small>
              </label>
            {/each}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom du service (Français) *</label>
            <input class="form-input" bind:value={service.nomFr} required placeholder="Ex : Chambre double avec vue sur lagon" />
          </div>
          <div class="form-group">
            <label class="form-label">Nom (Anglais)</label>
            <input class="form-input" bind:value={service.nomEn} placeholder="Ex : Double room with lagoon view" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea class="form-input" bind:value={service.descriptionFr} required rows="4"
            placeholder="Décrivez votre service en détail : équipements, inclus, accès…"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Prix *</label>
            <div class="input-group">
              <input class="form-input" type="number" bind:value={service.prix} required min="0" placeholder="0" />
              <select class="form-input" bind:value={service.devise} style="flex: 0 0 90px">
                <option value="XOF">XOF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Capacité (personnes)</label>
            <input class="form-input" type="number" bind:value={service.capacite} min="1" placeholder="Ex : 10" />
          </div>
          {#if service.type !== 'HEBERGEMENT'}
            <div class="form-group">
              <label class="form-label">Durée (minutes)</label>
              <input class="form-input" type="number" bind:value={service.duree} min="0" placeholder="Ex : 120" />
            </div>
          {/if}
        </div>

        <!-- Vidéo — pour hébergement et restaurant -->
        {#if needsVideo}
          <div class="form-group video-group">
            <label class="form-label">
              📹 Vidéo de présentation
              <span class="label-hint">Lien YouTube ou Vimeo pour montrer votre établissement</span>
            </label>
            <input class="form-input" bind:value={service.videoUrl}
              placeholder="https://www.youtube.com/watch?v=…" />
          </div>
        {/if}

        <!-- Images -->
        <div class="form-group">
          <label class="form-label">Photos (URLs)</label>
          {#each service.images as img, i}
            <div class="image-row">
              <input class="form-input" value={img} oninput={(e) => updateImage(i, e.target.value)}
                placeholder="https://…/photo.jpg" />
              <button type="button" class="btn-icon-remove" onclick={() => removeImage(i)} aria-label="Supprimer">✕</button>
            </div>
          {/each}
          <button type="button" class="btn btn-outline btn-sm" onclick={addImageField}>+ Ajouter une photo</button>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" onclick={() => goto('/profil/prestataire')}>
            Passer cette étape
          </button>
          <button type="submit" class="btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? 'Publication…' : 'Publier mon service ✓'}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .prest-hero {
    background: linear-gradient(135deg, var(--color-ocean-dark) 0%, var(--color-ocean) 60%, #1e6b8a 100%);
    color: white;
    padding: calc(var(--nav-h) + var(--space-12)) 0 var(--space-12);
    text-align: center;
  }
  .prest-hero-inner { max-width: 680px; margin: 0 auto; }
  .prest-badge {
    display: inline-block;
    background: rgba(232,152,42,0.2);
    border: 1px solid rgba(232,152,42,0.5);
    color: var(--color-gold-light);
    padding: var(--space-1) var(--space-4);
    border-radius: var(--radius-full);
    font-size: var(--text-sm); font-weight: 600;
    margin-bottom: var(--space-4);
  }
  .prest-hero h1 { color: white; font-size: clamp(2rem, 5vw, 3.2rem); margin-bottom: var(--space-3); }
  .prest-hero p { font-size: var(--text-lg); opacity: 0.85; margin-bottom: var(--space-6); }
  .benefits { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
  .benefits span { font-size: var(--text-sm); background: rgba(255,255,255,0.12); padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); }

  .prest-container { padding-block: var(--space-10); max-width: 760px; }

  /* Stepper */
  .stepper {
    display: flex; align-items: center; gap: 0;
    margin-bottom: var(--space-10);
    justify-content: center;
  }
  .step-item { display: flex; align-items: center; gap: var(--space-2); }
  .step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--color-border);
    color: var(--color-earth-light);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: var(--text-sm);
    transition: var(--transition);
  }
  .step-item.active .step-circle { background: var(--color-ocean); color: white; }
  .step-item.done .step-circle { background: #22c55e; color: white; }
  .step-item span { font-size: var(--text-sm); font-weight: 500; color: var(--color-earth-light); }
  .step-item.active span { color: var(--color-ocean); }
  .step-line { width: 60px; height: 2px; background: var(--color-border); margin: 0 var(--space-3); transition: var(--transition); }
  .step-line.done { background: #22c55e; }

  /* Form */
  .prest-form { padding: var(--space-8); }
  .prest-form h2 { margin-bottom: var(--space-1); }
  .form-subtitle { color: var(--color-earth-light); font-size: var(--text-sm); margin-bottom: var(--space-6); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-5); }
  .input-group { display: flex; gap: var(--space-2); }
  .btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-base); }

  /* Service type grid */
  .type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-3); }
  .type-card {
    border: 2px solid var(--color-border); border-radius: var(--radius-md);
    padding: var(--space-4); cursor: pointer; transition: var(--transition);
    text-align: center;
  }
  .type-card:hover { border-color: var(--color-ocean); }
  .type-card.selected { border-color: var(--color-ocean); background: rgba(13,59,92,0.06); }
  .type-card strong { display: block; font-size: var(--text-sm); margin-bottom: var(--space-1); }
  .type-card small { font-size: 11px; color: var(--color-earth-light); }

  /* Video group */
  .video-group { background: rgba(232,152,42,0.08); border: 1px solid rgba(232,152,42,0.25); border-radius: var(--radius-md); padding: var(--space-4); }
  .label-hint { display: block; font-size: var(--text-xs); font-weight: 400; color: var(--color-earth-light); margin-top: 2px; }

  /* Images */
  .image-row { display: flex; gap: var(--space-2); margin-bottom: var(--space-2); }
  .btn-icon-remove {
    flex-shrink: 0; width: 36px; height: 36px;
    background: none; border: 1px solid var(--color-border);
    border-radius: var(--radius-sm); cursor: pointer; font-size: 12px;
    color: var(--color-earth-light); transition: var(--transition);
  }
  .btn-icon-remove:hover { background: #fee2e2; border-color: #ef4444; color: #ef4444; }

  .form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); }

  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

  @media (max-width: 640px) {
    .form-row { grid-template-columns: 1fr; }
    .prest-form { padding: var(--space-5); }
  }
</style>
