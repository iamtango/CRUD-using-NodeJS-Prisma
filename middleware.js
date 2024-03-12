const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing Token" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden - Invalid Token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
