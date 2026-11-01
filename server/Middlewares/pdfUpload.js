const multer = require("multer");

const storage = multer.memoryStorage(); // keep file in memory

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;
