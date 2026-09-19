const Tesseract = require("tesseract.js");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    const {
      data: { text }
    } = await Tesseract.recognize(
      req.file.buffer,
      "eng",
      { logger: () => {} }
    );

    const cleanedText = text
      .replace(/\s+/g, " ")
      .trim();

    if (cleanedText.length < 80) {
      return res.status(400).json({
        success: false,
        message: "Could not extract enough text from image"
      });
    }

    res.json({
      success: true,
      text: cleanedText
    });

  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to extract text from image"
    });
  }
};

module.exports = { uploadImage };
