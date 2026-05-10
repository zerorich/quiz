function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user && req.user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

module.exports = isAuthenticated;
