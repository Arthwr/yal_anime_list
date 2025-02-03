const { Router } = require("express");
const indexController = require("../controllers/indexController");
const getMetaDataMiddleware = require("../controllers/middleware/getMetaDataMiddleware");

const indexRouter = Router();

// Redirect to 'everything' category
indexRouter.get("/", indexController.indexGetEverything);

// Middleware
indexRouter.use("/:category", getMetaDataMiddleware);

// Routes
indexRouter.get("/:category", indexController.indexGetCategory);
indexRouter.get("/:category/search", indexController.indexGetSearch);

// API endpoint
indexRouter.get("/:category/:page", indexController.indexLoadMoreTitles);

module.exports = indexRouter;
