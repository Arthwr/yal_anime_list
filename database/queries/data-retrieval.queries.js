module.exports = {
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
    WHERE categories.name = $1
    GROUP BY anime_titles.title_id, statuses.name
    LIMIT 50;
      `,
};
