# Pokémon React

## Setup Instructions

### 1. Configure the Database  
Edit the `db.js` file to match your database credentials:  

```js
const db = new pg.Client({
  user: 'YOUR_DB_USER',
  host: 'YOUR_DB_HOST',
  database: 'YOUR_DB_NAME',
  password: 'YOUR_DB_PASSWORD',
  port: YOUR_DB_PORT,  // e.g., 5432 for PostgreSQL
});
```

### 2. Create the Required Table  
Run the following SQL command in your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS team_generations (
  team_number INTEGER PRIMARY KEY,
  generation INTEGER NOT NULL
);
```

### 3. Navigate to the `src` Directory  
Open a terminal and go to the `src` directory:

```sh
cd 'c:/path/to/your/project/pokemon-react/src'
```

### 4. Run the Database API  
Start the backend service on port `3001`:

```sh
node db.js
```

### 5. Navigate to the Project Root Directory  
Move back to the main project folder:

```sh
cd 'c:/path/to/your/project/pokemon-react'
```

### 6. Install Dependencies  
Run the following command to install all necessary packages:

```sh
npm i
```

### 7. Start the Application  
Run the React app locally:

```sh
npm start
```

### 8. Screenshot  
Include a screenshot here by adding an image file to your project and referencing it like this:

```md
![App Screenshot](./screenshot.png)
```

---