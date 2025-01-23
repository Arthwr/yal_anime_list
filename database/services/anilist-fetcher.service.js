const fs = require("fs").promises;
const RateLimitService = require("./rate-limiter.service");
const config = require("../config/anilist.config");
const queries = require("../queries/anilist.queries");

class AnilistFetcherService {
  constructor() {
    this.pageNumber = 1;
    this.rateLimiter = new RateLimitService(config.API_OPTIONS.REQUEST_LIMIT);
  }

  //  prettier-ignore
  _buildRequestPayload() {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: queries.GRAPHQL_ANIME_QUERY,
        variables: {
          page: this.pageNumber,
          perPage: config.API_OPTIONS.RESULTS_PER_PAGE,
          startDate: config.API_OPTIONS.FILTERS.START_DATE,
          type: config.API_OPTIONS.FILTERS.MEDIA_TYPE,
          minScore: config.API_OPTIONS.FILTERS.MIN_SCORE,
        },
      }),
    };
  }

  async _initializeDataFile() {
    try {
      await fs.unlink(config.PATHS.CACHE_FILE);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    try {
      await fs.writeFile(config.PATHS.CACHE_FILE, "[]", "utf-8");
      console.log("Initialzed new data cache file.");
    } catch (error) {
      console.error("Data file initialization failed:", error);
      throw error;
    }
  }

  async _readCurrentData() {
    try {
      const rawData = await fs.readFile(config.PATHS.CACHE_FILE, "utf-8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Failed to read data files:", error);
      throw error;
    }
  }

  async _writeData(newContent) {
    try {
      const existingData = await this._readCurrentData(newContent);
      const contentToAdd = Array.isArray(newContent) ? newContent : [newContent];

      const combinedData = [...existingData, ...contentToAdd];

      await fs.writeFile(config.PATHS.CACHE_FILE, JSON.stringify(combinedData, null, 2), "utf-8");

      console.log(`Added ${contentToAdd.length} anime entries to cache.`);
    } catch (error) {
      console.error("Data writing failed:", error);
      throw error;
    }
  }

  async _fetchDataRecursively() {
    try {
      await this.rateLimiter.waitIfNeeded();

      const response = await fetch(config.BASE_URL, this._buildRequestPayload());
      const result = await response.json();

      if (!response.ok) {
        throw new Error("API request failed: " + JSON.stringify(result));
      }

      const mediaData = result.data.Page.media;

      if (mediaData.length > 0) {
        await this._writeData(mediaData);
        console.log(`Processed page ${this.pageNumber}`);
      }

      // Continue fetching if more pages exist
      if (result.data.Page.pageInfo.hasNextPage) {
        this.pageNumber++;
        await this._fetchDataRecursively();
      } else {
        console.log("Completed fetching all anime titles.");
      }
    } catch (error) {
      console.error("Recursive fetch error:", {
        message: error.message,
        page: this.pageNumber,
      });
      throw error;
    }
  }

  async fetchAllData() {
    try {
      await this._initializeDataFile();
      await this._fetchDataRecursively();
      console.log("Complete data fetch successfully.");
    } catch (error) {
      console.error("Data fetch failed:", error);
      throw error;
    }
  }
}

module.exports = AnilistFetcherService;
