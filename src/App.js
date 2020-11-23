import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import NavBar from './components/NavBar/NavBar';
import Login from './components/auth/Login/Login';
import ForgotPassword from './components/auth/ForgotPassword/ForfotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification/ForfotPasswordVerification';
import ChangedPasswordConfirmation from './components/auth/ChangedPasswordConfirmation/ChangedPasswordConfirmation';
import ChangePassword from './components/auth/ChangePassword/ChangePassword';
import SignUp from './components/auth/SignUp';
import GoogleMap from './components/GoogleMap/GoogleMap';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthenticatedUser()
      .then(() => setIsAuthenticating(false));
  }, []);

  const setAuthenticatedUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser(user);
    } catch(error) {
      if (error !== 'not authenticated') {
        console.error(error);
      }
    }
  };

  const authProps = {
    isAuthenticated,
    user,
    setIsAuthenticated,
    setUser,
  };

  return (
    !isAuthenticating &&
    <div className="App">
      <Router>
        <NavBar auth={authProps} />
        <Switch>
          <Route exact path="/sign-up" render={(props) => <SignUp auth={authProps} {...props} />}/>
          <Route exact path="/login" render={(props) => <Login auth={authProps} {...props} />}/>
          <Route exact path="/change-password" render={(props) => <ChangePassword auth={authProps} {...props} />}/>
          <Route exact path="/forgot-password" render={(props) => <ForgotPassword auth={authProps} {...props} />}/>
          <Route exact path="/forgot-password-verification" render={(props) => <ForgotPasswordVerification auth={authProps} {...props} />}/>
          <Route exact path="/changed-password-confirmation" render={(props) => <ChangedPasswordConfirmation auth={authProps} {...props} />}/>
          <Route exact path="/google-map" render={(props) => <GoogleMap auth={authProps} {...props} />}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
