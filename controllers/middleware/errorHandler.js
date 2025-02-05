const AppError = require("../../errors/AppError");

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    err = new AppError("Internal Server Error", 500);
  }

  const response = {
    status: err.status || 500,
    message: err.message || "Internal server error",
    errors: Array.isArray(err.errors) ? err.errors : null,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    console.error(`[${new Date().toISOString()}] Error:`, {
      name: err.name,
      status: err.status,
      message: err.message,
      stack: err.stack,
      errors: err.errors ? err.errors.map((error) => error.msg) : null,
    });
  }

  res.status(response.status).render("error", { response });
};

module.exports = errorHandler;
