const router = require("express").Router();
const upload = require("../Middlewares/imageUpload");

const { uploadImage } = require("../Controllers/imageController");
const ensureAuthenticated = require("../Middlewares/Auth");

router.post(
  "/upload/image",
  ensureAuthenticated,
  upload.single("image"),
  uploadImage
);

module.exports = router;
