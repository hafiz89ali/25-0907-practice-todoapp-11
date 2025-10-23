import database from "../database/connection.js";

const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        username varchar(255) UNIQUE,
        email varchar(255) UNIQUE,
        password varchar(255),
        created_at timestamp DEFAULT NOW()
    );
`;

async function createUsersTable() {
  try {
    database.query(createUsersTableSQL);
    console.log("Users table created.");
  } catch (error) {
    console.error({ error: error.message });
  }
}

export default createUsersTable;
