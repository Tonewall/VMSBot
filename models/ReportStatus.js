const mongoose = require("mongoose");
const { Schema } = mongoose;

const LastReportSchema = new Schema({
  reportType: String,
  date: Date
});

module.exports = mongoose.model("lastReportStatus", LastReportSchema);
