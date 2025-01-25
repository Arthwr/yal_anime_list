module.exports = {
  GRAPHQL_ANIME_QUERY: `
    query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $type: MediaType, $format: [MediaFormat], $minScore: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
      Page(page: $page, perPage: $perPage) {
        media(type: $type, format_in: $format, startDate_greater: $startDate, averageScore_greater: $minScore, sort: $sort) {
          title {
            romaji
          }
          status
          startDate {
            year
          }
          description(asHtml: false)
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
