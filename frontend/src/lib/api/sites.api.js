import { api } from './client.js';

export const sitesApi = {
  list: (params) => api.get('/sites', params),
  getBySlug: (slug) => api.get(`/sites/${slug}`),
  forMap: () => api.get('/sites/map'),
  categories: () => api.get('/categories'),
  regions: () => api.get('/regions')
};
