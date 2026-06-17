import { api } from './client.js';

export const reservationsApi = {
  create: (data) => api.post('/reservations', data),
  list: () => api.get('/reservations/mes-reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  cancel: (id) => api.patch(`/reservations/${id}/annuler`)
};
