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

First time opening the page looks like this, with just a plus button:
![image](https://github.com/user-attachments/assets/95073d85-4421-4bd0-86ad-987307d35019)

When clicked, you get the option to select from one of these different generations to create your team, or you can click on the top left button to go back to the first page:
![image](https://github.com/user-attachments/assets/aafee462-239d-43dc-a86d-668b055dc1ca)

If you clicked on Gen 1, for example, you will see this—an empty team. Under it, you see a list of Pokémon from Gen 1. You can use the search bar to filter and just click on a Pokémon you want to add.
Example for an empty team:
![image](https://github.com/user-attachments/assets/2605bcd9-4a53-4123-be30-d24c4a68517d)

You can click on the star to switch to a shiny Pokémon. You can also click on the Pokémon image in your team to remove it from the team:
![image](https://github.com/user-attachments/assets/2f079080-e3b6-445f-ab89-be5db817bb7a)

If you click on the top left button, you return to the first page, and it shows all the teams you created. You can click on the trash icon to remove a team.
For example, here is a team with Gen 1 and a team with Gen 2 (you can make two teams from the same generation):
![image](https://github.com/user-attachments/assets/a2f2512b-3b29-4f40-a2f0-519902fd7e0d)

If you click on a team, it takes you back where you can edit it (remove/add Pokémon).

Lastly, your database should look like this with the updated info:
![image](https://github.com/user-attachments/assets/2e3d7aa5-6469-48aa-bd4a-9876e2e36795)
![image](https://github.com/user-attachments/assets/56652888-0053-46f8-8894-f2c2c150dfc4)
