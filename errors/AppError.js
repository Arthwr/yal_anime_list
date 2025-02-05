class AppError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
