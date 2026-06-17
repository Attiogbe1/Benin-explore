import { i as head, e as escape_html } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let pendingReviews = [];
    head("1hf0ryg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Avis en attente — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-1hf0ryg"><div class="page-header svelte-1hf0ryg"><h1 class="svelte-1hf0ryg">Modération des avis `);
    if (pendingReviews.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="pending-chip svelte-1hf0ryg">${escape_html(pendingReviews.length)} en attente</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></h1></div> `);
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
