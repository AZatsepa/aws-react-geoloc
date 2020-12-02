import React, { useState, useContext } from "react";
import { shape, func } from "prop-types";
import { Auth } from "aws-amplify";
import { Form, Button } from "react-bootstrap";
import AlertContext from "../../context/AlertContext";

const ForgotPassword = (props) => {
  const { setError } = useContext(AlertContext);
  const [email, setEmail] = useState("");
  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      await Auth.forgotPassword(email);
      props.history.push("/forgot-password-verification");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Form onSubmit={forgotPasswordHandler}>
      <Form.Group controlId="formBasicEmail">
        <Form.Text className="text-muted">
          Please enter the email address associated with your account and
          we&apos;ll email you a password reset link.
        </Form.Text>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

ForgotPassword.propTypes = {
  history: shape({
    push: func,
  }).isRequired,
};

export default ForgotPassword;
// export default withRouter(ForgotPassword);
