const asyncHandler = require("../utils/asyncHandler");
const DataBaseService = require("../database/services/database-handler.service");

const indexGet = asyncHandler(async (req, res) => {
  const category = req.params.category ? decodeURIComponent(req.params.category).replace(/-/g, " ") : "everything";
  if (category !== "everything") {
    const categoriesResult = await DataBaseService.checkCategoryName(category);
    if (!categoriesResult || categoriesResult.length === 0) {
      return res.status(404).send("The requested category doesn't exist");
    }
  }

  const titles = await DataBaseService.getTitlesByCategory(category);
  const { statuses, years, genres, categories } = await DataBaseService.getMetaData();

  res.render("index", { titles, statuses, years, genres, categories });
});

module.exports = { indexGet };
