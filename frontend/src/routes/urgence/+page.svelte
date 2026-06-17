<script>
  import { onMount } from 'svelte';

  let alertes         = $state([]);
  let sharingLocation = $state(false);
  let locationShared  = $state(false);
  let locationUrl     = $state('');

  const urgences = [
    { nom: 'Police Nationale',          numero: '117',                icon: '🚔', color: '#1d4ed8' },
    { nom: 'SAMU / Urgences médicales', numero: '15',                 icon: '🏥', color: '#dc2626' },
    { nom: 'Pompiers',                  numero: '118',                icon: '🚒', color: '#ea580c' },
    { nom: 'Gendarmerie',               numero: '197',                icon: '👮', color: '#16a34a' },
    { nom: 'Ambassade de France',       numero: '+229 21 30 02 25',   icon: '🇫🇷', color: '#1d4ed8' },
    { nom: 'Urgences européennes',      numero: '+229 21 31 45 67',   icon: '🌐', color: '#7c3aed' },
  ];

  const hopitaux = [
    { nom: 'CNHU-HKM Cotonou',     ville: 'Cotonou', tel: '+229 21 30 01 55' },
    { nom: 'Hôpital Saint Luc',    ville: 'Cotonou', tel: '+229 21 31 45 67' },
    { nom: 'HZ Abomey-Calavi',     ville: 'Abomey-Calavi', tel: '+229 21 36 00 55' },
    { nom: 'Clinique Louis Pasteur', ville: 'Cotonou', tel: '+229 21 31 22 33' },
  ];

  const conseils = [
    { icon: '💊', title: 'Santé',         desc: 'Vaccin fièvre jaune obligatoire. Antipaludéens recommandés. Consultez un médecin avant le départ.',          color: '#16a34a' },
    { icon: '💧', title: 'Eau potable',   desc: 'Buvez uniquement de l\'eau en bouteille ou purifiée. Évitez les glaçons dans les établissements peu sûrs.',   color: '#2563eb' },
    { icon: '🌡️', title: 'Chaleur',       desc: 'Températures 30–35 °C. Restez hydraté, portez une protection solaire et des vêtements légers.',               color: '#ea580c' },
    { icon: '🦟', title: 'Paludisme',     desc: 'Utilisez un répulsif anti-moustiques et une moustiquaire traitée, surtout la nuit.',                          color: '#9333ea' },
    { icon: '🛂', title: 'Visa e-Bénin', desc: 'Visa disponible en ligne avant le départ. Passeport valide 6 mois + photo + assurance obligatoire.',           color: '#0891b2' },
    { icon: '💰', title: 'Monnaie',       desc: 'Franc CFA (XOF). 1 € ≈ 655 XOF. Distributeurs à Cotonou. Carte Visa acceptée dans les grands hôtels.',      color: '#d97706' },
  ];

  onMount(async () => {
    try {
      const res = await fetch('/api/emergency/alertes');
      if (res.ok) { const d = await res.json(); alertes = Array.isArray(d) ? d : []; }
    } catch {}
  });

  async function shareLocation() {
    if (!navigator.geolocation) return;
    sharingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationUrl = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        navigator.clipboard?.writeText(locationUrl).catch(() => {});
        sharingLocation = false;
        locationShared = true;
        setTimeout(() => locationShared = false, 8000);
      },
      () => { sharingLocation = false; }
    );
  }

  function revealOnScroll(node, delay = 0) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { node.style.opacity = '1'; node.style.transform = 'none'; io.disconnect(); }
    }, { threshold: 0.06 });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<svelte:head><title>Urgences & Sécurité — BeninExplore</title></svelte:head>

