import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import NavBar from './components/NavBar/NavBar';
import Login from './components/auth/Login/Login';
import ForgotPassword from './components/auth/ForgotPassword/ForfotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification/ForfotPasswordVerification';
import ChangedPasswordConfirmation from './components/auth/ChangedPasswordConfirmation/ChangedPasswordConfirmation';

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
      setIsAuthenticated(true);
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch(error) {
      if (error !== 'No current user') {
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
          <Route exact path="/login" render={(props) => <Login auth={authProps} {...props} />}/>
          <Route exact path="/forgot-password" render={(props) => <ForgotPassword auth={authProps} {...props} />}/>
          <Route exact path="/forgot-password-verification" render={(props) => <ForgotPasswordVerification auth={authProps} {...props} />}/>
          <Route exact path="/changed-password-confirmation" render={(props) => <ChangedPasswordConfirmation auth={authProps} {...props} />}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
