import express, { urlencoded } from "express";
import router from "./routes/routes.js";
import "./database/connection.js";

console.log("System is running.");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use(router);

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
