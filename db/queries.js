const GRAPHQL_ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $type: MediaType, $minScore: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: $type, startDate_greater: $startDate, averageScore_greater: $minScore) {
        title {
          romaji
        }
        status
        startDate {
          year
        }
        description
        genres
        averageScore
        coverImage {
          extraLarge
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const SQL_CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS statuses (
    status_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS anime_titles (
    title_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date INT,
    status_id INT NOT NULL,
    image_url VARCHAR(2048) NOT NULL,
    average_score INT,
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
    name VARCHAR(255) NOT NULL UNIQUE
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

const SQL_TRUNCATE_DEPENDENT_TABLES = `TRUNCATE TABLE anime_titles CASCADE;`;
const SQL_INSERT_DEFAULTV_STATUSES = `INSERT INTO statuses (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;`;
const SQL_INSERT_DEFAULTV_CATEGORIES = `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;`;
const SQL_INSERT_DEFAULTV_ANIME_GENRES_LIST = `INSERT INTO genre_list (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;`;

const SQL_BATCH_INSERT_ANIME = `
INSERT INTO anime_titles
(title, description, release_date, status_id, image_url, average_score)
SELECT
    unnest($1::text[]) as title,
    unnest($2::text[]) as description,
    unnest($3::int[]) as release_date,
    s.status_id,
    unnest($4::text[]) as image_url,
    unnest($5::int[]) as average_score
FROM statuses s
WHERE s.name = ANY($6::text[])
ON CONFLICT (title) DO NOTHING;
`;

const SQL_BATCH_INSERT_GENRES = `
WITH anime_ids AS (
    SELECT title_id, title
    FROM anime_titles
    WHERE title = ANY($1::text[])
),
genre_ids AS (
    SELECT genre_id, name
    FROM genre_list
    WHERE name = ANY($2::text[])
)
INSERT INTO anime_genres (anime_id, genre_id)
SELECT DISTINCT a.title_id, g.genre_id
FROM unnest($1::text[], $2::text[]) AS data(anime_title, genre_name)
JOIN anime_ids a ON a.title = data.anime_title
JOIN genre_ids g ON g.name = data.genre_name;
`;

const SQL_BATCH_INSERT_CATEGORIES = `
WITH anime_ids AS (
  SELECT title_id
  FROM anime_titles
  WHERE title = ANY($1::text[])
)
INSERT INTO anime_categories (category_id, anime_id)
SELECT c.category_id, a.title_id
FROM anime_ids a
JOIN categories c ON c.name = 'Everything'
ON CONFLICT (category_id, anime_id) DO NOTHING;
`;

module.exports = {
  SQL_CREATE_TABLES,
  SQL_INSERT_DEFAULTV_STATUSES,
  SQL_INSERT_DEFAULTV_CATEGORIES,
  SQL_INSERT_DEFAULTV_ANIME_GENRES_LIST,
  SQL_TRUNCATE_DEPENDENT_TABLES,
  GRAPHQL_ANILIST_QUERY,
  SQL_BATCH_INSERT_ANIME,
  SQL_BATCH_INSERT_GENRES,
  SQL_BATCH_INSERT_CATEGORIES,
};
