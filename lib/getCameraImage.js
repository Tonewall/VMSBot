async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function getImages( currentIP, cameraType, index, cameraErrors, headNum ) {
  console.log( "Getting image for ip ", currentIP );
  const numOfHeads = headNum;
  let adminUserForSnapShot, adminPassForSnapShot;
  let urlImages = [];

  // User & Password list for Avigilon & Pelco
  if ( cameraType === "A" ) {
    adminUserForSnapShot = ["admin", "administrator"];adminPassForSnapShot = ["timap123"];
     urlImages = [
      "http://" + currentIP + "/media/cam0/still.jpg?res=max",
      "http://" + currentIP + "/media/cam1/still.jpg?res=max",
      "http://" + currentIP + "/media/cam2/still.jpg?res=max",
      "http://" + currentIP + "/media/cam3/still.jpg?res=max"
    ];
  }
  if ( cameraType === "P" ) { adminUserForSnapShot = ["admin"];adminPassForSnapShot = ["timapp123"];
    urlImages = [
      "http://" + currentIP + "/jpeg",
    ];
  }

  // Filter urlImages based on number of camera heads
  const urls = urlImages.filter(function(url, index){
    return index < numOfHeads;
  });

  // Being Process
  await asyncForEach(adminUserForSnapShot, async (username) => {
      await tryUserPass(username, adminPassForSnapShot, cameraErrors, currentIP, urls);
  }).catch( error =>  console.log( "Error exception caught inside getImages ", error ));
}

async function tryUserPass(username, adminPassForSnapShot, cameraErrors, currentIP, urls){
  console.log("Trying username: ", username, " for IP: ", currentIP);

      await asyncForEach(urls, async (url) => {
       return new Promise( (resolve, reject) => {
          const request = require('request');
          let base64Str = null;

          const options = {
            method: "GET",
            uri: url,
            gzip: true,
            encoding: "binary",
            auth: {
              user: username,
              pass: adminPassForSnapShot[0],
              sendImmediately: false
            }
          };

          request(options,
            function(error, response, body) {
              if (error ) {
                console.error("commandFetchSnapshot error", error);
                resolve();
              }
              else {
                let mimeType = response.headers["content-type"];
                let b64encoded = Buffer.from(body, "binary").toString("base64");
                let image = "data:" + mimeType + ";base64," + b64encoded;
                let data = { mimeType: mimeType, image: image };
                base64Str = data.image;

                if (
                  data.mimeType === "text/html; charset=utf-8" ||
                  data.mimeType === "text/html"
                ) {
                  resolve();
                } else if (data.mimeType === "image/jpeg") {
                  cameraErrors.picDetails.push(base64Str);
                  cameraErrors.picStatus = true;
                  console.log("pic -- ",base64Str);
                  resolve();
                }
              }
            }
          );
       });
    })
}

module.exports = getImages;