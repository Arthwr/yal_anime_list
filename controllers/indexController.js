const { validatePageParam } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const parseQueryParams = require("./utils/parseQueryParams");
const handleValidationErrors = require("./validators/handleValidationErrors");
const DatabaseService = require("../database/services/database-handler.service");

const INITIAL_PAGE_SIZE = 50;
const LOAD_MORE_SIZE = 20;

const indexGetEverything = [
  async (req, res) => {
    res.redirect("/everything/");
  },
];

const indexGetCategory = [
  asyncHandler(async (req, res) => {
    const category = req.params.category;
    const titles = await DatabaseService.getTitlesByCategory(category);
    res.render("index", { titles });
  }),
];

const indexGetSearch = [
  asyncHandler(async (req, res) => {
    handleValidationErrors(req);

    const { category } = req.params;
    const queryParams = parseQueryParams(req.query);

    res.locals.formState = queryParams;

    const titles = await DatabaseService.searchTitles(
      queryParams.queryString,
      queryParams.genresArray,
      queryParams.yearsArray,
      queryParams.statusString,
      category
    );
    res.render("index", { titles });
  }),
];

const indexLoadMoreTitles = [
  validatePageParam(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req);

    const { category, page } = req.params;
    const offset = INITIAL_PAGE_SIZE + LOAD_MORE_SIZE * (page - 1);
    const queryParams = parseQueryParams(req.query);

    const titles = await DatabaseService.getMoreTitles(
      queryParams.queryString,
      queryParams.genresArray,
      queryParams.yearsArray,
      queryParams.statusString,
      category,
      offset
    );

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
