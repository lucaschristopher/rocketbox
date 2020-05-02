const mongoose = require("mongoose");

// Represents a folder in the application
const BoxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }]
  },
  // Creates fields "createdAt" and "updatedAt"
  { timestamps: true }
);

module.exports = mongoose.model("Box", BoxSchema);
