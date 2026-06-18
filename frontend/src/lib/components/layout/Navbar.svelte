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
    { href: '/sites',        label: 'Destinations', icon: '🗺️' },
    { href: '/map',          label: 'Carte',         icon: '📍' },
    { href: '/prestataires', label: 'Services',      icon: '🏨' },
    { href: '/reservations', label: 'Réservations',  icon: '📅' },
    { href: '/blog',         label: 'Blog',          icon: '✍️' },
    { href: '/urgence',      label: 'Urgences',      icon: '🆘' },
  ];

  function handleScroll() { isScrolled = window.scrollY > 20; }

  function handleKeydown(e) {
    if (e.key === 'Escape') { isMenuOpen = false; showNotifs = false; showLang = false; }
  }

  function closeDropdowns(e) {
    if (!e.target.closest('.notif-wrapper')) showNotifs = false;
    if (!e.target.closest('.lang-wrapper'))  showLang   = false;
  }

  function logout() {
    notificationsStore.disconnect();
    authStore.logout();
    isMenuOpen = false;
    goto('/');
  }

  function toggleNotifs() {
    showNotifs = !showNotifs;
    if (showNotifs && notificationsStore.unread > 0) notificationsStore.markAllRead();
  }

  onMount(() => {
    if (authStore.isLoggedIn && authStore.user?.id) notificationsStore.init(authStore.user.id);
  });
  onDestroy(() => {});
</script>

<svelte:window onscroll={handleScroll} onclick={closeDropdowns} onkeydown={handleKeydown} />

