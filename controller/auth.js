import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

import database from "../database/connection.js";

async function registerUsers(req, res) {
  // get user data from client
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // make sure all fields are filled in
  if (!username || !email || !password) {
    return res.status(401).json("All fields are required.");
  }

  // test email is valid
  const emailRegex = /\S+@\S+.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(401).json("Invalid email.");
  }

  // test password is match
  if (password !== confirmPassword) {
    return res.status(401).json("Password did not match.");
  }

  // encode password using bcrypt
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // prepare information to store in db
  const insertUsersSQL = `
    INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id
  `;

  try {
    const resDb = await database.query(insertUsersSQL, [
      username,
      email,
      hashedPassword,
    ]);
    const userId = resDb.rows[0].id;
    const resData = {
      message: "User registered successfully.",
      data: {
        userId,
        username,
        email,
      },
    };
    return res.status(201).json(resData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  // get user data from client
  const email = req.body.email;
  const password = req.body.password;

  // check all fields are present
  if (!email || !password) {
    return res.status(401).json("All fields are required.");
  }

  // check if valid email
  const emailRegex = /\S+@\S+.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(401).json("Invalid email.");
  }

  const selectUserSQL = `
    SELECT * FROM users WHERE email = $1
  `;

  // get user data using email
  try {
    const resDb = await database.query(selectUserSQL, [email]);
    if (resDb.rows.length === 0) {
      return res.status(401).json("Invalid email or password.");
    }

    // test password
    const user = resDb.rows[0];
    const dbPassword = user.password;
    const isPasswordMatch = bcrypt.compareSync(password, dbPassword);

    if (!isPasswordMatch) {
      return res.status(401).json("Invalid email or password.");
    }

    // create jwt token
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET);
    const resData = {
      message: "Login successful.",
      token,
    };
    return res.status(200).json({ resData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const authController = {
  registerUsers,
  loginUser,
};

export default authController;
