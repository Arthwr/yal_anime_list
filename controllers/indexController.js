const asyncHandler = require("../utils/asyncHandler");
const DataBaseService = require("../database/services/database-handler.service");

const indexGetMain = asyncHandler(async (req, res) => {
  const titles = await DataBaseService.getTitlesByCategory("Everything");
  res.render("index", { titles });
});

const indexGetCategory = asyncHandler(async (req, res) => {
  const category = decodeURIComponent(req.params.category).replace(/-/g, " ");
  const categoriesResult = await DataBaseService.checkCategoryName(category);

  if (!categoriesResult || categoriesResult.length === 0) {
    return res.status(404).send("The requested category doesn't exist.");
  }

  const categoryTitles = await DataBaseService.getTitlesByCategory(category);
  res.render("index", { titles: categoryTitles });
});

module.exports = { indexGetMain, indexGetCategory };
