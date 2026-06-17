import { i as head, b as ensure_array_like } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.store.svelte.js";
import "../../../../chunks/SiteCard.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("5beq1u", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mes favoris — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="container favoris-page svelte-5beq1u"><h1 class="svelte-5beq1u">❤️ Mes favoris</h1> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sites-grid svelte-5beq1u"><!--[-->`);
      const each_array = ensure_array_like(Array(4));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="skeleton" style="height: 380px; border-radius: var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
