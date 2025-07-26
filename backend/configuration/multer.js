const multer = require("multer");
const storage = multer.memoryStorage(); // store in memory for Cloudinary upload
const upload = multer({ storage });

module.exports = upload;
 