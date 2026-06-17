<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  let { children } = $props();

  onMount(() => {
    if (!authStore.isAdmin) goto('/');
  });

  const navGroups = [
    {
      title: 'Vue d\'ensemble',
      items: [{ href: '/admin', label: '📊 Dashboard' }]
    },
    {
      title: 'Contenu',
      items: [
        { href: '/admin/sites',         label: '🗺️ Sites touristiques' },
        { href: '/admin/blog',          label: '📰 Blog' },
        { href: '/admin/avis',          label: '⭐ Avis & Notes' },
      ]
    },
    {
      title: 'Commerce',
      items: [
        { href: '/admin/prestataires',  label: '🏢 Prestataires' },
        { href: '/admin/services',      label: '🛎️ Services' },
        { href: '/admin/reservations',  label: '🗓️ Réservations' },
      ]
    },
    {
      title: 'Utilisateurs',
      items: [
        { href: '/admin/utilisateurs',  label: '👥 Utilisateurs' },
      ]
    }
  ];
</script>

<div class="admin-layout">
  <aside class="admin-sidebar">
    <div class="admin-logo">
      <span>🇧🇯</span>
      <span>Admin</span>
    </div>
    <nav class="admin-nav">
      {#each navGroups as group}
        <div class="nav-group">
          <span class="nav-group-title">{group.title}</span>
          {#each group.items as item}
            <a
              href={item.href}
              class="admin-nav-item"
              class:active={$page.url.pathname === item.href}
            >{item.label}</a>
          {/each}
        </div>
      {/each}
    </nav>
    <div class="admin-footer">
      <a href="/" class="btn btn-ghost btn-sm">← Retour au site</a>
    </div>
  </aside>

  <main class="admin-main">
    {@render children()}
  </main>
</div>

<style>
  .admin-layout { display: flex; min-height: 100vh; }
  .admin-sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--color-ocean-dark); color: white;
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
  }
  .admin-logo {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-6); font-family: var(--font-display);
    font-size: var(--text-xl); font-weight: 700;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .admin-nav { flex: 1; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); overflow-y: auto; }
  .nav-group { display: flex; flex-direction: column; gap: var(--space-1); margin-bottom: var(--space-2); }
  .nav-group-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); padding: var(--space-2) var(--space-4) var(--space-1); }
  .admin-nav-item {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    color: rgba(255,255,255,0.7); text-decoration: none;
    font-size: var(--text-sm); transition: var(--transition);
  }
  .admin-nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
  .admin-nav-item.active { background: var(--color-gold); color: white; }
  .admin-footer { padding: var(--space-4); border-top: 1px solid rgba(255,255,255,0.1); }
  .btn-ghost { color: rgba(255,255,255,0.7); }
  .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
  .admin-main { flex: 1; background: var(--color-ivory); padding: var(--space-8); overflow-y: auto; }
</style>
