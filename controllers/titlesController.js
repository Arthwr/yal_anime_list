const { validationResult } = require("express-validator");
const { validatePageParam, validateCategoryParam } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const DatabaseService = require("../database/services/database-handler.service");

const getTitles = [
  validatePageParam(),
  validateCategoryParam(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageNumber = req.params.page;
    const categoryName = req.params.category;

    try {
      // We load 20 more titles starting from default 50 already rendered on the page on each request
      const offset = 50 + 20 * (pageNumber - 1);
      const titles = await DatabaseService.getMoreTitles(categoryName, offset);

      if (titles.length === 0) {
        return res.json({ html: "", noMoreItems: true });
      }

      res.render("partials/titles", { titles }, (error, html) => {
        if (error) {
          console.error("Error rendering titles: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        return res.json({ html, noMoreItems: false });
      });
    } catch (error) {
      console.error("Error fetching paginated titles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }),
];

module.exports = { getTitles };
