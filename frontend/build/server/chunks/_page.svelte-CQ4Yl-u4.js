import { j as head, m as attr, l as ensure_array_like, k as attr_class, o as escape_html } from './index-UZecICzA.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedType = "";
    let searchInput = "";
    const types = [
      { value: "", label: "Tous" },
      { value: "HEBERGEMENT", label: "🏨 Hébergement" },
      { value: "RESTAURANT", label: "🍽️ Restaurant" },
      { value: "GUIDE", label: "🧭 Guide" },
      { value: "TRANSPORT", label: "🚗 Transport" },
      { value: "ACTIVITE", label: "🎯 Activité" }
    ];
    head("122i30a", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Prestataires — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="prest-hero svelte-122i30a"><div class="container hero-inner svelte-122i30a"><h1 class="svelte-122i30a">Services touristiques du Bénin</h1> <p class="svelte-122i30a">Hébergements, guides, restaurants et activités — des prestataires locaux de confiance</p> <form class="search-bar svelte-122i30a"><input class="search-input svelte-122i30a"${attr("value", searchInput)} placeholder="Rechercher un prestataire, une activité…"/> <button type="submit" class="btn btn-primary">Rechercher</button></form></div></div> <div class="container prest-page svelte-122i30a"><div class="type-filters svelte-122i30a"><!--[-->`);
    const each_array = ensure_array_like(types);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<button${attr_class("type-btn svelte-122i30a", void 0, { "active": selectedType === t.value })}>${escape_html(t.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="providers-grid svelte-122i30a"><!--[-->`);
      const each_array_1 = ensure_array_like(Array(6));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        each_array_1[$$index_1];
        $$renderer2.push(`<div class="skeleton" style="height:320px;border-radius:var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="become-banner svelte-122i30a"><div><h3 class="svelte-122i30a">Vous avez un service touristique à proposer ?</h3> <p class="svelte-122i30a">Rejoignez des dizaines de prestataires et touchez des milliers de voyageurs au Bénin.</p></div> <a href="/devenir-prestataire" class="btn btn-primary btn-lg svelte-122i30a">Devenir prestataire →</a></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CQ4Yl-u4.js.map
