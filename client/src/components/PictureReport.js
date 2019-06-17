import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
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
          super(props);
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
          const results = this.state.cameras.map(function(camera) {
            let num = camera.headNum;
            if(num === 1) {
              return(
            <Grid className="pictureGrid"key={camera._id}>
              <Row className="pictureInfos">
              <Col xs={4} className="pInfos">
              <div className="deviceNameInfo"><b>Device Name: </b> {camera.deviceName} <br></br></div>
                <b>IP Address: </b>{camera.ip} <br></br>
                <b>Captured On: </b>{new Date(camera.date).toLocaleDateString("en-US")}
              </Col>
                
              <Col xs={8}>
                <img src={camera.picDetails[0]} width={270} height={210} alt="Not Available"/>

              </Col>
              </Row>
            </Grid>)
            } else if(num === 3) {
              return(
              <Grid className="pictureGrid"key={camera._id}>
              <Row className="pictureInfos">
              <Col xs={4} className="pInfos">
              <div className="deviceNameInfo"><b>Device Name: </b> {camera.deviceName} <br></br></div>
                <b>IP Address: </b>{camera.ip} <br></br>
                <b>Captured On: </b>{new Date(camera.date).toLocaleDateString("en-US")}
              </Col>
                
              <Col xs={8} className="pics">
                <Col xs={6}>
                  <img src={camera.picDetails[0]} width={270} height={210} alt="Not Available"/>
                </Col>
                <Col xs={6}>
                  <img src={camera.picDetails[1]} width={270} height={210} alt="Not Available"/>
                </Col>
                <Col xs={6}>
                  <img src={camera.picDetails[2]} width={270} height={210} alt="Not Available"/>
                </Col>

              </Col>
              </Row>
            </Grid>
              )
            } else {
              return(
              <Grid className="pictureGrid"key={camera._id}>
              <Row className="pictureInfos">
              <Col xs={4} className="pInfos">
              <div className="deviceNameInfo"><b>Device Name: </b> {camera.deviceName} <br></br></div>
                <b>IP Address: </b>{camera.ip} <br></br>
                <b>Captured On: </b>{new Date(camera.date).toLocaleDateString("en-US")}
              </Col>
                
              <Col xs={8} className="pics">
                <Col xs={6}>
                  <img src={camera.picDetails[0]} width={270} height={210} alt="Not Available"/>
                </Col>
                <Col xs={6}>
                  <img src={camera.picDetails[1]} width={270} height={210} alt="Not Available"/>
                </Col>
                <Col xs={6}>
                  <img src={camera.picDetails[2]} width={270} height={210} alt="Not Available"/>
                </Col>
                <Col xs={6}>
                  <img src={camera.picDetails[3]} width={270} height={210} alt="Not Available"/>
                </Col>

              </Col>
              </Row>
            </Grid>
              )
            }
            
          });
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
        return (
        <div className="report">
            <h1 id= "report">
                |Camera Picture Report
            </h1>
            <div className="cameraReports">
            {this.getResults()}
            </div>
        </div>
        );
    }
}

export default pictureReport;