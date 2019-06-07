const fs = require("fs");
const getCameras = (cameraFile, cameraListOfErrors, ListOfIps) => {
  console.log("Retrieving CameraList from JSON file.");
  return new Promise((resolve, reject) => {
    fs.readFile("cameras.json", (err, data) => {
      if (err) {
        cameraErrors = {
          host: "Error connecting to cameraList",
          output: "Error connecting to cameraList",
          status: "Error connecting to cameraList"
        };
        cameraListOfErrors.push(cameraErrors);
        let errors = {
          output: "Error opening camera file. Program terminated",
          cameras: cameraListOfErrors
        };
        reject(errors);
      } else {
        cameraList = JSON.parse(data);
        cameraList.forEach(camera => {
          cameras = {
            ip: camera.ip,
            type: camera.type,
            headNum: camera.headNum,
            modelNumber: camera.modelNumber,
            serialNumber: camera.serialNumber
          };
          ListOfIps.push(cameras);
        });
        resolve(ListOfIps);
      }
    });
  }).catch(e => {
    console.log("Error inside file `getCamerasFromList` ", e);
  });
};

module.exports = getCameras;