<!-- ── Hero ─────────────────────────────────────── -->
<section class="urgence-hero">
  <div class="hero-overlay"></div>
  <div class="container hero-inner">
    <div class="hero-text ha-1">
      <div class="hero-badge">🚨 Sécurité & Urgences</div>
      <h1>Besoin d'aide au Bénin ?</h1>
      <p>Numéros d'urgence, hôpitaux et conseils de sécurité pour voyageurs. Disponibles même hors-ligne.</p>
    </div>

    <div class="sos-block ha-2">
      <a href="tel:117" class="sos-btn" aria-label="Appeler la police — 117">
        <div class="sos-ring sos-ring--1"></div>
        <div class="sos-ring sos-ring--2"></div>
        <div class="sos-center">
          <span>🚨</span>
          <strong>SOS</strong>
          <small>Police — 117</small>
        </div>
      </a>

      <button
        class="loc-btn"
        onclick={shareLocation}
        disabled={sharingLocation}
        aria-label="Partager ma position GPS"
      >
        {#if locationShared}
          ✅ Position copiée dans le presse-papiers
        {:else if sharingLocation}
          ⏳ Localisation en cours…
        {:else}
          📍 Partager ma position GPS
        {/if}
      </button>

      {#if locationShared}
        <p class="loc-tip">Partagez ce lien avec vos contacts ou les secours.</p>
      {/if}
    </div>
  </div>
</section>

<!-- ── Alertes en cours ──────────────────────────── -->
{#if alertes.length > 0}
  <div class="alerts-bar">
    <div class="container alerts-inner">
      {#each alertes as a}
        <div class="alert-item alert-{a.severite}">
          {a.severite === 'danger' ? '🔴' : a.severite === 'warning' ? '🟡' : '🔵'}
          {a.messageFr}
        </div>
      {/each}
    </div>
  </div>
{/if}

<!-- ── Numéros d'urgence ─────────────────────────── -->
<section class="section section-sm">
  <div class="container">
    <div class="section-hd" use:revealOnScroll>
      <h2>Numéros d'urgence</h2>
      <p>Cliquez sur un numéro pour appeler directement</p>
    </div>
    <div class="urgences-grid">
      {#each urgences as u, i}
        <div class="uc-card" use:revealOnScroll={i * 60} style="--uc:{u.color}">
          <div class="uc-icon">{u.icon}</div>
          <div class="uc-body">
            <span class="uc-nom">{u.nom}</span>
            <a href="tel:{u.numero.replace(/\s/g,'')}" class="uc-num">{u.numero}</a>
          </div>
          <a href="tel:{u.numero.replace(/\s/g,'')}" class="uc-call" aria-label="Appeler {u.nom}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Hôpitaux ──────────────────────────────────── -->
<section class="section section-sm" style="background: var(--color-ivory-dark)">
  <div class="container">
    <div class="section-hd" use:revealOnScroll>
      <h2>🏥 Hôpitaux principaux</h2>
      <p>Établissements de santé recommandés pour les voyageurs</p>
    </div>
    <div class="hop-grid">
      {#each hopitaux as h, i}
        <div class="hop-card card" use:revealOnScroll={i * 70}>
          <div class="hop-icon">🏥</div>
          <h3>{h.nom}</h3>
          <p class="hop-ville">📍 {h.ville}</p>
          <a href="tel:{h.tel}" class="hop-tel">{h.tel}</a>
          <a href="tel:{h.tel}" class="btn btn-outline hop-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            Appeler
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Conseils essentiels ───────────────────────── -->
<section class="section">
  <div class="container">
    <div class="section-hd" use:revealOnScroll>
      <h2>Conseils essentiels</h2>
      <p>Préparez votre séjour sereinement</p>
    </div>
    <div class="conseils-grid">
      {#each conseils as c, i}
        <div class="conseil-card" use:revealOnScroll={i * 70} style="--cc:{c.color}">
          <div class="conseil-icon">{c.icon}</div>
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* ── Hero ─────────────────── */
  .urgence-hero {
    min-height: 52vh;
    background:
      url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/1280px-Porte_du_non_retour_-_Ouidah.jpg')
      center / cover no-repeat;
    position: relative; display: flex; align-items: center;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(127,0,0,0.90) 0%, rgba(8,37,53,0.86) 100%);
  }
  .hero-inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--space-12); padding-block: var(--space-16); flex-wrap: wrap; color: white;
  }
  .hero-badge {
    display: inline-flex; gap: var(--space-2);
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
    font-size: var(--text-sm); margin-bottom: var(--space-4); width: fit-content;
  }
  .hero-text h1 { color: white; font-size: clamp(2rem,5vw,3.8rem); margin-bottom: var(--space-4); }
  .hero-text p  { opacity: 0.85; max-width: 440px; font-size: var(--text-lg); line-height: 1.7; }

  /* SOS block */
  .sos-block { display: flex; flex-direction: column; align-items: center; gap: var(--space-5); flex-shrink: 0; }

  .sos-btn {
    position: relative;
    width: 150px; height: 150px; border-radius: 50%;
    background: #DC2626; color: white;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    animation: sosPulse 2.2s ease-in-out infinite;
    transition: transform 0.2s ease;
  }
  .sos-btn:hover { transform: scale(1.06); }
  .sos-center { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .sos-center span  { font-size: 1.8rem; }
  .sos-center strong { font-size: 1.6rem; font-weight: 800; letter-spacing: 0.04em; }
  .sos-center small  { font-size: var(--text-xs); opacity: 0.85; }

  .sos-ring {
    position: absolute; border-radius: 50%; background: rgba(220,38,38,0.22);
    animation: sosRing 2.2s ease-in-out infinite;
  }
  .sos-ring--1 { inset: -14px; animation-delay: 0s; }
  .sos-ring--2 { inset: -28px; animation-delay: 0.5s; background: rgba(220,38,38,0.10); }

  @keyframes sosPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.55); }
    50%      { box-shadow: 0 0 0 22px rgba(220,38,38,0); }
  }
  @keyframes sosRing {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  .loc-btn {
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.45); color: white;
    font-size: var(--text-sm); font-weight: 600;
    padding: var(--space-3) var(--space-6); border-radius: var(--radius-full);
    cursor: pointer; transition: var(--transition); white-space: nowrap;
  }
  .loc-btn:hover:not(:disabled) { background: rgba(255,255,255,0.25); }
  .loc-btn:disabled { opacity: 0.6; cursor: default; }
  .loc-tip { font-size: var(--text-xs); opacity: 0.7; text-align: center; max-width: 200px; }

  /* Alertes bar */
  .alerts-bar { background: #FEF3C7; border-top: 3px solid #F59E0B; border-bottom: 1px solid #FDE68A; }
  .alerts-inner { padding-block: var(--space-4); display: flex; flex-direction: column; gap: var(--space-1); }
  .alert-item { font-size: var(--text-sm); font-weight: 500; color: #92400E; }

  /* Section header */
  .section-hd { text-align: center; margin-bottom: var(--space-12); }
  .section-hd p { color: var(--color-earth-medium); margin-top: var(--space-2); }

  /* Urgences grid */
  .urgences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }
  .uc-card {
    display: flex; align-items: center; gap: var(--space-4);
    background: white; border-radius: var(--radius-lg); padding: var(--space-5);
    box-shadow: var(--shadow-sm); border-top: 4px solid var(--uc);
    transition: var(--transition);
  }
  .uc-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .uc-icon { font-size: 2.4rem; flex-shrink: 0; }
  .uc-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .uc-nom  { font-size: var(--text-xs); color: var(--color-earth-medium); font-weight: 500; }
  .uc-num  {
    font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700;
    color: var(--uc); text-decoration: none; transition: opacity 0.2s;
  }
  .uc-num:hover { opacity: 0.75; }
  .uc-call {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--uc); color: white;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; text-decoration: none; transition: var(--transition);
  }
  .uc-call:hover { transform: scale(1.1); }

  /* Hôpitaux */
  .hop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-5);
  }
  .hop-card { padding: var(--space-6); text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
  .hop-icon { font-size: 2.8rem; }
  .hop-card h3 { font-size: var(--text-xl); }
  .hop-ville { font-size: var(--text-sm); color: var(--color-earth-medium); }
  .hop-tel   { font-size: var(--text-sm); font-weight: 600; color: var(--color-ocean); text-decoration: none; }
  .hop-btn   { margin-top: var(--space-2); width: 100%; justify-content: center; }

  /* Conseils */
  .conseils-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
  }
  .conseil-card {
    background: white; border-radius: var(--radius-lg); padding: var(--space-6);
    border-left: 4px solid var(--cc); box-shadow: var(--shadow-sm);
    transition: var(--transition);
  }
  .conseil-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .conseil-icon { font-size: 2.4rem; display: block; margin-bottom: var(--space-3); }
  .conseil-card h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); color: var(--cc); }
  .conseil-card p  { font-size: var(--text-sm); color: var(--color-earth-medium); line-height: 1.65; }

  /* Hero entrance */
  .ha-1 { animation: fadeUp 0.7s ease 0.1s both; }
  .ha-2 { animation: fadeUp 0.7s ease 0.3s both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-inner { flex-direction: column; align-items: center; text-align: center; padding-block: var(--space-12); }
    .hero-text p { margin: 0 auto; }
    .urgences-grid { grid-template-columns: 1fr; }
    .conseils-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .conseils-grid { grid-template-columns: 1fr; }
    .hop-grid { grid-template-columns: 1fr; }
  }
</style>
