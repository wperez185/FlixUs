import React from 'react';
import {Link} from 'react-router-dom';

export default class Login extends React.Component {
  render() {
    return (
      <div className="Login">
        <h1 className="center">Login</h1>
        <div className="form-wrapper">
          <form className="form">
            {/* Email */}
            <label className="form-label" htmlFor="account-email">Email</label>
            <input className="form-input" id="account-email" type="email" name="email" />
            {/* Password */}
            <label className="form-label" htmlFor="account-password">Password</label>
            <input className="form-input" id="account-password" type="password" name="password" />
          </form>
          <button>Submit</button>
        </div>
        <div className="form-caption center">
          <small>Don’t have an account? <Link to="/register">Click here to register.</Link></small>
        </div>
      </div>
    );
  }
}
