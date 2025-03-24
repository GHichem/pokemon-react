const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "pokemon-react",
  password: "619619",
  port: 5432,
});

db.connect();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/create-table", async (req, res) => {
  try {
    // Query to get all existing tables that start with "team"
    const existingTablesQuery = `
      SELECT LOWER(table_name) AS table_name
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name ~* '^Team[0-9]+$'
      ORDER BY table_name ASC;
    `;

    const existingTablesResult = await db.query(existingTablesQuery);
    const existingTables = existingTablesResult.rows.map(row => row.table_name);

    // Determine the next available "TeamX" name
    let newTableNumber = 1;
    while (existingTables.includes(`team${newTableNumber}`)) { // Ensure lowercase comparison
      newTableNumber++;
    }
    
    const newTableName = `team${newTableNumber}`;

    // Create new table
    const createTableQuery = `
      CREATE TABLE public."${newTableName}" (  -- Ensure table name is quoted
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        img TEXT NOT NULL,
        shiny_img TEXT NOT NULL,
        type1 TEXT NOT NULL,
        type2 TEXT,
        shiny BOOLEAN DEFAULT false
      );
    `;

    await db.query(createTableQuery);

    // Insert into team_generations
    const generation = req.query.gen; // Assuming the generation is passed as a query parameter
    const insertGenerationQuery = `
      INSERT INTO team_generations (team_number, generation)
      VALUES ($1, $2)
    `;
    await db.query(insertGenerationQuery, [newTableNumber, generation]);

    res.status(200).send(`Table ${newTableName} created successfully!`);
  } catch (error) {
    console.error("Error creating table: ", error);
    res.status(500).send("Error creating table.");
  }
});

app.get("/team/:teamNumber", async (req, res) => {
  try {
    const { teamNumber } = req.params;
    const tableName = `team${teamNumber}`; // Construct the table name

    // Validate table exists before querying
    const tableExistsQuery = `
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = LOWER($1)
    `;

    const tableExistsResult = await db.query(tableExistsQuery, [tableName.toLowerCase()]);

    if (tableExistsResult.rows.length === 0) {
      return res.status(404).json({ error: `Table ${tableName} does not exist.` });
    }

    // Fetch data from the existing table
    const fetchTeamQuery = `SELECT * FROM public."${tableName}" ORDER BY id ASC`; // Quoted table name
    const teamResult = await db.query(fetchTeamQuery);

    res.status(200).json(teamResult.rows);
  } catch (error) {
    console.error("Error fetching team: ", error);
    res.status(500).json({ error: "Error fetching team." });
  }
});

app.get("/existing-tables", async (req, res) => {
  try {
    const existingTablesQuery = `
      SELECT LOWER(table_name) AS table_name
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name ~* '^Team[0-9]+$'
      ORDER BY table_name ASC;
    `;

    const existingTablesResult = await db.query(existingTablesQuery);
    const existingTables = existingTablesResult.rows.map(row => row.table_name);

    const tablesWithGenerations = await Promise.all(existingTables.map(async (tableName) => {
      const teamNumber = parseInt(tableName.replace('team', ''), 10);
      const teamQuery = `SELECT * FROM public."${tableName}" ORDER BY id ASC`; // Quoted table name
      const teamResult = await db.query(teamQuery);
      const team = teamResult.rows;
      const generation = await getGenerationForTeam(teamNumber); // Implement this function to get the generation for the team
      return [team, generation];
    }));

    res.status(200).json(tablesWithGenerations);
  } catch (error) {
    console.error("Error fetching existing tables: ", error);
    res.status(500).send("Error fetching existing tables.");
  }
});

const getGenerationForTeam = async (teamNumber) => {
  try {
    const generationQuery = `
      SELECT generation
      FROM team_generations
      WHERE team_number = $1
    `;
    const result = await db.query(generationQuery, [teamNumber]);
    if (result.rows.length > 0) {
      return result.rows[0].generation;
    } else {
      return null; // or a default value if the generation is not found
    }
  } catch (error) {
    console.error("Error fetching generation for team: ", error);
    return null; // or handle the error as needed
  }
};

const handleCreateTable = async (gen) => {
  // Trigger the backend API to create a table
  try {
    await axios.get(`http://localhost:3001/create-table?gen=${gen}`);  // Pass the generation as a query parameter
    console.log("Table created successfully!");
    let nextTeamNumber = tables.length + 1;
    console.log(nextTeamNumber);
    let team = await axios.get("http://localhost:3001/team/" + nextTeamNumber);

    setTables([...tables, [team.data, gen]]);
    setShowGenerations(false); // Hide generations after selecting one
  } catch (error) {
    console.error("Error creating table:", error);
    alert("Failed to create table!");
  }
};

app.delete("/delete-table/:teamNumber", async (req, res) => {
  try {
    const { teamNumber } = req.params;
    const tableName = `team${teamNumber}`;

    // Validate table exists before deleting
    const tableExistsQuery = `
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = LOWER($1)
    `;
    const tableExistsResult = await db.query(tableExistsQuery, [tableName.toLowerCase()]);

    if (tableExistsResult.rows.length === 0) {
      return res.status(404).json({ error: `Table ${tableName} does not exist.` });
    }

    // Delete the table
    const deleteTableQuery = `DROP TABLE public."${tableName}"`;
    await db.query(deleteTableQuery);

    // Delete the corresponding entry in team_generations
    const deleteGenerationQuery = `
      DELETE FROM team_generations
      WHERE team_number = $1
    `;
    await db.query(deleteGenerationQuery, [teamNumber]);

    res.status(200).send(`Table ${tableName} and its generation entry deleted successfully!`);
  } catch (error) {
    console.error("Error deleting table: ", error);
    res.status(500).send("Error deleting table.");
  }
});

