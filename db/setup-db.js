require("dotenv").config();
const { Client } = require("pg");
const values = require("./data/default-table-values.js");
const fetchAnilist = require("./fetch-anilist.js");

const queries = require("./queries.js");
const populateDb = require("./seed-db.js");

async function insertValues(client, queryBaseString, values) {
  for (let value of values) {
    try {
      await client.query(queryBaseString, [value]);
    } catch (error) {
      console.error(`Error inserting value: '${value}': `, error.message);
      throw error;
    }
  }
}

async function createAndCleanTables(client) {
  // Create initial tables
  await client.query(queries.SQL_CREATE_TABLES);
  console.log("Tables created successfully.");

  // Truncate anime_categories, anime_genres, anime_titles if there is old data on new build
  await client.query(queries.SQL_TRUNCATE_DEPENDENT_TABLES);
  console.log("Tables truncated successfully.");
}

async function populateTablesWithDefaults(client, values) {
  // Populate statuses, categories, and genres
  await insertValues(client, queries.SQL_INSERT_DEFAULTV_STATUSES, values.statuses);
  await insertValues(client, queries.SQL_INSERT_DEFAULTV_CATEGORIES, values.categories);
  await insertValues(client, queries.SQL_INSERT_DEFAULTV_ANIME_GENRES_LIST, values.genres);
  console.log("Tables populated with default values successfully.");
}

async function initiateTables() {
  console.log("Initiating connection to DB...");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query("BEGIN");

    await createAndCleanTables(client);
    await populateTablesWithDefaults(client, values);

    await client.query("COMMIT");
    console.log("Database operations committed.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in execution flow:", error.message);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

async function main() {
  await initiateTables();
  await fetchAnilist();
  await populateDb();
}

main();
