const { validationResult } = require("express-validator");
const AppError = require("../../errors/AppError");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError("Validation Error", 400, errors.array()));
  }

  next();
};

module.exports = handleValidationErrors;
