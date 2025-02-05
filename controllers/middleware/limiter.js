const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 request per window based on IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
