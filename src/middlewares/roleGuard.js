// src/middlewares/roleGuard.js

/**
 * restrictTo(...)
 *   Accepts one or more allowed roles and returns an Express middleware.
 *
 *   Example:
 *     router.post('/admin-route', protect, restrictTo('admin'), handler)
 *     router.get('/vendor-or-admin', protect, restrictTo('vendor', 'admin'), handler)
 */
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req; // assumes `protect` already attached req.user
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: only [${allowedRoles.join(', ')}] allowed`,
      });
    }
    next();
  };
};

export { restrictTo };
