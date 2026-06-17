import { i as head, c as attr, b as ensure_array_like, a as attr_class, h as stringify, e as escape_html, j as attr_style } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let alertes = [];
    let sharingLocation = false;
    const urgences = [
      {
        nom: "Police Nationale",
        numero: "117",
        icon: "🚔",
        color: "#1d4ed8"
      },
      {
        nom: "SAMU / Urgences médicales",
        numero: "15",
        icon: "🏥",
        color: "#dc2626"
      },
      { nom: "Pompiers", numero: "118", icon: "🚒", color: "#ea580c" },
      {
        nom: "Gendarmerie",
        numero: "197",
        icon: "👮",
        color: "#16a34a"
      },
      {
        nom: "Ambassade de France",
        numero: "+229 21 30 02 25",
        icon: "🇫🇷",
        color: "#1d4ed8"
      },
      {
        nom: "Urgences européennes",
        numero: "+229 21 31 45 67",
        icon: "🌐",
        color: "#7c3aed"
      }
    ];
    const hopitaux = [
      {
        nom: "CNHU-HKM Cotonou",
        ville: "Cotonou",
        tel: "+229 21 30 01 55"
      },
      {
        nom: "Hôpital Saint Luc",
        ville: "Cotonou",
        tel: "+229 21 31 45 67"
      },
      {
        nom: "HZ Abomey-Calavi",
        ville: "Abomey-Calavi",
        tel: "+229 21 36 00 55"
      },
      {
        nom: "Clinique Louis Pasteur",
        ville: "Cotonou",
        tel: "+229 21 31 22 33"
      }
    ];
    const conseils = [
      {
        icon: "💊",
        title: "Santé",
        desc: "Vaccin fièvre jaune obligatoire. Antipaludéens recommandés. Consultez un médecin avant le départ.",
        color: "#16a34a"
      },
      {
        icon: "💧",
        title: "Eau potable",
        desc: "Buvez uniquement de l'eau en bouteille ou purifiée. Évitez les glaçons dans les établissements peu sûrs.",
        color: "#2563eb"
      },
      {
        icon: "🌡️",
        title: "Chaleur",
        desc: "Températures 30–35 °C. Restez hydraté, portez une protection solaire et des vêtements légers.",
        color: "#ea580c"
      },
      {
        icon: "🦟",
        title: "Paludisme",
        desc: "Utilisez un répulsif anti-moustiques et une moustiquaire traitée, surtout la nuit.",
        color: "#9333ea"
      },
      {
        icon: "🛂",
        title: "Visa e-Bénin",
        desc: "Visa disponible en ligne avant le départ. Passeport valide 6 mois + photo + assurance obligatoire.",
        color: "#0891b2"
      },
      {
        icon: "💰",
        title: "Monnaie",
        desc: "Franc CFA (XOF). 1 € ≈ 655 XOF. Distributeurs à Cotonou. Carte Visa acceptée dans les grands hôtels.",
        color: "#d97706"
      }
    ];
    head("1lwudzs", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Urgences &amp; Sécurité — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<section class="urgence-hero svelte-1lwudzs"><div class="hero-overlay svelte-1lwudzs"></div> <div class="container hero-inner svelte-1lwudzs"><div class="hero-text ha-1 svelte-1lwudzs"><div class="hero-badge svelte-1lwudzs">🚨 Sécurité &amp; Urgences</div> <h1 class="svelte-1lwudzs">Besoin d'aide au Bénin ?</h1> <p class="svelte-1lwudzs">Numéros d'urgence, hôpitaux et conseils de sécurité pour voyageurs. Disponibles même hors-ligne.</p></div> <div class="sos-block ha-2 svelte-1lwudzs"><a href="tel:117" class="sos-btn svelte-1lwudzs" aria-label="Appeler la police — 117"><div class="sos-ring sos-ring--1 svelte-1lwudzs"></div> <div class="sos-ring sos-ring--2 svelte-1lwudzs"></div> <div class="sos-center svelte-1lwudzs"><span class="svelte-1lwudzs">🚨</span> <strong class="svelte-1lwudzs">SOS</strong> <small class="svelte-1lwudzs">Police — 117</small></div></a> <button class="loc-btn svelte-1lwudzs"${attr("disabled", sharingLocation, true)} aria-label="Partager ma position GPS">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`📍 Partager ma position GPS`);
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></section> `);
    if (alertes.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alerts-bar svelte-1lwudzs"><div class="container alerts-inner svelte-1lwudzs"><!--[-->`);
      const each_array = ensure_array_like(alertes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let a = each_array[$$index];
        $$renderer2.push(`<div${attr_class(`alert-item alert-${stringify(a.severite)}`, "svelte-1lwudzs")}>${escape_html(a.severite === "danger" ? "🔴" : a.severite === "warning" ? "🟡" : "🔵")}
          ${escape_html(a.messageFr)}</div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="section section-sm svelte-1lwudzs"><div class="container svelte-1lwudzs"><div class="section-hd svelte-1lwudzs"><h2 class="svelte-1lwudzs">Numéros d'urgence</h2> <p class="svelte-1lwudzs">Cliquez sur un numéro pour appeler directement</p></div> <div class="urgences-grid svelte-1lwudzs"><!--[-->`);
    const each_array_1 = ensure_array_like(urgences);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let u = each_array_1[i];
      $$renderer2.push(`<div class="uc-card svelte-1lwudzs"${attr_style(`--uc:${stringify(u.color)}`)}><div class="uc-icon svelte-1lwudzs">${escape_html(u.icon)}</div> <div class="uc-body svelte-1lwudzs"><span class="uc-nom svelte-1lwudzs">${escape_html(u.nom)}</span> <a${attr("href", `tel:${stringify(u.numero.replace(/\s/g, ""))}`)} class="uc-num svelte-1lwudzs">${escape_html(u.numero)}</a></div> <a${attr("href", `tel:${stringify(u.numero.replace(/\s/g, ""))}`)} class="uc-call svelte-1lwudzs"${attr("aria-label", `Appeler ${stringify(u.nom)}`)}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-1lwudzs"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" class="svelte-1lwudzs"></path></svg></a></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="section section-sm svelte-1lwudzs" style="background: var(--color-ivory-dark)"><div class="container svelte-1lwudzs"><div class="section-hd svelte-1lwudzs"><h2 class="svelte-1lwudzs">🏥 Hôpitaux principaux</h2> <p class="svelte-1lwudzs">Établissements de santé recommandés pour les voyageurs</p></div> <div class="hop-grid svelte-1lwudzs"><!--[-->`);
    const each_array_2 = ensure_array_like(hopitaux);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let h = each_array_2[i];
      $$renderer2.push(`<div class="hop-card card svelte-1lwudzs"><div class="hop-icon svelte-1lwudzs">🏥</div> <h3 class="svelte-1lwudzs">${escape_html(h.nom)}</h3> <p class="hop-ville svelte-1lwudzs">📍 ${escape_html(h.ville)}</p> <a${attr("href", `tel:${stringify(h.tel)}`)} class="hop-tel svelte-1lwudzs">${escape_html(h.tel)}</a> <a${attr("href", `tel:${stringify(h.tel)}`)} class="btn btn-outline hop-btn svelte-1lwudzs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="svelte-1lwudzs"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" class="svelte-1lwudzs"></path></svg> Appeler</a></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="section svelte-1lwudzs"><div class="container svelte-1lwudzs"><div class="section-hd svelte-1lwudzs"><h2 class="svelte-1lwudzs">Conseils essentiels</h2> <p class="svelte-1lwudzs">Préparez votre séjour sereinement</p></div> <div class="conseils-grid svelte-1lwudzs"><!--[-->`);
    const each_array_3 = ensure_array_like(conseils);
    for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
      let c = each_array_3[i];
      $$renderer2.push(`<div class="conseil-card svelte-1lwudzs"${attr_style(`--cc:${stringify(c.color)}`)}><div class="conseil-icon svelte-1lwudzs">${escape_html(c.icon)}</div> <h3 class="svelte-1lwudzs">${escape_html(c.title)}</h3> <p class="svelte-1lwudzs">${escape_html(c.desc)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section>`);
  });
}
export {
  _page as default
};
