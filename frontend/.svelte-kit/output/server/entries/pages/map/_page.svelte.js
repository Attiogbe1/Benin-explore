import { i as head, a as attr_class, e as escape_html, b as ensure_array_like, j as attr_style, h as stringify } from "../../../chunks/index.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let sites = [];
    let selectedSite = null;
    onDestroy(() => {
    });
    head("w85nl5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Carte interactive — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="map-page svelte-w85nl5"><div${attr_class("map-sidebar svelte-w85nl5", void 0, { "has-site": selectedSite })}><div class="map-header svelte-w85nl5"><h2 class="svelte-w85nl5">🗺️ Carte du Bénin</h2> <p class="svelte-w85nl5">${escape_html(sites.length)} sites touristiques</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<ul class="sites-list svelte-w85nl5"><!--[-->`);
      const each_array = ensure_array_like(sites);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let site = each_array[$$index];
        $$renderer2.push(`<li><button class="site-list-item svelte-w85nl5"><span class="site-dot svelte-w85nl5"${attr_style(`background: ${stringify(site.category?.couleur || "#0D3B5C")}`)}></span> <span>${escape_html(site.nomFr)}</span></button></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="map-container svelte-w85nl5"></div></div>`);
  });
}
export {
  _page as default
};
