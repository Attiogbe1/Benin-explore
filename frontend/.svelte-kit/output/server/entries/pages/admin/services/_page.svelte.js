import { i as head, e as escape_html, c as attr, b as ensure_array_like, f as derived } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let services = [];
    let search = "";
    let typeFilter = "";
    const typeLabels = {
      HEBERGEMENT: "🏨 Hébergement",
      TRANSPORT: "🚗 Transport",
      GUIDE: "🧭 Guide",
      ACTIVITE: "🎯 Activité",
      RESTAURANT: "🍽️ Restaurant"
    };
    const filtered = derived(() => services.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.nomFr?.toLowerCase().includes(q) || s.provider?.nomEntreprise?.toLowerCase().includes(q);
      const matchType = !typeFilter;
      return matchSearch && matchType;
    }));
    head("u8udot", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Services — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-u8udot"><div class="page-header svelte-u8udot"><h1 class="svelte-u8udot">Services <span class="count svelte-u8udot">(${escape_html(filtered().length)})</span></h1> <div class="filters svelte-u8udot"><input class="search-input svelte-u8udot" placeholder="Nom, prestataire…"${attr("value", search)}/> `);
    $$renderer2.select(
      { class: "filter-select", value: typeFilter },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Tous les types`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(Object.entries(typeLabels));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let [val, lbl] = each_array[$$index];
          $$renderer3.option({ value: val }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(lbl)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-u8udot"
    );
    $$renderer2.push(`</div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
