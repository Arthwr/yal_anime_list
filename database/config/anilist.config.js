module.exports = {
  BASE_URL: "https://graphql.anilist.co",
  API_OPTIONS: {
    REQUEST_LIMIT: 25, // Actual limit is 30 requests per minute. Slightly adjusted to 25 to be safer
    RESULTS_PER_PAGE: 50,
    FILTERS: {
      START_DATE: 20220101,
      MEDIA_TYPE: "ANIME",
      MIN_SCORE: 70,
    },
  },
  PATHS: {
    CACHE_FILE: "./database/data/anilist-cache.json",
  },
};