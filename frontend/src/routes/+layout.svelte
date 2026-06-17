<script>
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import ChatButton from '$lib/components/chat/ChatButton.svelte';
  import ChatPanel from '$lib/components/chat/ChatPanel.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <meta name="description" content="BeninExplore — Découvrez le Bénin : Ganvié, Ouidah, Abomey, Pendjari. Réservez vos guides, hébergements et activités en ligne.">
  <meta property="og:site_name" content="BeninExplore">
  <meta property="og:type" content="website">
</svelte:head>

<Navbar />

<main id="main-content" style="min-height: 100vh; padding-top: var(--nav-h);">
  {@render children()}
</main>

<Footer />

<ChatButton />
<ChatPanel />
<Toast />
