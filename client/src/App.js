import React, { Component } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from "./components/AboutUs";
import Navbar from "./components/CustomNavbar";
import Test from "./components/Test";
import Reports from "./components/Reports";
import Scheduler from "./components/Scheduler";
import Home from "./components/Home";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Router>
          <div>
            <Navbar />
            <Route exact path="/" component={Home} />
            <Route path="/aboutus" component={About} />
            <Route path="/reports" component={Reports} />
            <Route path="/cameraTest" component={Test} />
            <Route path="/schedule-cameraTest" component={Scheduler} />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
