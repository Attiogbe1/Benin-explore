import { i as head, e as escape_html, c as attr, f as derived } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let posts = [];
    let search = "";
    const filtered = derived(() => posts.filter((p) => !search));
    head("1h57cj5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Blog — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-1h57cj5"><div class="page-header svelte-1h57cj5"><h1 class="svelte-1h57cj5">Blog <span class="count svelte-1h57cj5">(${escape_html(filtered().length)} articles)</span></h1> <div class="header-actions svelte-1h57cj5"><input class="search-input svelte-1h57cj5" placeholder="Rechercher…"${attr("value", search)}/> <button class="btn btn-primary">+ Nouvel article</button></div></div> `);
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
export {
  _page as default
};
