const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const bankRoutes = require("./routes/bankRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const loginRoutes = require("./routes/loginRoutes");
const authenticateToken = require("./middleware");

const port = 6000 || process.env.PORT;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for handling CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Use the user routes
// app.use("/api", authenticateToken);
app.use("/", loginRoutes);
app.use("/api", userRoutes);
app.use("/api", bankRoutes);
app.use("/api", expenseRoutes);
app.use("/api", categoryRoutes);

// Handling 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
