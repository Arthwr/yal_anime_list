# Anime Management WebApp

Anime management web application that retrieves data from AniList GraphQL API to store and manage anime titles for personal use. 
Adapted only for screen sizes from 768px and higher, while for the best experience 2560px is recommended. 

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Shoelace**: UI components library
- **EJS**: Embedded JavaScript templating
- **Shoelace custom web components**
- **Helmet**
- **Express-Rate-Limit**


# Features

- **Data Fetching and Storage**: Fetches anime information from the AniList API, loads it into a PostgreSQL database, and converts the data into a predefined format.
- **Database Management**: Creates tables and relationships for storing anime titles, genres, categories, and statuses.
- **Category Assignment**: Allows users to assign categories such as "Watching", "Completed", "Plan to Watch", etc., to each anime title.
- **Combinational Search**: Supports combinational search by name query, genre (single or multiple), year (single or multiple), and status.
- **Database Limitations**: Due to the free tier of Render hosting, the database is limited to a single month of use. However, the script can easily refetch titles, although assigned categories will be lost.

# Preview
Currently hosted at [render](https://yal-anime-list.onrender.com/everything/) until 20th of March 2025. 

![yal-front](https://github.com/user-attachments/assets/c393a910-0ff5-4ead-960b-8291374d813c)

  

## Configuration

Default settings for fetching titles configured with a minimum score of 60 (out of 100) and year 2020 onwards. GraphQL string query can be easily customized through different variety of params: https://docs.anilist.co/guide/graphql/
The application settings can be configured through the `anilist.config.js` file. This includes API options such as request limits, results per page, filters for start date, media type, media format, minimum score, and sorting options.

## Usage

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/anime-management-webapp.git
   cd anime-management-webapp
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your environment variables.

4. **Initialize the database**:
   ```sh
   node database/initialize-database.js
   ```

5. **Start the server**:
   ```sh
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.
