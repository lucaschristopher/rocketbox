const mongoose = require("mongoose");

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
    timestamps: true,
    // Every time the FileSchema is converted to Object or JSON,
    // load automatically the virtual field
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// Virtual field
FileSchema.virtual("url").get(function() {
  return `http://localhost:3355/files/${encodeURIComponent(this.path)}`;
});

module.exports = mongoose.model("File", FileSchema);
