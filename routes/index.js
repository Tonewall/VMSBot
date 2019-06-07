module.exports = app => {
  //Require controller Modules
  var Camera_Test_Controller = require("../controllers/CameraTestController");
  var Report_Controller = require("../controllers/ReportController");
  // Ping Routes //

  // Get Status of Cameras Route//
  app.get("/api/cameraTest", Camera_Test_Controller.index);
  app.get("/api/reports/getdbCount", Report_Controller.getDBCount);

  // Generate Report of Cameras Route //
  app.get("/api/reports", Report_Controller.all);
  app.get("/api/reports/errors", Report_Controller.errors);
  app.get("/api/reports/by-date", Report_Controller.dateRange);
  app.post(
    "/api/reports/update-last-report",
    Report_Controller.updateLastReport
  );
  app.get("/api/reports/get-last-report", Report_Controller.getLastReport);
  app.get(
    "/api/reports/delete-last-reports-records",
    Report_Controller.deleteLastReportsRecords
  );
};
