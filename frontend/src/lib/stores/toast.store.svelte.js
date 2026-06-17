// Store notifications toast — Svelte 5 runes
import { v4 as uuidv4 } from 'uuid';

export const toastStore = (() => {
  let toasts = $state([]);

  function add(message, type = 'info', duration = 4000) {
    const id = uuidv4();
    toasts = [...toasts, { id, message, type }];
    if (duration > 0) setTimeout(() => remove(id), duration);
    return id;
  }

  function remove(id) {
    toasts = toasts.filter(t => t.id !== id);
  }

  return {
    get toasts() { return toasts; },
    success: (msg, d) => add(msg, 'success', d),
    error: (msg, d) => add(msg, 'error', d || 6000),
    info: (msg, d) => add(msg, 'info', d),
    warning: (msg, d) => add(msg, 'warning', d),
    remove
  };
})();
