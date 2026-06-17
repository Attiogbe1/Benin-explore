import { api } from './client.js';

export const servicesApi = {
  // Liste publique des services
  list: (params) => api.get('/services', params),

  // Détail d'un service
  getById: (id) => api.get(`/services/${id}`),

  // Mes services (prestataire connecté)
  mesServices: () => api.get('/services/mes-services'),

  // Créer un service
  create: (data) => api.post('/services', data),

  // Modifier un service
  update: (id, data) => api.put(`/services/${id}`, data),

  // Activer / désactiver un service
  toggleDisponibilite: (id) => api.patch(`/services/${id}/disponibilite`),

  // Supprimer un service
  delete: (id) => api.delete(`/services/${id}`)
};
