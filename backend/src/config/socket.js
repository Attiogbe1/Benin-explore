import { Server as SocketServer } from 'socket.io';

let io;

export function initSocket(httpServer) {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
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
