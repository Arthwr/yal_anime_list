const { validateCategoryParam, validateSearchInput } = require("../validators/validators");
const asyncHandler = require("../utils/asyncHandler");
const DatabaseService = require("../../database/services/database-handler.service");
const handleValidationErrors = require("./handleValidationErrors");

module.exports = [
  validateCategoryParam(),
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const category = req.params.category.replace(/-/g, " ");
    const categoriesResult = await DatabaseService.checkCategoryName(category);
    if (!categoriesResult || categoriesResult.length === 0) {
      return res.status(400).send("Requested category doesn't exist");
    }

    res.locals.metaData = await DatabaseService.getMetaData();
    res.locals.formState = {};

    next();
  }),
];
