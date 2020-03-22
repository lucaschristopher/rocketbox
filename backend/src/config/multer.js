const multer = require("multer");

// Node standard libraries
const path = require("path");
const crypto = require("crypto");

module.exports = {
  // File destiny
  dest: path.resolve(__dirname, "..", "..", "tmp"),
  // Storage location
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp"));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          callback(err);
        } else {
          file.key = `${hash.toString("hex")}-${file.originalname}`;
          callback(null, file.key);
        }
      });
    }
  })
};
