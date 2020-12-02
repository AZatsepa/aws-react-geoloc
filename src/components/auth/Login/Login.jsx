import React, { useState } from "react";
import { func, shape } from "prop-types";
import { Form, Button, Nav } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (event) => {
    event.preventDefault();
    try {
      await Auth.signIn(username, password);
      props.auth.setIsAuthenticated(true);
      props.history.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleLogIn}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <Form.Text className="text-muted">
          We will never share your username with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>

      <LinkContainer to="/forgot-password">
        <Nav.Link>Forgot your password?</Nav.Link>
      </LinkContainer>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

Login.propTypes = {
  history: shape({
    push: func,
  }).isRequired,
  auth: shape({
    setIsAuthenticated: func,
  }).isRequired,
};

export default Login;
