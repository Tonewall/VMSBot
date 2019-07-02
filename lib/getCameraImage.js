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
    if(username === adminUserForSnapShot[adminUserForSnapShot.length - 1]){
      if(cameraErrors.picStatus !== true) {
          cameraErrors.picStatus = false;
          // cameraErrors.picDetails.push("Unable to fetch pic");
          cameraErrors.picDetails.push("");
      }
    }
  }).catch( error =>  console.log( "Error exception caught inside getImages ", error ));
}

async function tryUserPass(username, adminPassForSnapShot, cameraErrors, currentIP, urls){
  let BreakException = {};
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
            //console.log("response ", response);
              if (error || (typeof body === "undefined")) {
                console.error("commandFetchSnapshot error", error);
                //cameraErrors.picStatus = false;
                //cameraErrors.picDetails.push("Unable to fetch picture");
                resolve();
              }
              else {
                let mimeType = response.headers["content-type"];
                // console.log("inside else 1");
                let b64encoded = Buffer.from(body, "binary").toString("base64");
                // console.log("inside else 2");
                let image = "data:" + mimeType + ";base64," + b64encoded;
                // console.log("inside else 3");
                let data = { mimeType: mimeType, image: image };
                // console.log("inside else 4");
                base64Str = data.image;

                if ( data.mimeType === "text/html; charset=utf-8" || data.mimeType === "text/html" ) {
                  // console.log("inside else 5");
                  //cameraErrors.picStatus = false;
                  //cameraErrors.picDetails.push("Unable to fetch picture");
                  // console.log("inside else 6");
                  resolve();
                }
                else if (data.mimeType === "image/jpeg") {
                      cameraErrors.picDetails.push(base64Str);
                      cameraErrors.picStatus = true;
                      console.log("pic -- ",base64Str);
                      resolve();
                }
                else {
                  //cameraErrors.picStatus = false;
                  //cameraErrors.picDetails.push("Unable to fetch picture");
                  resolve();
                }
              }
            }
          );
       }).catch(error => {
         console.log("There was an error inside tryUserPass", error);
         //cameraErrors.picStatus = false;
        // cameraErrors.picDetails.push('Unable to fetch picture');
         resolve();
       });
    })
}

module.exports = getImages;