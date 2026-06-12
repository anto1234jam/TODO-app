const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// ================= JWT MIDDLEWARE =================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Received Token:", token);
console.log("JWT Secret:", JWT_SECRET);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token Missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    console.log("Verified User:", decoded);

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// ================= SIGNUP =================

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.userDetail.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await argon2.hash(password);
    const user = await prisma.userDetail.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Create token immediately after signup
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      token,
      email: user.email,
    });
  } catch (error) {
    console.log("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= LOGIN =================

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.userDetail.findFirst({
      where: {
        username,
        
      },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Username or Password",
      });
    }
      const validPassword = await argon2.verify(
      user.password,
      password
    );

    if (!validPassword) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      token,
      email: user.email,
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= GET TASKS =================

app.get("/tasks/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    const tasks = await prisma.userTask.findMany({
      where: {
        email,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.log("Get Tasks Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= ADD TASK =================

app.post("/tasks", verifyToken, async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { task, status, email } = req.body;

    const newTask = await prisma.userTask.create({
      data: {
        task,
        status,
        email,
      },
    });

    console.log("Task Saved:", newTask);

    res.json(newTask);
  } catch (error) {
    console.log("Add Task Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= DELETE TASK =================

app.delete("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.userTask.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= VERIFY TOKEN =================

app.get("/verify-token", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// ================= START SERVER =================

app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});