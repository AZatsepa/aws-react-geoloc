import React, { useState } from "react";
import { shape, func } from "prop-types";
import { Form, Button, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

const ChangePassword = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (event) => {
    event.preventDefault();
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      props.history.push("/change-password-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleChangePassword}>
      <Form.Group controlId="formBasicOldPassword">
        <Form.Label>Old Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Old Password"
          onChange={(event) => setOldPassword(event.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicNewPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="New Password"
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </Form.Group>

      <LinkContainer to="/forgot-password">
        <Nav.Link>Forgot your password?</Nav.Link>
      </LinkContainer>

      <Button variant="primary" type="submit">
        Change password
      </Button>
    </Form>
  );
};

ChangePassword.propTypes = {
  history: shape({
    push: func,
  }).isRequired,
};

export default ChangePassword;
