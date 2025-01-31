const { Router } = require("express");
const titlesController = require("../controllers/titlesController");

const titlesRouter = Router();

titlesRouter.get("/:category/:page", titlesController.getTitles);

module.exports = titlesRouter;
