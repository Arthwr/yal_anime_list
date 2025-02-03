const { validationResult } = require("express-validator");
const { validateSearchInput, validatePageParam, validateCategoryParam } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const DatabaseService = require("../database/services/database-handler.service");

const indexGetEverything = [
  async (req, res) => {
    res.redirect("/everything/");
  },
];

const indexGetCategory = [
  asyncHandler(async (req, res) => {
    const category = req.params.category;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const titles = await DatabaseService.getTitlesByCategory(category);

    res.render("index", { titles });
  }),
];

const indexGetSearch = [
  validateCategoryParam(),
  validateSearchInput(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q: query, g: genres, y: years, s: status } = req.query;

    const category = req.params.category;
    const queryString = query || null;
    const genresArray = genres ? (Array.isArray(genres) ? genres : [genres]) : null;
    const yearsArray = years ? (Array.isArray(years) ? years : [years]) : null;
    const statusString = status || null;

    const formState = { queryString, genresArray, yearsArray, statusString };
    res.locals.formState = formState;
    console.log(formState);
    const titles = await DatabaseService.searchTitles(queryString, genresArray, yearsArray, statusString, category);
    res.render("index", { titles });
  }),
];

const indexLoadMoreTitles = [
  validatePageParam(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryName = req.params.category;
    const pageNumber = req.params.page;

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
  }),
];

module.exports = { indexGetEverything, indexGetCategory, indexGetSearch, indexLoadMoreTitles };
