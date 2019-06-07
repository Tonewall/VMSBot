async function PingAway(hostname, cameraErrors) {
  const ping = require("ping");

  try {
    return await ping.promise
      .probe(hostname, {
        timeout: 10,
        min_reply: 7
      })
      .then(function(res) {
        if (res.alive === false) {
          console.log("Not Alive");
          cameraErrors.pingStatus = "Not Alive";
          if (typeof res.output === "undefined" || res.output === "") {
            cameraErrors.pingStatusDetails =
              "Unable to retrieve error object. Possibly Ping was unsuccessful. Error object empty.";
          } else if (res.output === false) {
            cameraErrors.pingStatusDetails = res.output;
          } else {
            cameraErrors.pingStatusDetails =
              "Error getting ping status details. Error object empty.";
          }
          return cameraErrors;
        } else if (res.alive === true) {
          console.log("Alive");
          cameraErrors.pingStatus = "Alive";
          cameraErrors.pingStatusDetails = res.output;
          return cameraErrors;
        } else {
          console.log("UnKnown Ping Status");
          cameraErrors.pingStatus = "UnKnown Ping Status";
          cameraErrors.pingStatusDetails =
            "Unknown Ping Details. Unable to determine reason or error.";
          return cameraErrors;
        }
      });
  } catch (err) {
    console.log("There was an Exception error inside function PingAway");
  }
}

module.exports = PingAway;
