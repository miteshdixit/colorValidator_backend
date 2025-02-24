const sharp = require("sharp");
const colorDiff = require("color-diff");
const wcagContrast = require("wcag-contrast");
const path = require("path");
const { Vibrant } = require("node-vibrant/node"); // Corrected import
const fs = require("fs");

// Brand Colors
const brandColors = [
  { R: 255, G: 0, B: 0 },
  { R: 0, G: 61, B: 165 },
  { R: 114, G: 181, B: 232 },
  { R: 84, G: 88, B: 90 },
  { R: 255, G: 182, B: 18 },
  { R: 21, G: 139, B: 69 },
];

const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const filePath = req.file.path;

    // Extract dominant colors from the image
    const { dominant } = await sharp(filePath).stats();

    // Extract palette
    const palette = await Vibrant.from(filePath).getPalette();

    const extractedColor = {
      R: Math.round(dominant.r),
      G: Math.round(dominant.g),
      B: Math.round(dominant.b),
    };

    // Find closest brand color
    const closestColor = colorDiff.closest(extractedColor, brandColors);
    const isMatch = colorDiff.diff(extractedColor, closestColor) < 100;

    // Check for accessibility (against white background)
    const extractedHex = `#${(
      (1 << 24) +
      (extractedColor.R << 16) +
      (extractedColor.G << 8) +
      extractedColor.B
    )
      .toString(16)
      .slice(1)}`;
    const contrastRatio = wcagContrast.hex(extractedHex, "#FFFFFF");

    const accessibilityIssues = [];
    if (contrastRatio < 4.5) {
      accessibilityIssues.push({
        message: "Low contrast detected",
        contrastRatio: contrastRatio.toFixed(2),
        colors: [
          `rgb(${extractedColor.R}, ${extractedColor.G}, ${extractedColor.B})`,
          "#FFFFFF",
        ],
      });
    }

    // Full report
    const report = {
      extractedColors: [
        `rgb(${extractedColor.R}, ${extractedColor.G}, ${extractedColor.B})`,
      ],
      colorMatching: {
        extractedColor,
        closestBrandColor: closestColor,
        isMatch,
      },
      accessibilityIssues,
    };

    res.status(200).json({
      message: "Upload and analysis completed successfully",
      fileUrl: `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`,
      report,
      palette,
    });
  } catch (error) {
    console.error("Error during upload and analysis:", error);
    res.status(500).json({ message: "Failed to process image", error });
  }
};

module.exports = { uploadAndAnalyze };
