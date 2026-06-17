import { j as head, m as attr, o as escape_html } from './index-UZecICzA.js';
import './root-CTJTtf_m.js';
import './state.svelte-w1Tm48Zp.js';
import './auth.store.svelte-BLHQ1sTo.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let isLoading = false;
    head("1i2smtp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Connexion — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="auth-page svelte-1i2smtp"><div class="auth-card card svelte-1i2smtp"><div class="auth-header svelte-1i2smtp"><span class="auth-logo svelte-1i2smtp">🇧🇯</span> <h1 class="svelte-1i2smtp">Connexion</h1> <p class="svelte-1i2smtp">Accédez à votre espace BeninExplore</p></div> <form class="auth-form svelte-1i2smtp"><div class="form-group"><label class="form-label" for="email">Email</label> <input id="email" type="email" class="form-input"${attr("value", email)} required="" placeholder="votre@email.com"/></div> <div class="form-group"><label class="form-label" for="password">Mot de passe</label> <input id="password" type="password" class="form-input"${attr("value", password)} required="" placeholder="••••••••"/></div> <button type="submit" class="btn btn-primary btn-block svelte-1i2smtp"${attr("disabled", isLoading, true)}>${escape_html("Se connecter")}</button></form> <p class="auth-switch svelte-1i2smtp">Pas encore de compte ? <a href="/auth/register" class="svelte-1i2smtp">S'inscrire</a></p></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BFhDKWTZ.js.map
