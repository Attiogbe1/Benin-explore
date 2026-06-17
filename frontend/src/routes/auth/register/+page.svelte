<script>
  import { goto } from '$app/navigation';
  import { authApi } from '$lib/api/auth.api.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';

  let form = $state({
    prenom:    '',
    nom:       '',
    email:     '',
    telephone: '',
    password:  '',
    confirmPassword: '',
    langue:    'fr'
  });
  let isLoading   = $state(false);
  let showPass    = $state(false);
  let showConfirm = $state(false);

  async function handleRegister(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toastStore.error('Les mots de passe ne correspondent pas');
    }
    if (form.password.length < 8) {
      return toastStore.warning('Mot de passe : minimum 8 caractères');
    }
    isLoading = true;
    try {
      const payload = {
        prenom:    form.prenom,
        nom:       form.nom,
        email:     form.email,
        password:  form.password,
        langue:    form.langue,
        telephone: form.telephone || undefined
      };
      const { token, user } = await authApi.register(payload);
      authStore.login(token, user);
      toastStore.success('Compte créé ! Bienvenue sur BeninExplore 🇧🇯');
      goto('/');
    } catch (err) {
      toastStore.error(err.message || 'Erreur lors de l\'inscription');
    } finally {
      isLoading = false;
    }
  }

  const strength = $derived(() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8)  score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  });

  const strengthLabel = $derived(() => {
    const s = strength();
    if (!form.password) return null;
    if (s <= 1) return { label: 'Faible', color: '#ef4444' };
    if (s === 2) return { label: 'Moyen', color: '#f59e0b' };
    if (s === 3) return { label: 'Bon', color: '#3b82f6' };
    return { label: 'Fort', color: '#22c55e' };
  });
</script>

<svelte:head><title>Inscription — BeninExplore</title></svelte:head>

