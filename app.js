const dotenv = require("dotenv");
const path = require("node:path");
const express = require("express");
const utils = require("./utils/helpers");
const indexRouter = require("./routes/indexRouter");
const titlesRouter = require("./routes/titlesRouter");
const errorHandler = require("./middleware/errorHandler");

if ((process.env.NODE_ENV = "production")) {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config({ path: "./.env" });
}

const app = express();
const PORT = process.env.PORT || 3000;

// App middleware set up
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Passing helper functions
app.locals.utils = utils;

// Routes
app.use("/", indexRouter);
app.use("/titles", titlesRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
