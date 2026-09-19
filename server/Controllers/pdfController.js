
const pdf = require("pdf-parse");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded"
      });
    }


    const data = await pdf(req.file.buffer);
    
    let text = data.text || "";

    //  basic cleanup
    text = text.replace(/\s+/g, " ").trim();

    if (text.length < 100) {
      return res.status(400).json({
        success: false,
        message: "PDF contains too little readable text"
      });
    }

    res.json({
      success: true,
      text
    });

  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to extract text from PDF"
    });
  }
};

module.exports = { uploadPdf };
