import { j as head, k as attr_class, l as ensure_array_like, o as escape_html } from './index-UZecICzA.js';
import './auth.store.svelte-BLHQ1sTo.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedType = "";
    const types = [
      "HEBERGEMENT",
      "TRANSPORT",
      "GUIDE",
      "ACTIVITE",
      "RESTAURANT"
    ];
    const typeLabels = {
      HEBERGEMENT: "🏨 Hébergement",
      TRANSPORT: "🚗 Transport",
      GUIDE: "🧭 Guide",
      ACTIVITE: "🎯 Activité",
      RESTAURANT: "🍽️ Restaurant"
    };
    head("ar6fg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Réservations — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="page-header svelte-ar6fg"><div class="container"><h1 class="svelte-ar6fg">Réservez vos services</h1> <p class="svelte-ar6fg">Guides locaux, hébergements, transports et activités</p></div></div> <div class="container resa-index svelte-ar6fg"><div class="type-filters svelte-ar6fg"><button${attr_class("type-btn svelte-ar6fg", void 0, { "active": !selectedType })}>Tous</button> <!--[-->`);
    const each_array = ensure_array_like(types);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let type = each_array[$$index];
      $$renderer2.push(`<button${attr_class("type-btn svelte-ar6fg", void 0, { "active": selectedType === type })}>${escape_html(typeLabels[type])}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="services-grid svelte-ar6fg"><!--[-->`);
      const each_array_1 = ensure_array_like(Array(8));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        each_array_1[$$index_1];
        $$renderer2.push(`<div class="skeleton" style="height: 300px; border-radius: var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DLvLO9Um.js.map
