const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const imageRoutes = require("./routes/upload.js");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", imageRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
