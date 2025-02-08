const dotenv = require("dotenv");
const path = require("node:path");
const express = require("express");
const helmet = require("./controllers/middleware/helmet");
const helpers = require("./helpers/helpers");
const indexRouter = require("./routes/indexRouter");
const assignRouter = require("./routes/assignRouter");
const errorHandler = require("./controllers/middleware/errorHandler");
const AppError = require("./errors/AppError");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config({ path: "./.env" });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Helmet
app.use(helmet);

// App middleware set up
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Passing helper functions
app.locals.utils = helpers;

// Routes
app.use("/assign-category", assignRouter);
app.use("/", indexRouter);

// Error handling
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});
app.use(errorHandler);

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
