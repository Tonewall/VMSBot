var pdfMake = require("pdfmake/build/pdfmake.js");
var pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const pdfResults = ips => {
  let lensCount = 0;
  let workingCount = 0;
  let errorCount = 0;

  let headers = {
    top: {
      col_1: { 
        text: "IP", 
        style: "tableHeader", 
        alignment: "center" 
      },
      col_2: {
        text: "Serial Number",
        style: "tableHeader",
        alignment: "center"
      },
      col_3: {
        text: "Model Number",
        style: "tableHeader",
        alignment: "center"
      },
      col_4: { 
        text: "PingStatus", 
        style: "tableHeader", 
        alignment: "center" 
      },
      col_5: { 
        text: "WPS", 
        style: "tableHeader", 
        alignment: "center" 
      },
      col_6: { 
        text: "SnapShot", 
        style: "tableHeader", 
        alignment: "center" 
      },
      col_7: { 
        text: "Error", 
        style: "tableHeader", 
        alignment: "center" 
      }
    }
  };

  let rows = ips;

  let body = [];
  for (let key in headers) {
    if (headers.hasOwnProperty(key)) {
      let header = headers[key];
      let row = [];
      row.push(header.col_1);
      row.push(header.col_2);
      row.push(header.col_3);
      row.push(header.col_4);
      row.push(header.col_5);
      row.push(header.col_6);
      row.push(header.col_7);
      body.push(row);
    }
  }

  for (let key in rows) {
    if (rows.hasOwnProperty(key)) {
      let data = rows[key];
      console.log(data);
      let row = [];
      //col_1
      if(data.host) {
        row.push({ text: data.host.toString(), alignment: "center" });
      } else {
        row.push({text: data.ip.toString(), alignment: "center"});
      }
      //col_2
      if(data.serialNumber) {
        row.push({ text: data.serialNumber.toString(), alignment: "center" });
      } else {
        row.push({ text: "N/A", alignment: "center" });
      }
      //col_3
      if(data.modelNumber) {
        row.push({ text: data.modelNumber.toString(), alignment: "center" });
      } else {
        row.push({ text: "N/A", alignment: "center" });
      }
      //col_4
      if(data.pingStatus) {
        row.push({ text: data.pingStatus.toString(), alignment: "center" });
      } else {
        row.push({ text:"N/A", alignment: "center" });
      }
      //col_5
      if(data.cameraWebPageStatus) {
        if(data.cameraWebPageStatus.toString() === "401" &&
            data.picStatus) {
              row.push({ text: "200", alignment: "center" });
           } else {
             row.push({ text: data.cameraWebPageStatus.toString(), alignment: "center" });
           }
      } else {
        row.push({ text: "N/A", alignment: "center" });
      }
      //col_6
      if (data.picStatus) {
        row.push({ text: "Yes", alignment: "center" });
      } else {
        row.push({ text: "No", alignment: "center" });
      }
      //col_7
      if (
        data.pingStatus !== "Not Alive" &&
        data.picStatus !== false &&
        data.host !== "Unknown"
      ) {
        if(data.cameraWebPageStatus.toString() === "200") {
          lensCount += data.headNum;
          workingCount += 1;
          row.push({ text: "", alignment: "center" });
        } else if(data.cameraWebPageStatus.toString() === "401" &&
                  data.picStatus) {
          lensCount+= data.headNum;
          workingCount += 1;
          row.push({ text: "", alignment: "center" });
        } else {
          row.push({ text: "X", alignment: "center" });
        }
      } else {
        row.push({ text: "X", alignment: "center" });
      }
      body.push(row);
    }
  }

  errorCount = ips.length - workingCount;

  console.log(body);
  var currentdate = new Date();
  var datetime =
    "Report Time: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    "\n\n";
  let numOfFunctionalCameras = `Functional Cameras in this Report: ${workingCount} \n`;
  let numOfErrors = `Cameras with Errors in this Report: ${errorCount} \n`;
  let numOfFunctionalLens = `Functional Lens in this Report: ${lensCount} \n`;
  let numOfRecords = `Cameras in this Report: ${ips.length} \n`;

  var docDefinition = {
    info: {
      title: datetime
    },
    content: [
      { text: "Camera Report", style: "header" },
      { text: datetime },
      "Official camera report on GT Campus Cameras, this document details the status of running a test on the following cameras.",

      { text: numOfRecords, margin: [0, 20, 0, 8] },
      { text: numOfFunctionalCameras, margin: [0, 0, 0, 8] },
      { text: numOfFunctionalLens, margin: [0, 0, 0, 8] },
      { text: numOfErrors, margin: [0, 0, 0, 8] },
      {
        style: "tableExample",
        table: {
          body: body
        },
        layout: {
          fillColor: function(rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? "#CCCCCC" : null;
          }
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black"
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };
  pdfMake.createPdf(docDefinition).open();
};