app.get("/generation/:genNumber", async (req, res) => {
  try {
    const { genNumber } = req.params;
    const response = await axios.get(`https://pokeapi.co/api/v2/generation/${genNumber}`);
    
    if (!response.data.pokemon_species) {
      return res.status(404).json({ error: "Generation data not found." });
    }

    let pokemonList = await Promise.all(response.data.pokemon_species.map(async (pokemon) => {
      try {
        const name = pokemon.name;
        const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return {
          name,
          img: result.data.sprites.front_default || null,
          shiny_img: result.data.sprites.front_shiny || null,
          type1: result.data.types?.[0]?.type.name || null,
          type2: result.data.types?.[1]?.type.name || null,
          url: pokemon.url // Add the URL to the object
        };
      } catch (err) {
        console.error(`Error fetching Pokémon ${pokemon.name}:`, err.message);
        return null; // Skip Pokémon that failed to fetch
      }
    }));

    // Filter out null values and sort by the last number in the URL
    pokemonList = pokemonList.filter(pokemon => pokemon !== null).sort((a, b) => {
      const idA = parseInt(a.url.split('/').filter(Boolean).pop(), 10);
      const idB = parseInt(b.url.split('/').filter(Boolean).pop(), 10);
      return idA - idB;
    });

    res.status(200).json(pokemonList);
  } catch (error) {
    console.error("Error fetching generation data: ", error);
    res.status(500).json({ error: "Error fetching generation data." });
  }
});

app.post("/add-pokemon/:teamNumber", async (req, res) => {
  try {
    const { teamNumber } = req.params;
    const { name, img, shiny_img, type1, type2 } = req.body;
    const tableName = `team${teamNumber}`;

    // Validate table exists before inserting
    const tableExistsQuery = `
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = LOWER($1)
    `;
    const tableExistsResult = await db.query(tableExistsQuery, [tableName.toLowerCase()]);

    if (tableExistsResult.rows.length === 0) {
      return res.status(404).json({ error: `Table ${tableName} does not exist.` });
    }

    // Check if the team already has 6 Pokémon
    const countPokemonQuery = `SELECT COUNT(*) FROM public."${tableName}"`;
    const countResult = await db.query(countPokemonQuery);
    const pokemonCount = parseInt(countResult.rows[0].count, 10);

    if (pokemonCount >= 6) {
      return res.status(400).json({ error: `Team ${teamNumber} already has 6 Pokémon.` });
    }

    // Insert Pokémon into the team table
    const insertPokemonQuery = `
      INSERT INTO public."${tableName}" (name, img, shiny_img, type1, type2)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(insertPokemonQuery, [name, img, shiny_img, type1, type2]);

    res.status(200).send(`Pokémon ${name} added to team ${teamNumber} successfully!`);
  } catch (error) {
    console.error("Error adding Pokémon to team: ", error);
    res.status(500).send("Error adding Pokémon to team.");
  }
});

app.delete("/remove-pokemon/:teamNumber/:pokemonName", async (req, res) => {
  try {
    const { teamNumber, pokemonName } = req.params;
    const tableName = `team${teamNumber}`;

    // Validate table exists before deleting
    const tableExistsQuery = `
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = LOWER($1)
    `;
    const tableExistsResult = await db.query(tableExistsQuery, [tableName.toLowerCase()]);

    if (tableExistsResult.rows.length === 0) {
      return res.status(404).json({ error: `Table ${tableName} does not exist.` });
    }

    // Delete Pokémon from the team table
    const deletePokemonQuery = `
      DELETE FROM public."${tableName}" WHERE name = $1
    `;
    await db.query(deletePokemonQuery, [pokemonName]);

    res.status(200).send(`Pokémon ${pokemonName} removed from team ${teamNumber} successfully!`);
  } catch (error) {
    console.error("Error removing Pokémon from team: ", error);
    res.status(500).send("Error removing Pokémon from team.");
  }
});

app.put("/update-shiny/:teamNumber/:pokemonName", async (req, res) => {
  try {
    const { teamNumber, pokemonName } = req.params;
    const { isShiny } = req.body;
    const tableName = `team${teamNumber}`;

    // Validate table exists before updating
    const tableExistsQuery = `
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = LOWER($1)
    `;
    const tableExistsResult = await db.query(tableExistsQuery, [tableName.toLowerCase()]);

    if (tableExistsResult.rows.length === 0) {
      return res.status(404).json({ error: `Table ${tableName} does not exist.` });
    }

    // Update shiny status in the team table
    const updateShinyQuery = `
      UPDATE public."${tableName}" SET shiny = $1 WHERE name = $2
    `;
    await db.query(updateShinyQuery, [isShiny, pokemonName]);

    res.status(200).send(`Pokémon ${pokemonName} shiny status updated to ${isShiny} successfully!`);
  } catch (error) {
    console.error("Error updating shiny status: ", error);
    res.status(500).send("Error updating shiny status.");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
