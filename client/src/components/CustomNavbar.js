import React, { Component } from "react";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import "./CustomNavbar.css";

export default class CustomNavbar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">VMSBOT</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={2} href="/reports">
            Reports
          </NavItem>
          <NavDropdown id="nav-dropdown" eventKey={3} title="System">
            <MenuItem eventKey={3.1} href="/cameraTest">
              Camera Test
            </MenuItem>
            <MenuItem eventKey={3.2} href="/schedule-cameraTest">
              Schedule Test
            </MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={4} href="#">
            {" "}
            Login
          </NavItem>
          <NavDropdown id="nav-dropdown" eventKey={3} title="More">
            <MenuItem eventKey={3.1} href="/aboutus">
              About &#169;VMSBOT
            </MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
