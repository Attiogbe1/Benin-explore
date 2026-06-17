<div class="typing">
  <div class="avatar">🇧🇯</div>
  <div class="bubble">
    <span></span><span></span><span></span>
  </div>
</div>

<style>
  .typing {
    display: flex; align-items: flex-end; gap: 0.5rem;
  }
  .avatar {
    width: 28px; height: 28px;
    background: rgba(13,59,92,0.1); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }
  .bubble {
    background: var(--color-ivory-dark);
    padding: 0.75rem 1rem;
    border-radius: 12px 12px 12px 4px;
    display: flex; gap: 4px; align-items: center;
  }
  .bubble span {
    width: 6px; height: 6px;
    background: var(--color-earth-light);
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }
  .bubble span:nth-child(2) { animation-delay: 0.2s; }
  .bubble span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }
</style>
