require("dotenv").config();
const { Client } = require("pg");
const AnilistFetcherService = require("./services/anilist-fetcher.service");
const AnilistDataSeeder = require("./seeders/data.seeder");

async function initializeDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    await client.query("BEGIN");

    // Create tables
    await AnilistDataSeeder.createTables(client);

    // Clean old data
    await AnilistDataSeeder.truncateTables(client);

    // Seed default values
    await AnilistDataSeeder.seedDefaultValues(client);

    // Fetch Anilist data
    const fetcher = new AnilistFetcherService();
    await fetcher.fetchAllData();

    // Seed fetched data
    await AnilistDataSeeder.seedAnilistData(client);

    await client.query("COMMIT");
    console.log("Database initialization complete.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", error);
  } finally {
    await client.end();
  }
}

initializeDatabase();
