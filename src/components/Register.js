import React from 'react';
import {Link} from 'react-router-dom';

export default class Login extends React.Component {
  render() {
    return (
      <div className="Register">
        <h1 className="center">Register</h1>
        <div className="form-wrapper">
          <form className="form">
            {/* Name */}
            <label className="form-label" htmlFor="account-name">Name</label>
            <input className="form-input" id="account-name" type="text" name="name" />
            {/* Email */}
            <label className="form-label" htmlFor="account-email">Email</label>
            <input className="form-input" id="account-email" type="email" name="email" />
            {/* Password */}
            <label className="form-label" htmlFor="account-password">Password</label>
            <input className="form-input" id="account-password" type="password" name="password" />
          </form>
          <button>Submit</button>
          <div className="form-caption center">
            <small>Already have an account? <Link to="/login">Click here to login.</Link></small>
          </div>
        </div>
      </div>
    );
  }
}
