async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array).catch(e =>
      console.log("Error while cycling ", e)
    );
  }
}

function tryLoginForSnapShot(
  username,
  password,
  currentIP,
  index,
  cameraErrors,
  cameraType,
  ind,
  headNum
) {
  let urlSpec = "";
  if (cameraType === "A") urlSpec = "/media/cam"+ind+"/still.jpg?res=max";
  if (cameraType === "P") urlSpec = "/jpeg";
  const request = require("request");
  let base64Str = "";

  console.log(
    `Trying username: ${username} password: ${password} ip: ${currentIP} for index: ${index}`
  );
  return new Promise((resolve, reject) => {
    if (cameraErrors.picStatus === true && (ind === headNum)) return resolve();

    request(
      {
        method: "GET",
        uri: "http://" + currentIP + urlSpec,
        gzip: true,
        encoding: "binary",
        auth: {
          user: username,
          pass: password[0],
          sendImmediately: false
        }
      },

      function(error, response, body) {
        if (error && cameraErrors.picStatus === false) {
          console.error("commandFetchSnapshot error", error);
          cameraErrors.picDetails = ['2'];
          cameraErrors.picStatus = false;
        } else {
          let mimeType = response.headers["content-type"];
          let b64encoded = Buffer.from(body, "binary").toString("base64");
          let image = "data:" + mimeType + ";base64," + b64encoded;
          let data = { mimeType: mimeType, image: image };
          base64Str = data.image;

          if (
            data.mimeType === "text/html; charset=utf-8" ||
            data.mimeType === "text/html"
          ) {
            // cameraErrors.picDetails = ['3'];
            // cameraErrors.picStatus = false;
          } else if (data.mimeType === "image/jpeg") {
            cameraErrors.picDetails[ind] = base64Str;
            cameraErrors.picStatus = true;
          } else {
            cameraErrors.picDetails[ind] = base64Str;
            cameraErrors.picStatus = true;
          }
          

          console.log("mimeType ", data.mimeType);
        }
        return cameraErrors.picStatus === false
          ? resolve("no photo")
          : resolve("photo");
      }
    );
  }).catch(error => {
    console.log(
      "There was an error inside method `getSnapShot`, ErrorMessage:",
      error
    );
    cameraErrors.picStatus = false;
    cameraErrors.picDetails = ['4'];
    return cameraErrors.picStatus === false
      ? resolve("no photo")
      : resolve("photo");
  });
}

async function getSnapShot(currentIP, cameraType, index, cameraErrors, ind, headNum) {
  console.log("Inside method getSnapshot for ip ", currentIP);
  let adminUserForSnapShot = "";
  let adminPassForSnapShot = "";

  if (cameraType === "A") {
    adminUserForSnapShot = ["admin", "administrator"];
    adminPassForSnapShot = ["timap123"];
  }
  if (cameraType === "P") {
    adminUserForSnapShot = ["admin"];
    adminPassForSnapShot = ["timapp123"];
  }

  let photoStatus = "";
  let BreakException = {};

  await asyncForEach(adminUserForSnapShot, async username => {
    try {
      console.log(
        "Trying username for method tryloginForsnapshot: ",
        username,
        "for ip ",
        currentIP
      );
      await tryLoginForSnapShot(
        username,
        adminPassForSnapShot,
        currentIP,
        index,
        cameraErrors,
        cameraType,
        ind,
        headNum
      )
        .then(result => {
          photoStatus = result;
          console.log("photoStatus", photoStatus);
        })
        .catch(error => {
          console.log(
            "Error inside tryLoginForSnapShop method: for ip ",
            currentIP
          );
        });
      if (photoStatus === "photo") throw BreakException;
    } catch (error) {
      console.log("Error ", error);
      throw error;
    }
  }).catch(error => {
    console.log("error inside asyncForEach");
  });
}

module.exports = getSnapShot;
