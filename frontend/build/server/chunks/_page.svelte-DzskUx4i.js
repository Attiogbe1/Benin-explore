import { j as head, o as escape_html, m as attr } from './index-UZecICzA.js';
import './root-CTJTtf_m.js';
import './state.svelte-w1Tm48Zp.js';
import { a as authStore } from './auth.store.svelte-BLHQ1sTo.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = { nom: "", prenom: "", bio: "", pays: "", telephone: "" };
    let isLoading = false;
    head("kwz0d7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mon profil — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="container profil-page svelte-kwz0d7"><div class="profil-header svelte-kwz0d7"><div class="avatar-big svelte-kwz0d7">${escape_html(authStore.user?.prenom?.[0])}${escape_html(authStore.user?.nom?.[0])}</div> <div><h1 class="svelte-kwz0d7">${escape_html(authStore.user?.prenom)} ${escape_html(authStore.user?.nom)}</h1> <p class="svelte-kwz0d7">${escape_html(authStore.user?.email)}</p> <span class="role-badge svelte-kwz0d7">${escape_html(authStore.user?.role)}</span></div></div> <div class="profil-layout svelte-kwz0d7"><nav class="profil-nav svelte-kwz0d7"><a href="/profil" class="nav-item active svelte-kwz0d7">Informations</a> <a href="/profil/favoris" class="nav-item svelte-kwz0d7">❤️ Mes favoris</a> <a href="/profil/reservations" class="nav-item svelte-kwz0d7">🗓️ Mes réservations</a></nav> <div class="profil-content card svelte-kwz0d7"><h2 class="svelte-kwz0d7">Modifier mon profil</h2> <form class="profil-form svelte-kwz0d7"><div class="form-row svelte-kwz0d7"><div class="form-group"><label class="form-label">Prénom</label> <input type="text" class="form-input"${attr("value", form.prenom)}/></div> <div class="form-group"><label class="form-label">Nom</label> <input type="text" class="form-input"${attr("value", form.nom)}/></div></div> <div class="form-group"><label class="form-label">Bio</label> <textarea class="form-input" rows="3" placeholder="Parlez-nous de vous...">`);
    const $$body = escape_html(form.bio);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-row svelte-kwz0d7"><div class="form-group"><label class="form-label">Pays</label> <input type="text" class="form-input"${attr("value", form.pays)} placeholder="France, Bénin..."/></div> <div class="form-group"><label class="form-label">Téléphone</label> <input type="tel" class="form-input"${attr("value", form.telephone)}/></div></div> <button type="submit" class="btn btn-primary"${attr("disabled", isLoading, true)}>${escape_html("Sauvegarder")}</button></form></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DzskUx4i.js.map
