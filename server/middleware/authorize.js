module.exports = (role) => {
    return (req, res, next) => {
      if (!req.session.role || req.session.role !== role) {
        return res.status(403).json({ error: "Forbidden: Access denied." });
      }
      next();
    };
  };
  