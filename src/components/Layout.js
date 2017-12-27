import React from 'react';
import FeaturedMovie from './FeaturedMovie';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="Layout">
        <header className="header">
          <div className="wrapper">
            <a className="header-login nav-link" href="/login">
              Login
            </a>
            <div className="logo-wrapper">
              <a className="logo" href="/">
                FlixUs
              </a>
            </div>
            <nav className="nav">
              <ul className="nav-list">
                <li className="nav-item"><a href="/just-released" className="nav-link">Just Released</a></li>
                <li className="nav-item"><a href="/top-picks" className="nav-link">Top Picks</a></li>
                <li className="nav-item"><a href="/my-movies" className="nav-link">My Movies</a></li>
                <li className="nav-item"><a href="/my-account" className="nav-link">My Account</a></li>
                <li className="nav-item"><a href="/settings" className="nav-link">Settings</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>
          <FeaturedMovie
            image={this.props.featuredTop.full_backdrop_path}
            title={this.props.featuredTop.title}
            description={this.props.featuredTop.overview}
            href="/movie" />

          <div className="wrapper">
            <button onClick={this.sortByReleaseDate} type="button">
              Sort by release date
            </button>

            <button onClick={this.sortByPopularity} type="button">
              Sort by popularity
            </button>

            <form onSubmit={this.doSearch}>
              <input type="search" ref={input => (this.input = input)} />
              <button>Search</button>
            </form>

            {this.renderResults()}
          </div>

          <FeaturedMovie
            image={this.props.featuredBottom.full_backdrop_path}
            title={this.props.featuredBottom.title}
            description={this.props.featuredBottom.overview}
            href="/movie" />
        </main>
      </div>
    );
  }
}
