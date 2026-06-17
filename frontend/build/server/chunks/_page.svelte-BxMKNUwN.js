import { j as head, o as escape_html, m as attr, r as derived } from './index-UZecICzA.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let providers = [];
    let search = "";
    let verifFilter = "";
    const filtered = derived(() => providers.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.nomEntreprise?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.telephone?.includes(q);
      const matchVerif = true;
      return matchSearch && matchVerif;
    }));
    head("1kh0eka", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Prestataires — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-1kh0eka"><div class="page-header svelte-1kh0eka"><h1 class="svelte-1kh0eka">Prestataires <span class="count svelte-1kh0eka">(${escape_html(filtered().length)})</span></h1> <div class="filters svelte-1kh0eka"><input class="search-input svelte-1kh0eka" placeholder="Nom, email, téléphone…"${attr("value", search)}/> `);
    $$renderer2.select(
      { class: "filter-select", value: verifFilter },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Tous`);
        });
        $$renderer3.option({ value: "verifie" }, ($$renderer4) => {
          $$renderer4.push(`Vérifiés`);
        });
        $$renderer3.option({ value: "en-attente" }, ($$renderer4) => {
          $$renderer4.push(`En attente`);
        });
      },
      "svelte-1kh0eka"
    );
    $$renderer2.push(`</div></div> <div class="summary-chips svelte-1kh0eka"><span class="chip chip-green svelte-1kh0eka">${escape_html(providers.filter((p) => p.estVerifie).length)} vérifiés</span> <span class="chip chip-orange svelte-1kh0eka">${escape_html(providers.filter((p) => !p.estVerifie).length)} en attente</span> <span class="chip chip-blue svelte-1kh0eka">${escape_html(providers.reduce((s, p) => s + (p._count?.services ?? 0), 0))} services publiés</span></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BxMKNUwN.js.map
