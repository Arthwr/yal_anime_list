const { Router } = require("express");
const limiter = require("../controllers/middleware/limiter");
const indexController = require("../controllers/indexController");
const getMetaDataMiddleware = require("../controllers/middleware/getMetaDataMiddleware");

const indexRouter = Router();

// Handle favicon request
indexRouter.get("/favicon.ico", (req, res) => res.status(204).end());

// Redirect to 'everything' category
indexRouter.get("/", indexController.indexGetEverything);

// Middleware
indexRouter.use("/:category", getMetaDataMiddleware);

// Routes
indexRouter.get("/:category", indexController.indexGetCategory);
indexRouter.get("/:category/search", indexController.indexGetSearch);

// API endpoint
indexRouter.get("/:category/:page", limiter, indexController.indexLoadMoreTitles);

module.exports = indexRouter;
