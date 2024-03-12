const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController"); // Adjust the path accordingly

// Route to get all expenses
router.get("/expenses", expenseController.getExpenses);

// Route to create a new expense
router.post("/expenses", expenseController.createExpense);

// Route to get an expense by ID
router.get("/expenses/:id", expenseController.getExpenseById);

// Route to update an expense by ID
router.put("/expenses/:id", expenseController.updateExpense);

// Route to delete an expense by ID
router.delete("/expenses/:id", expenseController.deleteExpense);

module.exports = router;
