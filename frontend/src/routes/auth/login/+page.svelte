<script>
  import { goto } from '$app/navigation';
  import { authApi } from '$lib/api/auth.api.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);

  async function handleLogin(e) {
    e.preventDefault();
    isLoading = true;
    try {
      const { token, user } = await authApi.login({ email, password });
      authStore.login(token, user);
      toastStore.success(`Bienvenue, ${user.prenom} !`);
      goto('/');
    } catch (e) {
      toastStore.error(e.message || 'Identifiants invalides');
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head><title>Connexion — BeninExplore</title></svelte:head>

<div class="auth-page">
  <div class="auth-card card">
    <div class="auth-header">
      <span class="auth-logo">🇧🇯</span>
      <h1>Connexion</h1>
      <p>Accédez à votre espace BeninExplore</p>
    </div>

    <form onsubmit={handleLogin} class="auth-form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input id="email" type="email" class="form-input" bind:value={email} required placeholder="votre@email.com" />
      </div>
      <div class="form-group">
        <label class="form-label" for="password">Mot de passe</label>
        <input id="password" type="password" class="form-input" bind:value={password} required placeholder="••••••••" />
      </div>
      <button type="submit" class="btn btn-primary btn-block" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>

    <p class="auth-switch">
      Pas encore de compte ? <a href="/auth/register">S'inscrire</a>
    </p>
  </div>
</div>

<style>
  .auth-page {
    min-height: calc(100vh - var(--nav-h));
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-8) var(--container-padding);
    background: linear-gradient(135deg, var(--color-ivory) 0%, var(--color-ivory-dark) 100%);
  }
  .auth-card { width: 100%; max-width: 420px; padding: var(--space-10); }
  .auth-header { text-align: center; margin-bottom: var(--space-8); }
  .auth-logo { font-size: 3rem; display: block; margin-bottom: var(--space-4); }
  .auth-header h1 { margin-bottom: var(--space-2); }
  .auth-header p { color: var(--color-earth-medium); }
  .auth-form { display: flex; flex-direction: column; gap: var(--space-5); }
  .btn-block { width: 100%; justify-content: center; margin-top: var(--space-2); }
  .auth-switch { text-align: center; margin-top: var(--space-6); font-size: var(--text-sm); }
  .auth-switch a { color: var(--color-ocean); font-weight: 600; }
</style>
