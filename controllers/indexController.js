const { validatePageParam, validateSearchInput } = require("./validators/validators");
const asyncHandler = require("./utils/asyncHandler");
const parseQueryParams = require("./utils/parseQueryParams");
const handleValidationErrors = require("./middleware/handleValidationErrors");
const DatabaseService = require("../database/services/database-handler.service");
const AppError = require("../errors/AppError");

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
  validateSearchInput(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
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
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
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
        return next(new AppError(`Failed to fetch additional titles : ${error.message}`, 500));
      }

      return res.json({ html, noMoreItems: false });
    });
  }),
];

module.exports = { indexGetEverything, indexGetCategory, indexGetSearch, indexLoadMoreTitles };
