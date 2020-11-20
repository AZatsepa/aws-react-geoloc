import React from 'react';
import { object } from 'prop-types';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';

const NavBar = (props) => {
  const handleLogout = (event) => {
    event.preventDefault();
    // auth logic here
    console.log('Logged out');
    props.history.push('/');
  };

  return(
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>AWS-React-Geoloc</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/login">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
          <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavBar.propTypes = {
  history: object,
};

export default withRouter(NavBar);
