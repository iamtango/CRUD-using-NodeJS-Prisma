const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateAccessToken = (login) => {
  const payload = {
    id: login.id,
    email: login.email,
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
const getUserLogin = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);
    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }
    const userLogin = await prisma.login.findMany();
    res.status(200).json({ userLogin, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to create a new user
const createUserLogin = async (req, res) => {
  try {
    const createNewUserLogin = await prisma.login.create({
      data: req.body,
    });
    const token = generateAccessToken(createNewUserLogin);
    res.json({ user: createNewUserLogin, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a user by ID
const getLoginUserById = async (req, res) => {
  const userLoginId = parseInt(req.params.id);
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const UserLoginById = await prisma.login.findUnique({
      where: { id: userLoginId },
    });

    if (!UserLoginById) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ UserLoginById, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a user by ID
const updateUserLogin = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { email, full_name, password } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const updatedUserLogin = await prisma.login.update({
      where: { id: userId },
      data: {
        email,
        full_name,
        password,
      },
    });

    res.json({ updatedUserLogin, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a user by ID
const deleteUserLoginById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const deletedUserLogin = await prisma.login.delete({
      where: { id: userId },
    });

    res.json({ deletedUserLogin, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserLogin,
  getLoginUserById,
  createUserLogin,
  updateUserLogin,
  deleteUserLoginById,
};
