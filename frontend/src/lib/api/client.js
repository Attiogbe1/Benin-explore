// Wrapper fetch avec gestion auth et erreurs

function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL || '';
  return raw.replace(/\/$/, '');
}

function normalizeAssetUrls(value, baseUrl) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/') || value.startsWith('/api/')) {
      return `${baseUrl}${value}`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => normalizeAssetUrls(item, baseUrl));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeAssetUrls(item, baseUrl)])
    );
  }

  return value;
}

function getToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('benin_token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const apiBaseUrl = getApiBaseUrl();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    const url = `${apiBaseUrl}/api${path}`;
    res = await fetch(url, { ...options, headers });
  } catch {
    throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
  }

  if (res.status === 401) {
    localStorage.removeItem('benin_token');
    localStorage.removeItem('benin_user');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  const data = res.headers.get('content-type')?.includes('application/json')
    ? await res.json()
    : await res.text();

  const normalizedData = typeof data === 'string'
    ? data
    : normalizeAssetUrls(data, getApiBaseUrl());

  if (!res.ok) throw new Error(normalizedData?.error || `Erreur ${res.status}`);
  return normalizedData;
}

export const api = {
  get: (path, params) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path;
    return apiFetch(url);
  },
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' })
};
