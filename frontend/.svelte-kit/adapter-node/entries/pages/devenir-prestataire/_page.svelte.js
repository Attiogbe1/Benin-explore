import { i as head, a as attr_class, c as attr, e as escape_html } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { a as authStore } from "../../../chunks/auth.store.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let step = 1;
    let isLoading = false;
    let profile = {
      nomEntreprise: "",
      descriptionFr: "",
      telephone: "",
      email: authStore.user?.email ?? "",
      adresse: "",
      siteWeb: ""
    };
    head("1w0k9td", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Devenir prestataire — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="prest-hero svelte-1w0k9td"><div class="container prest-hero-inner svelte-1w0k9td"><div class="prest-badge svelte-1w0k9td">Rejoignez l'écosystème touristique du Bénin</div> <h1 class="svelte-1w0k9td">Devenez prestataire</h1> <p class="svelte-1w0k9td">Proposez vos services à des milliers de voyageurs et développez votre activité touristique.</p> <div class="benefits svelte-1w0k9td"><span class="svelte-1w0k9td">✅ Gratuit</span> <span class="svelte-1w0k9td">📬 Notifications en temps réel</span> <span class="svelte-1w0k9td">📹 Présentation vidéo</span> <span class="svelte-1w0k9td">🌍 Visibilité internationale</span></div></div></div> <div class="container prest-container svelte-1w0k9td"><div class="stepper svelte-1w0k9td"><div${attr_class("step-item svelte-1w0k9td", void 0, { "active": step >= 1, "done": step > 1 })}><div class="step-circle svelte-1w0k9td">1</div> <span class="svelte-1w0k9td">Profil entreprise</span></div> <div${attr_class("step-line svelte-1w0k9td", void 0, { "done": step > 1 })}></div> <div${attr_class("step-item svelte-1w0k9td", void 0, { "active": step >= 2 })}><div class="step-circle svelte-1w0k9td">2</div> <span class="svelte-1w0k9td">Premier service</span></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="prest-form card svelte-1w0k9td"><h2 class="svelte-1w0k9td">Votre profil d'entreprise</h2> <p class="form-subtitle svelte-1w0k9td">Ces informations seront visibles par les touristes.</p> <form><div class="form-row svelte-1w0k9td"><div class="form-group svelte-1w0k9td"><label class="form-label">Nom de l'entreprise *</label> <input class="form-input"${attr("value", profile.nomEntreprise)} required="" placeholder="Ex : Chez Alphonse Guesthouse"/></div> <div class="form-group svelte-1w0k9td"><label class="form-label">Téléphone *</label> <input class="form-input"${attr("value", profile.telephone)} required="" placeholder="+229 XX XX XX XX"/></div></div> <div class="form-group svelte-1w0k9td"><label class="form-label">Description de votre activité *</label> <textarea class="form-input" required="" rows="4" placeholder="Décrivez vos services, votre expérience, ce qui vous rend unique…">`);
      const $$body = escape_html(profile.descriptionFr);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="form-row svelte-1w0k9td"><div class="form-group svelte-1w0k9td"><label class="form-label">Email professionnel *</label> <input class="form-input" type="email"${attr("value", profile.email)} required=""/></div> <div class="form-group svelte-1w0k9td"><label class="form-label">Site web</label> <input class="form-input"${attr("value", profile.siteWeb)} placeholder="https://…"/></div></div> <div class="form-group svelte-1w0k9td"><label class="form-label">Adresse *</label> <input class="form-input"${attr("value", profile.adresse)} required="" placeholder="Quartier, ville, commune…"/></div> <button type="submit" class="btn btn-primary btn-lg svelte-1w0k9td"${attr("disabled", isLoading, true)}>${escape_html("Créer mon profil →")}</button></form></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
