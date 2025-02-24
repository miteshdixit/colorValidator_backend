// backend/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the upload path
const uploadPath = path.join(__dirname, "uploads");

// Ensure the uploads folder exists synchronously
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // Create folder synchronously
  console.log("Uploads folder created at:", uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = { upload };
