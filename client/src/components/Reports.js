import React, { Component } from "react";
import "./Reports.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import isAfter from "date-fns/is_after";
import { pdfResults } from "./generatePDF";
import DisplayLastReports from "./GenerateLastReport";
import "./GenerateLastReport.css";
import { Link } from 'react-router-dom';
import $ from "jquery";
import {
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
  Table
} from "reactstrap";

class reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameras: null,
      searchType: "",
      reportType: "",
      startDate: new Date(),
      endDate: new Date(),
      errors: "",
      lastReports: [],
      dbCount: ""
    };

    this.allCameras = this.allCameras.bind(this);
    this.cameraErrors = this.cameraErrors.bind(this);
    this.cameraByDates = this.cameraByDates.bind(this);
    this.getResults = this.getResults.bind(this);
    this.searchType = this.searchType.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.generatePdfReport = this.generatePdfReport.bind(this);
    this.deleteLastReportRecords = this.deleteLastReportRecords.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.getLastReport = this.getLastReport.bind(this);
    this.getDBCount = this.getDBCount.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }

  componentDidMount() {
    this.getLastReport();
    this.getDBCount();
  }

  getLastReport() {
    fetch("/api/reports/get-last-report")
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ lastReports: data });
      })

      .catch(error => console.log("error fetching data from backend", error));
  }

  getDBCount() {
    fetch("/api/reports/getdbCount")
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ dbCount: data.length });
        $("#radio1").prop("checked", false);
      })
      .catch(error => console.log("error fetching data from backend", error));
  }

  allCameras(e) {
    console.log("search");

    fetch("/api/reports")
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ cameras: data });
        console.log(this.state.cameras);
        $("#radio1").prop("checked", false);
      })
      .catch(error => console.log("error fetching data from backend", error));
  }

  searchType(e) {
    console.log(`Search type: ${e.target.value} selected`);
    this.setState({ searchType: e.target.value, errors: null });
    switch (this.state.searchType) {
      case "all":
        this.allCameras();
        this.setState({ reportType: this.state.searchType });
        this.setState({ searchType: null });
        break;
      case "errors":
        this.cameraErrors();
        this.setState({ reportType: this.state.searchType });
        this.setState({ searchType: null });
        break;
      case "dateRange":
        this.cameraByDates();
        this.setState({ reportType: this.state.searchType });
        this.setState({ searchType: null });
        break;
      default:
        break;
    }
  }

  handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  cameraByDates() {
    console.log("by date ", this.state.startDate, "and ", this.state.endDate);
    fetch(
      `/api/reports/by-date?startDate=${this.state.startDate}&endDate=${
        this.state.endDate
      }`
    )
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ cameras: data });
        console.log(this.state.cameras);
        $("#radio3").prop("checked", false);
      })
      .catch(error => console.log("error fetching data from backend", error));
  }

  cameraErrors() {
    console.log("search");

    fetch("/api/reports/errors")
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data === null) {
        }
        this.setState({ cameras: data });
        $("#radio2").prop("checked", false);
      })
      .catch(error => console.log("error fetching data from backend", error));
  }

  getResults() {
    if (this.state.cameras === null || this.state.cameras === undefined)
      return (
        <tr key="0">
          <th scope="row">1</th>
          <td>No Data</td>
          <td>No Data</td>
          <td>No Data</td>
          <td>No Data</td>
          <td>No Data</td>
          <td>No Data</td>
        </tr>
      );
    else {
      let cameraNo = 0;
      const results = this.state.cameras.map(camera => (
        <tr key={camera._id}>
          <th scope="row">{++cameraNo}</th>
          <td>{camera.ip}</td>
          <td>{camera.cameraType}</td>
          <td>{camera.pingStatus}</td>
          <td>{camera.cameraWebPageStatus}</td>
          <td>{camera.picStatus ? "Available" : "Not Available"}</td>
          <td>{new Date(camera.date).toLocaleDateString("en-US")}</td>
        </tr>
      ));
      return results;
    }
  }

  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate;
    endDate = endDate || this.state.endDate;

    if (isAfter(startDate, endDate)) {
      endDate = startDate;
    }

    this.setState({ startDate, endDate });
  };

  handleStartChange = startDate => this.handleChange({ startDate });

  handleEndChange = endDate => this.handleChange({ endDate });

  refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  generatePdfReport(cameras) {
    if (!cameras) {
      this.setState({
        errors: "Search must be run before report can be generated."
      });
    } else {
      console.log(cameras);
      pdfResults(cameras);
      fetch(`/api/reports/update-last-report/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reportType: this.state.reportType })
      })
        .then(response => response.json())
        .then(data => {
          this.refreshPage();
        })
        .catch(error => console.log("error fetching data from backend", error));
    }
  }

  deleteLastReportRecords() {
    fetch(`/api/reports/delete-last-reports-records/`)
      .then(response => response.json())
      .then(data => this.setState({ lastReports: [] }))
      .catch(error => console.log("error fetching data from backend", error));
  }

  render() {
    return (
      <Container className="marginTop">
        <Row>
          <Col md="4" />
          <Col md="4">
            <center>
              <h1 className="bold titleMargin">Reports</h1>
            </center>
          </Col>
          <Col md="4" />
        </Row>
        <Row>
          <Form>
            <Col sm="12" md="12">
              <Col md="2" />
              <Col md="3">
                <FormGroup>
                  <p className="bold">Search Type:</p>
                  <FormGroup check className="marginBottom">
                    <Label check />
                    <Input
                      id="radio1"
                      type="radio"
                      name="search"
                      value="all"
                      onClick={this.searchType}
                    />{" "}
                    All Cameras
                  </FormGroup>
                  <FormGroup check>
                    <Label check> </Label>
                    <Input
                      id="radio2"
                      type="radio"
                      name="search"
                      value="errors"
                      onClick={this.searchType}
                    />{" "}
                    Filter by Errors
                  </FormGroup>
                  <FormGroup check>
                    <Label check> </Label>
                    <Input
                      id="radio3"
                      type="radio"
                      name="search"
                      value="dateRange"
                      onClick={this.searchType}
                    />{" "}
                    Filter by Date-Range
                    <br />
                    <DatePicker
                      className="datepickerFields"
                      selected={this.state.startDate}
                      selectsStart
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleStartChange}
                    />{" "}
                    to{" "}
                    <DatePicker
                      className="datepickerFields"
                      selected={this.state.endDate}
                      selectsEnd
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleEndChange}
                    />
                  </FormGroup>
                </FormGroup>
                <Button className="search" size="sm" onClick={this.searchType}>
                  Search
                </Button>{" "}
              </Col>
              <Col md="3">
                <p>Last Report Generated: </p>
                <ol className="overflow">
                  <DisplayLastReports reports={this.state.lastReports} />
                </ol>
                <br />
                <center>
                  <Button 
                    className="generateReport"
                    size="md">
                    <Link to= {{
                      pathname:"/picture-report",
                      query: {cameras: this.state.cameras}
                      }}>Picture PDF</Link>
                  </Button>
                  
                  <Button
                    className="generateReport"
                    size="md"
                    onClick={() => this.generatePdfReport(this.state.cameras)}
                  >
                    PDF Report
                  </Button>{" "}
                  <Button
                    className="generateReport"
                    size="md"
                    onClick={() => this.deleteLastReportRecords()}
                  >
                    Delete Reports
                  </Button>
                </center>
                <br />
                <span style={{ color: "red" }}>{this.state.errors}</span>
              </Col>

              <Col md="3">
                <p>Files in DB: {this.state.dbCount}</p>
                <Button color="danger" size="lg">
                  Delete Files
                </Button>{" "}
              </Col>
              <Col md="1" />
            </Col>
          </Form>
        </Row>
        <Row>
          <Col md="4" />
          <Col md="4">
            <hr />
            <center>
              <h1 className="bold">Report Details</h1>
            </center>
          </Col>
          <Col md="4" />
        </Row>
        <Row>
          <Col md="2" />
          <Col md="8">
            <Table striped>
              <thead>
                <tr className="GTYellow">
                  <th>#</th>
                  <th>IP</th>
                  <th>Camera Type</th>
                  <th>Ping Status</th>
                  <th>Web Page Status</th>
                  <th>Pic Status</th>
                  <th>
                    <span className="ml">Date</span>
                  </th>
                </tr>
              </thead>
              <tbody>{this.getResults()}</tbody>
            </Table>
          </Col>
          <Col md="1" />
        </Row>
      </Container>
    );
  }
}
export default reports;