<!-- Backdrop -->
{#if isMenuOpen}
  <div class="drawer-backdrop" onclick={() => isMenuOpen = false} role="presentation"></div>
{/if}

<!-- ── Navbar ──────────────────────────────────────── -->
<header class="navbar" class:scrolled={isScrolled} class:hero-mode={heroMode}>
  <div class="container nav-inner">

    <a href="/" class="logo" onclick={() => isMenuOpen = false}>
      <span class="logo-flag">🇧🇯</span>
      <span class="logo-text">Benin<strong>Explore</strong></span>
    </a>

    <!-- Desktop links -->
    <nav class="nav-links-desktop" aria-label="Navigation principale">
      {#each navLinks as link}
        <a href={link.href} class="nav-link"
          class:active={$page.url.pathname.startsWith(link.href)}>
          {link.label}
        </a>
      {/each}
    </nav>

    <!-- Right actions -->
    <div class="nav-actions">

      {#if authStore.isLoggedIn}
        <!-- Notification bell -->
        <div class="notif-wrapper">
          <button class="icon-btn" onclick={(e) => { e.stopPropagation(); toggleNotifs(); }} aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {#if notificationsStore.unread > 0}
              <span class="notif-badge">{notificationsStore.unread > 9 ? '9+' : notificationsStore.unread}</span>
            {/if}
          </button>
          {#if showNotifs}
            <div class="notif-dropdown" role="menu" tabindex="0"
              onclick={(e) => e.stopPropagation()}
              onkeydown={(e) => { if (e.key === 'Escape') showNotifs = false; }}>
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
                    <button type="button" class="notif-item" class:unread={!n.lu}
                      onclick={() => { notificationsStore.markRead(n.id); if (n.lien) goto(n.lien); showNotifs = false; }}>
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

        <!-- Avatar + name (desktop only) -->
        <a href="/profil" class="nav-avatar desktop-only">
          <span class="avatar-circle">{authStore.user?.prenom?.[0]}{authStore.user?.nom?.[0]}</span>
          <span class="nav-username">{authStore.user?.prenom}</span>
        </a>

        <!-- Desktop auth buttons -->
        <div class="desktop-btns">
          {#if authStore.isPrestataire}
            <a href="/profil/prestataire" class="btn btn-outline btn-sm">Mon espace</a>
          {/if}
          {#if authStore.isAdmin}
            <a href="/admin" class="btn btn-outline btn-sm">Admin</a>
          {/if}
          <button class="btn btn-ghost btn-sm" onclick={logout}>Déconnexion</button>
        </div>
      {:else}
        <div class="desktop-btns">
          <a href="/devenir-prestataire" class="btn btn-ghost btn-sm">Devenir prestataire</a>
          <a href="/auth/login" class="btn btn-ghost btn-sm">Connexion</a>
          <a href="/auth/register" class="btn btn-primary btn-sm">S'inscrire</a>
        </div>
      {/if}

      <!-- Language switcher -->
      <div class="lang-wrapper">
        <button class="lang-btn"
          onclick={(e) => { e.stopPropagation(); showLang = !showLang; }}
          aria-label="Changer de langue" aria-expanded={showLang}>
          <span class="lang-flag">{langStore.flag}</span>
          <span class="lang-code">{langStore.current.toUpperCase()}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        {#if showLang}
          <div class="lang-dropdown" role="menu" tabindex="0"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => { if (e.key === 'Escape') showLang = false; }}>
            {#each LANGUAGES as l}
              <button class="lang-option" class:lang-active={langStore.current === l.code}
                onclick={() => { langStore.set(l.code); chatStore.setLangue(l.code); showLang = false; }}>
                <span>{l.flag}</span><span>{l.label}</span>
                {#if langStore.current === l.code}<span class="lang-check">✓</span>{/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Hamburger -->
      <button class="menu-toggle" class:open={isMenuOpen}
        onclick={() => isMenuOpen = !isMenuOpen}
        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isMenuOpen}>
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<!-- ── Drawer latéral ────────────────────────────── -->
<aside class="drawer" class:open={isMenuOpen} aria-label="Menu" aria-hidden={!isMenuOpen}>

  <!-- Drawer header -->
  <div class="drawer-head">
    <a href="/" class="logo" onclick={() => isMenuOpen = false}>
      <span class="logo-flag">🇧🇯</span>
      <span class="logo-text">Benin<strong>Explore</strong></span>
    </a>
    <button class="drawer-close" onclick={() => isMenuOpen = false} aria-label="Fermer">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Navigation -->
  <nav class="drawer-nav">
    <p class="drawer-label">Navigation</p>
    {#each navLinks as link}
      <a href={link.href} class="drawer-link"
        class:active={$page.url.pathname.startsWith(link.href)}
        onclick={() => isMenuOpen = false}>
        <span class="dl-icon">{link.icon}</span>
        <span class="dl-text">{link.label}</span>
        <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </a>
    {/each}
  </nav>

  <!-- Auth -->
  <div class="drawer-auth">
    {#if authStore.isLoggedIn}
      <div class="drawer-user-card">
        <span class="avatar-circle avatar-lg">
          {authStore.user?.prenom?.[0]}{authStore.user?.nom?.[0]}
        </span>
        <div class="drawer-user-info">
          <span class="drawer-user-name">{authStore.user?.prenom} {authStore.user?.nom}</span>
          <span class="drawer-user-email">{authStore.user?.email}</span>
        </div>
      </div>
      <a href="/profil" class="drawer-link" onclick={() => isMenuOpen = false}>
        <span class="dl-icon">👤</span><span class="dl-text">Mon profil</span>
        <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
      </a>
      {#if authStore.isPrestataire}
        <a href="/profil/prestataire" class="drawer-link" onclick={() => isMenuOpen = false}>
          <span class="dl-icon">🏢</span><span class="dl-text">Mon espace prestataire</span>
          <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      {/if}
      {#if authStore.isAdmin}
        <a href="/admin" class="drawer-link" onclick={() => isMenuOpen = false}>
          <span class="dl-icon">⚙️</span><span class="dl-text">Administration</span>
          <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      {/if}
      <button class="drawer-logout" onclick={logout}>
        <span class="dl-icon">🚪</span>
        <span class="dl-text">Déconnexion</span>
      </button>
    {:else}
      <div class="drawer-auth-btns">
        <a href="/auth/register" class="btn btn-primary" onclick={() => isMenuOpen = false}>S'inscrire</a>
        <a href="/auth/login" class="btn btn-outline" onclick={() => isMenuOpen = false}>Connexion</a>
      </div>
      <a href="/devenir-prestataire" class="drawer-link" onclick={() => isMenuOpen = false}>
        <span class="dl-icon">🏨</span><span class="dl-text">Devenir prestataire</span>
        <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    {/if}
  </div>

  <!-- Language in drawer -->
  <div class="drawer-langs">
    <p class="drawer-label">Langue</p>
    <div class="drawer-lang-grid">
      {#each LANGUAGES as l}
        <button class="drawer-lang-btn" class:active={langStore.current === l.code}
          onclick={() => { langStore.set(l.code); chatStore.setLangue(l.code); }}>
          <span>{l.flag}</span>
          <span>{l.label}</span>
          {#if langStore.current === l.code}<span class="lang-check-sm">✓</span>{/if}
        </button>
      {/each}
    </div>
  </div>

</aside>

<style>
  /* ══ NAVBAR ══════════════════════════════════════════ */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100; height: var(--nav-h);
    background: transparent; transition: var(--transition);
  }
  .navbar.scrolled {
    background: rgba(251,248,243,0.96);
    backdrop-filter: blur(14px);
    box-shadow: var(--shadow-sm);
  }
  .nav-inner {
    display: flex; align-items: center;
    justify-content: space-between; height: 100%; gap: var(--space-4);
  }
  .logo {
    display: flex; align-items: center; gap: var(--space-2);
    font-family: var(--font-display); font-size: var(--text-xl);
    color: var(--color-ocean); text-decoration: none; flex-shrink: 0;
  }
  .logo-flag { font-size: 1.5rem; }
  .logo-text strong { color: var(--color-gold); }

  /* Desktop nav links */
  .nav-links-desktop {
    display: flex; align-items: center; gap: var(--space-5); flex: 1;
    justify-content: center;
  }
  .nav-link {
    font-size: var(--text-sm); font-weight: 500;
    color: var(--color-earth-medium); text-decoration: none;
    transition: var(--transition); position: relative; padding-bottom: 2px;
    white-space: nowrap;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
    height: 2px; background: var(--color-gold);
    transform: scaleX(0); transition: var(--transition);
  }
  .nav-link:hover, .nav-link.active { color: var(--color-ocean); }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

  /* Right actions */
  .nav-actions { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
  .desktop-btns { display: flex; align-items: center; gap: var(--space-2); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }

  /* Avatar */
  .nav-avatar {
    display: flex; align-items: center; gap: var(--space-2);
    text-decoration: none; color: var(--color-earth);
  }
  .avatar-circle {
    width: 32px; height: 32px; background: var(--color-ocean);
    color: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
    flex-shrink: 0;
  }
  .avatar-lg { width: 40px; height: 40px; font-size: var(--text-sm); }
  .nav-username { font-size: var(--text-sm); }

  /* Icon button */
  .icon-btn {
    position: relative; background: none; border: none; cursor: pointer;
    color: var(--color-earth-medium); width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; transition: var(--transition);
  }
  .icon-btn:hover { background: rgba(0,0,0,0.06); color: var(--color-ocean); }

  /* Notifications */
  .notif-wrapper { position: relative; }
  .notif-badge {
    position: absolute; top: 2px; right: 2px;
    min-width: 16px; height: 16px; background: var(--color-terracotta);
    color: white; border-radius: 8px; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; padding: 0 3px;
    animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
  .notif-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0; width: 340px;
    background: white; border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0,0,0,0.16); overflow: hidden; z-index: 200;
    animation: dropIn 0.18s ease;
  }
  @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  .notif-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-sm); font-weight: 600;
  }
  .notif-mark-all { background:none; border:none; cursor:pointer; font-size:var(--text-xs); color:var(--color-ocean); }
  .notif-empty { padding: var(--space-6); text-align:center; color:var(--color-earth-light); font-size:var(--text-sm); }
  .notif-list { list-style:none; margin:0; padding:0; max-height:360px; overflow-y:auto; }
  .notif-item {
    display:flex; gap:var(--space-3); padding:var(--space-3) var(--space-4);
    border-bottom:1px solid var(--color-border); cursor:pointer; transition:background 0.15s;
    width:100%; text-align:left; background:none; border:none; border-bottom:1px solid var(--color-border);
  }
  .notif-item:hover { background:var(--color-ivory); }
  .notif-item.unread { background:rgba(13,59,92,0.04); }
  .notif-icon { font-size:1.4rem; flex-shrink:0; padding-top:2px; }
  .notif-content { flex:1; min-width:0; }
  .notif-content strong { display:block; font-size:var(--text-sm); margin-bottom:2px; }
  .notif-content p { font-size:var(--text-xs); color:var(--color-earth-medium); margin:0 0 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .notif-content time { font-size:11px; color:var(--color-earth-light); }

  /* Language */
  .lang-wrapper { position: relative; }
  .lang-btn {
    display: flex; align-items: center; gap: 4px;
    background: none; border: 1.5px solid var(--color-border);
    color: var(--color-earth-medium); padding: 5px 10px;
    border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 700;
    cursor: pointer; transition: var(--transition); white-space: nowrap;
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
    padding: var(--space-3) var(--space-4); background: none; border: none;
    cursor: pointer; font-size: var(--text-sm); width: 100%; text-align: left;
    transition: background 0.15s; color: var(--color-earth);
  }
  .lang-option:hover { background: var(--color-ivory); }
  .lang-option.lang-active { color: var(--color-ocean); font-weight: 600; }
  .lang-check { margin-left: auto; color: var(--color-ocean); font-weight: 700; }

  /* Hamburger */
  .menu-toggle {
    display: none; flex-direction: column; justify-content: center;
    gap: 5px; background: none; border: none; cursor: pointer;
    padding: 8px; border-radius: var(--radius-md);
    transition: background 0.2s; min-width: 44px; min-height: 44px;
    align-items: center;
  }
  .menu-toggle:hover { background: rgba(0,0,0,0.06); }
  .menu-toggle span {
    display: block; width: 22px; height: 2px;
    background: var(--color-earth); border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s, background 0.25s;
    transform-origin: center;
  }
  .menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .menu-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ══ HERO MODE ══════════════════════════════════════ */
  .navbar.hero-mode .nav-link { color: rgba(255,255,255,0.85); }
  .navbar.hero-mode .nav-link:hover,
  .navbar.hero-mode .nav-link.active { color: white; }
  .navbar.hero-mode .nav-link::after { background: var(--color-gold-light); }
  .navbar.hero-mode .logo { color: white; }
  .navbar.hero-mode .logo strong { color: var(--color-gold-light); }
  .navbar.hero-mode .btn-ghost { color: rgba(255,255,255,0.85); }
  .navbar.hero-mode .btn-ghost:hover { background: rgba(255,255,255,0.12); color: white; }
  .navbar.hero-mode .btn-primary { background: var(--color-gold); }
  .navbar.hero-mode .menu-toggle span { background: white; }
  .navbar.hero-mode .icon-btn { color: rgba(255,255,255,0.85); }
  .navbar.hero-mode .icon-btn:hover { background: rgba(255,255,255,0.12); color: white; }
  .navbar.hero-mode .lang-btn { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.85); }
  .navbar.hero-mode .lang-btn:hover { border-color: white; color: white; }
  .navbar.hero-mode .nav-avatar { color: rgba(255,255,255,0.9); }
  .navbar.hero-mode .nav-username { color: rgba(255,255,255,0.9); }

  /* ══ DRAWER ═════════════════════════════════════════ */
  .drawer-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 149; backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(340px, 88vw);
    background: var(--color-white);
    z-index: 150;
    display: flex; flex-direction: column;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -4px 0 32px rgba(0,0,0,0.18);
  }
  .drawer.open { transform: translateX(0); }

  .drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0; min-height: var(--nav-h);
  }

  .drawer-close {
    background: none; border: none; cursor: pointer;
    color: var(--color-earth-medium); padding: 8px; border-radius: 50%;
    transition: background 0.2s, color 0.2s;
    min-width: 44px; min-height: 44px;
    display: flex; align-items: center; justify-content: center;
  }
  .drawer-close:hover { background: var(--color-ivory-dark); color: var(--color-ocean); }

  .drawer-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--color-earth-light);
    padding: var(--space-4) var(--space-5) var(--space-2);
    margin: 0;
  }

  .drawer-nav { padding: 0 var(--space-3); }
  .drawer-auth { padding: 0 var(--space-3); }
  .drawer-langs { padding: 0 var(--space-3) var(--space-5); }

  /* Drawer link */
  .drawer-link {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-3) var(--space-3);
    border-radius: var(--radius-md);
    text-decoration: none; color: var(--color-earth);
    font-size: var(--text-sm); font-weight: 500;
    transition: background 0.15s, color 0.15s;
    min-height: 48px;
  }
  .drawer-link:hover { background: var(--color-ivory); color: var(--color-ocean); }
  .drawer-link.active { background: rgba(13,59,92,0.08); color: var(--color-ocean); font-weight: 600; }
  .dl-icon { font-size: 1.1rem; width: 24px; text-align: center; flex-shrink: 0; }
  .dl-text { flex: 1; }
  .dl-arrow { margin-left: auto; color: var(--color-earth-light); flex-shrink: 0; }
  .drawer-link:hover .dl-arrow { color: var(--color-ocean); }

  /* Drawer user card */
  .drawer-user-card {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-3) var(--space-3);
    background: var(--color-ivory);
    border-radius: var(--radius-md); margin-bottom: var(--space-2);
  }
  .drawer-user-info { min-width: 0; }
  .drawer-user-name { font-size: var(--text-sm); font-weight: 600; color: var(--color-earth); display: block; }
  .drawer-user-email { font-size: var(--text-xs); color: var(--color-earth-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

  /* Drawer auth buttons */
  .drawer-auth-btns {
    display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);
    padding: var(--space-2) var(--space-3) var(--space-3);
  }
  .drawer-auth-btns .btn { text-align: center; justify-content: center; }

  /* Drawer logout */
  .drawer-logout {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-3) var(--space-3);
    border-radius: var(--radius-md);
    background: none; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
    color: var(--color-terracotta); width: 100%; text-align: left;
    min-height: 48px; transition: background 0.15s;
  }
  .drawer-logout:hover { background: rgba(220,38,38,0.06); }

  /* Drawer language grid */
  .drawer-lang-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: var(--space-2); padding: 0 var(--space-3);
  }
  .drawer-lang-btn {
    display: flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-ivory); border: 1.5px solid transparent;
    border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm);
    color: var(--color-earth); transition: all 0.15s;
    min-height: 44px;
  }
  .drawer-lang-btn:hover { background: var(--color-ivory-dark); }
  .drawer-lang-btn.active { border-color: var(--color-ocean); color: var(--color-ocean); font-weight: 600; background: rgba(13,59,92,0.06); }
  .lang-check-sm { margin-left: auto; color: var(--color-ocean); font-weight: 700; font-size: 0.75rem; }

  /* ══ RESPONSIVE BREAKPOINTS ═════════════════════════ */

  /* Hide hamburger on large screens, show desktop nav */
  @media (min-width: 1024px) {
    .menu-toggle { display: none !important; }
    .drawer { display: none; }
    .drawer-backdrop { display: none; }
  }

  /* Tablet + Mobile: show hamburger, hide desktop nav/btns */
  @media (max-width: 1023px) {
    .nav-links-desktop { display: none; }
    .desktop-btns { display: none; }
    .desktop-only { display: none !important; }
    .menu-toggle { display: flex; }
  }

  /* Medium tablet: show nav username */
  @media (max-width: 768px) {
    .nav-username { display: none; }
    .lang-code { display: none; }
    .lang-btn { padding: 5px 7px; }
  }

  /* Small mobile: tighter nav */
  @media (max-width: 480px) {
    .notif-dropdown {
      position: fixed;
      top: var(--nav-h); left: 0.75rem; right: 0.75rem; width: auto;
    }
    .lang-dropdown { right: -60px; }
  }
</style>
