import React from 'react';
import {Link} from 'react-router-dom';
import { userLogin } from '../actions'

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      username: '',
      password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  login(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { dispatch } = this.props;
    console.log('We’re trying to login!', this.state);
    const history = this.props.history;
    dispatch(userLogin(username, password, history));
  }

  handleInputChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }


  render() {
    return (
      <div className="Login">
        <h1 className="center">Login</h1>
        <div className="form-wrapper">
          <form onSubmit={this.login}>
            <div className="form">
              {/* Username */}
              <label className="form-label" htmlFor="username">Username</label>
              <input className="form-input" id="username" type="username" name="username" value={this.state.username} onChange={this.handleInputChange}/>
              {/* Password */}
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-input" id="password" type="password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="form-caption center">
          <small>Don’t have an account? <Link to="/register">Click here to register.</Link></small>
        </div>
      </div>
    );
  }
}
