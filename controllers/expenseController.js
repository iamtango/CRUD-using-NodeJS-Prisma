const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateAccessToken = (expense) => {
  const payload = {
    id: expense.id,
    title: expense.title,
    amount: expense.amount,
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

// Function to get all expenses
const getExpenses = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);
    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }
    const expenses = await prisma.expense.findMany({});
    res.status(200).json({ expenses, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to create a new expense
const createExpense = async (req, res) => {
  try {
    const newExpense = await prisma.expense.create({
      data: req.body,
    });
    console.log("newExpense =>", newExpense);
    const token = generateAccessToken(newExpense);
    console.log("token =>", token);

    res.status(200).json({ expense: newExpense, token });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get an expense by ID
const getExpenseById = async (req, res) => {
  const expenseId = parseInt(req.params.id);
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    res.json({ expense, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update an expense by ID
const updateExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id);
    const { title, amount } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { title, amount },
    });

    res.json({ updatedExpense, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete an expense by ID
const deleteExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ deletedExpense, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getExpenseById,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
