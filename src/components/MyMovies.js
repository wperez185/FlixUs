import React from 'react';
import {Link} from 'react-router-dom';
import {removeFromMyMovies} from '../actions';
import {Toast} from 'react-toastr-basic';

export default class Home extends React.Component {
  removeFromMyMovies(event, movie) {
    event.preventDefault();
    this.props.dispatch(removeFromMyMovies(movie, this.props.user));
  }

  renderResults() {
    const movies = this.props.user.movies.map((movie, index) => (
      <li className="movie-grid-item" key={index}>
        <button className="movie" type="button" data-text="Remove from My Movies"
          onClick={event => this.removeFromMyMovies(event, movie)}>
          <img className="movie-poster" src={movie.full_poster_path} alt={movie.title} />
        </button>
      </li>
    ));

    return <ul className="movie-grid">{movies}</ul>;
  }

  render(props) {
    return (
      <div className="MyMovies">
        <h1 className="center">My Movies</h1>
        <div className="MovieGrid">
          <div className="wrapper">
            { this.props.user.movies.length ?
              this.renderResults() :
              (<div className="center">
                You haven’t added any movies yet.<br/><br/>
                <Link to="/top-picks">Go pick some!</Link>
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}
