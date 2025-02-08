const { validateCategoryParam } = require("../validators/validators");
const asyncHandler = require("../utils/asyncHandler");
const DatabaseService = require("../../database/services/database-handler.service");
const handleValidationErrors = require("./handleValidationErrors");
const AppError = require("../../errors/AppError");

module.exports = [
  validateCategoryParam(),
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const category = req.params.category.replace(/-/g, " ");
    const categoriesResult = await DatabaseService.getCategoryName(category);
    if (!categoriesResult || categoriesResult.length === 0) {
      return next(new AppError(`Requested category '${category}' doesn't exist`, 400));
    }

    res.locals.metaData = await DatabaseService.getMetaData();
    res.locals.formState = {};
    next();
  }),
];
