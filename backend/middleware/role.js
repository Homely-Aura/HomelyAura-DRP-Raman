// TODO: middleware
/**
 * Middleware to restrict access based on user role(s).
 * Usage: requireRole('admin'), requireRole('subadmin','admin'), etc.
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};
