import { api } from './client.js';

export const providersApi = {
  // Liste publique des prestataires vérifiés
  list: (params) => api.get('/providers', params),

  // Profil public d'un prestataire
  getById: (id) => api.get(`/providers/${id}`),

  // Mon profil prestataire (utilisateur connecté)
  monProfil: () => api.get('/providers/mon-profil'),

  // Mes réservations reçues (prestataire)
  mesReservations: (params) => api.get('/providers/mes-reservations', params),

  // Mes statistiques (prestataire)
  stats: () => api.get('/providers/stats'),

  // Devenir prestataire
  create: (data) => api.post('/providers', data),

  // Modifier mon profil prestataire
  update: (id, data) => api.put(`/providers/${id}`, data)
};
