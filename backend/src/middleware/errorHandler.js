export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);
  }

  // Prisma constraint / not-found errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Cette ressource existe déjà' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Ressource introuvable' });
  }

  // Database connection errors (Neon cold-start, socket closed, ECONNRESET)
  if (
    err.code === 'P1001' || err.code === 'P1002' ||
    err.message?.includes('socket') ||
    err.message?.includes('ECONNRESET') ||
    err.message?.includes('Connection refused') ||
    err.message?.includes('closed unexpectedly')
  ) {
    return res.status(503).json({
      error: 'Service temporairement indisponible. Veuillez réessayer dans quelques secondes.'
    });
  }

  res.status(status).json({
    error: status === 500 ? 'Erreur interne du serveur' : err.message
  });
}
