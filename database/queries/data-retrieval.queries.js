module.exports = {
  GET_TITLES_BY_CATEGORY: `
  SELECT
    title,
    description,
    release_date,
    statuses.name AS status_name,
    image_url,
    average_score
  FROM anime_titles
    INNER JOIN anime_categories
        ON anime_titles.title_id = anime_categories.anime_id
    INNER JOIN categories
        ON anime_categories.category_id = categories.category_id
    INNER JOIN statuses
        ON anime_titles.status_id = statuses.status_id
    WHERE categories.name = $1
    LIMIT 50;
      `,
};
