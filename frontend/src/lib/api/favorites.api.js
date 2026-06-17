import { api } from './client.js';

export const favoritesApi = {
  list: () => api.get('/favorites'),
  toggle: (siteId) => api.post('/favorites/toggle', { siteId }),
  check: (siteId) => api.get(`/favorites/check/${siteId}`)
};
