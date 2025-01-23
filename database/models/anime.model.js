class AnimeModel {
  constructor(data) {
    this.title = data.title?.romaji || "Unknown Title";
    this.description = data.description || "No description available";
    this.releaseYear = data.startDate?.year;
    this.status = data.status;
    this.imageUrl = data.coverImage?.extraLarge;
    this.score = data.averageScore;
    this.genres = data.genres || [];
  }

  toDatabaseFormat() {
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

  static fromAnilistData(data) {
    return new AnimeModel(data);
  }
}

module.exports = AnimeModel;
