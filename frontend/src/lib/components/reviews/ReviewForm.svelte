<script>
  import StarRating from './StarRating.svelte';
  import { toastStore } from '$lib/stores/toast.store.svelte.js';
  import { authStore } from '$lib/stores/auth.store.svelte.js';
  import { api } from '$lib/api/client.js';

  // siteId OU reservationId (pour service)
  let { siteId = null, reservationId = null, serviceName = null, onSuccess } = $props();

  let note = $state(5);
  let commentaire = $state('');
  let isSubmitting = $state(false);

  const isServiceReview = $derived(!!reservationId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!commentaire.trim()) return toastStore.warning('Veuillez écrire un commentaire');
    if (note < 1) return toastStore.warning('Veuillez choisir une note');

    isSubmitting = true;
    try {
      if (isServiceReview) {
        await api.post('/service-reviews', { reservationId, note, commentaire });
      } else {
        await api.post('/reviews', { siteId, note, commentaire });
      }
      toastStore.success('Merci pour votre avis !');
      commentaire = '';
      note = 5;
      onSuccess?.();
    } catch (err) {
      toastStore.error(err.message || 'Erreur lors de la soumission');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="review-form-wrap">
  {#if serviceName}
    <p class="review-target">Votre avis sur <strong>{serviceName}</strong></p>
  {/if}

  <form class="review-form" onsubmit={handleSubmit}>
    <div class="star-section">
      <span class="star-label">Votre note</span>
      <div class="star-interactive">
        <StarRating {note} editable onChange={(n) => note = n} size="lg" />
        <span class="note-text">{note}/5 — {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][note]}</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Votre commentaire *</label>
      <textarea
        class="form-input"
        bind:value={commentaire}
        placeholder={isServiceReview
          ? 'Décrivez votre expérience : qualité du service, accueil, rapport qualité-prix...'
          : 'Partagez votre expérience : ambiance, accessibilité, conseils pour les autres visiteurs...'}
        rows="4"
        required
        maxlength="1000"
      ></textarea>
      <span class="char-count">{commentaire.length}/1000</span>
    </div>

    <button type="submit" class="btn btn-primary" disabled={isSubmitting || note < 1}>
      {isSubmitting ? 'Publication...' : 'Publier mon avis'}
    </button>
  </form>
</div>

<style>
  .review-form-wrap { background: var(--color-ivory-dark); border-radius: var(--radius-lg); padding: var(--space-6); }
  .review-target { font-size: var(--text-sm); color: var(--color-earth-medium); margin-bottom: var(--space-4); }
  .review-form { display: flex; flex-direction: column; gap: var(--space-5); }
  .star-section { display: flex; flex-direction: column; gap: var(--space-2); }
  .star-label { font-size: var(--text-sm); font-weight: 600; color: var(--color-earth); }
  .star-interactive { display: flex; align-items: center; gap: var(--space-4); }
  .note-text { font-size: var(--text-sm); color: var(--color-earth-medium); }
  .form-group { display: flex; flex-direction: column; gap: var(--space-2); position: relative; }
  .char-count { font-size: 11px; color: var(--color-earth-light); text-align: right; }
</style>
