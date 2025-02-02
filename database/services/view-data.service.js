const DatabaseService = require("./database-handler.service");

class ViewDataService {
  static async getCommonViewData(category = "everything") {
    const normalizedCategory = decodeURIComponent(category).replace(/-/g, " ");

    if (normalizedCategory !== "everything") {
      const categoriesResult = await DatabaseService.checkCategoryName(normalizedCategory);
      if (!categoriesResult || categoriesResult.length === 0) {
        throw { status: 404, message: "Requested category doesn't exist" };
      }
    }

    const { statuses, years, genres, categories } = await DatabaseService.getMetaData();
    return {
      currentCategory: normalizedCategory,
      statuses,
      years,
      genres,
      categories,
    };
  }
}

module.exports = ViewDataService;
