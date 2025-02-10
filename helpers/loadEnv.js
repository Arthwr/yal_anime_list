const dotenv = require("dotenv");
const fs = require("fs");

function loadEnv(defaultEnv = "development") {
  const env = process.env.NODE_ENV || defaultEnv;
  const envFilepath = `./.env.${env}`;

  if (fs.existsSync(envFilepath)) {
    dotenv.config({ path: envFilepath });
    console.log(`Loaded environment variables from ${envFilepath}`);
  } else {
    dotenv.config({ path: "./.env" });
    console.log(`Environment file ${envFilepath} not found. Loaded default .env file.`);
  }
}

loadEnv()

module.exports = loadEnv;
