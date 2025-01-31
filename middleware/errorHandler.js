const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const response = {
    message: err.message || "Internal Server Error",
    path: req.path,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    console.error(`[${new Date().toISOString()}] ${err.stack}`);
  }

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
