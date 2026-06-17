<script>
  let { note = 0, max = 5, size = 'md', editable = false, onChange } = $props();
  let hovered = $state(0);

  const sizes = { sm: '1rem', md: '1.4rem', lg: '1.8rem' };
</script>

<div class="stars" style="--sz:{sizes[size] ?? sizes.md}" class:editable>
  {#each Array(max) as _, i}
    {@const filled = (editable ? (hovered || note) : note) > i}
    <span
      class="star"
      class:filled
      role={editable ? 'button' : 'img'}
      aria-label={editable ? `Note ${i + 1}` : undefined}
      tabindex={editable ? 0 : undefined}
      onmouseenter={() => { if (editable) hovered = i + 1; }}
      onmouseleave={() => { if (editable) hovered = 0; }}
      onclick={() => { if (editable) onChange?.(i + 1); }}
      onkeydown={(e) => { if (editable && (e.key === 'Enter' || e.key === ' ')) onChange?.(i + 1); }}
    >★</span>
  {/each}
</div>

<style>
  .stars { display: inline-flex; gap: 1px; }
  .star { font-size: var(--sz); color: var(--color-border); line-height: 1; }
  .star.filled { color: #f59e0b; }
  .editable .star { cursor: pointer; transition: color 0.1s, transform 0.1s; }
  .editable .star:hover { transform: scale(1.15); }
</style>
