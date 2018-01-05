import React from 'react';
import { deleteAccount } from '../actions'

export default class MyAccount extends React.Component {
  constructor() {
    super();
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

  render() {
    const { dispatch, history } = this.props;
    const { username, password, token, id } = this.state;
    return (
      <div className="MyAccount">
        <h1 className="center">My Account</h1>
        <div className="form-wrapper">
          <form className="form">
            {/* Name */}
            <label className="form-label" htmlFor="account-name">Name</label>
            <input className="form-input" id="account-name" type="text" name="name" />
            {/* Email */}
            <label className="form-label" htmlFor="account-email">Email</label>
            <input className="form-input" id="account-email" type="email" name="email" value={username} />
            {/* Password (disabled) */}
            <label className="form-label" htmlFor="account-password">Password</label>
            <input className="form-input" id="account-password" type="password" name="password" disabled readOnly value={password} />
            <button className="delete" type="button" onClick={() => {dispatch(deleteAccount(token, id, history))}}> Delete Account </button>
          </form>
        </div>
      </div>
    );
  }
}
