<script>
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { notificationsStore } from '$lib/stores/notifications.store.svelte.js';
  import { chatStore } from '$lib/stores/chat.store.svelte.js';
  import { langStore, LANGUAGES } from '$lib/stores/lang.store.svelte.js';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';

  let isMenuOpen = $state(false);
  let isScrolled = $state(false);
  let showNotifs = $state(false);
  let showLang   = $state(false);

  const isHeroPage = $derived($page.url.pathname === '/');
  const heroMode   = $derived(isHeroPage && !isScrolled);

  const navLinks = [
    { href: '/sites',          label: 'Destinations' },
    { href: '/map',            label: 'Carte'         },
    { href: '/prestataires',   label: 'Services'      },
    { href: '/reservations',   label: 'Réservations'  },
    { href: '/blog',           label: 'Blog'          },
    { href: '/urgence',        label: 'Urgences'      }
  ];

  function handleScroll() {
    isScrolled = window.scrollY > 20;
  }

  function logout() {
    notificationsStore.disconnect();
    authStore.logout();
    isMenuOpen = false;
    goto('/');
  }

  function toggleNotifs() {
    showNotifs = !showNotifs;
    if (showNotifs && notificationsStore.unread > 0) {
      notificationsStore.markAllRead();
    }
  }

  function closeNotifs(e) {
    if (!e.target.closest('.notif-wrapper')) showNotifs = false;
    if (!e.target.closest('.lang-wrapper'))  showLang   = false;
  }

  onMount(() => {
    if (authStore.isLoggedIn && authStore.user?.id) {
      notificationsStore.init(authStore.user.id);
    }
  });

  onDestroy(() => {});
</script>

<svelte:window onscroll={handleScroll} onclick={closeNotifs} />

