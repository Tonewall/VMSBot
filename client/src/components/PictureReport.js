import React, { Component } from "react";
import "./PictureReport.css";

class pictureReport extends Component {
    constructor(props) {
        try {
            super(props);
            this.state = {
                cameras: this.props.location.query.cameras
            }
        }
        catch(e){
            this.state = {
                cameras: null
            }
        }
    }

    getResults() {
        if (this.state.cameras === null || this.state.cameras === undefined)
          return (
            <tr key="0">
              There are no cameras selected
            </tr>
          );
        else {
          const results = this.state.cameras.map(camera => (
            <tr key={camera._id}>
              <td>
                <b>Device Name: </b> {camera.deviceName} <br></br>
                <b>IP Address: </b>{camera.ip} <br></br>
                <b>Captured On: </b>{new Date(camera.date).toLocaleDateString("en-US")}
              </td>
              <td><img src={camera.picDetails} width={400} height={350} alt="Image Not Available" /></td>
            </tr>
          ));
          return results;
        }
      }
    render() {
        if(this.state.cameras === null) {
            return(
                <h1 className="errorMessage">
                    No Cameras Found, Please Go Back to the Reports Page and Reload the Cameras
                </h1>
            )
        }
        const { location } = this.props;
        return (
        <div className="report">
            <h1 id= "report">
                |Camera Picture Report
            </h1>
            <table>
                <tbody>{this.getResults()}</tbody>
            </table>
        </div>
        );
    }
}

export default pictureReport;