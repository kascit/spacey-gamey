const { verifyToken } = require("../utils/jwt.utils");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    return next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = { protect };
