import { j as head, l as ensure_array_like, o as escape_html, m as attr, k as attr_class, ax as attr_style, q as stringify } from './index-UZecICzA.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let categories = [];
    let featuredServices = [];
    const serviceTypeLabels = {
      HEBERGEMENT: "🏨 Hébergement",
      TRANSPORT: "🚗 Transport",
      GUIDE: "🧭 Guide",
      ACTIVITE: "🎯 Activité",
      RESTAURANT: "🍽️ Restaurant"
    };
    const serviceTypeColors = {
      HEBERGEMENT: "#0D3B5C",
      RESTAURANT: "#C4622D",
      GUIDE: "#2d7a4f",
      TRANSPORT: "#7c3aed",
      ACTIVITE: "#E8982A"
    };
    function formatPrixLocal(prix) {
      return new Intl.NumberFormat("fr-FR").format(prix) + " XOF";
    }
    const heroStats = [
      { value: "20+", label: "Sites touristiques" },
      { value: "6", label: "Régions" },
      { value: "2000+", label: "Touristes/an" },
      { value: "1", label: "Patrimoine UNESCO" }
    ];
    const catImages = {
      historique: "https://images.trvl-media.com/place/3000001219/29bec893-aed8-479e-ae0a-2564398ec47d.jpg",
      naturel: "https://images.partir.com/3WyrelRrnOeUbsSJ4smYz6zsETY=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-chutes-kota-tanougou.jpg",
      culturel: "https://images.trvl-media.com/place/3000449170/d8cbe128-8da7-400c-9e99-cebe305ae2c0.jpg",
      plage: "https://images.partir.com/g0Hk8nXsvpa9v0dzyFYy4p8ucOs=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-plages-gran-popo.jpg",
      religieux: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/800px-Porte_du_non_retour_-_Ouidah.jpg",
      gastronomique: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/800px-Ganvie_stilt_village%2C_Benin.jpg"
    };
    const iconEmojis = {
      landmark: "🏛️",
      trees: "🌳",
      palette: "🎨",
      waves: "🏖️",
      star: "⭐",
      utensils: "🍽️"
    };
    const heroDests = [
      {
        img: "https://images.trvl-media.com/place/3000449170/d8cbe128-8da7-400c-9e99-cebe305ae2c0.jpg",
        name: "Ganvié",
        sub: "Cité lacustre",
        href: "/sites/ganvie-cite-lacustre"
      },
      {
        img: "https://images.trvl-media.com/place/3000001219/29bec893-aed8-479e-ae0a-2564398ec47d.jpg",
        name: "Porte du Non-Retour",
        sub: "Ouidah — Mémorial UNESCO",
        href: "/sites/ouidah-route-esclaves"
      },
      {
        img: "https://images.partir.com/g0Hk8nXsvpa9v0dzyFYy4p8ucOs=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-plages-gran-popo.jpg",
        name: "Grand-Popo",
        sub: "Plages & détente",
        href: "/sites/plages-grand-popo"
      }
    ];
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>BeninExplore — Découvrez le Bénin</title>`);
      });
    });
    $$renderer2.push(`<section class="hero svelte-1uha8ag"><div class="hero-overlay svelte-1uha8ag" aria-hidden="true"></div> <div class="hero-pattern svelte-1uha8ag" aria-hidden="true"></div> <div class="container hero-wrapper svelte-1uha8ag"><div class="hero-content svelte-1uha8ag"><div class="hero-badge ha-1 svelte-1uha8ag"><span class="svelte-1uha8ag">🇧🇯</span> Plateforme officielle tourisme Bénin</div> <h1 class="hero-title ha-2 svelte-1uha8ag">Découvrez la Magie<br class="svelte-1uha8ag"/><em class="svelte-1uha8ag">du Bénin</em></h1> <p class="hero-subtitle ha-3 svelte-1uha8ag">Des palais d'Abomey aux eaux de Ganvié, explorez 20+ destinations
        exceptionnelles. Réservez vos guides et hébergements, planifiez avec
        notre chatbot IA.</p> <div class="hero-actions ha-4 svelte-1uha8ag"><a href="/sites" class="btn btn-gold hero-btn svelte-1uha8ag"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-1uha8ag"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" class="svelte-1uha8ag"></path></svg> Explorer les destinations</a> <a href="/map" class="btn hero-btn-outline svelte-1uha8ag"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1uha8ag"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" class="svelte-1uha8ag"></path></svg> Carte interactive</a></div> <div class="hero-stats ha-5 svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(heroStats);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$renderer2.push(`<div class="stat svelte-1uha8ag"><span class="stat-value svelte-1uha8ag">${escape_html(stat.value)}</span> <span class="stat-label svelte-1uha8ag">${escape_html(stat.label)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="hero-visual ha-l svelte-1uha8ag" aria-hidden="true"><div class="dest-stack svelte-1uha8ag"><!--[-->`);
    const each_array_1 = ensure_array_like(heroDests);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let d = each_array_1[i];
      $$renderer2.push(`<a${attr("href", d.href)}${attr_class("dest-card svelte-1uha8ag", void 0, { "dest-card--offset": i === 1 })}${attr_style(`animation-delay: ${stringify(i * 0.5)}s`)}><div class="dest-thumb svelte-1uha8ag"><img${attr("src", d.img)}${attr("alt", d.name)} loading="lazy" referrerpolicy="no-referrer" class="svelte-1uha8ag"/></div> <div class="dest-info svelte-1uha8ag"><strong class="svelte-1uha8ag">${escape_html(d.name)}</strong> <span class="svelte-1uha8ag">${escape_html(d.sub)}</span></div> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dest-arr svelte-1uha8ag"><path d="M5 12h14M12 5l7 7-7 7" class="svelte-1uha8ag"></path></svg></a>`);
    }
    $$renderer2.push(`<!--]--> <div class="dest-badge animate-float-d svelte-1uha8ag"><span class="svelte-1uha8ag">📍</span> 20+ destinations</div></div></div></div></section> <section class="section section-sm svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header svelte-1uha8ag"><h2 class="svelte-1uha8ag">Explorer par catégorie</h2> <p class="svelte-1uha8ag">Des sites historiques aux plages sauvages</p></div> <div class="categories-grid svelte-1uha8ag"><!--[-->`);
    const each_array_2 = ensure_array_like(categories);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let cat = each_array_2[i];
      $$renderer2.push(`<a${attr("href", `/sites?categorie=${stringify(cat.slug)}`)} class="cat-card svelte-1uha8ag"${attr_style(`--cat-color: ${stringify(cat.couleur)}`)}><div class="cat-img-wrap svelte-1uha8ag"><img${attr("src", catImages[cat.slug])} alt="" aria-hidden="true" referrerpolicy="no-referrer" class="svelte-1uha8ag"/> <div class="cat-color-tint svelte-1uha8ag"${attr_style(`background:${stringify(cat.couleur)}`)}></div></div> <div class="cat-icon-wrap svelte-1uha8ag"${attr_style(`background:${stringify(cat.couleur)}22; color:${stringify(cat.couleur)}`)}>${escape_html(iconEmojis[cat.icone] || "🏛️")}</div> <span class="cat-name svelte-1uha8ag">${escape_html(cat.nomFr)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="section svelte-1uha8ag" style="background: var(--color-ivory-dark)"><div class="container svelte-1uha8ag"><div class="section-header svelte-1uha8ag"><h2 class="svelte-1uha8ag">Sites incontournables</h2> <p class="svelte-1uha8ag">Les destinations les plus appréciées par nos visiteurs</p> <a href="/sites" class="btn btn-outline svelte-1uha8ag">Voir tout →</a></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sites-grid svelte-1uha8ag"><!--[-->`);
      const each_array_3 = ensure_array_like(Array(6));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        each_array_3[$$index_3];
        $$renderer2.push(`<div class="skeleton svelte-1uha8ag" style="height:380px; border-radius:var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="section chatbot-cta svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="cta-card svelte-1uha8ag"><div class="cta-icon animate-float svelte-1uha8ag">🤖</div> <div class="cta-content svelte-1uha8ag"><h2 class="svelte-1uha8ag">Votre guide IA personnel</h2> <p class="svelte-1uha8ag">BeninGuide connaît le Bénin sur le bout des doigts. Posez-lui vos questions sur les visas,
          la météo, les traditions, les itinéraires personnalisés et bien plus.</p> <p class="cta-powered svelte-1uha8ag">Propulsé par <strong class="svelte-1uha8ag">Claude AI</strong> (Anthropic)</p></div> <div class="cta-actions svelte-1uha8ag"><button class="btn btn-gold svelte-1uha8ag">Discuter avec BeninGuide</button> <a href="/urgence" class="btn btn-outline svelte-1uha8ag">Contacts d'urgence</a></div></div></div></section> <section class="section services-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header svelte-1uha8ag"><h2 class="svelte-1uha8ag">Services touristiques</h2> <p class="svelte-1uha8ag">Hébergements, guides locaux, restaurants et activités — réservez directement auprès de prestataires vérifiés</p> <a href="/prestataires" class="btn btn-outline svelte-1uha8ag">Voir tous les prestataires →</a></div> `);
    if (featuredServices.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="services-grid svelte-1uha8ag"><!--[-->`);
      const each_array_5 = ensure_array_like(featuredServices);
      for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
        let svc = each_array_5[i];
        $$renderer2.push(`<a${attr("href", `/prestataires/${stringify(svc.provider?.id ?? "")}`)} class="svc-card card svelte-1uha8ag"><div class="svc-img-wrap svelte-1uha8ag">`);
        if (svc.images?.[0]) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", svc.images[0])}${attr("alt", svc.nomFr)} class="svc-img svelte-1uha8ag" referrerpolicy="no-referrer"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="svc-img-fallback svelte-1uha8ag"${attr_style(`background:${stringify(serviceTypeColors[svc.type])}22`)}><span style="font-size:2.5rem" class="svelte-1uha8ag">${escape_html(serviceTypeLabels[svc.type]?.[0] ?? "🛎️")}</span></div>`);
        }
        $$renderer2.push(`<!--]--> <span class="svc-type-badge svelte-1uha8ag"${attr_style(`background:${stringify(serviceTypeColors[svc.type])}`)}>${escape_html(serviceTypeLabels[svc.type] ?? svc.type)}</span> `);
        if (svc.videoUrl) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="svc-video-badge svelte-1uha8ag">📹 Vidéo</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="svc-body svelte-1uha8ag"><p class="svc-provider svelte-1uha8ag">🏢 ${escape_html(svc.provider?.nomEntreprise ?? "—")}</p> <h3 class="svelte-1uha8ag">${escape_html(svc.nomFr)}</h3> <p class="svc-desc svelte-1uha8ag">${escape_html(svc.descriptionFr?.slice(0, 75))}…</p> <div class="svc-footer svelte-1uha8ag"><span class="svc-prix svelte-1uha8ag">${escape_html(formatPrixLocal(svc.prix))}</span> <span class="svc-cta svelte-1uha8ag">Voir →</span></div></div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section> <section class="section provider-banner-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="provider-banner svelte-1uha8ag"><div class="pb-deco svelte-1uha8ag"><span class="pb-emoji svelte-1uha8ag">🏢</span> <span class="pb-emoji pb-emoji--2 svelte-1uha8ag">📹</span> <span class="pb-emoji pb-emoji--3 svelte-1uha8ag">📬</span></div> <div class="pb-content svelte-1uha8ag"><span class="pb-badge svelte-1uha8ag">Pour les professionnels du tourisme</span> <h2 class="svelte-1uha8ag">Vous proposez des services touristiques ?</h2> <p class="svelte-1uha8ag">Rejoignez BeninExplore et touchez des milliers de voyageurs. Présentez votre hébergement ou restaurant en vidéo, recevez des réservations en temps réel et gérez tout depuis votre espace personnel.</p> <div class="pb-features svelte-1uha8ag"><span class="svelte-1uha8ag">✅ Inscription gratuite</span> <span class="svelte-1uha8ag">📹 Présentation vidéo YouTube / Vimeo</span> <span class="svelte-1uha8ag">📬 Notifications instantanées</span> <span class="svelte-1uha8ag">📊 Tableau de bord complet</span></div></div> <div class="pb-actions svelte-1uha8ag"><a href="/devenir-prestataire" class="btn btn-gold pb-btn svelte-1uha8ag">Devenir prestataire →</a> <a href="/prestataires" class="btn pb-btn-outline svelte-1uha8ag">Voir les prestataires</a></div></div></div></section> <section class="section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header svelte-1uha8ag"><h2 class="svelte-1uha8ag">Pourquoi BeninExplore ?</h2></div> <div class="features-grid svelte-1uha8ag"><!--[-->`);
    const each_array_7 = ensure_array_like([
      {
        icon: "🗺️",
        title: "Carte interactive",
        desc: "Explorez tous les sites sur une carte OpenStreetMap avec filtres et détails."
      },
      {
        icon: "🤖",
        title: "Chatbot IA",
        desc: "BeninGuide répond à vos questions 24h/24 en 4 langues grâce à Claude AI."
      },
      {
        icon: "🏨",
        title: "Réservations",
        desc: "Réservez guides, hôtels, transports directement sur la plateforme."
      },
      {
        icon: "📱",
        title: "Hors-ligne",
        desc: "Accédez aux informations essentielles même sans connexion."
      }
    ]);
    for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
      let feature = each_array_7[i];
      $$renderer2.push(`<div class="feature-card svelte-1uha8ag"><span class="feature-icon svelte-1uha8ag">${escape_html(feature.icon)}</span> <h3 class="svelte-1uha8ag">${escape_html(feature.title)}</h3> <p class="svelte-1uha8ag">${escape_html(feature.desc)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="section infos-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header svelte-1uha8ag"><h2 class="svelte-1uha8ag">Informations pratiques</h2> <p class="svelte-1uha8ag">Tout ce qu'il faut savoir avant de partir au Bénin</p></div> <div class="infos-grid svelte-1uha8ag"><!--[-->`);
    const each_array_8 = ensure_array_like([
      {
        icon: "🛂",
        titre: "Visa e-Bénin",
        desc: "Obtenez votre visa en ligne en 48 h. Démarches 100 % numériques avant le départ.",
        lien: "/urgence",
        cta: "Infos visa"
      },
      {
        icon: "💊",
        titre: "Santé",
        desc: "Vaccin fièvre jaune obligatoire. Antipaludéens et assurance santé recommandés.",
        lien: "/urgence",
        cta: "Conseils santé"
      },
      {
        icon: "💰",
        titre: "Monnaie",
        desc: "Franc CFA (XOF). 1 € ≈ 655 XOF. Distributeurs à Cotonou, carte Visa acceptée.",
        lien: null,
        cta: null
      },
      {
        icon: "🌡️",
        titre: "Météo",
        desc: "Meilleure saison : novembre–mars (saison sèche). Évitez juillet–août (grandes pluies).",
        lien: null,
        cta: null
      },
      {
        icon: "🌐",
        titre: "Langues",
        desc: "Français (officiel), Fon, Yoruba. Guides anglophones disponibles via BeninExplore.",
        lien: null,
        cta: null
      },
      {
        icon: "✈️",
        titre: "Transport",
        desc: "Aéroport de Cotonou (COO). Taxis-motos (zemijans) et VTC pour les déplacements locaux.",
        lien: null,
        cta: null
      }
    ]);
    for (let i = 0, $$length = each_array_8.length; i < $$length; i++) {
      let info = each_array_8[i];
      $$renderer2.push(`<div class="info-card svelte-1uha8ag"><div class="info-icon svelte-1uha8ag">${escape_html(info.icon)}</div> <h3 class="svelte-1uha8ag">${escape_html(info.titre)}</h3> <p class="svelte-1uha8ag">${escape_html(info.desc)}</p> `);
      if (info.lien) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", info.lien)} class="info-link svelte-1uha8ag">${escape_html(info.cta)} →</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="section gamif-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="gamif-wrapper svelte-1uha8ag"><div class="gamif-text svelte-1uha8ag"><div class="gamif-label svelte-1uha8ag">🏆 Explorez &amp; Gagnez</div> <h2 class="svelte-1uha8ag">Devenez un Explorateur du Bénin</h2> <p class="svelte-1uha8ag">Visitez des sites, laissez des avis et réservez des services pour gagner des points et débloquer des badges exclusifs.</p> <div class="badges-row svelte-1uha8ag"><!--[-->`);
    const each_array_9 = ensure_array_like([
      { icon: "🌟", name: "Premier voyage" },
      { icon: "📸", name: "Photographe" },
      { icon: "🗺️", name: "Explorateur" },
      { icon: "👑", name: "Ambassadeur" }
    ]);
    for (let i = 0, $$length = each_array_9.length; i < $$length; i++) {
      let b = each_array_9[i];
      $$renderer2.push(`<div class="badge-chip svelte-1uha8ag"${attr_style(`animation-delay:${stringify(i * 0.12)}s`)}><span class="badge-emoji svelte-1uha8ag">${escape_html(b.icon)}</span> <span class="badge-name svelte-1uha8ag">${escape_html(b.name)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div> <a href="/auth/register" class="btn btn-gold gamif-cta svelte-1uha8ag">Commencer l'aventure →</a></div> <div class="gamif-card svelte-1uha8ag" aria-hidden="true"><div class="gc-top svelte-1uha8ag"><span class="gc-title svelte-1uha8ag">🏅 Explorateur Bronze</span> <span class="gc-pts svelte-1uha8ag">1 250 pts</span></div> <div class="gc-bar svelte-1uha8ag"><div class="gc-fill svelte-1uha8ag" style="width:62%"></div></div> <p class="gc-sub svelte-1uha8ag">62% vers le niveau Argent — encore 750 pts</p> <div class="gc-leaderboard svelte-1uha8ag"><!--[-->`);
    const each_array_10 = ensure_array_like([
      { pos: "🥇", name: "Kofi A.", pts: "4 820 pts", you: false },
      { pos: "🥈", name: "Ama D.", pts: "3 310 pts", you: false },
      { pos: "🥉", name: "Vous", pts: "1 250 pts", you: true }
    ]);
    for (let $$index_10 = 0, $$length = each_array_10.length; $$index_10 < $$length; $$index_10++) {
      let r = each_array_10[$$index_10];
      $$renderer2.push(`<div${attr_class("gc-rank svelte-1uha8ag", void 0, { "gc-you": r.you })}><span class="svelte-1uha8ag">${escape_html(r.pos)} ${escape_html(r.name)}</span> <span class="svelte-1uha8ag">${escape_html(r.pts)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="gc-badges svelte-1uha8ag"><!--[-->`);
    const each_array_11 = ensure_array_like(["🌟", "📸", "🗺️"]);
    for (let $$index_11 = 0, $$length = each_array_11.length; $$index_11 < $$length; $$index_11++) {
      let b = each_array_11[$$index_11];
      $$renderer2.push(`<span class="gc-badge-mini svelte-1uha8ag">${escape_html(b)}</span>`);
    }
    $$renderer2.push(`<!--]--> <span class="gc-badge-lock svelte-1uha8ag">🔒</span></div></div></div></div></section>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BKrnVoBY.js.map
