import React from "react";
import "./Footer.css";

class Footer extends React.Component {
  render() {
    return (
      <footer className="mainfooter" role="contentinfo">
        <div className="footer-middle">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="footer-pad">
                  <h4>Address</h4>
                  <address>
                    <ul className="list-unstyled">
                      <li>
                        Georgia Tech Police Department
                        <br />
                        879 Hemphill Ave
                        <br />
                        Atlanta, Georgia
                        <br />
                        30332-0440
                        <br />
                      </li>
                      <li>Phone: (404) 894-2500</li>
                    </ul>
                  </address>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="footer-pad">
                  <h4>Georgia Tech Resources</h4>
                  <ul className="list-unstyled">
                    <li>
                      <a href="placeholder">Placeholder</a>
                    </li>
                    <li>
                      <a href="office">Office & Departments</a>
                    </li>
                    <li>
                      <a href="news">News Center</a>
                    </li>
                    <li>
                      <a href="campus">Campus Calendar</a>
                    </li>
                    <li>
                      <a href="special">Special Events</a>
                    </li>
                    <li>
                      <a href="institute">Institute Communications</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="footer-pad">
                  <h4>Campus Safety Programs</h4>
                  <ul className="list-unstyled">
                    <li>
                      <a href="gtens">GTENS</a>
                    </li>
                    <li>
                      <a href="safety">Safety Program Enrollment</a>
                    </li>
                    <li>
                      <a href="livesafe">LiveSafe</a>
                    </li>
                    <li>
                      <a href="news">GTPD News</a>
                    </li>
                    <li>
                      <a href="crimealerts">Crime Alerts</a>
                    </li>
                    <li>
                      <a href="safety">Safety Tips</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="footer-pad">
                  <h4>Visit Resources</h4>
                  <ul className="list-unstyled">
                    <li>
                      <a href="campus">Campus Police</a>
                    </li>
                    <li>
                      <a href="vistor">Visitor Parking Information</a>
                    </li>
                    <li>
                      <a href="gtglc">Georgia Tech Global Learning Center</a>
                    </li>
                    <li>
                      <a href="place">Barnes & Noble at Georgia Tech</a>
                    </li>
                    <li>
                      <a href="place">Robert C. Williams Paper Museum</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <p className="text-xs-center">
                  &copy; Copyright 2018 - Georgia Institute of Technology. All
                  rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
