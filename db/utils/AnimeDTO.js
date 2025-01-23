class AnimeDTO {
  constructor(rawAnimeData) {
    this.title = rawAnimeData.title.romaji;
    this.description = rawAnimeData.description;
    this.releaseYear = rawAnimeData.startDate.year;
    this.status = rawAnimeData.status;
    this.imageUrl = rawAnimeData.coverImage.extraLarge;
    this.score = rawAnimeData.averageScore;
    this.genres = rawAnimeData.genres;
  }

  static fromAPI(data) {
    return new AnimeDTO(data);
  }

  toDatabase() {
    return {
      title: this.title,
      description: this.description,
      release_date: this.releaseYear,
      status: this.status,
      image_url: this.imageUrl,
      average_score: this.score,
      genres: this.genres,
    };
  }
}

module.exports = AnimeDTO;
