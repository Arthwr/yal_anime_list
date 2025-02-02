const { validationResult } = require("express-validator");
const { validateCategoryParam, validateSearchInput } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const DatabaseService = require("../database/services/database-handler.service");
const ViewDataService = require("../database/services/view-data.service");

const indexGet = [
  validateCategoryParam(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const viewData = await ViewDataService.getCommonViewData(req.params.category);
    const titles = await DatabaseService.getTitlesByCategory(viewData.currentCategory);

    res.render("index", { titles, ...viewData });
  }),
];

const searchGet = [
  validateSearchInput(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q: query = null, g: genres = null, y: years = null, s: status = null, c: category } = req.query;

    const queryString = query || null;
    const genresArray = genres ? (Array.isArray(genres) ? genres : [genres]) : null;
    const yearsArray = years ? (Array.isArray(years) ? years : [years]) : null;
    const statusString = status || null;

    const viewData = await ViewDataService.getCommonViewData(category);
    const titles = await DatabaseService.searchTitles(queryString, genresArray, yearsArray, statusString, category);

    res.render("index", { titles, ...viewData });
  }),
];
module.exports = { indexGet, searchGet };
