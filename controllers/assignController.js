const { validateCategoryAndTitleId } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const handleValidationErrors = require("./middleware/handleValidationErrors");
const DatabaseService = require("../database/services/database-handler.service");

const assignPostCategory = [
  validateCategoryAndTitleId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { categoryName, titleId } = req.body;

    if (!categoryName || !titleId) {
      return res.status(400).json({ error: "missing title id or category name" });
    }

    const result = await DatabaseService.assignTitleToCategory(categoryName, titleId);
    res.status(200).send(result);
  }),
];

module.exports = { assignPostCategory };
