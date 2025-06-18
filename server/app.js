const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const noteRoutes = require("./routes/noteRoutes");
const dataService = require("./daoMethods/dataService");

const app = express();

// Initialize data directories
dataService.ensureDirectories().catch(console.error);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);
app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
