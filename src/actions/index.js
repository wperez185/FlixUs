import fetch from 'cross-fetch';
import axios from 'axios';


// set axios base url
axios.defaults.baseURL = 'http://localhost:8080';

// TMDB API key:
// https://www.themoviedb.org/settings/api
const API_KEY = 'cc6d2c6b137405f0457b9bdb5863c4ef';

// Get TMBD's image settings:
// https://developers.themoviedb.org/3/getting-started/images
// https://developers.themoviedb.org/3/configuration/get-api-configuration
let _imageSettings;

// Base movie actions on Redux's Example Reddit API:
// https://redux.js.org/docs/advanced/ExampleRedditAPI.html

export const REQUEST_MOVIES = 'REQUEST_MOVIES';
const requestMovies = () => {
  return {
    type: REQUEST_MOVIES
  };
};

export const RECEIVE_MOVIES = 'RECEIVE_MOVIES';
const receiveMovies = (json) => {
  return {
    type: RECEIVE_MOVIES,
    featuredTop: json.featuredTop,
    featuredBottom: json.featuredBottom,
    movies: json.movies,
    receivedAt: Date.now()
  };
};

export const fetchMovies = () => {
  return dispatch => {
    dispatch(requestMovies());

    // First get image settings
    const getImages = new Promise((resolve, reject) => {
      fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(json => {
          _imageSettings = json.images;
          resolve(json.images);
        });
    });

    // Then load movies
    const getMovies = new Promise((resolve, reject) => {
      getImages.then(() => {
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`)
          .then(response => response.json())
          .then(json => {
            resolve(json.results);
          });
      });
    });

    // Return movies via action
    return getMovies.then(json => {
      // Add full image paths
      let movies = json.map(movie => {
        // 'w300', 'w780', 'w1280', 'original'
        movie.full_backdrop_path = _imageSettings.base_url + 'w1280' + movie.backdrop_path;
        // 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
        movie.full_poster_path = _imageSettings.base_url + 'w154' + movie.poster_path;
        return movie;
      });

      // Feature the 2 most popular movies
      let featured = movies
        .sort((a, b) => a.popularity < b.popularity)
        .slice(0, 2);

      dispatch(receiveMovies({
        featuredTop: featured[0],
        featuredBottom: featured[1],
        movies: movies
      }));
    });
  };
};


// My Movies actions:
export const ADD_TO_MY_MOVIES = 'ADD_TO_MY_MOVIES';
export const addToMyMovies = (movie) => ({
  type: ADD_TO_MY_MOVIES,
  movie: movie
});

export const REMOVE_FROM_MY_MOVIES = 'REMOVE_FROM_MY_MOVIES';
export const removeFromMyMovies = (movie) => ({
  type: REMOVE_FROM_MY_MOVIES,
  movie: movie
});


export const USER_REGISTER = 'USER_REGISTER';
export const userRegister = (username, password, history) => {
  return (dispatch) => {
    axios({
      method: 'post',
      data: {
        username,
        password
      },
      url: '/api/users/register',
    }).then(response => {
      if (response.status === 201) {
        const { user } = response.data;
        history.push('/')
        localStorage.setItem('app_user', JSON.stringify(user));
        dispatch({
          type: USER_REGISTER,
          user
        });
      }
    }).catch(err => {
      const status = err.response ? err.response.status : 500;
      switch(status) {
        case 404: {
          console.log('User not found: ', err.response.data);
          break;
        }
        case 401: {
          console.log('User is unauthorized: ', err.response.data);
          break;
        }
        case 422: {
          console.log('Missing field: ', err.response.data)
          break;
        }
        default: {
          console.log('Server error occured');
          break;
        }
      }
    });
  };
};

export const UPDATE_USER = "UPDATE_USER";
export const updateAccount = (token, id, username, password) => {
  return (dispatch) => {
    axios({
      method: 'put',
      headers: {'Authorization': token },
      url: `api/users/${id}`,
      data: {
        username: username,
        password: password
      }
    }).then(response => {
      if (response.status === 200) {
        dispatch({ type: UPDATE_USER })

      }
    }).catch(err => {
      console.log('Error occured when updating: ', err)
    })
  };
};

export const DELETE_USER = "DELETE_USER";
export const deleteAccount = (token, id, history) => {
  return (dispatch) => {
    axios({
      method: 'delete',
      headers: {'Authorization': token },
      url: `api/users/${id}`
    }).then(response => {
      if (response.status === 204) {
        dispatch({ type: DELETE_USER })
        history.push('/')
      }
    }).catch(err => {
      console.log('Error occured when deleting: ', err)
    })
  };
};

export const USER_LOGIN = 'USER_LOGIN';
export const userLogin = (username, password, history) => {
  return (dispatch) => {
    axios({
      method: 'post',
      data: {
        username,
        password
      },
      url: '/api/users/login',
    }).then(response => {
      if (response.status === 200) {
        history.push('/');
        const { user } = response.data;
        localStorage.setItem('app_user',JSON.stringify(user));
        dispatch({
          type: USER_LOGIN,
          user
        });
      }
    }).catch(err => {
      const status = err.response ? err.response.status : 500;
      switch(status) {
        case 404: {
          console.log('User not found: ', err.response.data);
          break;
        }
        case 401: {
          console.log('User is unauthorized: ', err.response.data);
          break;
        }
        case 422: {
          console.log('Missing field: ', err.response.data)
          break;
        }
        default: {
          console.log('Server error occured');
          break;
        }
      }
    });
  };
};

export const USER_LOGOUT = 'USER_LOGOUT';
export const userLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('app_user');
    dispatch({
      type: USER_LOGOUT
    });
  };
};
