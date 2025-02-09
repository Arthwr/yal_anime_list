require("dotenv").config();
const AppError = require("../../errors/AppError");
const pool = require("../config/pool");
const retrievalQueries = require("../queries/data-retrieval.queries");
const updateQueries = require("../queries/data-update.queries");

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

  static async withTransaction(callback) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async _ensureRecordsExists(client, query, errorMessage, params) {
    const result = await client.query(query, params);
    if (!result.rows.length) {
      throw new AppError(errorMessage, 404);
    }
  }

  // Read methods
  static async getMetaData() {
    const result = await this.query(retrievalQueries.GET_METADATA);
    return result[0] || {};
  }

  static async getCategoryName(categoryName) {
    return await this.query(retrievalQueries.GET_CATEGORY, [categoryName]);
  }

  static async getTitlesByCategory(categoryName) {
    return await this.query(retrievalQueries.GET_TITLES_BY_CATEGORY, [categoryName]);
  }

  static async getMoreTitles(query, genresArray, yearsArray, status, categoryName, offset) {
    return await this.query(retrievalQueries.GET_TITLES, [
      query,
      genresArray,
      yearsArray,
      status,
      categoryName,
      offset,
    ]);
  }

  static async searchTitles(query, genresArray, yearsArray, status, categoryName) {
    return await this.query(retrievalQueries.SEARCH_TITLES, [query, genresArray, yearsArray, status, categoryName]);
  }

  // Write methods
  static async assignTitleToCategory(categoryName, titleId) {
    try {
      return await this.withTransaction(async (client) => {
         await this._ensureRecordsExists(client, retrievalQueries.GET_TITLE_ID, `Title id "${titleId}" not found`, [
            titleId,
          ]);

        let result;

        if (categoryName) {
          await this._ensureRecordsExists(client, retrievalQueries.GET_CATEGORY, `Category "${categoryName}" not found`, [
          categoryName,
        ]);
          result = await client.query(updateQueries.UPSERT_TITLE_TO_CATEGORY, [categoryName, titleId]);
        } else {
          result = await client.query(updateQueries.REMOVE_TITLE_FROM_CATEGORY, [titleId]);
        }

        if (result && result.rowCount > 0) {
          return {
            success: true,
            message: categoryName
              ? `Selected title assigned to "${categoryName}"`
              : `Selected title unassigned`,
          };
        } else {
          return {
            success: false,
            message: categoryName
              ? `Couldn't assign selected title to "${categoryName}".`
              : `Couldn't unassign selected title`,
          };
        }
      });
    } catch (error) {
      console.error("Error assigning title to category: ", error);
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = DatabaseService;
