import { j as head, o as escape_html, m as attr, l as ensure_array_like, k as attr_class, ax as attr_style, r as derived, q as stringify } from './index-UZecICzA.js';

function formatPrix(montant, devise = "XOF") {
  if (devise === "XOF") {
    return `${montant.toLocaleString("fr-FR")} FCFA`;
  }
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: devise }).format(montant);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let reservations = [];
    let statusFilter = "";
    let search = "";
    const statusLabels = {
      EN_ATTENTE: { label: "En attente", bg: "#fef9c3", color: "#854d0e" },
      CONFIRMEE: { label: "Confirmée", bg: "#dcfce7", color: "#166534" },
      EN_COURS: { label: "En cours", bg: "#dbeafe", color: "#1e40af" },
      TERMINEE: { label: "Terminée", bg: "#f3f4f6", color: "#374151" },
      ANNULEE: { label: "Annulée", bg: "#fee2e2", color: "#991b1b" },
      REFUSEE: { label: "Refusée", bg: "#fee2e2", color: "#991b1b" }
    };
    const filtered = derived(() => reservations.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.user?.prenom?.toLowerCase().includes(q) || r.user?.nom?.toLowerCase().includes(q) || r.service?.nomFr?.toLowerCase().includes(q);
      const matchStatus = !statusFilter;
      return matchSearch && matchStatus;
    }));
    const total = derived(() => filtered().reduce((s, r) => s + (r.prixTotal ?? 0), 0));
    head("1v57m18", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Réservations — Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page svelte-1v57m18"><div class="page-header svelte-1v57m18"><div><h1 class="svelte-1v57m18">Réservations <span class="count svelte-1v57m18">(${escape_html(filtered().length)})</span></h1> `);
    if (filtered().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="total-revenus svelte-1v57m18">Total : <strong>${escape_html(formatPrix(total()))}</strong></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="filters svelte-1v57m18"><input class="search-input svelte-1v57m18" placeholder="Chercher client ou service…"${attr("value", search)}/> `);
    $$renderer2.select(
      { class: "filter-select", value: statusFilter },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Tous les statuts`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(Object.entries(statusLabels));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let [val, { label }] = each_array[$$index];
          $$renderer3.option({ value: val }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-1v57m18"
    );
    $$renderer2.push(`</div></div> <div class="status-counts svelte-1v57m18"><!--[-->`);
    const each_array_1 = ensure_array_like(Object.entries(statusLabels));
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let [val, { label, bg, color }] = each_array_1[$$index_1];
      const cnt = reservations.filter((r) => r.statut === val).length;
      if (cnt > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button${attr_class("status-chip svelte-1v57m18", void 0, { "active-filter": statusFilter === val })}${attr_style(`background:${stringify(bg)};color:${stringify(color)}`)}>${escape_html(label)} (${escape_html(cnt)})</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BXYWjwLQ.js.map
