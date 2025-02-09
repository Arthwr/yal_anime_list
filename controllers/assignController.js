const { validateCategoryAndTitleId } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const handleValidationErrors = require("./middleware/handleValidationErrors");
const DatabaseService = require("../database/services/database-handler.service");

const assignPostCategory = [
  validateCategoryAndTitleId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { categoryName, titleId } = req.body;

    if (!titleId) {
      return res.status(400).json({ error: "missing title id" });
    }

    if (!categoryName) {
      return res.status(400).json({ error: "missing category name" });
    }

    const result =
      categoryName === "Unassigned"
        ? await DatabaseService.assignTitleToCategory(null, titleId)
        : await DatabaseService.assignTitleToCategory(categoryName, titleId);

    return res.status(200).send(result);
  }),
];

module.exports = { assignPostCategory };
