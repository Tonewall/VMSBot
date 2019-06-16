const mongoose = require("mongoose");
const { Schema } = mongoose;

const cameraSchema = new Schema({
  ip: String,
  deviceName: String,
  errorsExists: Boolean,
  pingStatus: String,
  pingStatusDetails: String,
  cameraWebPageStatus: String,
  cameraWebPageStatusDetails: String,
  headNum: Number,
  modelNumber: String,
  serialNumber: String,
  picStatus: Boolean,
  picDetails: [String],
  cameraType: String,
  date: Date
});

module.exports = mongoose.model("cameras", cameraSchema);
