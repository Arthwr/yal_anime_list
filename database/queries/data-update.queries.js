module.exports = {
  UPSERT_TITLE_TO_CATEGORY: `
  INSERT INTO anime_categories
    (anime_id, category_id, is_default_category, added_at)
  VALUES
    ($2,
    (SELECT category_id FROM categories WHERE name = $1),
    false,
    NOW())
  ON CONFLICT (anime_id)
    WHERE is_default_category = false
    DO UPDATE SET
      category_id = EXCLUDED.category_id,
      added_at = NOW();
  `,
};
