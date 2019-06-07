import React from "react";

const DisplayLastReports = data => {
  let results;
  if (data.reports.length === 0) {
    return <ol>No Data</ol>;
  } else {
    results = data.reports.map(report => {
      let day = new Date(report.date);
      let month =
        day.getMonth() + "/" + day.getDate() + "/" + day.getFullYear();
      return (
        <li key={report._id}>
          {report.reportType} -- {month}
        </li>
      );
    });

    return results;
  }
};

export default DisplayLastReports;
