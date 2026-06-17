function loadUser() {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem("benin_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
const authStore = (() => {
  let user = loadUser();
  let token = typeof localStorage !== "undefined" ? localStorage.getItem("benin_token") : null;
  return {
    get user() {
      return user;
    },
    get token() {
      return token;
    },
    get isLoggedIn() {
      return !!user && !!token;
    },
    get isAdmin() {
      return user?.role === "ADMIN";
    },
    get isPrestataire() {
      return user?.role === "PRESTATAIRE" || user?.role === "ADMIN";
    },
    login(newToken, newUser) {
      token = newToken;
      user = newUser;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("benin_token", newToken);
        localStorage.setItem("benin_user", JSON.stringify(newUser));
      }
    },
    logout() {
      token = null;
      user = null;
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("benin_token");
        localStorage.removeItem("benin_user");
      }
    },
    updateUser(data) {
      user = { ...user, ...data };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("benin_user", JSON.stringify(user));
      }
    }
  };
})();

export { authStore as a };
//# sourceMappingURL=auth.store.svelte-BLHQ1sTo.js.map
