const fs = require("node:fs");
const RateLimiter = require("./utils/RateLimiter.js");
const config = require("./config.js");
const queries = require("./queries.js");

class AnimeDataFetch {
  constructor() {
    this.pageNumber = 1;
    this.rateLimiter = new RateLimiter(config.requestLimit);
  }

  getRequestOptions() {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: queries.GRAPHQL_ANILIST_QUERY,
        variables: {
          page: this.pageNumber,
          perPage: config.perPage,
          startDate: config.startDate,
          type: config.type,
          minScore: config.minScore,
        },
      }),
    };
  }

  async handleResponse(response) {
    const json = await response.json();
    if (!response.ok) {
      throw {
        message: "Failed to fetch data",
        status: response.status,
        errorDetails: json,
      };
    }
    return json;
  }

  async ensureDirectoryExists() {
    try {
      await fs.promises.mkdir(config.dataDirPath, { recursive: true });
    } catch (error) {
      console.error("Failed to create directory: ", error);
      throw error;
    }
  }

  async initializeDataFile() {
    try {
      await this.ensureDirectoryExists();
      try {
        // Deleting old data on new build if it exists
        await fs.promises.unlink(config.dataPath);
        console.log(`Deleted existing ${config.dataPath}`);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error(`Failed to delete ${config.dataPath}:`, error.message);
          throw error;
        }
      }

      // Create new empty file
      await fs.promises.writeFile(config.dataPath, "[]", "utf-8");
      console.log("Initialized new data file.");
    } catch (error) {
      console.error("Error during file initialization:", error.message);
      throw error;
    }
  }

  async readCurrentData() {
    try {
      const currentData = await fs.promises.readFile(config.dataPath, "utf-8");
      return JSON.parse(currentData);
    } catch (error) {
      console.error("Error reading data file:", error.message);
      throw error;
    }
  }

  async writeData(content) {
    try {
      const currentData = await this.readCurrentData();
      const newData = Array.isArray(content) ? content : [content];
      const updatedData = [...currentData, ...newData];

      await fs.promises.writeFile(config.dataPath, JSON.stringify(updatedData, null, 2), "utf-8");
      console.log(`Successfuly wrote ${newData.length} items to ${config.dataPath}`);
    } catch (error) {
      console.log("Error writting to file: ", error);
      throw error;
    }
  }

  async fetchAndWriteData() {
    try {
      // Anilist has 30 request per minute limit, so we limit it to 25 with rateLimiter.
      await this.rateLimiter.waitIfNeeded();

      const response = await fetch(config.baseUrl, this.getRequestOptions());
      const result = await this.handleResponse(response);

      // If there is no data in body we skip
      if (result.data.Page.media.length > 0) {
        await this.writeData(result.data.Page.media);
        console.log(`Processed page ${this.pageNumber}`);
      }

      // Check if there is more data to fetch until there is no available nextPage
      if (result.data.Page.pageInfo.hasNextPage) {
        this.pageNumber++;
        await this.fetchAndWriteData();
      } else {
        console.log("Finished fetching all data");
      }
    } catch (error) {
      console.error("Error fetching data:", {
        message: error.message,
        status: error.status,
        details: error.errorDetails?.errors || "No error details available",
        page: this.pageNumber,
      });

      throw error;
    }
  }
}

async function fetchAnilist() {
  const fetcher = new AnimeDataFetch();

  try {
    await fetcher.initializeDataFile();
    await fetcher.fetchAndWriteData();

    console.log("Data fetching process completed successfully.");
  } catch (error) {
    console.error("Fatal error during execution:", error.message);
    process.exitCode = 1;
  }
}

module.exports = fetchAnilist;
