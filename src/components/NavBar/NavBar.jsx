import React from 'react';
import {func, object, shape, bool} from 'prop-types';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';

const NavBar = (props) => {
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await Auth.signOut();
      props.auth.setIsAuthenticated(false);
      props.auth.setUser(null);
      props.history.push('/');
    } catch(error) {
      console.error(error.message);
    }
  };

  return(
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>AWS-React-Geoloc</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">

        <Nav className="mr-auto">
          {
            props.auth.isAuthenticated ?
              <>
                <LinkContainer to="/google-map">
                  <Nav.Link>Google Map</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/change-password">
                  <Nav.Link>Change password</Nav.Link>
                </LinkContainer>
                <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
              </>
              :
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/sign-up">
                  <Nav.Link>SignUp</Nav.Link>
                </LinkContainer>
              </>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavBar.propTypes = {
  history: object,
  auth: shape({
    setIsAuthenticated: func,
    isAuthenticated: bool,
  })
};

export default withRouter(NavBar);
