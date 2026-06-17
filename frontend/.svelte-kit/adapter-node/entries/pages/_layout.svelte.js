import { a as attr_class, b as ensure_array_like, c as attr, d as store_get, e as escape_html, u as unsubscribe_stores, f as derived, h as stringify, i as head } from "../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { p as page } from "../../chunks/stores.js";
import { a as authStore } from "../../chunks/auth.store.svelte.js";
import "clsx";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import { o as onDestroy } from "../../chunks/index-server.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function getApiBaseUrl() {
  const raw = "";
  return raw.replace(/\/$/, "");
}
function normalizeAssetUrls(value, baseUrl) {
  if (typeof value === "string") {
    if (value.startsWith("/uploads/") || value.startsWith("/api/")) {
      return `${baseUrl}${value}`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAssetUrls(item, baseUrl));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeAssetUrls(item, baseUrl)])
    );
  }
  return value;
}
function getToken() {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("benin_token");
}
async function apiFetch(path, options = {}) {
  const token = getToken();
  const apiBaseUrl = getApiBaseUrl();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let res;
  try {
    const url = `${apiBaseUrl}/api${path}`;
    res = await fetch(url, { ...options, headers });
  } catch {
    throw new Error("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
  }
  if (res.status === 401) {
    localStorage.removeItem("benin_token");
    localStorage.removeItem("benin_user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
  const data = res.headers.get("content-type")?.includes("application/json") ? await res.json() : await res.text();
  const normalizedData = typeof data === "string" ? data : normalizeAssetUrls(data, getApiBaseUrl());
  if (!res.ok) throw new Error(normalizedData?.error || `Erreur ${res.status}`);
  return normalizedData;
}
const api = {
  get: (path, params) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path;
    return apiFetch(url);
  },
  post: (path, body) => apiFetch(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: "DELETE" })
};
const notificationsStore = /* @__PURE__ */ (() => {
  let items = [];
  let socket = null;
  let initialised = false;
  function push(notif) {
    items = [notif, ...items];
  }
  return {
    get items() {
      return items;
    },
    get unread() {
      return items.filter((n) => !n.lu).length;
    },
    async init(userId) {
      if (!userId || initialised) return;
      initialised = true;
      try {
        items = await api.get("/notifications");
      } catch {
      }
      socket = io({ auth: { userId }, transports: ["websocket", "polling"] });
      socket.on("nouvelle_reservation", (data) => {
        push({
          id: `tmp-${Date.now()}`,
          type: "nouvelle_reservation",
          titre: "Nouvelle réservation",
          message: `${data.tourist ?? "Un touriste"} a réservé "${data.service}"`,
          lien: "/profil/prestataire",
          lu: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      });
      socket.on("statut_reservation", (data) => {
        push({
          id: `tmp-${Date.now()}`,
          type: "statut_reservation",
          titre: "Réservation mise à jour",
          message: `Statut : ${data.statut}`,
          lien: "/profil/reservations",
          lu: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      });
    },
    async markAllRead() {
      try {
        await api.patch("/notifications/tout-lu");
      } catch {
      }
      items = items.map((n) => ({ ...n, lu: true }));
    },
    async markRead(id) {
      if (id.startsWith("tmp-")) {
        items = items.map((n) => n.id === id ? { ...n, lu: true } : n);
        return;
      }
      try {
        await api.patch(`/notifications/${id}/lu`);
      } catch {
      }
      items = items.map((n) => n.id === id ? { ...n, lu: true } : n);
    },
    disconnect() {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      initialised = false;
    }
  };
})();
function getSessionId() {
  if (typeof localStorage === "undefined") return v4();
  let id = localStorage.getItem("benin_chat_session");
  if (!id) {
    id = v4();
    localStorage.setItem("benin_chat_session", id);
  }
  return id;
}
const welcomeMessages = {
  fr: "Bonjour ! Je suis **BeninGuide**, votre assistant pour découvrir le Bénin. Comment puis-je vous aider ?",
  en: "Hello! I'm **BeninGuide**, your assistant to explore Benin. How can I help you?",
  es: "¡Hola! Soy **BeninGuide**, tu asistente para explorar Benín. ¿Cómo puedo ayudarte?",
  de: "Hallo! Ich bin **BeninGuide**, Ihr Assistent für Benin. Wie kann ich Ihnen helfen?"
};
const chatStore = (() => {
  let isOpen = false;
  let isLoading = false;
  let messages = [];
  let sessionId = getSessionId();
  let hasNewMessage = false;
  let langue = "fr";
  return {
    get isOpen() {
      return isOpen;
    },
    get isLoading() {
      return isLoading;
    },
    get messages() {
      return messages;
    },
    get sessionId() {
      return sessionId;
    },
    get hasNewMessage() {
      return hasNewMessage;
    },
    get langue() {
      return langue;
    },
    setLangue(l) {
      langue = l;
    },
    open(lang = "fr") {
      langue = lang;
      isOpen = true;
      hasNewMessage = false;
      if (messages.length === 0) {
        messages = [
          {
            id: v4(),
            role: "assistant",
            content: welcomeMessages[lang] || welcomeMessages.fr,
            timestamp: /* @__PURE__ */ new Date()
          }
        ];
      }
    },
    close() {
      isOpen = false;
    },
    toggle(lang) {
      isOpen ? this.close() : this.open(lang || langue);
    },
    async sendMessage(content) {
      if (!content.trim() || isLoading) return;
      messages = [
        ...messages,
        { id: v4(), role: "user", content, timestamp: /* @__PURE__ */ new Date() }
      ];
      isLoading = true;
      const assistantId = v4();
      messages = [
        ...messages,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: /* @__PURE__ */ new Date(),
          isStreaming: true
        }
      ];
      try {
        const token = typeof localStorage !== "undefined" ? localStorage.getItem("benin_token") : null;
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...token ? { Authorization: `Bearer ${token}` } : {}
          },
          body: JSON.stringify({ message: content, sessionId, langue })
        });
        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                messages = messages.map((m) => m.id === assistantId ? { ...m, content: m.content + data.text } : m);
              }
              if (data.error) {
                messages = messages.map((m) => m.id === assistantId ? { ...m, content: data.error, isError: true, isStreaming: false } : m);
              }
              if (data.done) {
                messages = messages.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m);
                if (!isOpen) hasNewMessage = true;
              }
            } catch {
            }
          }
        }
      } catch (err) {
        messages = messages.map((m) => m.id === assistantId ? {
          ...m,
          content: "Désolé, je rencontre un problème technique. Réessayez dans un instant.",
          isError: true,
          isStreaming: false
        } : m);
      } finally {
        isLoading = false;
        messages = messages.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m);
      }
    },
    clearHistory() {
      messages = [];
      sessionId = v4();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("benin_chat_session", sessionId);
      }
    }
  };
})();
function getLang() {
  if (typeof localStorage === "undefined") return "fr";
  return localStorage.getItem("benin_lang") || "fr";
}
const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" }
];
const langStore = (() => {
  let _lang = getLang();
  return {
    get current() {
      return _lang;
    },
    get flag() {
      return LANGUAGES.find((l) => l.code === _lang)?.flag ?? "🌐";
    },
    set(l) {
      _lang = l;
      if (typeof localStorage !== "undefined") localStorage.setItem("benin_lang", l);
    }
  };
})();
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isMenuOpen = false;
    let isScrolled = false;
    let showLang = false;
    const isHeroPage = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname === "/");
    const heroMode = derived(() => isHeroPage() && !isScrolled);
    const navLinks = [
      { href: "/sites", label: "Destinations" },
      { href: "/map", label: "Carte" },
      { href: "/prestataires", label: "Services" },
      { href: "/reservations", label: "Réservations" },
      { href: "/blog", label: "Blog" },
      { href: "/urgence", label: "Urgences" }
    ];
    onDestroy(() => {
    });
    $$renderer2.push(`<header${attr_class("navbar svelte-1n8e4t1", void 0, { "scrolled": isScrolled, "hero-mode": heroMode() })}><div class="container nav-inner svelte-1n8e4t1"><a href="/" class="logo svelte-1n8e4t1"><span class="logo-flag svelte-1n8e4t1">🇧🇯</span> <span class="logo-text svelte-1n8e4t1">Benin<strong class="svelte-1n8e4t1">Explore</strong></span></a> <nav${attr_class("nav-links svelte-1n8e4t1", void 0, { "open": isMenuOpen })} aria-label="Navigation principale"><!--[-->`);
    const each_array = ensure_array_like(navLinks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr("href", link.href)}${attr_class("nav-link svelte-1n8e4t1", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(link.href)
      })}>${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="nav-actions svelte-1n8e4t1">`);
    if (authStore.isLoggedIn) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="notif-wrapper svelte-1n8e4t1"><button class="notif-btn svelte-1n8e4t1" aria-label="Notifications"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> `);
      if (notificationsStore.unread > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="notif-badge svelte-1n8e4t1">${escape_html(notificationsStore.unread > 9 ? "9+" : notificationsStore.unread)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <a href="/profil" class="btn btn-ghost nav-avatar svelte-1n8e4t1"><span class="avatar-circle svelte-1n8e4t1">${escape_html(authStore.user?.prenom?.[0])}${escape_html(authStore.user?.nom?.[0])}</span> <span class="nav-username svelte-1n8e4t1">${escape_html(authStore.user?.prenom)}</span></a> `);
      if (authStore.isPrestataire) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="/profil/prestataire" class="btn btn-outline btn-sm svelte-1n8e4t1">Mon espace</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (authStore.isAdmin) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="/admin" class="btn btn-outline btn-sm svelte-1n8e4t1">Admin</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn btn-ghost btn-sm svelte-1n8e4t1">Déconnexion</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a href="/devenir-prestataire" class="btn btn-ghost btn-sm svelte-1n8e4t1">Devenir prestataire</a> <a href="/auth/login" class="btn btn-ghost btn-sm svelte-1n8e4t1">Connexion</a> <a href="/auth/register" class="btn btn-primary btn-sm svelte-1n8e4t1">S'inscrire</a>`);
    }
    $$renderer2.push(`<!--]--> <div class="lang-wrapper svelte-1n8e4t1"><button class="lang-btn svelte-1n8e4t1" aria-label="Changer de langue"${attr("aria-expanded", showLang)}><span class="lang-flag svelte-1n8e4t1">${escape_html(langStore.flag)}</span> <span class="lang-code svelte-1n8e4t1">${escape_html(langStore.current.toUpperCase())}</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button${attr_class("menu-toggle svelte-1n8e4t1", void 0, { "open": isMenuOpen })}${attr("aria-label", "Ouvrir le menu")}${attr("aria-expanded", isMenuOpen)}><span class="svelte-1n8e4t1"></span><span class="svelte-1n8e4t1"></span><span class="svelte-1n8e4t1"></span></button></div></div></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<footer class="footer svelte-7lfk2o"><div class="container footer-inner svelte-7lfk2o"><div class="footer-brand svelte-7lfk2o"><div class="footer-logo svelte-7lfk2o">🇧🇯 Benin<strong class="svelte-7lfk2o">Explore</strong></div> <p class="svelte-7lfk2o">Découvrez la richesse culturelle, historique et naturelle du Bénin — la patrie du Vodoun et du Royaume de Danhomè.</p></div> <nav class="footer-nav svelte-7lfk2o"><h4 class="svelte-7lfk2o">Destinations</h4> <a href="/sites?categorie=historique" class="svelte-7lfk2o">Sites historiques</a> <a href="/sites?categorie=naturel" class="svelte-7lfk2o">Nature &amp; Faune</a> <a href="/sites?categorie=plage" class="svelte-7lfk2o">Plages</a> <a href="/map" class="svelte-7lfk2o">Carte interactive</a></nav> <nav class="footer-nav svelte-7lfk2o"><h4 class="svelte-7lfk2o">Voyager</h4> <a href="/reservations" class="svelte-7lfk2o">Réservations</a> <a href="/blog" class="svelte-7lfk2o">Articles &amp; Itinéraires</a> <a href="/urgence" class="svelte-7lfk2o">Contacts d'urgence</a> <a href="/auth/register" class="svelte-7lfk2o">Créer un compte</a></nav> <div class="footer-emergency svelte-7lfk2o"><h4 class="svelte-7lfk2o">🚨 Urgences Bénin</h4> <p class="svelte-7lfk2o"><strong class="svelte-7lfk2o">Police</strong> : 117</p> <p class="svelte-7lfk2o"><strong class="svelte-7lfk2o">SAMU</strong> : 161</p> <p class="svelte-7lfk2o"><strong class="svelte-7lfk2o">Pompiers</strong> : 118</p></div></div> <div class="footer-bottom svelte-7lfk2o"><div class="container footer-bottom-inner svelte-7lfk2o"><p class="svelte-7lfk2o">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} BeninExplore. Fait avec ❤️ pour le Bénin.</p> <p class="svelte-7lfk2o">Chatbot propulsé par <strong class="svelte-7lfk2o">Claude AI</strong> (Anthropic)</p></div></div></footer>`);
  });
}
function ChatButton($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="chat-button-wrapper svelte-1ngml4t">`);
    if (chatStore.hasNewMessage) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="new-dot svelte-1ngml4t" aria-hidden="true"></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button${attr_class("chat-fab svelte-1ngml4t", void 0, { "is-open": chatStore.isOpen })}${attr("aria-label", chatStore.isOpen ? "Fermer BeninGuide" : "Ouvrir BeninGuide")}>`);
    if (chatStore.isOpen) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1ngml4t"><path d="M18 6L6 18M6 6l12 12" class="svelte-1ngml4t"></path></svg>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="svelte-1ngml4t"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" class="svelte-1ngml4t"></path></svg> <span class="fab-label svelte-1ngml4t">BeninGuide</span>`);
    }
    $$renderer2.push(`<!--]--></button></div>`);
  });
}
function ChatMessage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { message } = $$props;
    function renderMarkdown(text) {
      if (!text) return "";
      return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>").replace(/\n/g, "<br>");
    }
    $$renderer2.push(`<div${attr_class("message svelte-h4cdis", void 0, {
      "user": message.role === "user",
      "assistant": message.role === "assistant",
      "error": message.isError,
      "streaming": message.isStreaming
    })}>`);
    if (message.role === "assistant") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="avatar svelte-h4cdis">🇧🇯</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bubble svelte-h4cdis">`);
    if (message.content) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="svelte-h4cdis">${html(renderMarkdown(message.content))}`);
      if (message.isStreaming) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="cursor svelte-h4cdis"></span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></p>`);
    } else if (message.isStreaming) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="svelte-h4cdis"><span class="cursor svelte-h4cdis"></span></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!message.isStreaming) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<time class="timestamp svelte-h4cdis">${escape_html(new Date(message.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))}</time>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function ChatTyping($$renderer) {
  $$renderer.push(`<div class="typing svelte-1h0kdei"><div class="avatar svelte-1h0kdei">🇧🇯</div> <div class="bubble svelte-1h0kdei"><span class="svelte-1h0kdei"></span><span class="svelte-1h0kdei"></span><span class="svelte-1h0kdei"></span></div></div>`);
}
function ChatQuickActions($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { actions = [] } = $$props;
    $$renderer2.push(`<div class="quick-actions svelte-1txoht3"><p class="label svelte-1txoht3">Questions fréquentes :</p> <div class="actions-list svelte-1txoht3"><!--[-->`);
    const each_array = ensure_array_like(actions);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let action = each_array[$$index];
      $$renderer2.push(`<button class="quick-btn svelte-1txoht3">${escape_html(action.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function ChatPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let inputValue = "";
    const quickActions = [
      {
        label: "🗺️ Sites incontournables",
        query: "Quels sont les sites incontournables au Bénin ?"
      },
      {
        label: "🏨 Hébergements",
        query: "Recommande-moi des hôtels au Bénin"
      },
      {
        label: "📅 Meilleure période",
        query: "Quelle est la meilleure période pour visiter le Bénin ?"
      },
      {
        label: "🛂 Visa requis ?",
        query: "Ai-je besoin d'un visa pour aller au Bénin ?"
      },
      {
        label: "🚨 Numéros d'urgence",
        query: "Quels sont les numéros d'urgence au Bénin ?"
      }
    ];
    if (chatStore.isOpen) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="chat-overlay svelte-1xwj6s7" role="none"></div> <aside class="chat-panel svelte-1xwj6s7" aria-label="Assistant BeninGuide"><header class="chat-header svelte-1xwj6s7"><div class="chat-header-info svelte-1xwj6s7"><div class="chat-avatar svelte-1xwj6s7">🇧🇯</div> <div><h3 class="svelte-1xwj6s7">BeninGuide</h3> <p class="chat-status svelte-1xwj6s7"><span class="status-dot svelte-1xwj6s7"></span>En ligne</p></div></div> <div class="chat-header-actions svelte-1xwj6s7"><button class="icon-btn svelte-1xwj6s7" title="Nouvelle conversation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"></path></svg></button> <button class="icon-btn svelte-1xwj6s7" title="Fermer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div></header> <div class="chat-messages svelte-1xwj6s7"><!--[-->`);
      const each_array = ensure_array_like(chatStore.messages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let message = each_array[$$index];
        ChatMessage($$renderer2, { message });
      }
      $$renderer2.push(`<!--]--> `);
      if (chatStore.isLoading && !chatStore.messages.some((m) => m.isStreaming && m.content?.length > 0)) {
        $$renderer2.push("<!--[0-->");
        ChatTyping($$renderer2);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (chatStore.messages.length <= 1 && !chatStore.isLoading) {
        $$renderer2.push("<!--[0-->");
        ChatQuickActions($$renderer2, { actions: quickActions });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <footer class="chat-footer svelte-1xwj6s7"><div class="chat-input-wrapper svelte-1xwj6s7"><textarea placeholder="Posez votre question sur le Bénin..." rows="1" class="chat-input svelte-1xwj6s7"${attr("disabled", chatStore.isLoading, true)}>`);
      const $$body = escape_html(inputValue);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea> <button class="send-btn svelte-1xwj6s7"${attr("disabled", !inputValue.trim() || chatStore.isLoading, true)} aria-label="Envoyer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button></div> <p class="powered-by svelte-1xwj6s7">Propulsé par <strong class="svelte-1xwj6s7">Claude AI</strong></p></footer></aside>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const toastStore = /* @__PURE__ */ (() => {
  let toasts = [];
  function add(message, type = "info", duration = 4e3) {
    const id = v4();
    toasts = [...toasts, { id, message, type }];
    if (duration > 0) setTimeout(() => remove(id), duration);
    return id;
  }
  function remove(id) {
    toasts = toasts.filter((t) => t.id !== id);
  }
  return {
    get toasts() {
      return toasts;
    },
    success: (msg, d) => add(msg, "success", d),
    error: (msg, d) => add(msg, "error", d || 6e3),
    info: (msg, d) => add(msg, "info", d),
    warning: (msg, d) => add(msg, "warning", d),
    remove
  };
})();
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="toasts svelte-zemmny" role="region" aria-label="Notifications"><!--[-->`);
    const each_array = ensure_array_like(toastStore.toasts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`toast toast-${stringify(toast.type)}`, "svelte-zemmny")} role="alert"><span class="toast-icon">`);
      if (toast.type === "success") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`✅`);
      } else if (toast.type === "error") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`❌`);
      } else if (toast.type === "warning") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`⚠️`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`ℹ️`);
      }
      $$renderer2.push(`<!--]--></span> <p class="svelte-zemmny">${escape_html(toast.message)}</p> <button class="toast-close svelte-zemmny">✕</button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="description" content="BeninExplore — Découvrez le Bénin : Ganvié, Ouidah, Abomey, Pendjari. Réservez vos guides, hébergements et activités en ligne."/> <meta property="og:site_name" content="BeninExplore"/> <meta property="og:type" content="website"/>`);
    });
    Navbar($$renderer2);
    $$renderer2.push(`<!----> <main id="main-content" style="min-height: 100vh; padding-top: var(--nav-h);">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main> `);
    Footer($$renderer2);
    $$renderer2.push(`<!----> `);
    ChatButton($$renderer2);
    $$renderer2.push(`<!----> `);
    ChatPanel($$renderer2);
    $$renderer2.push(`<!----> `);
    Toast($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
