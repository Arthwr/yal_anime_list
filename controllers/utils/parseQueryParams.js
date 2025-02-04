const parseQueryParams = (queryParams) => {
  const { q: query, g: genres, y: years, s: status } = queryParams;
  return {
    queryString: query || null,
    genresArray: genres ? (Array.isArray(genres) ? genres : [genres]) : null,
    yearsArray: years ? (Array.isArray(years) ? years : [years]) : null,
    statusString: status || null,
  };
};

module.exports = parseQueryParams;
