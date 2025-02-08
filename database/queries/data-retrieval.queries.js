module.exports = {
  GET_METADATA: `
  SELECT
    ARRAY(SELECT DISTINCT name FROM statuses) as statuses,
    ARRAY(SELECT DISTINCT release_date FROM anime_titles) as years,
    ARRAY(SELECT DISTINCT name FROM genre_list) as genres,
    ARRAY(SELECT DISTINCT name FROM categories) as categories
  `,

  GET_CATEGORY: `
  SELECT category_id FROM categories WHERE LOWER(name) = LOWER($1);
  `,

  GET_TITLE_ID: `
  SELECT anime_id FROM anime_categories WHERE anime_id = $1
  `,

  GET_TITLES_BY_CATEGORY: `
  SELECT
    anime_titles.title,
    anime_titles.description,
    anime_titles.release_date,
    anime_titles.title_id,
    statuses.name AS status_name,
    anime_titles.image_url,
    anime_titles.average_score,
    ARRAY_AGG(DISTINCT genre_list.name) AS genres,
    COALESCE(custom_cat.name, 'Everything') AS category_name
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
    LEFT JOIN anime_categories custom_cat_join
        ON anime_titles.title_id = custom_cat_join.anime_id
        AND custom_cat_join.is_default_category = false
    LEFT JOIN categories custom_cat
        ON custom_cat_join.category_id = custom_cat.category_id
    WHERE LOWER(categories.name) = LOWER($1)
    GROUP BY anime_titles.title_id, statuses.name, custom_cat.name
    LIMIT 50;
      `,

  GET_TITLES: `
  SELECT
    anime_titles.title,
    anime_titles.description,
    anime_titles.release_date,
    anime_titles.title_id,
    statuses.name AS status_name,
    anime_titles.image_url,
    anime_titles.average_score,
    ARRAY_AGG(DISTINCT genre_list.name) AS genres,
    categories.name AS category_name
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
    WHERE
      ($1::TEXT IS NULL OR anime_titles.title ILIKE '%' || $1 || '%')
      AND ($3::INT[] IS NULL OR anime_titles.release_date = ANY($3))
      AND ($4::TEXT IS NULL OR statuses.name = $4)
      AND (LOWER(categories.name) = LOWER($5))
    GROUP BY anime_titles.title_id, statuses.name, categories.name
    HAVING
      ($2::TEXT[] IS NULL OR $2 <@ ARRAY_AGG(DISTINCT genre_list.name)::text[])
    LIMIT 20 OFFSET $6;
  `,

  SEARCH_TITLES: `
    SELECT
    anime_titles.title,
    anime_titles.description,
    anime_titles.release_date,
    anime_titles.title_id,
    statuses.name AS status_name,
    anime_titles.image_url,
    anime_titles.average_score,
    ARRAY_AGG(DISTINCT genre_list.name) AS genres,
    categories.name AS category_name
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
    WHERE
      ($1::TEXT IS NULL OR anime_titles.title ILIKE '%' || $1 || '%')
      AND ($3::INT[] IS NULL OR anime_titles.release_date = ANY($3))
      AND ($4::TEXT IS NULL OR statuses.name = $4)
      AND (LOWER(categories.name) = LOWER($5))
    GROUP BY anime_titles.title_id, statuses.name, categories.name
    HAVING
      ($2::TEXT[] IS NULL OR $2 <@ ARRAY_AGG(DISTINCT genre_list.name)::text[])
    LIMIT 50;
  `,
};
