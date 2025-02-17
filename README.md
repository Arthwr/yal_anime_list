# Anime Management WebApp
Self-educational mini-project

An anime management web application that retrieves data from the AniList GraphQL API to store and manage anime titles for personal use.  
Designed for screen sizes of 768px and higher, with an optimal experience at 2560px. 

Author of this repo is too lazy to implement mobile version of it.

## Tech Stack  
- **Node.js**  
- **Express.js**  
- **PostgreSQL**  
- **EJS**  
- **Shoelace** (Web Components)  

## Features  

- **Data Fetching & Storage**: Retrieves anime information from the AniList API, stores it in a PostgreSQL database, and converts the data into a predefined format.  
- **Database Management**: Creates tables and relationships for storing anime titles, genres, categories, and statuses.  
- **Category Assignment**: Users can assign categories such as "Watching," "Completed," "Plan to Watch," etc., to each anime title.  
- **Combinational Search**: Supports searching by name, genres, years, and release status.  
- **Database Limitations**: Due to the free-tier limitations of Render hosting, the database is available for one month per deployment. However, data can be refetched anytime, though assigned categories will be lost.  

## Preview  

Currently hosted on [Render](https://yal-anime-list.onrender.com/everything/) with DB access being available only until March 20, 2025.  

![yal-front](https://github.com/user-attachments/assets/c393a910-0ff5-4ead-960b-8291374d813c)  

## Configuration  

Default settings are pre-configured to fetch anime titles with a minimum score of 60 (out of 100) and from the year 2020 onwards.  

Application settings can be modified in the `anilist.config.js` file. This includes:  
- API options (request limits, results per page)  
- Filters (start date, media type, media format, minimum score, sorting)  

Additional GraphQL query parameters can be added or modified. For full reference, see the [AniList GraphQL Guide](https://docs.anilist.co/guide/graphql/).  

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
   Create a `.env` file in the root directory and add and define your database link and server port.

4. **Initialize the database**:
   ```sh
  node database/initialize-database.js  # Fetches anime titles
  npm run prod  # Starts the server
   ```

5. **Start the server**:
   ```sh
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.
