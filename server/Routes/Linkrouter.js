const router = require('express').Router();
const ensureAuthenticated = require("../Middlewares/Auth");

const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

async function extractArticle(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const dom = new JSDOM(response.data, { url });
  const reader = new Readability(dom.window.document);

  const article = reader.parse();

  if (!article || !article.textContent) {
    throw new Error("Could not extract content");
  }

  return article.textContent;
}

router.post(
  "/extract-from-link",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const { url } = req.body; 

      if (!url) {
        return res.status(400).json({
          success: false,
          message: "URL is required"
        });
      }

      const rawText = await extractArticle(url); 
      console.log(rawText);
      if (!rawText || typeof rawText !== "string") {
        return res.status(400).json({
          success: false,
          message: "Could not extract valid text"
        });
      }
      
      // Same reasoning as pdfController: RAG retrieves only the most
      // relevant/diverse chunks at generation time, so we no longer need to
      // aggressively truncate the raw extracted text here.
      const data = rawText.slice(0, 60000);

      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        text: data
      });

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Error occurred while extracting"
      });
    }
  }
);

module.exports = router;