const { Router } = require("express");
const assignController = require("../controllers/assignController");
const limiter = require("../controllers/middleware/limiter");

const assingRouter = Router();

assingRouter.post("/", limiter, assignController.assignPostCategory);

module.exports = assingRouter;
