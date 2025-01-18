const fs = require("node:fs");

const graphqlQuery = `
  query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $type: MediaType, $minScore: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: $type, startDate_greater: $startDate, averageScore_greater: $minScore) {
        title {
          romaji
        }
        status
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
`;

let pageNumber = 1;
let requestCount = 0;

const config = {
  requestLimit: 10,
  perPage: 50,
  startDate: 20240101,
  type: "ANIME",
  minScore: 70,
  baseUrl: "https://graphql.anilist.co",
  dbPath: "./db/anime-data.json",
};

// prettier-ignore
function getRequestOptions(page) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: {
        page,
        perPage: config.perPage,
        startDate: config.startDate,
        type: config.type,
        minScore: config.minScore
      },
    }),
  };
}

async function handleResponse(response) {
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

async function readCurrentData() {
  try {
    const currentData = await fs.promises.readFile(config.dbPath, "utf-8");
    return JSON.parse(currentData);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.promises.writeFile(config.dbPath, "[]", "utf-8");
      return [];
    }
    console.error("Error handling data file: ", error);
  }
}

async function writeData(content) {
  try {
    const currentData = await readCurrentData();
    const newData = Array.isArray(content) ? content : [content];
    const updatedData = [...currentData, ...newData];

    await fs.promises.writeFile(config.dbPath, JSON.stringify(updatedData, null, 2), "utf-8");
    console.log(`Successfuly wrote ${newData.length} items to ${config.dbPath}`);
  } catch (error) {
    console.log("Error writting to file: ", error);
  }
}

async function fetchAndWriteData() {
  try {
    // Anilist has 30 request per minute limit
    if (requestCount >= config.requestLimit) {
      console.log("Request limit reached.");
      return;
    }

    const response = await fetch(config.baseUrl, getRequestOptions(pageNumber));
    const result = await handleResponse(response);

    // If there is no data in body we skip
    if (result.data.Page.media.length > 0) {
      await writeData(result.data.Page.media);
      console.log(`Processed page ${pageNumber}`);
    }

    // Check if there is more data to fetch until there is no available nextPage
    if (result.data.Page.pageInfo.hasNextPage) {
      pageNumber++;
      requestCount++;
      await fetchAndWriteData();
    }
  } catch (error) {
    console.error("Error fetching data:", {
      message: error.message,
      status: error.status,
      details: error.errorDetails.errors,
      page: this.pageNumber,
    });
  }
}

fetchAndWriteData();
