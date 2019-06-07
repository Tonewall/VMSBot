const express = require("express");
const http = require("http");
const timeout = require("connect-timeout");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
require("./models/User");
require("./models/CameraDataFromDB");
global.terminateTest = "false";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("./routes")(app);

mongoose.connect(keys.mongoURL, { useNewUrlParser: true });

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", function(socket) {
  console.log("New client connected");

  console.log(terminateTest);
  socket.on("stop", function(data) {
    if (data.message === "terminate") {
      terminateTest = "true";
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
server.keepAliveTimeout = 11000000;
server.timeout = 11000000;
server.setTimeout = 11000000;
console.log("global", terminateTest);
exports.app = app;
exports.io = io;
