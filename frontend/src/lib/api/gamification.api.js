import { api } from './client.js';

export const gamificationApi = {
  // Tous les badges disponibles (public)
  badges: () => api.get('/gamification/badges'),

  // Mes badges (utilisateur connecté)
  mesBadges: () => api.get('/gamification/mes-badges'),

  // Mes points et progression
  mesPoints: () => api.get('/gamification/mes-points'),

  // Classement top 10
  classement: () => api.get('/gamification/classement')
};
