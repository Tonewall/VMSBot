const mongoose = require("mongoose");
const { Schema } = mongoose;

const cameraSchema = new Schema({
  ip: String,
  errorsExists: Boolean,
  pingStatus: String,
  pingStatusDetails: String,
  cameraWebPageStatus: String,
  cameraWebPageStatusDetails: String,
  picStatus: Boolean,
  picStatusDetails: String,
  cameraType: String,
  date: Date
});

module.exports = mongoose.model("cameras", cameraSchema);
