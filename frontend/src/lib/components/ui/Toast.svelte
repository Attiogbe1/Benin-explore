<script>
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
</script>

<div class="toasts" role="region" aria-label="Notifications">
  {#each toastStore.toasts as toast (toast.id)}
    <div class="toast toast-{toast.type}" role="alert">
      <span class="toast-icon">
        {#if toast.type === 'success'}✅
        {:else if toast.type === 'error'}❌
        {:else if toast.type === 'warning'}⚠️
        {:else}ℹ️{/if}
      </span>
      <p>{toast.message}</p>
      <button class="toast-close" onclick={() => toastStore.remove(toast.id)}>✕</button>
    </div>
  {/each}
</div>

<style>
  .toasts {
    position: fixed; bottom: 1.5rem; left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex; flex-direction: column; gap: 0.5rem;
    pointer-events: none;
    width: min(90vw, 400px);
  }
  .toast {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: white; border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    pointer-events: all;
    animation: slideInUp 0.25s ease;
    border-left: 4px solid;
  }
  .toast p { flex: 1; font-size: 0.875rem; }
  .toast-success { border-color: var(--color-success); }
  .toast-error { border-color: var(--color-error); }
  .toast-warning { border-color: var(--color-warning); }
  .toast-info { border-color: var(--color-info); }
  .toast-close {
    background: none; border: none; cursor: pointer;
    font-size: 0.75rem; opacity: 0.5; padding: 2px;
  }
  .toast-close:hover { opacity: 1; }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
