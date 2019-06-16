import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Grid, Row, Col, Button } from "react-bootstrap";
import "./Test.css";
import { pdfResults } from "./generatePDF";

class test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ips: [],
      testStatus: {
        socketEndPoint: "http://127.0.0.1:5000/",
        response: false,
        isScheduled: false
      },
      btnStart: {
        style: "success",
        title: "Start",
        disabled: false
      },
      btnStop: {
        style: "danger",
        title: "Stop",
        disabled: true
      },
      description: "Ready to run camera test.",
      runStatus: "off"
    };
    this.getWebPageStatusDetails = this.getWebPageStatusDetails.bind(this);
    this.startPingTest = this.startPingTest.bind(this);
    this.toggleTestOnOff = this.toggleTestOnOff.bind(this);
    this.terminateProcess = this.terminateProcess.bind(this);

    const { socketEndPoint } = this.state;
    this.socket = socketIOClient(socketEndPoint);
    this.socket.on("connect", () => {
      console.log("connected");
      this.socket.on("FromApi", data => {
        console.log("data received from backend socket");
        this.setState({
          description: "Results available",
          ips: data
        });
        _this.toggleTestOnOff("completed");
      });
      this.socket.on("connect_failed", function() {
        console.log("Failed");
      });
    });
    let _this = this;
  }

  terminateProcess() {
    console.log("socket is, ", this.socket);
    this.socket.emit("stop", { message: "terminate" });
  }

  componentDidMount() {}

  startPingTest(event) {
    this.setState({ isScheduled: false });
    this.props.location.state = null;

    this.setState({
      btnStart: { title: "Processing", style: "info", disabled: true },
      description:
        "Please wait while cameras are ping. This process could take a few hours.",
      btnStop: { title: "Stop", style: "danger" }
    });

    if (event) event.preventDefault();

    console.log("starting PingTest...");

    fetch("/api/cameraTest")
      .then(response => response.json())
      .then(data => {})
      .catch(error => console.log("error fetching data from backend", error));
  }

  toggleTestOnOff(e) {
    let option = e.hasOwnProperty("target") ? e.target.value : e;

    switch (option) {
      case "start":
        this.setState({
          runStatus: "on",
          description: "Test Status: Running",
          btnStart: { disabled: true },
          btnStop: { disabled: false }
        });
        this.startPingTest();
        break;

      case "completed":
        this.setState({
          description: "Previous Test: Completed. Ready",
          runStatus: "off",
          btnStart: { style: "success", title: "Start", disabled: false },
          btnStop: { style: "danger", title: "Stop", disabled: true }
        });
        break;

      case "terminate":
        this.setState({
          btnStop: { style: "danger", title: "Terminating", disabled: true },
          description: "Please Wait.."
        });
        this.terminateProcess();
        break;

      default:
        break;
    }
  }

  getWebPageStatusDetails(value) {
    if (typeof value !== "object") {
      return value;
    } else {
      return value.code;
    }
  }

  render() {
    let errorCount = 0;
    let cameraCount = 0;
    let lensCount = 0;
    const getResults = this.state.ips.map((result, index) => {
      let color = "green";
      let picture = new Image();
      if (result.picStatus === true) picture.src = result.picDetails[0];
      else picture.src = require("./noimage.jpg");

      if (
        result.pingStatus === "Not Alive" ||
        result.cameraWebPageStatus !== 200 ||
        result.picStatus === false ||
        result.host === "Unknown"
      ) {
        color = "red";
        errorCount += 1;
      } else {
        lensCount += result.headNum;
      }
      cameraCount += 1;
      return (
        <Col xs={12} md={12} key={index}>
          <b className={color}>{result.host}</b>: -- <b>Camera Type</b>: "
          {result.cameraType}" -- <b>Ping Status</b>: "{result.pingStatus}" --{" "}
          <b>Ping Details:</b> "{result.pingStatusDetails}" --{" "}
          <b>Camera WebPage Status:</b> "{result.cameraWebPageStatus}" --{" "}
          <b>Camera WebPage Details:</b> "
          {this.getWebPageStatusDetails(result.cameraWebPageStatusDetails)}"
          <br />
          -- <b>SnapShot Status:</b> "
          {result.picStatus === true ? "Pic Available" : "No Pic"}"-
          <img src={picture.src} width={50} height={50} alt="snapshot" />
          --end of ip {result.host} details.
          <br />
          <br />
        </Col>
      );
    });

    const alignCenter = {
      textAlign: "center"
    };

    return (
      <div className="testComponentStyles">
        <div className="row">
          <div className="col">
            <Grid className="container-fluid">
              <Row className="show-grid">
                <Col xs={12} md={12} style={alignCenter}>
                  <h1>Campus Camera Test</h1>
                  <Button
                    onClick={this.toggleTestOnOff}
                    bsStyle={this.state.btnStart.style}
                    bsSize="large"
                    value="start"
                    className="btn"
                    disabled={this.state.btnStart.disabled}
                  >
                    {this.state.btnStart.title}
                  </Button>
                  <Button
                    onClick={this.toggleTestOnOff}
                    bsStyle={this.state.btnStop.style}
                    bsSize="large"
                    value="terminate"
                    disabled={this.state.btnStop.disabled}
                  >
                    {this.state.btnStop.title}
                  </Button>
                  <br />
                  {this.state.description}
                  <hr />
                </Col>
              </Row>
              <Row className="show-grid">
                <Col xs={12} md={12} style={alignCenter}>
                  <h2> Results</h2>
                  <button onClick={() => pdfResults(this.state.ips)}>
                    PDF
                  </button>
                  <br />
                </Col>
              </Row>
              <p>
                <b>
                  Number of Cameras Tested:
                  <span className="blue"> {cameraCount}</span>{" "}
                </b>
              </p>
              <p>
                <b>
                  Number of Functional Cameras:
                  <span className="green">
                    {" "}
                    {cameraCount - errorCount}
                  </span>{" "}
                </b>
              </p>
              <p>
                <b>
                  Number of Funcional Cameras Lens:
                  <span className="green"> {lensCount}</span>{" "}
                </b>
              </p>
              <p>
                <b>
                  Number of Reported Errors:
                  <span className="red"> {errorCount}</span>{" "}
                </b>
              </p>
              <Row>{getResults}</Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
export default test;
