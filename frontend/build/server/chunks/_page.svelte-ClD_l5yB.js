import { j as head, o as escape_html, m as attr, r as derived } from './index-UZecICzA.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let users = [];
    let search = "";
    let roleFilter = "";
    const filtered = derived(() => users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.prenom?.toLowerCase().includes(q) || u.nom?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchRole = !roleFilter;
      return matchSearch && matchRole;
    }));
    head("e257pl", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Utilisateurs — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-e257pl"><div class="page-header svelte-e257pl"><h1 class="svelte-e257pl">Utilisateurs <span class="count svelte-e257pl">(${escape_html(filtered().length)})</span></h1> <div class="filters svelte-e257pl"><input class="search-input svelte-e257pl" placeholder="Rechercher…"${attr("value", search)}/> `);
    $$renderer2.select(
      { class: "filter-select", value: roleFilter },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Tous les rôles`);
        });
        $$renderer3.option({ value: "ADMIN" }, ($$renderer4) => {
          $$renderer4.push(`Admin`);
        });
        $$renderer3.option({ value: "PRESTATAIRE" }, ($$renderer4) => {
          $$renderer4.push(`Prestataire`);
        });
        $$renderer3.option({ value: "TOURISTE" }, ($$renderer4) => {
          $$renderer4.push(`Touriste`);
        });
        $$renderer3.option({ value: "VISITEUR" }, ($$renderer4) => {
          $$renderer4.push(`Visiteur`);
        });
      },
      "svelte-e257pl"
    );
    $$renderer2.push(`</div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-ClD_l5yB.js.map
