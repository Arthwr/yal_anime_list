const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.indexGetMain);
indexRouter.get("/:category", indexController.indexGetCategory);

module.exports = indexRouter;
