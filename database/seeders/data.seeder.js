const fs = require("fs").promises;
const AnimeModel = require("../models/anime.model");
const config = require("../config/anilist.config");
const defaultValues = require("../config/default-data.config");
const tableQueries = require("../queries/table-creation.queries");
const insertQueries = require("../queries/data-insertion.queries");

class DataSeeder {
  static async truncateTables(client) {
    try {
      console.log("Truncating tables...");
      await client.query(tableQueries.TRUNCATE_TABLES);
      console.log("Tables truncated successfully.");
    } catch (error) {
      console.log("Error truncating tables: ", error);
      throw error;
    }
  }

  static async createTables(client) {
    try {
      await client.query(tableQueries.CREATE_TABLES);
      console.log("Database tables created successfuly.");
    } catch (error) {
      console.log("Table creation failed: ", error);
      throw error;
    }
  }

  static async seedDefaultValues(client) {
    try {
      // Seed statuse
      for (const status of defaultValues.STATUSES) {
        await client.query(insertQueries.INSERT_STATUSES, [status]);
      }

      // Seed categories
      for (const category of defaultValues.CATEGORIES) {
        await client.query(insertQueries.INSERT_CATEGORIES, [category]);
      }

      // Seed genres
      for (const genre of defaultValues.GENRES) {
        await client.query(insertQueries.INSERT_GENRES, [genre]);
      }

      console.log("Default values seeded successfully.");
    } catch (error) {
      console.error("Error seeding default values: ", error);
      throw error;
    }
  }

  static async seedAnilistData(client) {
    try {
      const rawData = await fs.readFile(config.PATHS.CACHE_FILE, "utf-8");
      const parsedData = JSON.parse(rawData);

      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error("No anime data to seed.");
      }

      // Transform to AnimeModel instance and then to expected database format.
      const animeList = parsedData.map((anime) => AnimeModel.fromAnilistData(anime).toDatabaseFormat());

      // Separate and prepare data into different arrays for batch insertion
      const titles = animeList.map((anime) => anime.title);
      const descriptions = animeList.map((anime) => anime.description);
      const releaseDates = animeList.map((anime) => anime.release_date);
      const imageUrls = animeList.map((anime) => anime.image_url);
      const scores = animeList.map((anime) => anime.average_score);
      const statuses = animeList.map((anime) => anime.status);

      // Batch insert anime titles
      console.log("Inserting anime titles...");
      await client.query(insertQueries.BATCH_INSERT_ANIME, [
        titles,
        descriptions,
        releaseDates,
        imageUrls,
        scores,
        statuses,
      ]);

      // Batch insert genres and titles relationships
      const genrePair = animeList.flatMap((anime, index) => anime.genres.map((genre) => [titles[index], genre]));

      if (genrePair.length > 0) {
        console.log("Inserting genre relationships...");
        const animeTitles = genrePair.map((pair) => pair[0]);
        const genreNames = genrePair.map((pair) => pair[1]);

        await client.query(insertQueries.BATCH_INSERT_GENRES, [animeTitles, genreNames]);
      }

      // Batch insert all anime titles to the default 'Everything' category
      console.log("Inserting category relationships...");
      await client.query(insertQueries.BATCH_INSERT_CATEGORIES);

      console.log(`Seeded ${titles.length} anime entries from source file.`);
      const { rows } = await client.query("SELECT COUNT(title_id) FROM anime_titles;");
      console.log("Actually inserted titles to the table:", rows[0].count);
    } catch (error) {
      console.error("Anilist data seeding failed: ", error);
      throw error;
    }
  }
}

module.exports = DataSeeder;
