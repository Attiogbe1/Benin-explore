import { i as head } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.store.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("3xt7sm", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mon espace prestataire — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="dashboard-hero svelte-3xt7sm"><div class="container"><h1 class="svelte-3xt7sm">Mon espace prestataire</h1> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="container dashboard svelte-3xt7sm">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:200px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
