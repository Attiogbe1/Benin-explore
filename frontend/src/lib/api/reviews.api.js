import { api } from './client.js';

export const reviewsApi = {
  create: (data) => api.post('/reviews', data),
  bySite: (siteId, params) => api.get(`/reviews/site/${siteId}`, params)
};
