import { l as ensure_array_like, o as escape_html, m as attr, k as attr_class, n as store_get, p as unsubscribe_stores } from './index-UZecICzA.js';
import './root-CTJTtf_m.js';
import './state.svelte-w1Tm48Zp.js';
import { p as page } from './stores-CsfH1fBI.js';
import './auth.store.svelte-BLHQ1sTo.js';

function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const navGroups = [
      {
        title: "Vue d'ensemble",
        items: [{ href: "/admin", label: "📊 Dashboard" }]
      },
      {
        title: "Contenu",
        items: [
          { href: "/admin/sites", label: "🗺️ Sites touristiques" },
          { href: "/admin/blog", label: "📰 Blog" },
          { href: "/admin/avis", label: "⭐ Avis & Notes" }
        ]
      },
      {
        title: "Commerce",
        items: [
          { href: "/admin/prestataires", label: "🏢 Prestataires" },
          { href: "/admin/services", label: "🛎️ Services" },
          { href: "/admin/reservations", label: "🗓️ Réservations" }
        ]
      },
      {
        title: "Utilisateurs",
        items: [{ href: "/admin/utilisateurs", label: "👥 Utilisateurs" }]
      }
    ];
    $$renderer2.push(`<div class="admin-layout svelte-1qg5d05"><aside class="admin-sidebar svelte-1qg5d05"><div class="admin-logo svelte-1qg5d05"><span>🇧🇯</span> <span>Admin</span></div> <nav class="admin-nav svelte-1qg5d05"><!--[-->`);
    const each_array = ensure_array_like(navGroups);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let group = each_array[$$index_1];
      $$renderer2.push(`<div class="nav-group svelte-1qg5d05"><span class="nav-group-title svelte-1qg5d05">${escape_html(group.title)}</span> <!--[-->`);
      const each_array_1 = ensure_array_like(group.items);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let item = each_array_1[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class("admin-nav-item svelte-1qg5d05", void 0, {
          "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === item.href
        })}>${escape_html(item.label)}</a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="admin-footer svelte-1qg5d05"><a href="/" class="btn btn-ghost btn-sm svelte-1qg5d05">← Retour au site</a></div></aside> <main class="admin-main svelte-1qg5d05">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DxSVga8P.js.map
