<script>
  import { chatStore } from '$lib/stores/chat.store.svelte.js';
  let { actions = [] } = $props();
</script>

<div class="quick-actions">
  <p class="label">Questions fréquentes :</p>
  <div class="actions-list">
    {#each actions as action}
      <button
        class="quick-btn"
        onclick={() => chatStore.sendMessage(action.query)}
      >
        {action.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .quick-actions { padding: 0.5rem 0; }
  .label { font-size: 0.7rem; color: var(--color-earth-light); margin-bottom: 0.5rem; }
  .actions-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .quick-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    padding: 0.35rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    cursor: pointer;
    color: var(--color-earth-medium);
    transition: var(--transition);
    font-family: var(--font-body);
  }
  .quick-btn:hover {
    background: var(--color-ocean);
    color: white;
    border-color: var(--color-ocean);
  }
</style>
