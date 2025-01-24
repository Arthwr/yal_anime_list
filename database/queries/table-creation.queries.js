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
    category_id INT NOT NULL,
    anime_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (category_id, anime_id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id)
        REFERENCES categories (category_id),
    CONSTRAINT fk_anime_id FOREIGN KEY (anime_id)
        REFERENCES anime_titles (title_id)
);
`;

const TRUNCATE_TABLES = `
TRUNCATE TABLE anime_categories CASCADE;
TRUNCATE TABLE anime_genres CASCADE;
TRUNCATE TABLE anime_titles CASCADE;
TRUNCATE TABLE statuses CASCADE;
TRUNCATE TABLE genre_list CASCADE;
TRUNCATE TABLE categories CASCADE;
`;

module.exports = {
  CREATE_TABLES: TABLE_SCHEMA,
  TRUNCATE_TABLES,
};
