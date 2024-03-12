const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateAccessToken = (bank) => {
  const payload = {
    id: bank.id,
    account_number: bank.account_number,
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

// Function to get all banks
const getBanks = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }

    const banks = await prisma.bankAccount.findMany({});
    res.status(200).json({ banks, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to create a new bank
const createBank = async (req, res) => {
  try {
    const newBank = await prisma.bankAccount.create({
      data: req.body,
    });

    const token = generateAccessToken(newBank);
    res.json({ bank: newBank, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a bank by ID
const getBankById = async (req, res) => {
  try {
    const bankId = parseInt(req.params.id);

    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const bank = await prisma.bankAccount.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      res.status(404).json({ error: "Bank not found" });
      return;
    }

    res.json({ bank, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a bank by ID
const updateBank = async (req, res) => {
  try {
    const bankId = parseInt(req.params.id);
    const { bank_name, account_type, account_number } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized Token" });
    }

    const updatedBank = await prisma.bankAccount.update({
      where: { id: bankId },
      data: {
        bank_name,
        account_type,
        account_number,
      },
    });

    res.json({ updatedBank, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a bank by ID
const deleteBank = async (req, res) => {
  try {
    const bankId = parseInt(req.params.id);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const verificationResult = verifyAccessToken(token);

    if (!verificationResult.success) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const deletedBank = await prisma.bankAccount.delete({
      where: { id: bankId },
    });

    res.json({ deletedBank, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getBankById,
  getBanks,
  createBank,
  updateBank,
  deleteBank,
};
