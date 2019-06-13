const PingCameraModule = require("../lib/pingCameras");
const getStatusOfCamerasModule = require("../lib/getStatusOfCameras");
const getCameraImageModule = require("../lib/getCameraImage");
const getCamerasModule = require("../lib/getCamerasFromList");
const path = require("path");
const cameraFile = path.basename(__dirname + "../cameras.json");
const Sockets = require("../index");

exports.index = function(req, res) {
  let cameraListOfErrors = [];
  let ListOfIps = [];

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array).catch(e =>
        console.log("Error while cycling ", e)
      );
    }
  }

  const processAllRequests = async () => {
    await asyncForEach(ListOfIps, async (host, index) => {
      try {
        console.log("Camera#: ", index, " has IP Address: ", host);
        let cameraErrors = {
          host: "",
          pingStatus: "",
          pingStatusDetails: "",
          cameraWebPageStatus: "",
          cameraWebPageStatusDetails: "",
          picStatus: false,
          picDetails: "",
          headNum: host.headNum,
          modelNumber: host.modelNumber,
          serialNumber: host.serialNumber,
          cameraType: host.type
        };
        cameraErrors.host = host.ip;

        await PingCameraModule(host.ip, cameraErrors);
        await getStatusOfCamerasModule(host.ip, host.type, index, cameraErrors);
        await getCameraImageModule(host.ip, host.type, index, cameraErrors);
        cameraListOfErrors.push(cameraErrors); //Push all errors into error Array
        await addRecordToDB(index);
        await terminateProcess(index);
      } catch (error) {
        console.log("Error inside method `processAllRequests` ", error);
      }
    });
  };

  function terminateProcess(index) {
    if (terminateTest === "true") {
      ListOfIps.splice(index);
      Sockets.io.emit("FromApi", cameraListOfErrors);
      global.terminateTest = "false";
    }
  }

  async function addRecordToDB(index) {
    const mongoose = require("mongoose");
    const Camera = mongoose.model("cameras");
    console.log("cameraListOfErrors Object ", cameraListOfErrors);
    console.log("ip is ", cameraListOfErrors[index].host);
    console.log("serial Number: " + cameraListOfErrors[index].serialNumber);

    new Camera({
      ip: cameraListOfErrors[index].host,
      pingStatus: cameraListOfErrors[index].pingStatus,
      pingStatusDetails: cameraListOfErrors[index].pingStatusDetails,
      cameraWebPageStatus: cameraListOfErrors[index].cameraWebPageStatus,
      cameraWebPageStatusDetails:
        cameraListOfErrors[index].cameraWebPageStatusDetails,
      headNum: cameraListOfErrors[index].headNum,
      modelNumber: cameraListOfErrors[index].modelNumber,
      serialNumber: cameraListOfErrors[index].serialNumber,
      picStatus: cameraListOfErrors[index].picStatus,
      picDetails: cameraListOfErrors[index].picDetails,
      cameraType: cameraListOfErrors[index].cameraType,
      date: new Date()
    })
      .save()
      .catch(e => {
        console.log("error saving camera to database ", e);
      });
  }

  res.json([]);
  getCamerasModule(cameraFile, cameraListOfErrors, ListOfIps)
    .then(() => {
      if (ListOfIps.length === 0) {
        throw new Error("No IPS to Process");
      } else {
        console.log(ListOfIps);
        console.log("Proceeding with camera IPs");
        result = processAllRequests();
        return result;
      }
    })
    .then(() => {
      console.log("Data Stored In Database... Process Complete.");
      console.log(cameraListOfErrors);
      Sockets.io.emit("FromApi", cameraListOfErrors);
    })
    .catch(errors => {
      console.log("No data gathering from camera file... Program Terminating!");
      if (ListOfIps === 0) {
        res.json(cameraListOfErrors); //return error object, no camera.json list
      } else {
        console.log(
          `There were unexpected errors: ${errors}. Program terminating.`
        );
        res.json(cameraListOfErrors);
      }
    });
};
