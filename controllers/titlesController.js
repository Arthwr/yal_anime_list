const DatabaseService = require("../database/services/database-handler.service");

exports.getTitles = async (req, res) => {
  const pageNumber = Number(req.params.page);
  const category = req.params.category ? req.params.category : "Everything";
  const categoryName = decodeURIComponent(category).replace(/-/g, " ");

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(404).json({ error: "Invalid page number" });
  }

  try {
    // We load 20 more titles starting from default 50 already rendered on the page on each request
    const offset = 50 + 20 * (pageNumber - 1);
    const titles = await DatabaseService.getMoreTitles(categoryName, offset);

    if (titles.length === 0) {
      return res.json({ html: "", noMoreItems: true });
    }

    res.render("partials/titles", { titles }, (error, html) => {
      if (error) {
        console.error("Error rendering titles: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.json({ html, noMoreItems: false });
    });
  } catch (error) {
    console.error("Error fetching paginated titles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
