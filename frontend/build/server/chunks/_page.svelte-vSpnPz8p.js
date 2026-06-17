import { j as head, o as escape_html, m as attr, r as derived } from './index-UZecICzA.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let sites = [];
    let search = "";
    const filtered = derived(() => sites.filter((s) => !search));
    head("1l8xuwj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sites touristiques — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-1l8xuwj"><div class="page-header svelte-1l8xuwj"><h1 class="svelte-1l8xuwj">Sites touristiques <span class="count svelte-1l8xuwj">(${escape_html(filtered().length)})</span></h1> <div class="header-actions svelte-1l8xuwj"><input class="search-input svelte-1l8xuwj" placeholder="Rechercher…"${attr("value", search)}/> <button class="btn btn-primary">+ Nouveau site</button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:300px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-vSpnPz8p.js.map
