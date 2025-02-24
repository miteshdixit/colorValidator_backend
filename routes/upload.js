const express = require("express");
const { upload } = require("../multer.js");
const { uploadAndAnalyze } = require("../controllers/image.controller.js");

const routes = express.Router();

routes.post("/uploads", upload.single("image"), uploadAndAnalyze);

module.exports = routes;
