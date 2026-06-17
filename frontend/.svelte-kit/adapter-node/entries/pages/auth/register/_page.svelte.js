import { i as head, c as attr, e as escape_html, j as attr_style, h as stringify, a as attr_class, f as derived } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.store.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      langue: "fr"
    };
    let isLoading = false;
    const strength = derived(() => () => {
      const p = form.password;
      let score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      return score;
    });
    const strengthLabel = derived(() => () => {
      strength()();
      return null;
    });
    head("8bdjn9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Inscription — BeninExplore</title>`);
      });
    });
    $$renderer2.push(`<div class="auth-page svelte-8bdjn9"><div class="auth-card card svelte-8bdjn9"><div class="auth-header svelte-8bdjn9"><span class="auth-logo svelte-8bdjn9">🇧🇯</span> <h1 class="svelte-8bdjn9">Créer un compte</h1> <p class="svelte-8bdjn9">Rejoignez la communauté BeninExplore</p></div> <form class="auth-form svelte-8bdjn9"><div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="prenom"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg> Prénom <span class="req svelte-8bdjn9">*</span></label> <input id="prenom" type="text" class="form-input svelte-8bdjn9"${attr("value", form.prenom)} placeholder="Ex : Kouassi" required="" autocomplete="given-name"/></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="nom"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg> Nom de famille <span class="req svelte-8bdjn9">*</span></label> <input id="nom" type="text" class="form-input svelte-8bdjn9"${attr("value", form.nom)} placeholder="Ex : ATTIOGBE" required="" autocomplete="family-name"/></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="email"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> Adresse email <span class="req svelte-8bdjn9">*</span></label> <input id="email" type="email" class="form-input svelte-8bdjn9"${attr("value", form.email)} placeholder="vous@exemple.com" required="" autocomplete="email"/></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="telephone"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"></path></svg> Téléphone <span class="opt svelte-8bdjn9">(optionnel)</span></label> <input id="telephone" type="tel" class="form-input svelte-8bdjn9"${attr("value", form.telephone)} placeholder="+229 97 00 00 00" autocomplete="tel"/></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="password"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><rect width="18" height="11" x="3" y="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Mot de passe <span class="req svelte-8bdjn9">*</span></label> <div class="input-eye svelte-8bdjn9"><input id="password"${attr("type", "password")} class="form-input svelte-8bdjn9"${attr("value", form.password)} placeholder="Min. 8 caractères" required="" minlength="8" autocomplete="new-password"/> <button type="button" class="eye-btn svelte-8bdjn9" tabindex="-1">${escape_html("👁")}</button></div> `);
    if (strengthLabel()()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="strength-bar svelte-8bdjn9"><div class="strength-fill svelte-8bdjn9"${attr_style(`width:${stringify(strength()() * 25)}%;background:${stringify(strengthLabel()()?.color)}`)}></div></div> <span class="strength-label svelte-8bdjn9"${attr_style(`color:${stringify(strengthLabel()()?.color)}`)}>Force : ${escape_html(strengthLabel()()?.label)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="confirm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Confirmer le mot de passe <span class="req svelte-8bdjn9">*</span></label> <div class="input-eye svelte-8bdjn9"><input id="confirm"${attr("type", "password")}${attr_class("form-input svelte-8bdjn9", void 0, {
      "input-error": form.confirmPassword,
      "input-ok": form.confirmPassword
    })}${attr("value", form.confirmPassword)} placeholder="Répétez le mot de passe" required="" autocomplete="new-password"/> <button type="button" class="eye-btn svelte-8bdjn9" tabindex="-1">${escape_html("👁")}</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="field svelte-8bdjn9"><label class="field-label svelte-8bdjn9" for="langue"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-8bdjn9"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"></path></svg> Langue préférée</label> `);
    $$renderer2.select(
      { id: "langue", class: "form-input", value: form.langue },
      ($$renderer3) => {
        $$renderer3.option({ value: "fr" }, ($$renderer4) => {
          $$renderer4.push(`🇫🇷 Français`);
        });
        $$renderer3.option({ value: "en" }, ($$renderer4) => {
          $$renderer4.push(`🇬🇧 English`);
        });
        $$renderer3.option({ value: "es" }, ($$renderer4) => {
          $$renderer4.push(`🇪🇸 Español`);
        });
        $$renderer3.option({ value: "de" }, ($$renderer4) => {
          $$renderer4.push(`🇩🇪 Deutsch`);
        });
      },
      "svelte-8bdjn9"
    );
    $$renderer2.push(`</div> <p class="cgu svelte-8bdjn9">En créant un compte, vous acceptez nos <a href="/mentions-legales" class="svelte-8bdjn9">conditions d'utilisation</a> et notre <a href="/mentions-legales" class="svelte-8bdjn9">politique de confidentialité</a>.</p> <button type="submit" class="btn btn-primary btn-block svelte-8bdjn9"${attr("disabled", isLoading, true)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`🇧🇯 Créer mon compte`);
    }
    $$renderer2.push(`<!--]--></button></form> <div class="auth-divider svelte-8bdjn9"><span>ou</span></div> <p class="auth-switch svelte-8bdjn9">Déjà un compte ? <a href="/auth/login" class="svelte-8bdjn9">Se connecter →</a></p></div></div>`);
  });
}
export {
  _page as default
};
