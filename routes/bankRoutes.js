const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankController");

// Route to get all banks
router.get("/banks", bankController.getBanks);

// Route to create a new bank
router.post("/banks", bankController.createBank);

// Route to get a bank by ID
router.get("/banks/:id", bankController.getBankById);

// Route to update a bank by ID
router.put("/banks/:id", bankController.updateBank);

// Route to delete a bank by ID
router.delete("/banks/:id", bankController.deleteBank);

module.exports = router;
