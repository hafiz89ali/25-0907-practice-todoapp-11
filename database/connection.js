import { Client } from "pg";
import { configDotenv } from "dotenv";
import createUsersTable from "../models/user.js";
import createTodosTable from "../models/todo.js";

configDotenv();

const database = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

async function testConnectionAndLog() {
  try {
    await database.connect();
    const currentDatabase = await database.query("SELECT current_database()");
    const now = await database.query("SELECT NOW()");
    const databaseName = currentDatabase.rows[0].current_database;
    const time = now.rows[0].now;
    console.log(`Connected to database ${databaseName} on ${time}`);
    createUsersTable();
    createTodosTable();
  } catch (error) {
    console.error({ error: error.message });
  }
}

testConnectionAndLog();

export default database;
