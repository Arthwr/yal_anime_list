const SQL_CREATE_TABLES = `
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

const SQL_INSERT_DEFAULTV_STATUSES = `INSERT INTO statuses (name) VALUES ($1)`;
const SQL_INSERT_DEFAULTV_CATEGORIES = `INSERT INTO categories (name) VALUES ($1)`;
const SQL_INSERT_DEFAULTV_ANIME_GENRES_LIST = `INSERT INTO genre_list (name) VALUES ($1)`;

const GRAPHQL_ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $type: MediaType, $minScore: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: $type, startDate_greater: $startDate, averageScore_greater: $minScore) {
        title {
          romaji
        }
        status
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

module.exports = {
  SQL_CREATE_TABLES,
  SQL_INSERT_DEFAULTV_STATUSES,
  SQL_INSERT_DEFAULTV_CATEGORIES,
  SQL_INSERT_DEFAULTV_ANIME_GENRES_LIST,
  GRAPHQL_ANILIST_QUERY,
};
