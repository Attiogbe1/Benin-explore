import { Server as SocketServer } from 'socket.io';

let io;

function normalizeOrigin(value) {
  return value?.trim().replace(/\/$/, '');
}

export function initSocket(httpServer) {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ALLOWED_ORIGINS,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
    .flatMap(value => String(value || '').split(',').map(item => item.trim()).filter(Boolean))
    .map(normalizeOrigin)
    .filter(Boolean);

  const allowedOriginSet = new Set(allowedOrigins);

  io = new SocketServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const normalizedOrigin = normalizeOrigin(origin);
        if (allowedOriginSet.has(normalizedOrigin)) {
          return callback(null, true);
        }

        return callback(new Error('Origin not allowed by Socket.IO CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('disconnect', () => {});
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io non initialisé');
  return io;
}

export function notifyUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}
