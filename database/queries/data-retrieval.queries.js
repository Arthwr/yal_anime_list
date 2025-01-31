module.exports = {
  GET_METADATA: `
  SELECT
    ARRAY(SELECT DISTINCT name FROM statuses) as statuses,
    ARRAY(SELECT DISTINCT release_date FROM anime_titles) as years,
    ARRAY(SELECT DISTINCT name FROM genre_list) as genres,
    ARRAY(SELECT DISTINCT name FROM categories) as categories
  `,
  GET_CATEGORY: `
  SELECT category_id FROM categories WHERE name ILIKE $1;
  `,
  GET_TITLES_BY_CATEGORY: `
  SELECT
    anime_titles.title,
    anime_titles.description,
    anime_titles.release_date,
    statuses.name AS status_name,
    anime_titles.image_url,
    anime_titles.average_score,
    ARRAY_AGG(DISTINCT genre_list.name) AS genres
  FROM anime_titles
    INNER JOIN anime_categories
        ON anime_titles.title_id = anime_categories.anime_id
    INNER JOIN categories
        ON anime_categories.category_id = categories.category_id
    INNER JOIN statuses
        ON anime_titles.status_id = statuses.status_id
    LEFT JOIN anime_genres
        ON anime_titles.title_id = anime_genres.anime_id
    LEFT JOIN genre_list
        ON anime_genres.genre_id = genre_list.genre_id
    WHERE categories.name ILIKE $1
    GROUP BY anime_titles.title_id, statuses.name
    LIMIT 50;
      `,
  GET_TITLES: `
  SELECT
    anime_titles.title,
    anime_titles.description,
    anime_titles.release_date,
    statuses.name AS status_name,
    anime_titles.image_url,
    anime_titles.average_score,
    ARRAY_AGG(DISTINCT genre_list.name) AS genres
  FROM anime_titles
    INNER JOIN anime_categories
        ON anime_titles.title_id = anime_categories.anime_id
    INNER JOIN categories
        ON anime_categories.category_id = categories.category_id
    INNER JOIN statuses
        ON anime_titles.status_id = statuses.status_id
    LEFT JOIN anime_genres
        ON anime_titles.title_id = anime_genres.anime_id
    LEFT JOIN genre_list
        ON anime_genres.genre_id = genre_list.genre_id
    WHERE categories.name ILIKE $1
    GROUP BY anime_titles.title_id, statuses.name
    LIMIT 20 OFFSET $2;
  `,
};
