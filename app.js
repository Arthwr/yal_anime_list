const dotenv = require("dotenv");
const path = require("node:path");
const express = require("express");
const helmet = require("./controllers/middleware/helmet");
const helpers = require("./helpers/helpers");
const indexRouter = require("./routes/indexRouter");
const errorHandler = require("./controllers/middleware/errorHandler");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config({ path: "./.env" });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet);

// App middleware set up
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Passing helper functions
app.locals.utils = helpers;

// Routes
app.use("/", indexRouter);

// Error handling
app.use((req, res, next) => {
  next({ status: 404, message: "Route not found" });
});
app.use(errorHandler);

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
