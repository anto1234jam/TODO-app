const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();

app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();


// MYSQL CONNECTION
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "todo_app"

});


// DATABASE CONNECT
db.connect((err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("MySQL Connected");

    }

});


// SIGNUP API
// const prisma = require("./prisma");

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.userDetail.create({
      data: {
        username,
        email,
        password
      }
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.log("SIGNUP ERROR:");
    console.log(error);

    res.json({
      success: false,
      error: error.message
    });
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.userDetail.findFirst({
      where: {
        username,
        password
      }
    });

    if (user) {
      res.json({
        success: true,
        email: user.email
      });
    } else {
      res.json({
        success: false
      });
    }

  } catch (error) {
    console.log(error);

    res.json({
      success: false
    });
  }
});

// GET USER TASKS
app.get("/tasks/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const tasks = await prisma.userTask.findMany({
      where: {
        email
      }
    });

    res.json(tasks);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


// ADD TASK
app.post("/tasks", async (req, res) => {
  try {
    const { task, status, email } = req.body;

    const newTask = await prisma.userTask.create({
      data: {
        task,
        status,
        email
      }
    });

    res.json(newTask);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.userTask.delete({
      where: {
        id
      }
    });

    res.json({
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen(3000, () => {

    console.log("Server Running On Port 3000");

});