const router = require("express").Router();
const upload = require("../Middlewares/pdfUpload");
const { uploadPdf } = require("../Controllers/pdfController");
const ensureAuthenticated = require("../Middlewares/Auth");

// protected route (same auth as quiz)
router.post(
  "/upload/pdf",
  ensureAuthenticated,
  upload.single("pdf"),
  uploadPdf
);

module.exports = router;
