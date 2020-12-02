import React, { useContext } from "react";
import { func, shape, bool } from "prop-types";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import AlertContext from "../context/AlertContext";

const NavBar = ({ history, auth }) => {
  const { setError } = useContext(AlertContext);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await Auth.signOut();
      auth.setIsAuthenticated(false);
      auth.setUser(null);
      history.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>AWS-React-Geoloc</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {auth.isAuthenticated
            ? (
              <>
                <LinkContainer to="/google-map">
                  <Nav.Link>Google Map</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/change-password">
                  <Nav.Link>Change password</Nav.Link>
                </LinkContainer>
                <Nav.Link href="/" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/sign-up">
                  <Nav.Link>SignUp</Nav.Link>
                </LinkContainer>
              </>
            )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavBar.propTypes = {
  history: shape({
    push: func,
  }).isRequired,
  auth: shape({
    setIsAuthenticated: func,
    isAuthenticated: bool,
  }).isRequired,
};

export default withRouter(NavBar);