<header class="navbar" class:scrolled={isScrolled} class:hero-mode={heroMode}>
  <div class="container nav-inner">
    <a href="/" class="logo">
      <span class="logo-flag">🇧🇯</span>
      <span class="logo-text">Benin<strong>Explore</strong></span>
    </a>

    <nav class="nav-links" class:open={isMenuOpen} aria-label="Navigation principale">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={$page.url.pathname.startsWith(link.href)}
          onclick={() => isMenuOpen = false}
        >
          {link.label}
        </a>
      {/each}

      <div class="nav-mobile-auth">
        {#if authStore.isLoggedIn}
          <a href="/profil" class="nav-link" onclick={() => isMenuOpen = false}>Mon profil</a>
          {#if authStore.isPrestataire}
            <a href="/profil/prestataire" class="nav-link" onclick={() => isMenuOpen = false}>Mon espace prestataire</a>
          {/if}
          {#if authStore.isAdmin}
            <a href="/admin" class="nav-link" onclick={() => isMenuOpen = false}>Administration</a>
          {/if}
          <button class="nav-link nav-logout-btn" onclick={logout}>Déconnexion</button>
        {:else}
          <a href="/devenir-prestataire" class="nav-link" onclick={() => isMenuOpen = false}>Devenir prestataire</a>
          <a href="/auth/login" class="nav-link" onclick={() => isMenuOpen = false}>Connexion</a>
          <a href="/auth/register" class="btn btn-primary nav-register-btn" onclick={() => isMenuOpen = false}>S'inscrire</a>
        {/if}
      </div>
    </nav>

    <div class="nav-actions">
      {#if authStore.isLoggedIn}
        <!-- Notification bell -->
        <div class="notif-wrapper">
          <button class="notif-btn" onclick={(e) => { e.stopPropagation(); toggleNotifs(); }} aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {#if notificationsStore.unread > 0}
              <span class="notif-badge">{notificationsStore.unread > 9 ? '9+' : notificationsStore.unread}</span>
            {/if}
          </button>

          {#if showNotifs}
            <div
              class="notif-dropdown"
              role="menu"
              aria-label="Notifications"
              tabindex="0"
              onclick={(e) => e.stopPropagation()}
              onkeydown={(e) => { if (e.key === 'Escape') showNotifs = false; }}
            >
              <div class="notif-header">
                <span>Notifications</span>
                {#if notificationsStore.items.length > 0}
                  <button class="notif-mark-all" onclick={notificationsStore.markAllRead}>Tout marquer lu</button>
                {/if}
              </div>
              {#if notificationsStore.items.length === 0}
                <p class="notif-empty">Aucune notification</p>
              {:else}
                <ul class="notif-list">
                  {#each notificationsStore.items.slice(0, 8) as n}
                    <button
                      type="button"
                      class="notif-item"
                      class:unread={!n.lu}
                      onclick={() => { notificationsStore.markRead(n.id); if (n.lien) goto(n.lien); showNotifs = false; }}
                    >
                      <div class="notif-icon">{n.type === 'nouvelle_reservation' ? '📬' : '📋'}</div>
                      <div class="notif-content">
                        <strong>{n.titre}</strong>
                        <p>{n.message}</p>
                        <time>{new Date(n.createdAt).toLocaleDateString('fr-FR')}</time>
                      </div>
                    </button>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>

        <a href="/profil" class="btn btn-ghost nav-avatar">
          <span class="avatar-circle">{authStore.user?.prenom?.[0]}{authStore.user?.nom?.[0]}</span>
          <span class="nav-username">{authStore.user?.prenom}</span>
        </a>
        {#if authStore.isPrestataire}
          <a href="/profil/prestataire" class="btn btn-outline btn-sm">Mon espace</a>
        {/if}
        {#if authStore.isAdmin}
          <a href="/admin" class="btn btn-outline btn-sm">Admin</a>
        {/if}
        <button class="btn btn-ghost btn-sm" onclick={logout}>Déconnexion</button>
      {:else}
        <a href="/devenir-prestataire" class="btn btn-ghost btn-sm">Devenir prestataire</a>
        <a href="/auth/login" class="btn btn-ghost btn-sm">Connexion</a>
        <a href="/auth/register" class="btn btn-primary btn-sm">S'inscrire</a>
      {/if}

      <!-- Language switcher -->
      <div class="lang-wrapper">
        <button
          class="lang-btn"
          onclick={(e) => { e.stopPropagation(); showLang = !showLang; }}
          aria-label="Changer de langue"
          aria-expanded={showLang}
        >
          <span class="lang-flag">{langStore.flag}</span>
          <span class="lang-code">{langStore.current.toUpperCase()}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        {#if showLang}
          <div
            class="lang-dropdown"
            role="menu"
            aria-label="Choisir une langue"
            tabindex="0"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => { if (e.key === 'Escape') showLang = false; }}
          >
            {#each LANGUAGES as l}
              <button
                class="lang-option"
                class:lang-active={langStore.current === l.code}
                onclick={() => { langStore.set(l.code); chatStore.setLangue(l.code); showLang = false; }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {#if langStore.current === l.code}<span class="lang-check">✓</span>{/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <button
        class="menu-toggle"
        class:open={isMenuOpen}
        onclick={() => isMenuOpen = !isMenuOpen}
        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isMenuOpen}
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<style>
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: var(--nav-h);
    background: transparent;
    transition: var(--transition);
  }
  .navbar.scrolled {
    background: rgba(251, 248, 243, 0.95);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-sm);
  }
  .nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 100%;
  }
  .logo {
    display: flex; align-items: center; gap: var(--space-2);
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-ocean);
    text-decoration: none;
  }
  .logo-flag { font-size: 1.5rem; }
  .logo-text strong { color: var(--color-gold); }
  .nav-links {
    display: flex; align-items: center; gap: var(--space-5);
  }
  .nav-link {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-earth-medium);
    text-decoration: none;
    transition: var(--transition);
    position: relative;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content: ''; position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px; background: var(--color-gold);
    transform: scaleX(0); transition: var(--transition);
  }
  .nav-link:hover, .nav-link.active { color: var(--color-ocean); }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
  .nav-actions { display: flex; align-items: center; gap: var(--space-2); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
  .avatar-circle {
    width: 32px; height: 32px;
    background: var(--color-ocean);
    color: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--text-xs); font-weight: 700;
    text-transform: uppercase;
  }
  .nav-username { font-size: var(--text-sm); }

  /* Notification bell */
  .notif-wrapper { position: relative; }
  .notif-btn {
    position: relative;
    background: none; border: none; cursor: pointer;
    color: var(--color-earth-medium);
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
  }
  .notif-btn:hover { background: rgba(0,0,0,0.06); color: var(--color-ocean); }
  .notif-badge {
    position: absolute; top: 2px; right: 2px;
    min-width: 16px; height: 16px;
    background: var(--color-terracotta);
    color: white; border-radius: 8px;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
    animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

  .notif-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    width: 340px;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0,0,0,0.16);
    overflow: hidden;
    z-index: 200;
    animation: dropIn 0.18s ease;
  }
  @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  .notif-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-sm); font-weight: 600;
  }
  .notif-mark-all {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); color: var(--color-ocean);
  }
  .notif-empty { padding: var(--space-6); text-align: center; color: var(--color-earth-light); font-size: var(--text-sm); }
  .notif-list { list-style: none; margin: 0; padding: 0; max-height: 360px; overflow-y: auto; }
  .notif-item {
    display: flex; gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    cursor: pointer; transition: background 0.15s;
  }
  .notif-item:hover { background: var(--color-ivory); }
  .notif-item.unread { background: rgba(13,59,92,0.04); }
  .notif-icon { font-size: 1.4rem; flex-shrink: 0; padding-top: 2px; }
  .notif-content { flex: 1; min-width: 0; }
  .notif-content strong { display: block; font-size: var(--text-sm); margin-bottom: 2px; }
  .notif-content p { font-size: var(--text-xs); color: var(--color-earth-medium); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .notif-content time { font-size: 11px; color: var(--color-earth-light); }

  /* Hero mode */
  .navbar.hero-mode .nav-link { color: rgba(255,255,255,0.82); }
  .navbar.hero-mode .nav-link:hover,
  .navbar.hero-mode .nav-link.active { color: white; }
  .navbar.hero-mode .nav-link::after { background: var(--color-gold-light); }
  .navbar.hero-mode .logo { color: white; }
  .navbar.hero-mode .logo strong { color: var(--color-gold-light); }
  .navbar.hero-mode .btn-ghost { color: rgba(255,255,255,0.82); }
  .navbar.hero-mode .btn-ghost:hover { background: rgba(255,255,255,0.12); color: white; }
  .navbar.hero-mode .btn-primary { background: var(--color-gold); }
  .navbar.hero-mode .menu-toggle span { background: white; }
  .navbar.hero-mode .notif-btn { color: rgba(255,255,255,0.82); }
  .navbar.hero-mode .notif-btn:hover { background: rgba(255,255,255,0.12); color: white; }

  /* ── Language switcher ─────── */
  .lang-wrapper { position: relative; }
  .lang-btn {
    display: flex; align-items: center; gap: 4px;
    background: none;
    border: 1.5px solid var(--color-border);
    color: var(--color-earth-medium);
    padding: 5px 10px; border-radius: var(--radius-full);
    font-size: var(--text-xs); font-weight: 700;
    cursor: pointer; transition: var(--transition);
  }
  .lang-btn:hover { border-color: var(--color-ocean); color: var(--color-ocean); }
  .lang-flag { font-size: 1rem; }
  .lang-code { letter-spacing: 0.04em; }
  .lang-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: white; border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0,0,0,0.16);
    overflow: hidden; z-index: 210; min-width: 148px;
    animation: dropIn 0.18s ease;
  }
  .lang-option {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: none; border: none; cursor: pointer;
    font-size: var(--text-sm); width: 100%; text-align: left;
    transition: background 0.15s; color: var(--color-earth);
  }
  .lang-option:hover { background: var(--color-ivory); }
  .lang-option.lang-active { color: var(--color-ocean); font-weight: 600; }
  .lang-check { margin-left: auto; color: var(--color-ocean); font-weight: 700; }

  /* Hero mode lang */
  .navbar.hero-mode .lang-btn { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.85); }
  .navbar.hero-mode .lang-btn:hover { border-color: white; color: white; }

  /* ── Auth mobile panel ──────── */
  .nav-mobile-auth {
    display: none;
    flex-direction: column;
    gap: var(--space-3);
    padding-top: var(--space-4);
    margin-top: var(--space-2);
    border-top: 1px solid rgba(0,0,0,0.08);
    width: 100%;
  }
  .nav-logout-btn {
    background: none; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
    color: var(--color-terracotta); text-align: left; padding: 0;
  }
  .nav-register-btn { text-align: center; }

  /* ── Hamburger ─────────────── */
  .menu-toggle {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 5px;
  }
  .menu-toggle span {
    display: block; width: 22px; height: 2px;
    background: var(--color-earth); border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                opacity 0.2s ease, background 0.25s ease;
    transform-origin: center;
  }
  .menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .menu-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  @media (max-width: 768px) {
    .nav-links {
      display: flex;
      position: fixed;
      top: var(--nav-h); left: 0; right: 0;
      background: var(--color-ivory);
      flex-direction: column; padding: var(--space-6);
      box-shadow: var(--shadow-lg);
      gap: var(--space-4);
      opacity: 0; transform: translateY(-8px);
      pointer-events: none;
      transition: opacity 0.28s cubic-bezier(0.4,0,0.2,1),
                  transform 0.28s cubic-bezier(0.4,0,0.2,1);
      max-height: calc(100vh - var(--nav-h));
      overflow-y: auto;
    }
    .nav-links.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .menu-toggle { display: flex; }
    .nav-username { display: none; }
    .nav-actions .btn-sm { display: none; }
    .nav-mobile-auth { display: flex; }
    .navbar.hero-mode .nav-links { background: var(--color-ocean-dark); }
    .navbar.hero-mode .nav-links .nav-link { color: rgba(255,255,255,0.85); }
    .navbar.hero-mode .nav-mobile-auth { border-top-color: rgba(255,255,255,0.2); }
    .navbar.hero-mode .nav-logout-btn { color: #f87171; }
    .notif-dropdown { right: -80px; width: 300px; }
  }

  @media (max-width: 420px) {
    .notif-dropdown {
      position: fixed;
      top: var(--nav-h);
      left: 0.75rem;
      right: 0.75rem;
      width: auto;
    }
  }
</style>
