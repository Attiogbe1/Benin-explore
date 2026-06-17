import { api } from './client.js';

export const adminApi = {
  // ── Dashboard ────────────────────────────────────────
  stats: () => api.get('/admin/stats'),

  // ── Utilisateurs ─────────────────────────────────────
  users: (params) => api.get('/admin/utilisateurs', params),
  toggleUserStatus: (id) => api.patch(`/admin/utilisateurs/${id}/statut`),

  // ── Prestataires ─────────────────────────────────────
  providers: (params) => api.get('/admin/prestataires', params),
  verifyProvider: (id, estVerifie) => api.patch(`/admin/prestataires/${id}/verifier`, { estVerifie }),
  deleteProvider: (id) => api.delete(`/admin/prestataires/${id}`),

  // ── Services ─────────────────────────────────────────
  services: (params) => api.get('/admin/services', params),
  deleteService: (id) => api.delete(`/admin/services/${id}`),

  // ── Sites touristiques ────────────────────────────────
  createSite: (data) => api.post('/admin/sites', data),
  updateSite: (id, data) => api.put(`/admin/sites/${id}`, data),
  deleteSite: (id) => api.delete(`/admin/sites/${id}`),

  // ── Réservations ─────────────────────────────────────
  reservations: (params) => api.get('/admin/reservations', params),

  // ── Avis ─────────────────────────────────────────────
  pendingReviews: () => api.get('/admin/avis-en-attente'),
  approveReview: (id) => api.patch(`/admin/avis/${id}/approuver`),
  deleteReview: (id) => api.delete(`/admin/avis/${id}`),

  // ── Blog ─────────────────────────────────────────────
  allPosts: (params) => api.get('/admin/blog', params),
  createPost: (data) => api.post('/admin/blog', data),
  updatePost: (id, data) => api.put(`/admin/blog/${id}`, data),
  deletePost: (id) => api.delete(`/admin/blog/${id}`),

  // ── Alertes sécurité ─────────────────────────────────
  alertes: () => api.get('/admin/alertes'),
  createAlerte: (data) => api.post('/admin/alertes', data),
  updateAlerte: (id, data) => api.patch(`/admin/alertes/${id}`, data),
  deleteAlerte: (id) => api.delete(`/admin/alertes/${id}`),

  // ── Badges / Gamification ─────────────────────────────
  badges: () => api.get('/admin/badges'),
  createBadge: (data) => api.post('/admin/badges', data),
  awardBadge: (userId, badgeId) => api.post(`/admin/badges/${userId}/attribuer`, { badgeId }),

  // ── Catégories ───────────────────────────────────────
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),

  // ── Régions ──────────────────────────────────────────
  createRegion: (data) => api.post('/admin/regions', data),
  updateRegion: (id, data) => api.put(`/admin/regions/${id}`, data)
};
