require("dotenv").config();
const pool = require("../config/pool");
const queries = require("../queries/data-retrieval.queries");

class DatabaseService {
  static async query(queryString, params) {
    try {
      const result = await pool.query(queryString, params);
      return result.rows;
    } catch (error) {
      console.error("Database query error: ", error);
      throw error;
    }
  }

  static async getTitlesByCategory(categoryName) {
    try {
      const query = queries.GET_TITLES_BY_CATEGORY;
      const result = await this.query(query, [categoryName]);
      return result;
    } catch (error) {
      console.error("Error fetching titles by category:", error);
      throw new Error("Failed to fetch titles by category");
    }
  }
  // Perform search query with specified params
  // REST actions queries : delete, add, update
}

module.exports = DatabaseService;
