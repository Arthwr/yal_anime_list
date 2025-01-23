require("dotenv").config();
const { Client } = require("pg");
const fs = require("node:fs");
const config = require("./config.js");
const AnimeDTO = require("./utils/AnimeDTO.js");
const queries = require("./queries.js");

async function checkIfSourceDataIsAvailable() {
  try {
    await fs.promises.access(config.dataPath);
    console.log("Source file is available.");
    return true;
  } catch (error) {
    console.log("File doesn't exist.");
    return false;
  }
}

function prepareAnimeData(animelist) {
  const animeRecords = animelist.map((anime) => AnimeDTO.fromAPI(anime));

  const titles = [];
  const descriptions = [];
  const dates = [];
  const images = [];
  const scores = [];
  const statuses = [];
  const genrePair = [];
  const animeTitlesForCategories = [];

  for (const anime of animeRecords) {
    const dbRecord = anime.toDatabase();
    titles.push(dbRecord.title);
    descriptions.push(dbRecord.description);
    dates.push(dbRecord.release_date);
    images.push(dbRecord.image_url);
    scores.push(dbRecord.average_score);
    statuses.push(dbRecord.status);
    animeTitlesForCategories.push(dbRecord.title);

    if (dbRecord.genres.length > 0) {
      dbRecord.genres.forEach((genre) => genrePair.push([dbRecord.title, genre]));
    }
  }

  return {
    animeData: [titles, descriptions, dates, images, scores, statuses],
    genrePair,
    animeTitlesForCategories,
  };
}

async function seedDb() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    await client.query("BEGIN");

    const dataSource = await fs.promises.readFile(config.dataPath);
    const animelist = await JSON.parse(dataSource);

    if (!Array.isArray(animelist) || animelist.length === 0) {
      throw new Error("Invalid or empty anime list data");
    }

    console.log(`Processing ${animelist.length} anime entries...`);
    const { animeData, genrePair, animeTitlesForCategories } = prepareAnimeData(animelist);

    // Insert anime titles in batches
    console.log("Inserting anime titles...");
    await client.query(queries.SQL_BATCH_INSERT_ANIME, animeData);

    // Insert genres
    if (genrePair.length > 0) {
      console.log("Inserting genre relationships...");
      const animeTitles = genrePair.map((pair) => pair[0]);
      const genreNames = genrePair.map((pair) => pair[1]);
      await client.query(queries.SQL_BATCH_INSERT_GENRES, [animeTitles, genreNames]);
    }

    // Insert categories
    if (animeTitlesForCategories.length > 0) {
      console.log("Inserting category relationships...");
      await client.query(queries.SQL_BATCH_INSERT_CATEGORIES, [animeTitlesForCategories]);
    }

    await client.query("COMMIT");
    console.log("Successfully seeded the database.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error during seeding: ", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function populateDb() {
  try {
    const isDataAvailable = await checkIfSourceDataIsAvailable();
    if (!isDataAvailable) {
      throw new Error("Source data file is not available");
    }

    await seedDb();
  } catch (error) {
    console.error("Error during DB seeding: ", error.message);
    throw error;
  }
}

module.exports = populateDb;
