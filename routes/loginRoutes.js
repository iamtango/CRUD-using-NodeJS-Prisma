const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// Route to get all banks
router.get("/login", loginController.getUserLogin);

// Route to create a new bank
router.post("/login", loginController.createUserLogin);

// Route to get a bank by ID
router.get("/login/:id", loginController.getLoginUserById);

// Route to update a bank by ID
router.put("/login/:id", loginController.updateUserLogin);

// Route to delete a bank by ID
router.delete("/login/:id", loginController.deleteUserLoginById);

module.exports = router;
