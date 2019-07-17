import React, { Component } from "react";
import "./scheduler.css";
import moment from "moment";
import $ from "jquery";
import socketIOClient from "socket.io-client";

class scheduler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      time: 0,
      isOn: false,
      start: 0,
      startTest: false,
      testStatus: "",
      socketEndPoint: "http://vmsbot.police.gatech.edu:3200/"
    };
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.startCameraTest = this.startCameraTest.bind(this);

    const { socketEndPoint } = this.state;
    this.socket = socketIOClient(socketEndPoint);
    this.socket.on("connect", () => {
      console.log("connected");
      this.socket.on("FromApi", data => {
        console.log("data received from backend socket");
        this.setState({
          testStatus: "Test Completed!",
          startTest: false
        });
      });
      this.socket.on("connect_failed", function() {
        console.log("Failed");
      });
    });
  }

  startCameraTest() {
    this.setState({ testStatus: "" });
    fetch("/api/cameraTest")
      .then(response => response.json())
      .then(data => {
        console.log("Retrieveing data");
        console.log("Array is data: ", Array.isArray(data));
        console.log("Data output is ", data);
        console.log(this.state.ips);
      })
      .catch(error => console.log("error fetching data from backend", error));
    setTimeout(this.startTimer, 1000*60*61);
  }

  componentDidMount() {
    console.log(this.props.data);
    let timeSelected;
    var oldTime = localStorage.getItem("oldTime");
    if (oldTime != null) {
      $(".panel-footer").text("Current Scheduled Time: " + oldTime + " Daily");
      $(".valueHolder").text(oldTime);
    } else {
      oldTime = "00:00";
    }
    let futureTime = oldTime.split(":");
    let ts = futureTime[0];
    this.setState({ start: ts });
    this.startTimer();

    $("#customDropdown").on("click", function(event) {
      var container = $("#dropContainer");
      var drop = $("#customDropdown");
      var target = $(event.target);

      if (
        target.hasClass("valueHolder") ||
        target.attr("id") === "customDropdown"
      ) {
        container.toggle();
      } else if (target.hasClass("dropOption")) {
        timeSelected = event.target.innerHTML;
        console.log("New scheduled time " + timeSelected);
        drop.find("span.valueHolder").text(target.text());
        container.hide();
      }
    });

    //clicking Save button
    $("#save").on("click", event => {
      if (timeSelected == null) {
        alert("You have not changed the scheduled time");
      } else {
        if (
          window.confirm(
            "Do you want to change the scheduled time to " + timeSelected + "?"
          )
        ) {
          $(".panel-footer").text(
            "Current Scheduled Time: " + timeSelected + " Daily"
          );
          localStorage.setItem("oldTime", timeSelected);
          alert(timeSelected + " is your new scheduled time");
          let now = moment();
          this.setState({ time: now.hour() });
          let futureTime = timeSelected.split(":");
          let ts = futureTime[0];

          this.setState({ start: ts });
          console.log("Time Selected", this.state.start);
          console.log("Current Time", this.state.time);
          window.location.reload();
        } else {
          alert("You've cancelled the schedule change");
        }
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      let now = moment();
      console.log(
        "Current Hour: " + this.state.time + ", Scheduled Hour: " + this.state.start
      );
      this.setState({ time: now.hour() });
      if (this.state.time === parseInt(this.state.start)) {
        console.log("it's time");
        clearInterval(this.timer);
        this.setState({ startTest: true });
        this.startCameraTest();
      }
    }, 10000);
  }

  resetTimer() {
    console.log("Timer reset");
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <center>
              <h1>Schedule An Automated Camera Test</h1>
            </center>
          </div>
        </div>

        <div id="schedulerPanel" className="container">
          <div className="panel GTBlue">
            <div className="panel-heading">
              <h1 className="panel-title text-center">VMS Bot Scheduler</h1>
            </div>
            <div className="panel-body">
              <div className="col-md-5 col-sm-5 col-xs-5">
                <p className="info">Choose a Time Schedule to Run Daily</p>
              </div>
              <div className="col-md-3 col-sm-3 col-xs-3">
                <div id="customDropdown" className="btn">
                  <span className="valueHolder">00:00</span>
                  <div id="dropContainer">
                    <div className="dropOption" id="1">
                      00:00
                    </div>
                    {/*<div className="dropOption" id="2">*/}
                    {/*12:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="3">
                      1:00
                    </div>
                    {/*<div className="dropOption" id="4">*/}
                    {/*1:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="5">
                      2:00
                    </div>
                    {/*<div className="dropOption" id="6">*/}
                    {/*2:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="7">
                      3:00
                    </div>
                    {/*<div className="dropOption" id="8">*/}
                    {/*3:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="9">
                      4:00
                    </div>
                    {/*<div className="dropOption" id="10">*/}
                    {/*4:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="11">
                      5:00
                    </div>
                    {/*<div className="dropOption" id="12">*/}
                    {/*5:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="13">
                      6:00
                    </div>
                    {/*<div className="dropOption" id="14">*/}
                    {/*6:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="15">
                      7:00
                    </div>
                    {/*<div className="dropOption" id="16">*/}
                    {/*7:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="17">
                      8:00
                    </div>
                    {/*<div className="dropOption" id="18">*/}
                    {/*8:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="19">
                      9:00
                    </div>
                    {/*<div className="dropOption" id="20">*/}
                    {/*9:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="21">
                      10:00
                    </div>
                    {/*<div className="dropOption" id="22">*/}
                    {/*10:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="23">
                      11:00
                    </div>
                    {/*<div className="dropOption" id="24">*/}
                    {/*11:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="25">
                      12:00
                    </div>
                    {/*<div className="dropOption" id="26">*/}
                    {/*12:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="27">
                      13:00
                    </div>
                    {/*<div className="dropOption" id="28">*/}
                    {/*13:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="29">
                      14:00
                    </div>
                    {/*<div className="dropOption" id="30">*/}
                    {/*14:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="31">
                      15:00
                    </div>
                    {/*<div className="dropOption" id="32">*/}
                    {/*15:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="33">
                      16:00
                    </div>
                    {/*<div className="dropOption" id="34">*/}
                    {/*16:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="35">
                      17:00
                    </div>
                    {/*<div className="dropOption" id="36">*/}
                    {/*17:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="37">
                      18:00
                    </div>
                    {/*<div className="dropOption" id="38">*/}
                    {/*18:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="39">
                      19:00
                    </div>
                    {/*<div className="dropOption" id="40">*/}
                    {/*19:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="41">
                      20:00
                    </div>
                    {/*<div className="dropOption" id="42">*/}
                    {/*20:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="43">
                      21:00
                    </div>
                    {/*<div className="dropOption" id="44">*/}
                    {/*21:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="45">
                      22:00
                    </div>
                    {/*<div className="dropOption" id="46">*/}
                    {/*22:30*/}
                    {/*</div>*/}
                    <div className="dropOption" id="47">
                      23:00
                    </div>
                    {/*<div className="dropOption" id="48">*/}
                    {/*23:30*/}
                    {/*</div>*/}
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-sm-2 col-xs-2">
                <a href="#" id="save" className="btn btn-success">
                  Save
                </a>
              </div>
              {/*<div className="col-md-2 col-sm-2 col-xs-2">*/}
              {/*<a href="#" id="runNow" className="btn btn-success">*/}
              {/*Run Now*/}
              {/*</a>*/}
              <div className="col-md-2 col-sm-2 col-xs-2 yellow">
                {this.state.startTest ? (
                  <span className="blink">Processing</span>
                ) : (
                  "Ready!"
                )}
                <br />
                {this.state.testStatus}
              </div>
              {/*</div>*/}
              <div className="col-md-11 col-sm-2 col-xs-2 white">
                <center>24 Hour Clock</center>
              </div>
            </div>
            <div className="panel-footer text-center">
              Current Scheduled Time:
            </div>{" "}
          </div>
        </div>
      </div>
    );
  }
}

export default scheduler;
