const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  if (process.env.NODE_ENV === "development") {
    res.status(500).json({ message: err.message || "Internal Server Error", path: req.path, stack: err.stack });
  } else {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = errorHandler;
