const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
indexRouter.get("/:category", indexController.indexGet);

module.exports = indexRouter;
