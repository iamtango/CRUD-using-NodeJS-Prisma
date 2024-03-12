const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateAccessToken = (category) => {
  const payload = {
    id: category.id,
    name: category.name,
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

// Function to get all categories
const getCategories = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);
    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }
    const categories = await prisma.category.findMany({});
    res.status(200).json({ categories, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to create a new category
const createCategory = async (req, res) => {
  try {
    const newCategory = await prisma.category.create({
      data: req.body,
    });
    const token = generateAccessToken(newCategory);

    res.json({ category: newCategory, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const token = req.header("Authorization")?.replace("Bearer ", "");

    const verificationResult = verifyAccessToken(token);
    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.json({ category: category, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;

    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      },
    });

    res.json({ category: updatedCategory, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({ deletedCategory, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
