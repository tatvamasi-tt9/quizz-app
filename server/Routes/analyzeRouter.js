const router = require("express").Router();
const { analyzeDocument } = require("../Controllers/analyzeController");
const ensureAuthenticated = require("../Middlewares/Auth");

// POST /analyze-document - Analyze text and return cluster/topic information
router.post(
  "/analyze-document",
  ensureAuthenticated,
  analyzeDocument
);

module.exports = router;
