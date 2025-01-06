const dotenv = require("dotenv");
const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");

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

// Routes
app.use("/", indexRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  if (process.env.NODE_ENV === "development") {
    res
      .status(500)
      .json({ message: err.message || "Internal Server Error", path: req.path, indexRouter, stack: err.stack });
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
