import React from 'react';
import {userLogout} from '../actions';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    this.props.history.push('/');
  }

  componentWillMount() {
    this.props.dispatch(userLogout()).then(this.onLogout);
  }

  render() {
    return (
      <div className="Logout">
        <h1 className="center">Logout</h1>
        <div className="form-wrapper">
          Logging you out now…
        </div>
      </div>
    );
  }
}
