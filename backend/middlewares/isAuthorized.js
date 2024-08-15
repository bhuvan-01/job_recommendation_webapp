
const isAuthorized = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'employer')) {
      next();
  } else {
      res.status(403).json({ message: 'Access denied. Requires admin or employer role.' });
  }
};
