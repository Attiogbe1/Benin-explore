import { api } from './client.js';

export const chatApi = {
  sendMessage: (message, sessionId, langue) =>
    api.post('/chat/message', { message, sessionId, langue }),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  clearSession: (sessionId) => api.delete(`/chat/session/${sessionId}`)
};
