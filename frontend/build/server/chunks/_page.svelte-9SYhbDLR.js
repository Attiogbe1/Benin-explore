import { j as head, l as ensure_array_like } from './index-UZecICzA.js';
import './root-CTJTtf_m.js';
import './state.svelte-w1Tm48Zp.js';
import './auth.store.svelte-BLHQ1sTo.js';

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

export { _page as default };
//# sourceMappingURL=_page.svelte-9SYhbDLR.js.map
