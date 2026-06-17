<script>
  import { chatStore } from '$lib/stores/chat.store.svelte.js';
  import { onMount } from 'svelte';

  let buttonEl;

  onMount(async () => {
    const { animate } = await import('motion');
    animate(buttonEl,
      { scale: [0, 1.1, 1], opacity: [0, 1] },
      { duration: 0.5, easing: 'ease-out', delay: 1.2 }
    );
  });
</script>

<div class="chat-button-wrapper" bind:this={buttonEl}>
  {#if chatStore.hasNewMessage}
    <span class="new-dot" aria-hidden="true"></span>
  {/if}
  <button
    class="chat-fab"
    class:is-open={chatStore.isOpen}
    onclick={() => chatStore.toggle()}
    aria-label={chatStore.isOpen ? 'Fermer BeninGuide' : 'Ouvrir BeninGuide'}
  >
    {#if chatStore.isOpen}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    {:else}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <span class="fab-label">BeninGuide</span>
    {/if}
  </button>
</div>

<style>
  .chat-button-wrapper {
    position: fixed; bottom: 2rem; right: 2rem;
    z-index: 1000;
  }
  .chat-fab {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    background: var(--color-ocean); color: white;
    border: none; border-radius: 50px; cursor: pointer;
    box-shadow: 0 4px 20px rgba(13, 59, 92, 0.4);
    transition: var(--transition);
    font-family: var(--font-body); font-weight: 600; font-size: 0.875rem;
  }
  .chat-fab:hover {
    background: var(--color-ocean-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(13, 59, 92, 0.5);
  }
  .chat-fab.is-open {
    background: var(--color-earth-medium);
    border-radius: 50%; padding: 0.875rem;
  }
  .new-dot {
    position: absolute; top: -4px; right: -4px;
    width: 14px; height: 14px;
    background: var(--color-gold); border-radius: 50%;
    border: 2px solid var(--color-ivory);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }
  @media (max-width: 640px) {
    .chat-button-wrapper { bottom: 1.5rem; right: 1rem; }
    .fab-label { display: none; }
    .chat-fab { border-radius: 50%; padding: 1rem; }
  }
</style>
