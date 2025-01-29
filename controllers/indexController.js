const DataBaseService = require("../database/services/database-handler.service");

exports.indexGetMain = async (req, res) => {
  const titles = await DataBaseService.getTitlesByCategory("Everything");
  res.render("index", { titles });
};

exports.indexGetCategory = async (req, res) => {
  const category = decodeURIComponent(req.params.category).replace(/-/g, " ");
  const categoriesResult = await DataBaseService.checkCategoryName(category);

  if (!categoriesResult || categoriesResult.length === 0) {
    return res.status(404).send("The requested category doesn't exist.");
  }

  const categoryTitles = await DataBaseService.getTitlesByCategory(category);
  res.render("index", { titles: categoryTitles });
};
