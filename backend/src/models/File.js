const mongoose = require("mongoose");

// Represents a file in the application
const FileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  {
    // Creates fields "createdAt" and "updatedAt"
    timestamps: true,
    // Every time the FileSchema is converted to Object or JSON,
    // load automatically the virtual field
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// Virtual field
FileSchema.virtual("url").get(function() {
  const url = process.env.URL || "http://localhost:3355";
  return `${url}/files/${encodeURIComponent(this.path)}`;
});

module.exports = mongoose.model("File", FileSchema);
