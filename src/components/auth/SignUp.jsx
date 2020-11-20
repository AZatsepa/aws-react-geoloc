import React, { useState } from 'react';
import { object } from 'prop-types';
import { Form, Button, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';

const SignUp = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: email
        }
      });
      props.history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return(
    <Form onSubmit={handleSignUp}>
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

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(event) => setEmail(event.target.value)}
        />
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
        Sign up
      </Button>
    </Form>
  );
};

SignUp.propTypes = {
  history: object,
};

export default SignUp;