<div class="auth-page">
  <div class="auth-card card">
    <div class="auth-header">
      <span class="auth-logo">🇧🇯</span>
      <h1>Créer un compte</h1>
      <p>Rejoignez la communauté BeninExplore</p>
    </div>

    <form onsubmit={handleRegister} class="auth-form">

      <!-- Prénom -->
      <div class="field">
        <label class="field-label" for="prenom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          Prénom <span class="req">*</span>
        </label>
        <input
          id="prenom"
          type="text"
          class="form-input"
          bind:value={form.prenom}
          placeholder="Ex : Kouassi"
          required
          autocomplete="given-name"
        />
      </div>

      <!-- Nom -->
      <div class="field">
        <label class="field-label" for="nom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          Nom de famille <span class="req">*</span>
        </label>
        <input
          id="nom"
          type="text"
          class="form-input"
          bind:value={form.nom}
          placeholder="Ex : ATTIOGBE"
          required
          autocomplete="family-name"
        />
      </div>

      <!-- Email -->
      <div class="field">
        <label class="field-label" for="email">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Adresse email <span class="req">*</span>
        </label>
        <input
          id="email"
          type="email"
          class="form-input"
          bind:value={form.email}
          placeholder="vous@exemple.com"
          required
          autocomplete="email"
        />
      </div>

      <!-- Téléphone -->
      <div class="field">
        <label class="field-label" for="telephone">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>
          Téléphone <span class="opt">(optionnel)</span>
        </label>
        <input
          id="telephone"
          type="tel"
          class="form-input"
          bind:value={form.telephone}
          placeholder="+229 97 00 00 00"
          autocomplete="tel"
        />
      </div>

      <!-- Mot de passe -->
      <div class="field">
        <label class="field-label" for="password">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Mot de passe <span class="req">*</span>
        </label>
        <div class="input-eye">
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            class="form-input"
            bind:value={form.password}
            placeholder="Min. 8 caractères"
            required
            minlength="8"
            autocomplete="new-password"
          />
          <button type="button" class="eye-btn" onclick={() => showPass = !showPass} tabindex="-1">
            {showPass ? '🙈' : '👁'}
          </button>
        </div>
        {#if strengthLabel()}
          <div class="strength-bar">
            <div
              class="strength-fill"
              style="width:{strength() * 25}%;background:{strengthLabel()?.color}"
            ></div>
          </div>
          <span class="strength-label" style="color:{strengthLabel()?.color}">
            Force : {strengthLabel()?.label}
          </span>
        {/if}
      </div>

      <!-- Confirmer mot de passe -->
      <div class="field">
        <label class="field-label" for="confirm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          Confirmer le mot de passe <span class="req">*</span>
        </label>
        <div class="input-eye">
          <input
            id="confirm"
            type={showConfirm ? 'text' : 'password'}
            class="form-input"
            class:input-error={form.confirmPassword && form.password !== form.confirmPassword}
            class:input-ok={form.confirmPassword && form.password === form.confirmPassword}
            bind:value={form.confirmPassword}
            placeholder="Répétez le mot de passe"
            required
            autocomplete="new-password"
          />
          <button type="button" class="eye-btn" onclick={() => showConfirm = !showConfirm} tabindex="-1">
            {showConfirm ? '🙈' : '👁'}
          </button>
        </div>
        {#if form.confirmPassword && form.password !== form.confirmPassword}
          <span class="field-error">Les mots de passe ne correspondent pas</span>
        {/if}
      </div>

      <!-- Langue -->
      <div class="field">
        <label class="field-label" for="langue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
          Langue préférée
        </label>
        <select id="langue" class="form-input" bind:value={form.langue}>
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>
      </div>

      <!-- CGU -->
      <p class="cgu">
        En créant un compte, vous acceptez nos
        <a href="/mentions-legales">conditions d'utilisation</a>
        et notre <a href="/mentions-legales">politique de confidentialité</a>.
      </p>

      <button type="submit" class="btn btn-primary btn-block" disabled={isLoading}>
        {#if isLoading}
          <span class="spinner"></span> Création…
        {:else}
          🇧🇯 Créer mon compte
        {/if}
      </button>
    </form>

    <div class="auth-divider"><span>ou</span></div>

    <p class="auth-switch">
      Déjà un compte ? <a href="/auth/login">Se connecter →</a>
    </p>
  </div>
</div>

<style>
  .auth-page {
    min-height: calc(100vh - var(--nav-h));
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-8) var(--container-padding);
    background: linear-gradient(135deg,
      var(--color-ivory) 0%,
      rgba(13,59,92,0.04) 50%,
      rgba(232,152,42,0.04) 100%);
  }

  .auth-card {
    width: 100%; max-width: 480px;
    padding: var(--space-10) var(--space-8);
  }

  .auth-header { text-align: center; margin-bottom: var(--space-8); }
  .auth-logo { font-size: 3rem; display: block; margin-bottom: var(--space-3); }
  .auth-header h1 { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
  .auth-header p { color: var(--color-earth-medium); font-size: var(--text-sm); }

  /* ── Fields ────────────────────────────────────── */
  .auth-form { display: flex; flex-direction: column; gap: var(--space-4); }

  .field { display: flex; flex-direction: column; gap: var(--space-2); }

  .field-label {
    display: flex; align-items: center; gap: var(--space-2);
    font-size: var(--text-sm); font-weight: 600;
    color: var(--color-earth);
  }
  .field-label svg { color: var(--color-ocean); flex-shrink: 0; }
  .req  { color: #ef4444; }
  .opt  { font-weight: 400; color: var(--color-earth-light); font-size: var(--text-xs); }

  .form-input {
    padding: var(--space-3) var(--space-4);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: var(--font-body); font-size: var(--text-sm);
    width: 100%; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: white;
  }
  .form-input:focus {
    outline: none;
    border-color: var(--color-ocean);
    box-shadow: 0 0 0 3px rgba(13,59,92,0.1);
  }
  .form-input.input-error { border-color: #ef4444; }
  .form-input.input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
  .form-input.input-ok { border-color: #22c55e; }

  /* ── Password eye toggle ───────────────────────── */
  .input-eye { position: relative; }
  .input-eye .form-input { padding-right: 44px; }
  .eye-btn {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: 40px; background: none; border: none;
    cursor: pointer; font-size: 14px; display: flex;
    align-items: center; justify-content: center;
    color: var(--color-earth-light);
  }
  .eye-btn:hover { color: var(--color-ocean); }

  /* ── Strength bar ──────────────────────────────── */
  .strength-bar {
    height: 4px; background: var(--color-border);
    border-radius: 2px; overflow: hidden;
    margin-top: var(--space-1);
  }
  .strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
  .strength-label { font-size: var(--text-xs); font-weight: 600; margin-top: 2px; }

  /* ── Error / hint ──────────────────────────────── */
  .field-error { font-size: var(--text-xs); color: #ef4444; font-weight: 500; }

  /* ── CGU ───────────────────────────────────────── */
  .cgu {
    font-size: var(--text-xs); color: var(--color-earth-light);
    text-align: center; line-height: 1.5;
    margin-top: var(--space-2);
  }
  .cgu a { color: var(--color-ocean); }

  /* ── Submit ────────────────────────────────────── */
  .btn-block {
    width: 100%; justify-content: center;
    padding: var(--space-4); font-size: var(--text-base);
    margin-top: var(--space-2);
    display: flex; align-items: center; gap: var(--space-2);
  }
  .spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.6s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider / switch ──────────────────────────── */
  .auth-divider {
    display: flex; align-items: center; gap: var(--space-4);
    margin: var(--space-5) 0; color: var(--color-earth-light); font-size: var(--text-sm);
  }
  .auth-divider::before,
  .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }

  .auth-switch { text-align: center; font-size: var(--text-sm); color: var(--color-earth-medium); margin-top: var(--space-4); }
  .auth-switch a { color: var(--color-ocean); font-weight: 600; text-decoration: none; }
  .auth-switch a:hover { text-decoration: underline; }

  @media (max-width: 520px) {
    .auth-card { padding: var(--space-7) var(--space-5); }
  }
</style>
