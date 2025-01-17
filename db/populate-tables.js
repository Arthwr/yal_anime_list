require("dotenv").config({ path: "./.env.production" });
const values = require("./default-values.js");
const { Client } = require("pg");

const SQL_TABLE_DEFAULT_STATUSES = `
INSERT INTO statuses (name)
VALUES ($1)
`;

const SQL_TABLE_DEFAULT_CATEGORIES = `
INSERT INTO categories (name)
VALUES ($1)
`;

const SQL_TABLE_DEFAULT_ANIME_GENRES_LIST = `
INSERT INTO genre_list (name)
VALUES ($1)
`;

async function populateDefaultValues(client, queryBaseString, values) {
  try {
    for (let i = 0; i < values.length; i++) {
      await client.query(queryBaseString, [values[i]]);
    }
  } catch (error) {
    console.error("Failed to execute insertion of default values", error.message);
  }
}

async function main() {
  console.log("Initiating connection to DB..");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("Connected to the DB.");

    // Populate statuses table
    await populateDefaultValues(client, SQL_TABLE_DEFAULT_STATUSES, values.statuses);
    console.log("Table 'statuses' populated with default values");

    // Populate categories table
    await populateDefaultValues(client, SQL_TABLE_DEFAULT_CATEGORIES, values.categories);
    console.log("Table 'categories' populated with default values");

    await populateDefaultValues(client, SQL_TABLE_DEFAULT_ANIME_GENRES_LIST, values.genres);
    console.log("Table 'genre_list' populated with default values");

    console.log("SQL table population script with default values executed.");
  } catch (error) {
    console.error("Failed to populate DB with default values:", error.message);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

main();
