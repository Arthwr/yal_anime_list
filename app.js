const dotenv = require("dotenv");
const path = require("node:path");
const express = require("express");
const helpers = require("./helpers/helpers");
const indexRouter = require("./routes/indexRouter");
const titlesRouter = require("./routes/titlesRouter");
const errorHandler = require("./middleware/errorHandler");

if (process.env.NODE_ENV === "production") {
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
app.locals.utils = helpers;

// Routes
app.use("/", indexRouter);
app.use("/titles", titlesRouter);

// Error handling
app.use((req, res, next) => {
  next({ status: 404, message: "Route not found" });
});
app.use(errorHandler);

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
