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

  static async getMetaData() {
    const result = await this.query(queries.GET_METADATA);
    return result[0] || {};
  }

  static async checkCategoryName(categoryName) {
    return await this.query(queries.GET_CATEGORY, [categoryName]);
  }

  static async getTitlesByCategory(categoryName) {
    return await this.query(queries.GET_TITLES_BY_CATEGORY, [categoryName]);
  }

  static async getMoreTitles(query, genresArray, yearsArray, status, categoryName, offset) {
    return await this.query(queries.GET_TITLES, [query, genresArray, yearsArray, status, categoryName, offset]);
  }

  static async searchTitles(query, genresArray, yearsArray, status, categoryName) {
    return await this.query(queries.SEARCH_TITLES, [query, genresArray, yearsArray, status, categoryName]);
  }
}

module.exports = DatabaseService;
