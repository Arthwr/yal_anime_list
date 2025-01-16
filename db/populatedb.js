require("dotenv").config({ path: "./.env.production" });
const { Client } = require("pg");

const SQL_CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS statuses (
    status_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS anime_titles (
    title_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    status_id INT NOT NULL,
    image_url VARCHAR(2048) NOT NULL,
    CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses (status_id)
);

CREATE TABLE IF NOT EXISTS genre_list (
    genre_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS anime_genres (
    anime_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (anime_id, genre_id),
    CONSTRAINT fk_anime_id FOREIGN KEY (anime_id) REFERENCES anime_titles (title_id),
    CONSTRAINT fk_genre_id FOREIGN KEY (genre_id) REFERENCES genre_list (genre_id)
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS anime_categories (
    category_id INT NOT NULL,
    anime_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (category_id, anime_id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (category_id),
    CONSTRAINT fk_anime_id FOREIGN KEY (anime_id) REFERENCES anime_titles (title_id)
);
`;

const SQL_TABLE_CREATION_CHECK = `
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('statuses', 'anime_titles', 'genre_list', 'anime_genres', 'categories', 'anime_categories');
`;

async function main() {
  console.log("Starting to seed db..");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query(SQL_CREATE_TABLE);
    console.log("Table creation script executed");

    const res = await client.query(SQL_TABLE_CREATION_CHECK);

    if (res.rows.length > 0) {
      console.log(
        "Tables found: ",
        res.rows.map((row) => row.table_name)
      );
    } else {
      console.log("No tables found.");
    }
    console.log("Tables: ", res.rows);
  } catch (error) {
    console.error("Error while seeding DB: ", error.message);
  } finally {
    await client.end();
    console.log("Done with DB operations.");
  }
}

main();
