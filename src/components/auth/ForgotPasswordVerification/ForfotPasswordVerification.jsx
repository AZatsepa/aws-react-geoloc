import React, { useState, useContext } from "react";
import { shape, func } from "prop-types";
import { Auth } from "aws-amplify";
import { Form, Button } from "react-bootstrap";
import AlertContext from "../../context/AlertContext";

const ForgotPasswordVerification = (props) => {
  const { setError } = useContext(AlertContext);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passwordVerificationHandler = async (event) => {
    event.preventDefault();
    try {
      await Auth.forgotPasswordSubmit(email, verificationCode, password);
      props.history.push("/changed-password-confirmation");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Form onSubmit={passwordVerificationHandler}>
      <Form.Text className="text-muted">
        Please enter the verification code sent to your email address below,
        your email address and a new password.
      </Form.Text>

      <Form.Group controlId="formBasicVerificationCode">
        <Form.Control
          type="text"
          placeholder="Enter verification code"
          onChange={(event) => setVerificationCode(event.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(event) => setEmail(event.target.value)}
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

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

ForgotPasswordVerification.propTypes = {
  history: shape({
    push: func,
  }).isRequired,
};

export default ForgotPasswordVerification;
