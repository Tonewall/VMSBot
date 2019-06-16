async function getStatusCodesOfCameras(ip, cameraType, index, cameraErrors) {
  const request = require("request");
  let username = "";
  let password = "";
  // console.log("camera type", cameraType);
  if (cameraType === "A") {
    username = "admin";
    password = "timap123";
  } else if (cameraType === "P") {
    username = "admin";
    password = "timpp123";
  }

  try {
    return (results = await new Promise((resolve, reject) => {
      console.log("at statuscode check");
      request.get(
        "http://" + ip,
        {
          auth: {
            user: username,
            pass: password,
            sendImmediately: false
          }
        },
        function(error, response, body) {
          console.log(
            "Checking Status of Webpage for index ",
            index,
            " IP: ",
            ip
          );

          if (error) {
            cameraErrors.cameraWebPageStatus = "Unknown";
            cameraErrors.cameraWebPageStatusDetails = error.code;
          } else {
            cameraErrors.cameraWebPageStatus = response.statusCode;
            cameraErrors.cameraWebPageStatusDetails =
              response && response.statusCode;
          }
          resolve();
        }
      );
    }));
  } catch (err) {
    console.log("There was an error inside method `getStatusCodesOfCameras`");
    if (!response) {
      cameraErrors.cameraWebPageStatus = "Unable to process status code";
      cameraErrors.cameraWebPageStatusDetails = "Error in getting Details.";
    } else {
      cameraErrors.WebPageStatus = response && response.statusCode;
      cameraErrors.WebPageStatusDetails = response && response.statusCode;
    }
  }
}

module.exports = getStatusCodesOfCameras;
