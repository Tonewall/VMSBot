import React from "react";
import "./Home.css";
import { Carousel } from "react-bootstrap";

class home extends React.Component {
  render() {
    return (
      <div className="container bgStyle">
        <div className="row">
          <div className="col " />
          <div className="col ">
            <Carousel interval={7000} className="carouselStyle">
              <Carousel.Item>
                <img
                  width={1200}
                  height={500}
                  alt="900x500"
                  src={require("../../src/images/security1.png")}
                />
                <Carousel.Caption>
                  <h3>
                    Welcome to GTPD -{" "}
                    <span style={{ color: "#FFCC00", fontWeight: "bold" }}>
                      V
                    </span>
                    ideo{" "}
                    <span style={{ color: "#FFCC00", fontWeight: "bold" }}>
                      M
                    </span>
                    anagement
                    <span style={{ color: "#FFCC00", fontWeight: "bold" }}>
                      {" "}
                      S
                    </span>
                    ystem
                  </h3>
                  <p>Automated Video Surveillance</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  width={1200}
                  height={500}
                  alt="900x500"
                  src={require("../../src/images/carousel-camera3.jpg")}
                />
                <Carousel.Caption>
                  <h3>Diagnose and Troubleshoot</h3>
                  <span style={{ color: "#FFCC00", fontWeight: "bold" }}>
                    <p>
                      This application is an automated bot used to diagnose and
                      troubleshoot malfunctioning security cameras for the
                      Georgia Tech Police Department. More information can be
                      found at the bottom in the 'Background Information'
                      section.
                    </p>
                  </span>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  width={1200}
                  height={500}
                  alt="900x500"
                  src={require("../../src/images/carousel-camera2.jpg")}
                />
                <Carousel.Caption>
                  <h3>Daily Logs & History Reports</h3>
                  <p>
                    <span style={{ color: "#FFCC00", fontWeight: "bold" }}>
                      Generate past reports on camera diagnostics.
                    </span>
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col" />
        </div>
      </div>
    );
  }
}

export default home;
