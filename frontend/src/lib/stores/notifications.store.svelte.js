import { io } from 'socket.io-client';
import { api } from '$lib/api/client.js';

export const notificationsStore = (() => {
  let items = $state([]);
  let socket = null;
  let initialised = false;

  function push(notif) {
    items = [notif, ...items];
  }

  return {
    get items() { return items; },
    get unread() { return items.filter(n => !n.lu).length; },

    async init(userId) {
      if (!userId || initialised) return;
      initialised = true;

      try {
        items = await api.get('/notifications');
      } catch { /* ignore — backend might be cold */ }

      socket = io({ auth: { userId }, transports: ['websocket', 'polling'] });

      socket.on('nouvelle_reservation', (data) => {
        push({
          id: `tmp-${Date.now()}`,
          type: 'nouvelle_reservation',
          titre: 'Nouvelle réservation',
          message: `${data.tourist ?? 'Un touriste'} a réservé "${data.service}"`,
          lien: '/profil/prestataire',
          lu: false,
          createdAt: new Date().toISOString()
        });
      });

      socket.on('statut_reservation', (data) => {
        push({
          id: `tmp-${Date.now()}`,
          type: 'statut_reservation',
          titre: 'Réservation mise à jour',
          message: `Statut : ${data.statut}`,
          lien: '/profil/reservations',
          lu: false,
          createdAt: new Date().toISOString()
        });
      });
    },

    async markAllRead() {
      try { await api.patch('/notifications/tout-lu'); } catch { /* ignore */ }
      items = items.map(n => ({ ...n, lu: true }));
    },

    async markRead(id) {
      if (id.startsWith('tmp-')) {
        items = items.map(n => n.id === id ? { ...n, lu: true } : n);
        return;
      }
      try { await api.patch(`/notifications/${id}/lu`); } catch { /* ignore */ }
      items = items.map(n => n.id === id ? { ...n, lu: true } : n);
    },

    disconnect() {
      if (socket) { socket.disconnect(); socket = null; }
      initialised = false;
    }
  };
})();
