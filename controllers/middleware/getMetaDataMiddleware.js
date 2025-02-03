const { validateCategoryParam } = require("../validators/validators");
const asyncHandler = require("../utils/asyncHandler");
const DatabaseService = require("../../database/services/database-handler.service");

module.exports = [
  validateCategoryParam(),
  asyncHandler(async (req, res, next) => {
    const category = req.params.category.replace(/-/g, " ");
    const categoriesResult = await DatabaseService.checkCategoryName(category);
    if (!categoriesResult || categoriesResult.length === 0) {
      const error = new Error("Requested category doesn't exist");
      error.status = 404;
      return next(error);
    }

    res.locals.metaData = await DatabaseService.getMetaData();
    res.locals.formState = {};

    next();
  }),
];
