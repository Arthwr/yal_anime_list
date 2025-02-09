const AppError = require("../../errors/AppError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = Array.isArray(err.errors) ? err.errors : null;
  let stack = err.stack;
  let name = err.name;

  if (!(err instanceof AppError)) {
    console.error("Non-AppError caught: ", err);
    if (statusCode === 500) {
      message = "Internal Server Error";
    }
  }

  const response = {
    status: statusCode,
    message: message,
    errors: errors,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    console.error(`[${new Date().toISOString()}] Error:`, {
      name: name,
      status: statusCode,
      message: message,
      stack: stack,
      errors: errors ? err.errors.map((error) => error.msg) : null,
    });
  }

  res.status(response.status).render("error", { response });
};

module.exports = errorHandler;
