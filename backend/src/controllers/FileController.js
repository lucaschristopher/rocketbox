const Box = require("../models/Box");
const File = require("../models/File");

class FileController {
  async store(req, res) {
    const { idBox } = req.params;
    const box = await Box.findById(idBox);

    const file = await File.create({
      title: req.file.originalname,
      path: req.file.key
    });

    box.files.push(file);
    await box.save();

    // All users connects in box._id
    req.io.sockets.in(box._id).emit("file", file);

    return res.json(file);
  }
}

module.exports = new FileController();
