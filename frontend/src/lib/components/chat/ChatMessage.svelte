<script>
  let { message } = $props();

  function renderMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
</script>

<div
  class="message"
  class:user={message.role === 'user'}
  class:assistant={message.role === 'assistant'}
  class:error={message.isError}
  class:streaming={message.isStreaming}
>
  {#if message.role === 'assistant'}
    <div class="avatar">🇧🇯</div>
  {/if}
  <div class="bubble">
    {#if message.content}
      <p>{@html renderMarkdown(message.content)}{#if message.isStreaming}<span class="cursor"></span>{/if}</p>
    {:else if message.isStreaming}
      <p><span class="cursor"></span></p>
    {/if}
    {#if !message.isStreaming}
      <time class="timestamp">
        {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </time>
    {/if}
  </div>
</div>

<style>
  .message {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    max-width: 100%;
  }
  .message.user { flex-direction: row-reverse; }
  .avatar {
    width: 28px; height: 28px; flex-shrink: 0;
    background: rgba(13,59,92,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }
  .bubble {
    max-width: 85%;
    padding: 0.6rem 0.875rem;
    border-radius: 12px;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  .assistant .bubble {
    background: var(--color-ivory-dark);
    color: var(--color-earth);
    border-bottom-left-radius: 4px;
  }
  .user .bubble {
    background: var(--color-ocean);
    color: white;
    border-bottom-right-radius: 4px;
  }
  .error .bubble { background: #FEE2E2; color: #DC2626; }
  .timestamp {
    display: block; font-size: 0.65rem;
    opacity: 0.5; margin-top: 0.3rem; text-align: right;
  }
  .user .timestamp { text-align: left; }

  /* Curseur clignotant pendant le streaming */
  .cursor {
    display: inline-block;
    width: 2px; height: 1em;
    background: var(--color-ocean);
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 0.7s step-end infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  .assistant.streaming .bubble {
    background: var(--color-ivory-dark);
  }
</style>
