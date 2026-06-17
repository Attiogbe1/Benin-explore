import { i as head, e as escape_html } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.store.svelte.js";
import "../../../../chunks/StarRating.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("v3fd42", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Prestataire")} — BeninExplore</title>`);
      });
    });
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="container" style="padding-block:var(--space-16)"><div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
