const DataBaseService = require("../database/services/database-handler.service");

exports.indexGetPage = async (req, res) => {
  const titles = await DataBaseService.getTitlesByCategory("Everything");
  res.render("index", { titles });
};
