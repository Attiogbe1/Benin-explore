<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { authApi } from '$lib/api/auth.api.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';

  let form = $state({ nom: '', prenom: '', bio: '', pays: '', telephone: '' });
  let isLoading = $state(false);

  onMount(() => {
    if (!authStore.isLoggedIn) return goto('/auth/login');
    const u = authStore.user;
    form = { nom: u.nom || '', prenom: u.prenom || '', bio: u.bio || '', pays: u.pays || '', telephone: u.telephone || '' };
  });

  async function handleUpdate(e) {
    e.preventDefault();
    isLoading = true;
    try {
      const user = await authApi.updateProfile(form);
      authStore.updateUser(user);
      toastStore.success('Profil mis à jour');
    } catch (e) {
      toastStore.error(e.message);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head><title>Mon profil — BeninExplore</title></svelte:head>

<div class="container profil-page">
  <div class="profil-header">
    <div class="avatar-big">{authStore.user?.prenom?.[0]}{authStore.user?.nom?.[0]}</div>
    <div>
      <h1>{authStore.user?.prenom} {authStore.user?.nom}</h1>
      <p>{authStore.user?.email}</p>
      <span class="role-badge">{authStore.user?.role}</span>
    </div>
  </div>

  <div class="profil-layout">
    <nav class="profil-nav">
      <a href="/profil" class="nav-item active">Informations</a>
      <a href="/profil/favoris" class="nav-item">❤️ Mes favoris</a>
      <a href="/profil/reservations" class="nav-item">🗓️ Mes réservations</a>
    </nav>

    <div class="profil-content card">
      <h2>Modifier mon profil</h2>
      <form onsubmit={handleUpdate} class="profil-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input type="text" class="form-input" bind:value={form.prenom} />
          </div>
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input type="text" class="form-input" bind:value={form.nom} />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea class="form-input" bind:value={form.bio} rows="3" placeholder="Parlez-nous de vous..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pays</label>
            <input type="text" class="form-input" bind:value={form.pays} placeholder="France, Bénin..." />
          </div>
          <div class="form-group">
            <label class="form-label">Téléphone</label>
            <input type="tel" class="form-input" bind:value={form.telephone} />
          </div>
        </div>
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .profil-page { padding-block: var(--space-8); }
  .profil-header { display: flex; align-items: center; gap: var(--space-6); margin-bottom: var(--space-8); }
  .avatar-big {
    width: 80px; height: 80px; flex-shrink: 0;
    background: var(--color-ocean); color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: var(--text-2xl); font-weight: 700; text-transform: uppercase;
  }
  .profil-header h1 { margin-bottom: var(--space-1); }
  .profil-header p { color: var(--color-earth-light); font-size: var(--text-sm); }
  .role-badge {
    background: var(--color-gold-light); color: var(--color-earth);
    padding: 2px 10px; border-radius: var(--radius-full);
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
  }
  .profil-layout { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-8); }
  .profil-nav { display: flex; flex-direction: column; gap: var(--space-2); }
  .nav-item {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm); font-weight: 500;
    color: var(--color-earth-medium); text-decoration: none;
    transition: var(--transition);
  }
  .nav-item:hover, .nav-item.active {
    background: var(--color-ocean); color: white;
  }
  .profil-content { padding: var(--space-8); }
  .profil-content h2 { margin-bottom: var(--space-6); }
  .profil-form { display: flex; flex-direction: column; gap: var(--space-5); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  @media (max-width: 768px) {
    .profil-layout { grid-template-columns: 1fr; }
    .profil-nav { flex-direction: row; flex-wrap: wrap; }
    .form-row { grid-template-columns: 1fr; }
  }
</style>
