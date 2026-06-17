// Wraps async Express route handlers so errors are forwarded to next(err)
// instead of becoming unhandled rejections that crash the process in Node 22.
export const ah = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
