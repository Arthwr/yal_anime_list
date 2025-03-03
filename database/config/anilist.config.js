module.exports = {
  BASE_URL: "https://graphql.anilist.co",
  API_OPTIONS: {
    REQUEST_LIMIT: 25, // Actual limit is 30 requests per minute. Slightly adjusted to 25 to be safer
    RESULTS_PER_PAGE: 50,
    FILTERS: {
      START_DATE: 20200101, // format (yyyy:mmmm:dddd)
      MEDIA_TYPE: "ANIME",
      MEDIA_FORMAT: ["TV", "MOVIE"],
      MIN_SCORE: 60, // user score
      SORT: ["POPULARITY_DESC", "SCORE_DESC"],
    },
  },
  PATHS: {
    CACHE_FILE: "./database/data/anilist-cache.json",
  },
};
