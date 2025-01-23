module.exports = {
  GRAPHQL_ANIME_QUERY: `
    query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $type: MediaType, $minScore: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: $type, startDate_greater: $startDate, averageScore_greater: $minScore) {
          title {
            romaji
          }
          status
          startDate {
            year
          }
          description
          genres
          averageScore
          coverImage {
            extraLarge
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `,
};
