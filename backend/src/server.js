const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

// WS Protocol to Socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  // Socket is a representation of the real-time connection
  // between the user and the server
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

// String of DB connection
const url = "mongodb://localhost:27017/omnistack-april";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(url, options);

// Some events for Mongo to stay listening and report if something different happened

mongoose.connection.on("connected", () => {
  console.log("Application connected on database =D");
});

mongoose.connection.on("disconnected", () => {
  console.log("Application disconnected from database.");
});

mongoose.connection.on("error", err => {
  console.log(`Error on connection with database: ${err}.`);
});

// Middlewares

// Global middleware
app.use((req, res, next) => {
  req.io = io;

  return next();
});

// To use JSON in request
app.use(express.json());
// Allows to send files on request
app.use(express.urlencoded({ extended: true }));
// Every time the user accesses the "files" route,
// we redirect him to the "tmp" folder.
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

// App routes
app.use(require("./routes/routes"));

const port = 3355;

// Listens requests with HTTP protocol and WS protocol
server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
