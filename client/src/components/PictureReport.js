import React, { Component } from "react";
import "./PictureReport.css";

class pictureReport extends Component {
    constructor(props) {
        super(props);
        console.dir(props);
        this.state = {
            cameras: this.props.location.query.cameras
        }
    }

    getResults() {
        console.log(this.state.cameras);
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
        if(this.props === null || this.props === undefined) {
            return(
                <div>
                    No Cameras Found
                </div>
            )
        }
        const { location } = this.props;
        console.log(location.query);
        return (
        <div className="report">
            <h1>
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