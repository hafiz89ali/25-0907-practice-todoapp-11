import database from "../database/connection.js";

const createTodosTableSQL = `
    CREATE TABLE IF NOT EXISTS todos(
        id serial PRIMARY KEY,
        name varchar(255),
        is_completed boolean DEFAULT false,
        created_by integer REFERENCES users(id),
        created_at timestamp DEFAULT NOW()
    );
`;

async function createTodosTable() {
  try {
    database.query(createTodosTableSQL);
    console.log("Todos table created.");
  } catch (error) {
    console.error({ error: error.message });
  }
}

export default createTodosTable;
