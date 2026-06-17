import { i as head, b as ensure_array_like, e as escape_html, a as attr_class } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeCategorie = "";
    const CATEGORIES = [
      "Itinéraires",
      "Culture & Histoire",
      "Conseils pratiques",
      "Gastronomie",
      "Activités"
    ];
    head("u4k2t", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Blog &amp; Itinéraires — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<section class="blog-hero svelte-u4k2t"><div class="hero-overlay svelte-u4k2t"></div> <div class="container hero-inner svelte-u4k2t"><div class="ha-1 svelte-u4k2t"><div class="hero-badge svelte-u4k2t">✍️ Blog &amp; Itinéraires</div> <h1 class="svelte-u4k2t">Explorez le Bénin<br/><em class="svelte-u4k2t">avec nos experts</em></h1> <p class="svelte-u4k2t">Guides de voyage, récits authentiques et itinéraires pour vivre le Bénin au-delà des clichés.</p></div> <div class="hero-stats ha-2 svelte-u4k2t"><!--[-->`);
    const each_array = ensure_array_like([
      ["📄", "20+", "Articles"],
      ["🗺️", "6", "Régions couvertes"],
      ["✍️", "8", "Auteurs locaux"]
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [icon, val, lbl] = each_array[$$index];
      $$renderer2.push(`<div class="hstat svelte-u4k2t"><span class="svelte-u4k2t">${escape_html(icon)}</span> <strong class="svelte-u4k2t">${escape_html(val)}</strong> <span class="svelte-u4k2t">${escape_html(lbl)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <div class="container blog-body svelte-u4k2t"><div class="cat-tabs svelte-u4k2t"><button${attr_class("cat-tab svelte-u4k2t", void 0, { "active": activeCategorie === "" })}>Tous les articles</button> <!--[-->`);
    const each_array_1 = ensure_array_like(CATEGORIES);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class("cat-tab svelte-u4k2t", void 0, { "active": activeCategorie === cat })}>${escape_html(cat)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="blog-grid svelte-u4k2t"><!--[-->`);
      const each_array_2 = ensure_array_like(Array(6));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        each_array_2[$$index_2];
        $$renderer2.push(`<div class="skeleton" style="height:320px; border-radius:var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
