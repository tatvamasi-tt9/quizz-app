const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const token = req.cookies.token; //  read cookie


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, token missing"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();

  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = ensureAuthenticated;

