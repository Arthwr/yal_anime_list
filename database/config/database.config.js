module.exports = {
  CONNECTION: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 5432,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_NAME,
  },
};
