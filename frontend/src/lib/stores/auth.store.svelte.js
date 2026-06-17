// Store auth — Svelte 5 runes

function loadUser() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem('benin_user');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export const authStore = (() => {
  let user = $state(loadUser());
  let token = $state(typeof localStorage !== 'undefined' ? localStorage.getItem('benin_token') : null);

  return {
    get user() { return user; },
    get token() { return token; },
    get isLoggedIn() { return !!user && !!token; },
    get isAdmin() { return user?.role === 'ADMIN'; },
    get isPrestataire() { return user?.role === 'PRESTATAIRE' || user?.role === 'ADMIN'; },

    login(newToken, newUser) {
      token = newToken;
      user = newUser;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('benin_token', newToken);
        localStorage.setItem('benin_user', JSON.stringify(newUser));
      }
    },

    logout() {
      token = null;
      user = null;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('benin_token');
        localStorage.removeItem('benin_user');
      }
    },

    updateUser(data) {
      user = { ...user, ...data };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('benin_user', JSON.stringify(user));
      }
    }
  };
})();
