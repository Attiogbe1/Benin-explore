<script>
  import { chatStore } from '$lib/stores/chat.store.svelte.js';
  import ChatMessage from './ChatMessage.svelte';
  import ChatTyping from './ChatTyping.svelte';
  import ChatQuickActions from './ChatQuickActions.svelte';

  let inputValue = $state('');
  let messagesContainer = $state();

  const quickActions = [
    { label: "🗺️ Sites incontournables", query: "Quels sont les sites incontournables au Bénin ?" },
    { label: "🏨 Hébergements", query: "Recommande-moi des hôtels au Bénin" },
    { label: "📅 Meilleure période", query: "Quelle est la meilleure période pour visiter le Bénin ?" },
    { label: "🛂 Visa requis ?", query: "Ai-je besoin d'un visa pour aller au Bénin ?" },
    { label: "🚨 Numéros d'urgence", query: "Quels sont les numéros d'urgence au Bénin ?" }
  ];

  function handleSubmit() {
    if (inputValue.trim()) {
      chatStore.sendMessage(inputValue.trim());
      inputValue = '';
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  $effect(() => {
    chatStore.messages;
    chatStore.isLoading;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
</script>

{#if chatStore.isOpen}
  <div class="chat-overlay" onclick={() => chatStore.close()} role="none"></div>

  <aside class="chat-panel" aria-label="Assistant BeninGuide">
    <header class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">🇧🇯</div>
        <div>
          <h3>BeninGuide</h3>
          <p class="chat-status"><span class="status-dot"></span>En ligne</p>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="icon-btn" onclick={() => chatStore.clearHistory()} title="Nouvelle conversation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"/>
          </svg>
        </button>
        <button class="icon-btn" onclick={() => chatStore.close()} title="Fermer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="chat-messages" bind:this={messagesContainer}>
      {#each chatStore.messages as message (message.id)}
        <ChatMessage {message} />
      {/each}
      {#if chatStore.isLoading && !chatStore.messages.some(m => m.isStreaming && m.content?.length > 0)}
        <ChatTyping />
      {/if}
      {#if chatStore.messages.length <= 1 && !chatStore.isLoading}
        <ChatQuickActions actions={quickActions} />
      {/if}
    </div>

    <footer class="chat-footer">
      <div class="chat-input-wrapper">
        <textarea
          bind:value={inputValue}
          onkeydown={handleKeydown}
          placeholder="Posez votre question sur le Bénin..."
          rows="1"
          class="chat-input"
          disabled={chatStore.isLoading}
        ></textarea>
        <button
          class="send-btn"
          onclick={handleSubmit}
          disabled={!inputValue.trim() || chatStore.isLoading}
          aria-label="Envoyer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <p class="powered-by">Propulsé par <strong>Claude AI</strong></p>
    </footer>
  </aside>
{/if}

<style>
  .chat-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.3); z-index: 998;
    display: none;
  }
  .chat-panel {
    position: fixed;
    bottom: 5.5rem; right: 2rem;
    width: 380px; height: 560px;
    background: var(--color-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    display: flex; flex-direction: column;
    z-index: 999; overflow: hidden;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .chat-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--color-ocean); color: white;
  }
  .chat-header-info { display: flex; align-items: center; gap: 0.75rem; }
  .chat-avatar {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.2); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .chat-header h3 {
    font-family: var(--font-display); font-size: 1.05rem;
    margin: 0; color: white;
  }
  .chat-status { display: flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; opacity: 0.85; margin: 0; }
  .status-dot { width: 7px; height: 7px; background: #4ADE80; border-radius: 50%; }
  .chat-header-actions { display: flex; gap: 0.4rem; }
  .icon-btn {
    background: rgba(255,255,255,0.15); border: none; color: white;
    cursor: pointer; padding: 0.4rem; border-radius: 6px;
    transition: var(--transition); display: flex;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.25); }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.75rem;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
  .chat-footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-ivory);
  }
  .chat-input-wrapper {
    display: flex; align-items: flex-end; gap: 0.5rem;
    background: white; border: 1.5px solid var(--color-border);
    border-radius: 12px; padding: 0.5rem 0.5rem 0.5rem 0.875rem;
    transition: var(--transition);
  }
  .chat-input-wrapper:focus-within { border-color: var(--color-ocean); }
  .chat-input {
    flex: 1; border: none; background: transparent;
    font-family: var(--font-body); font-size: 0.875rem;
    resize: none; outline: none; line-height: 1.5;
    max-height: 100px; overflow-y: auto;
  }
  .send-btn {
    background: var(--color-ocean); color: white;
    border: none; padding: 0.5rem; border-radius: 8px;
    cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; flex-shrink: 0;
  }
  .send-btn:hover:not(:disabled) { background: var(--color-ocean-light); }
  .send-btn:disabled { opacity: 0.4; cursor: default; }
  .powered-by {
    text-align: center; font-size: 0.68rem;
    color: var(--color-earth-light); margin-top: 0.4rem;
  }
  .powered-by strong { color: var(--color-ocean); }
  @media (max-width: 640px) {
    .chat-overlay { display: block; }
    .chat-panel {
      bottom: 0; right: 0; left: 0;
      width: 100%; border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      height: 75vh;
    }
  }
</style>
