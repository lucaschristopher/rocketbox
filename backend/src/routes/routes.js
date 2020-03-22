const express = require("express");
const multer = require("multer");

const multerConfig = require("../config/multer");

const routes = express.Router();

const BoxController = require("../controllers/BoxController");
const FileController = require("../controllers/FileController");

routes.get("/boxes", BoxController.index);
routes.get("/boxes/:id", BoxController.show);
routes.post("/boxes", BoxController.store);

// Allows to send one file at a time (field in the request body = "file")
routes.post(
  "/boxes/:idBox/files",
  multer(multerConfig).single("file"),
  FileController.store
);

module.exports = routes;
