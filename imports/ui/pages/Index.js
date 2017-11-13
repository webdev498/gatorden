import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { loginWithGoogle }  from '../../modules/login';

export default class Index extends React.Component {

  handleGoogleLogin() {
    event.preventDefault();

    loginWithGoogle();
  }

  render() {
    return <div className="Index">
            <Jumbotron className="text-center">
              <img src="/weblogo.jpg"/>
              <h2>RCDS Room Scheduler</h2>
              {
              // <div className="google-login-button" onClick={this.handleGoogleLogin}>
              //   <img src="/google_login_btn.png"></img>
              // </div>
              }
            </Jumbotron>
          </div>
  }
};
