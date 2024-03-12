const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to get all users
const getUsers = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);
    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }
    const users = await prisma.user.findMany();
    res.status(200).json({ users, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to create a new user
const createUser = async (req, res) => {
  try {
    const postUsers = await prisma.user.create({
      data: req.body,
    });
    const token = generateAccessToken(postUsers);
    res.json({ user: postUsers, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { email, full_name, password } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        full_name,
        password,
      },
    });

    res.json({ updatedUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ deletedUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
