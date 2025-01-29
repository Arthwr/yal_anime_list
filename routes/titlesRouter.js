const { Router } = require("express");
const titlesController = require("../controllers/titlesController");

const apiRouter = Router();

apiRouter.get("/:page", titlesController.getTitles);

module.exports = apiRouter;
