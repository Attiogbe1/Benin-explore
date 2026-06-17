import { i as head, b as ensure_array_like } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Admin — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-dashboard svelte-1jef3w8"><h1 class="svelte-1jef3w8">Dashboard</h1> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="stats-grid svelte-1jef3w8"><!--[-->`);
      const each_array = ensure_array_like(Array(5));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="skeleton" style="height: 120px; border-radius: var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
