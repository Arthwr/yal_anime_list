const { Router } = require("express");
const titlesController = require("../controllers/titlesController");

const apiRouter = Router();

apiRouter.get("/:category/:page", titlesController.getTitles);

module.exports = apiRouter;
