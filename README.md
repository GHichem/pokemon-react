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

### 5. Navigate Back to the Project Root and Install Dependencies
Move back to the main project folder:

```sh
cd 'c:/path/to/your/project/pokemon-react'
npm i
```

### 6. Start the Application  
Run the React app locally:

```sh
npm start
```

### 7. Screenshot  

Upon opening the application for the first time, you’ll be prompted to choose the generation team you want to create:
![image](https://github.com/user-attachments/assets/90436c82-e279-405c-ab0b-fbfd684246c0)

After selecting a generation, such as Gen 1, you will see an empty team. Below that, a list of Pokémon from the chosen generation will appear. You can search for specific Pokémon and add them to your team by clicking on them.

Example of an empty team:
![image](https://github.com/user-attachments/assets/2605bcd9-4a53-4123-be30-d24c4a68517d)

You can toggle the shiny variant of a Pokémon by clicking the star icon. Additionally, click on the Pokémon image in your team to remove it.
![image](https://github.com/user-attachments/assets/2f079080-e3b6-445f-ab89-be5db817bb7a)

At the top left of the page, there’s a button that takes you to the team overview page. From here, you can view all the teams you've created and delete teams by clicking the trash icon.

Example of teams created from Gen 1 and Gen 2:
![image](https://github.com/user-attachments/assets/a2f2512b-3b29-4f40-a2f0-519902fd7e0d)

Click on a team to edit it, allowing you to add or remove Pokémon. You can also click the "+" button to return to the generation selection page.

Lastly, your database will reflect the updated information, as shown below:
![image](https://github.com/user-attachments/assets/2e3d7aa5-6469-48aa-bd4a-9876e2e36795)
![image](https://github.com/user-attachments/assets/56652888-0053-46f8-8894-f2c2c150dfc4)
