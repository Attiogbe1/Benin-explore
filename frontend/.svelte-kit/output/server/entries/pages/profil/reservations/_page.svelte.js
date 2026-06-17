import { i as head, b as ensure_array_like } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.store.svelte.js";
import "../../../../chunks/StarRating.svelte_svelte_type_style_lang.js";
import "../../../../chunks/ReviewForm.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("i2whrr", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mes réservations — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="container resa-page svelte-i2whrr"><h1 class="svelte-i2whrr">🗓️ Mes réservations</h1> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Array(3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="skeleton" style="height: 120px; border-radius: var(--radius-lg); margin-bottom: var(--space-4)"></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
