import React from 'react';
import {Link} from 'react-router-dom';
import { userRegister } from '../actions'

export default class Register extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '', 
      password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.register = this.register.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  register(event) {
    event.preventDefault();
    const { history, dispatch } = this.props;
    const { username, password } = this.state;
    dispatch(userRegister(username, password, history));
    console.log(this.state);
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="Register">
        <h1 className="center">Register</h1>
        <div className="form-wrapper">
          <form onSubmit={this.register}>
            <div className="form">
              {/* Username */}
              <label className="form-label" htmlFor="username">Username</label>
              <input className="form-input" id="username" type="username" name="username" value={username}onChange={this.handleInputChange} />
              {/* Password */}
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-input" id="password" type="password" name="password" value={password} onChange={this.handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="form-caption center">
          <small>Already have an account? <Link to="/login">Click here to login.</Link></small>
        </div>
      </div>
    );
  }
}
