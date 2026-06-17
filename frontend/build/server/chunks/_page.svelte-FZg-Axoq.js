import { j as head, o as escape_html, m as attr, l as ensure_array_like } from './index-UZecICzA.js';

const filtersStore = /* @__PURE__ */ (() => {
  let search = "";
  let categorie = "";
  let region = "";
  let gratuit = false;
  let sort = "popularite";
  return {
    get search() {
      return search;
    },
    get categorie() {
      return categorie;
    },
    get region() {
      return region;
    },
    get gratuit() {
      return gratuit;
    },
    get sort() {
      return sort;
    },
    get params() {
      const p = {};
      if (search) p.search = search;
      if (categorie) p.categorie = categorie;
      if (region) p.region = region;
      if (gratuit) p.gratuit = "true";
      if (sort !== "popularite") p.sort = sort;
      return p;
    },
    setSearch(v) {
      search = v;
    },
    setCategorie(v) {
      categorie = v;
    },
    setRegion(v) {
      region = v;
    },
    setGratuit(v) {
      gratuit = v;
    },
    setSort(v) {
      sort = v;
    },
    reset() {
      search = "";
      categorie = "";
      region = "";
      gratuit = false;
      sort = "popularite";
    }
  };
})();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let total = 0;
    let categories = [];
    let regions = [];
    head("8z6e0v", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Destinations — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="page-header svelte-8z6e0v"><div class="container"><h1 class="svelte-8z6e0v">Toutes les destinations</h1> <p class="svelte-8z6e0v">${escape_html(total)} site${escape_html("")} touristique${escape_html("")} au Bénin</p></div></div> <div class="container page-content svelte-8z6e0v"><form class="filters-bar svelte-8z6e0v"><input type="search" class="form-input search-input svelte-8z6e0v" placeholder="Rechercher un site, une ville..."${attr("value", filtersStore.search)}/> <select class="form-input svelte-8z6e0v">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Toutes catégories`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.option({ value: cat.slug }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(cat.nomFr)}`);
      });
    }
    $$renderer2.push(`<!--]--></select> <select class="form-input svelte-8z6e0v">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Toutes régions`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array_1 = ensure_array_like(regions);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let reg = each_array_1[$$index_1];
      $$renderer2.option({ value: reg.slug }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(reg.nomFr)}`);
      });
    }
    $$renderer2.push(`<!--]--></select> <select class="form-input svelte-8z6e0v">`);
    $$renderer2.option({ value: "popularite" }, ($$renderer3) => {
      $$renderer3.push(`Plus populaires`);
    });
    $$renderer2.option({ value: "note" }, ($$renderer3) => {
      $$renderer3.push(`Mieux notés`);
    });
    $$renderer2.option({ value: "recent" }, ($$renderer3) => {
      $$renderer3.push(`Récents`);
    });
    $$renderer2.option({ value: "nom" }, ($$renderer3) => {
      $$renderer3.push(`A → Z`);
    });
    $$renderer2.push(`</select> <label class="filter-check svelte-8z6e0v"><input type="checkbox"${attr("checked", filtersStore.gratuit, true)}/> Gratuit</label> <button type="submit" class="btn btn-primary">Rechercher</button></form> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sites-grid svelte-8z6e0v"><!--[-->`);
      const each_array_2 = ensure_array_like(Array(12));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        each_array_2[$$index_2];
        $$renderer2.push(`<div class="skeleton" style="height: 380px; border-radius: var(--radius-lg)"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-FZg-Axoq.js.map
