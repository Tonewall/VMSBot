const CameraModel = require("../models/CameraDataFromDB");
const LastReportModel = require("../models/ReportStatus");
const mongoose = require("mongoose");

exports.all = function(req, res) {
  CameraModel.find({}).exec((err, cameras) => {
    if (err) {
      res.send("Error retrieving data from database");
    } else {
      res.send(cameras);
    }
  });
};

exports.getLastReport = function(req, res) {
  LastReportModel.find({}).exec((err, reports) => {
    if (err) {
      res.send("Error retrieving data from database");
    } else {
      res.send(reports);
    }
  });
};

exports.errors = function(req, res) {
  CameraModel.find({
    $or: [
      { pingStatus: "Not Alive" },
      { cameraWebPageStatus: 401 },
      { picStatus: false }
    ]
  }).exec((err, cameras) => {
    if (err) {
      res.send("Error retrieving data from database");
    } else {
      res.send(cameras);
    }
  });
};

exports.dateRange = function(req, res) {
  console.log("hi", req.param("startDate"));
  let end = new Date(
    new Date(req.param("endDate")).getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  let start = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  let syear = new Date(req.param("startDate")).getFullYear();
  let smonth = new Date(req.param("startDate")).getMonth() + 1;
  let sday = new Date(req.param("startDate")).getDate();

  let eyear = new Date(req.param("endDate")).getFullYear();
  let emonth = new Date(req.param("endDate")).getMonth() + 1;
  let eday = new Date(req.param("endDate")).getDate();

  let formatStart = syear + "," + smonth + "," + sday;
  let formatEnd = eyear + "," + emonth + "," + eday;
  console.log("start", formatStart);
  console.log("end ", formatEnd);
  if (formatStart === formatEnd) {
    const day = new Date(req.param("endDate"));
    const nextday = new Date();
    formatEnd = nextday.setDate(day.getDate() + 1);
  }
  CameraModel.find({
    date: {
      $gte: new Date(formatStart),
      $lte: new Date(formatEnd)
    }
  }).exec((err, cameras) => {
    if (err) {
      console.log(err);
      res.send({});
    } else {
      console.log("returned ", cameras);
      res.send(cameras);
    }
  });
};

exports.updateLastReport = function(req, res) {
  console.log("report type is", req.body.reportType);
  new LastReportModel({
    reportType: req.body.reportType.toUpperCase(),
    date: new Date()
  })
    .save(res.send({ data: "success" }))
    .catch(e => {
      console.log("Error saving last report status to database ", e);
    });
};

exports.deleteLastReportsRecords = function(req, res) {
  const mongoose = require("mongoose");
  const LastReportModel = mongoose.model("lastReportStatus");

  LastReportModel.remove({}).exec(err => {
    if (err) {
      console.log("There was an error deleting records");
    } else {
      res.send([]);
    }
  });
};

exports.getDBCount = function(req, res) {
  CameraModel.find({}, (err, cameras) => {
    if (err) {
      res.json({ error: `Error retrieving data from database` });
    } else {
      res.send({ length: cameras.length });
    }
  });
};
