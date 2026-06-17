<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">🇧🇯 Benin<strong>Explore</strong></div>
      <p>Découvrez la richesse culturelle, historique et naturelle du Bénin — la patrie du Vodoun et du Royaume de Danhomè.</p>
    </div>

    <nav class="footer-nav">
      <h4>Destinations</h4>
      <a href="/sites?categorie=historique">Sites historiques</a>
      <a href="/sites?categorie=naturel">Nature & Faune</a>
      <a href="/sites?categorie=plage">Plages</a>
      <a href="/map">Carte interactive</a>
    </nav>

    <nav class="footer-nav">
      <h4>Voyager</h4>
      <a href="/reservations">Réservations</a>
      <a href="/blog">Articles & Itinéraires</a>
      <a href="/urgence">Contacts d'urgence</a>
      <a href="/auth/register">Créer un compte</a>
    </nav>

    <div class="footer-emergency">
      <h4>🚨 Urgences Bénin</h4>
      <p><strong>Police</strong> : 117</p>
      <p><strong>SAMU</strong> : 161</p>
      <p><strong>Pompiers</strong> : 118</p>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>© {new Date().getFullYear()} BeninExplore. Fait avec ❤️ pour le Bénin.</p>
      <p>Chatbot propulsé par <strong>Claude AI</strong> (Anthropic)</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-earth);
    color: rgba(255,255,255,0.8);
    margin-top: auto;
  }
  .footer-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: var(--space-12);
    padding-block: var(--space-16);
  }
  .footer-logo {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: white;
    margin-bottom: var(--space-4);
  }
  .footer-logo strong { color: var(--color-gold); }
  .footer-brand p { font-size: var(--text-sm); line-height: 1.8; opacity: 0.75; }
  .footer-nav { display: flex; flex-direction: column; gap: var(--space-3); }
  .footer-nav h4 {
    font-family: var(--font-body);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-gold);
    margin-bottom: var(--space-2);
  }
  .footer-nav a {
    font-size: var(--text-sm);
    opacity: 0.75;
    transition: var(--transition);
    text-decoration: none;
    color: inherit;
  }
  .footer-nav a:hover { opacity: 1; color: var(--color-gold-light); }
  .footer-emergency h4 { color: var(--color-gold); margin-bottom: var(--space-3); font-size: var(--text-sm); }
  .footer-emergency p { font-size: var(--text-sm); margin-bottom: var(--space-1); }
  .footer-emergency strong { color: white; }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-block: var(--space-4);
  }
  .footer-bottom-inner {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: var(--space-2);
  }
  .footer-bottom p { font-size: var(--text-xs); opacity: 0.6; }
  .footer-bottom strong { color: var(--color-gold-light); }
  @media (max-width: 768px) {
    .footer-inner { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
    .footer-brand { grid-column: 1 / -1; }
    .footer-bottom-inner { justify-content: center; text-align: center; }
  }
  @media (max-width: 480px) {
    .footer-inner { grid-template-columns: 1fr; }
  }
</style>
