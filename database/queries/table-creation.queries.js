const TABLE_SCHEMA = `
-- Statuses Table
CREATE TABLE IF NOT EXISTS statuses (
    status_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Anime Titles Table
CREATE TABLE IF NOT EXISTS anime_titles (
    title_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    release_date INT,
    status_id INT,
    image_url VARCHAR(2048) NOT NULL,
    average_score INT,
    CONSTRAINT fk_status_id FOREIGN KEY (status_id)
        REFERENCES statuses (status_id)
);

-- Genre List Table
CREATE TABLE IF NOT EXISTS genre_list (
    genre_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Anime Genres Junction Table
CREATE TABLE IF NOT EXISTS anime_genres (
    anime_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (anime_id, genre_id),
    CONSTRAINT fk_anime_id FOREIGN KEY (anime_id)
        REFERENCES anime_titles (title_id),
    CONSTRAINT fk_genre_id FOREIGN KEY (genre_id)
        REFERENCES genre_list (genre_id)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Anime Categories Junction Table
CREATE TABLE IF NOT EXISTS anime_categories (
    anime_id INT NOT NULL,
    category_id INT NOT NULL,
    is_default_category BOOLEAN NOT NULL DEFAULT false,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (anime_id, category_id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id)
        REFERENCES categories (category_id),
    CONSTRAINT fk_anime_id FOREIGN KEY (anime_id)
        REFERENCES anime_titles (title_id)
);
`;

const ASSIGN_CONSTRAINT = `
CREATE UNIQUE INDEX uniq_anime_custom_category
    ON anime_categories(anime_id)
    WHERE is_default_category = false;
`;

const DROP_TABLES = `
DROP TABLE IF EXISTS anime_genres CASCADE;
DROP TABLE IF EXISTS anime_categories CASCADE;
DROP TABLE IF EXISTS anime_titles CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS genre_list CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
`;

module.exports = {
  CREATE_TABLES: TABLE_SCHEMA,
  ASSIGN_CONSTRAINT,
  DROP_TABLES,
};
