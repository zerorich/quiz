function isAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
}

module.exports = isAdmin;
