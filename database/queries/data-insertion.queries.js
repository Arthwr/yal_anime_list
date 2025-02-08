module.exports = {
  // Insert default statuses
  INSERT_STATUSES: `
   INSERT INTO statuses (name)
   VALUES ($1)
   ON CONFLICT (name) DO NOTHING;
`,

  // Insert default categories
  INSERT_CATEGORIES: `
    INSERT INTO categories (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING;
  `,

  // Insert default genres
  INSERT_GENRES: `
    INSERT INTO genre_list (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING;
  `,

  // Batch insert anime titles
  BATCH_INSERT_ANIME: `
    INSERT INTO anime_titles
      (title, description, release_date, status_id, image_url, average_score)
    SELECT
      data.title,
      data.description,
      data.release_date,
      s.status_id,
      data.image_url,
      data.average_score
    FROM (
      SELECT
        unnest($1::text[]) as title,
        unnest($2::text[]) as description,
        unnest($3::int[]) as release_date,
        unnest($4::text[]) as image_url,
        unnest($5::int[]) as average_score,
        unnest($6::text[]) as status_name
    ) AS data
    JOIN statuses s ON s.name = data.status_name
    ON CONFLICT (title) DO NOTHING;
  `,

  // Batch insert anime genres
  BATCH_INSERT_GENRES: `
    WITH anime_ids AS (
      SELECT title_id, title
      FROM anime_titles
    ),
    genre_ids AS (
      SELECT genre_id, name
      FROM genre_list
    )
    INSERT INTO anime_genres (anime_id, genre_id)
    SELECT DISTINCT a.title_id, g.genre_id
    FROM unnest($1::text[], $2::text[]) AS data(anime_title, genre_name)
    JOIN anime_ids a ON a.title = data.anime_title
    JOIN genre_ids g ON g.name = data.genre_name
    ON CONFLICT (anime_id, genre_id) DO NOTHING;
  `,

  // Batch insert default category for all anime
  BATCH_INSERT_CATEGORIES: `
    WITH anime_ids AS (
      SELECT title_id
      FROM anime_titles
    ),
    default_category AS (
      SELECT category_id
      FROM categories
      WHERE name = 'Everything'
    )
    INSERT INTO anime_categories (anime_id, category_id, is_default_category)
    SELECT anime_ids.title_id, default_category.category_id, true
    FROM anime_ids, default_category
    ON CONFLICT (category_id, anime_id) DO NOTHING;
  `,
};
