const config = {
  requestLimit: 20,
  perPage: 50,
  startDate: 20220101,
  type: "ANIME",
  minScore: 70,
  baseUrl: "https://graphql.anilist.co",
  dataDirPath: "./db/data",
  dataPath: "./db/data/anime-data.json",
};

module.exports = config;
