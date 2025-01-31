### 1. `statuses` Table

| Field Name  | Data Type     | Constraints           | Description                |
|-------------|---------------|-----------------------|----------------------------|
| `status_id` | INT           | PRIMARY KEY           | Unique ID for each status. |
| `name`      | VARCHAR(50)   | NOT NULL, UNIQUE      | Name of the status.        |

---

### 2. `anime_titles` Table

| Field Name      | Data Type       | Constraints                 | Description                     |
|-----------------|-----------------|-----------------------------|---------------------------------|
| `title_id`      | INT             | PRIMARY KEY                 | Unique ID for each anime.       |
| `title`         | VARCHAR(255)    | NOT NULL, UNIQUE            | Title of the anime.             |
| `description`   | TEXT            |                             | Description of the anime.       |
| `release_date`  | INT             |                             | Release date of the anime.      |
| `status_id`     | INT             | FOREIGN KEY                 | References `statuses.status_id` |
| `image_url`     | VARCHAR(2048)   | NOT NULL                    | URL to the anime cover image.   |
| `average_score` | INT             |                             | Average score of anime title.   |

---

### 3. `genre_list` Table

| Field Name  | Data Type     | Constraints           | Description                |
|-------------|---------------|-----------------------|----------------------------|
| `genre_id`  | INT           | PRIMARY KEY           | Unique ID for each genre.  |
| `name`      | VARCHAR(50)   | NOT NULL, UNIQUE      | Name of the genre.         |

---

### 4. `anime_genres` Table

| Field Name  | Data Type     | Constraints                        | Description                          |
|-------------|---------------|------------------------------------|--------------------------------------|
| `anime_id`  | INT           | PRIMARY KEY, FOREIGN KEY           | References `anime_titles.title_id`.  |
| `genre_id`  | INT           | PRIMARY KEY, FOREIGN KEY           | References `genre_list.genre_id`.    |

---

### 5. `categories` Table

| Field Name    | Data Type     | Constraints           | Description                         |
|---------------|---------------|-----------------------|-------------------------------------|
| `category_id` | INT           | PRIMARY KEY           | Unique ID for each category.        |
| `name`        | VARCHAR(255)  | NOT NULL, UNIQUE      | Name of the category.               |

---

### 6. `anime_categories` Table

| Field Name    | Data Type     | Constraints                        | Description                          |
|---------------|---------------|------------------------------------|--------------------------------------|
| `category_id` | INT           | PRIMARY KEY, FOREIGN KEY           | References `categories.category_id`. |
| `anime_id`    | INT           | PRIMARY KEY, FOREIGN KEY           | References `anime_titles.title_id`.  |
| `added_at`    | TIMESTAMP     | DEFAULT NOW()                      | Timestamp when the entry was added.  |

---
