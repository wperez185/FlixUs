import React from 'react';
import { updateAccount,deleteAccount } from '../actions'

export default class MyAccount extends React.Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    console.log('this.props -> ', this.props)
    const { id, username, password, token } = this.props.user
    this.setState({
      id,
      username,
      password,
      token
    })
  }

  handleInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    const { dispatch, history } = this.props;
    const { username, password, token, id } = this.state;
    return (
      <div className="MyAccount">
        <h1 className="center">My Account</h1>
        <div className="form-wrapper">
          <form className="form" onSubmit={(event) => {event.preventDefault(); dispatch(updateAccount(token, id, username, password))}}>
            {/* Username */}
            <label className="form-label" htmlFor="username">Username</label>
            <input className="form-input" id="username" type="text" name="username" onChange={this.handleInputChange} value={username} />
            {/* Password */}
            <label className="form-label" htmlFor="account-password">Password</label>
            <input className="form-input" id="account-password" type="password" name="password" onChange={this.handleInputChange} value={password} />
            <button className="update" type="submit"> Update Account </button>
            <button className="delete" type="button" onClick={() => {dispatch(deleteAccount(token, id, history))}}> Delete Account </button>
          </form>
        </div>
      </div>
    );
  }
}
