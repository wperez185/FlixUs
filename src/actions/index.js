import fetch from 'cross-fetch';
import axios from 'axios';
import {Toast, ToastDanger} from 'react-toastr-basic';



// set axios base url

axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080';
if(process.env.NODE_ENV==='production') {
  axios.defaults.baseURL = 'https://lit-caverns-59843.herokuapp.com/';
}
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
export const ADD_TO_MY_MOVIES_SUCCESS = 'ADD_TO_MY_MOVIES_SUCCESS';
export const addToMyMoviesSuccess = (movie, user) => ({
  type: ADD_TO_MY_MOVIES_SUCCESS,
  movie: movie,
  user: user
});

export const addToMyMovies = (movie, user) => {
  console.log("USER", user);
  return dispatch => {
    // TODO: Loading spinner / disable button while request is loading
    // dispatch(addToMyMoviesRequest());

    // Only add new movies
    if (user.movies.map(m => m.title).indexOf(movie.title) >= 0) {
      return dispatch(addToMyMoviesSuccess(movie, user));
    }

    const data = {
      movie: movie,
      id: user.id
    };

    const token = user.token;

    const addMovie = new Promise((resolve, reject) => {
      axios('/api/users/add-movie', {
        method: 'POST',
        data: data,
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        withCredentials: true
      })
      .then(json => {
        if (typeof json.code !== 'undefined' && json.code >= 400) {
          reject(json.message);
        } else {
          if (typeof json.movies === 'string') {
            json.movies = JSON.parse(json.movies);
          }
          json.token = token;
          resolve(json);
        }
      });
    });

    return addMovie.then(user => {
      dispatch(addToMyMoviesSuccess(movie, user));
      Toast("Movie Added to My Movies");
    });
  };
};

export const REMOVE_FROM_MY_MOVIES_SUCCESS = 'REMOVE_FROM_MY_MOVIES_SUCCESS';
export const removeFromMyMoviesSuccess = (movie, user) => ({
  type: REMOVE_FROM_MY_MOVIES_SUCCESS,
  movie: movie,
  user: user
});

export const removeFromMyMovies = (movie, user) => {
  return dispatch => {
    // TODO: Loading spinner / disable button while request is loading
    // dispatch(removeFromMyMoviesRequest());

    const data = {
      movie: movie,
      id: user.id
    };

    const token = user.token;

    const removeMovie = new Promise((resolve, reject) => {
      axios('/api/users/remove-movie', {
        method: 'POST',
        data: data,
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        withCredentials: true
      })
      .then(json => {
        if (typeof json.code !== 'undefined' && json.code >= 400) {
          reject(json.message);
        } else {
          if (typeof json.movies === 'string') {
            json.movies = JSON.parse(json.movies);
          }
          json.token = token;
          resolve(json);
        }
      });
    });

    return removeMovie.then(user => {
      dispatch(removeFromMyMoviesSuccess(movie, user));
    });
  };
};


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
        if (typeof user.movies === 'string') {
          user.movies = JSON.parse(user.movies);
          }
        history.push('/')
        localStorage.setItem('app_user', JSON.stringify(user));
        dispatch({
          type: USER_REGISTER,
          user
        });
      }
    }).catch(err => {
      ToastDanger("Username already taken.");
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
    return axios({
      method: 'put',
      headers: {'Authorization': token },
      url: `api/users/${id}`,
      data: {
        username: username,
        password: password
      }
    }).then(response => {
      if (response.status === 200) {

        let tempUser = JSON.parse(localStorage.getItem('app_user'));
        tempUser.username = username;
        tempUser.password = password;
        localStorage.setItem('app_user', JSON.stringify(tempUser));
        dispatch({ type: UPDATE_USER });
      }
    }).catch(err => {
      console.log('Error occured when updating: ', err)
    });
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
        if (typeof user.movies === 'string') {
          user.movies = JSON.parse(user.movies);
          }
        localStorage.setItem('app_user',JSON.stringify(user));
        dispatch({
          type: USER_LOGIN,
          user
        });
      }
    }).catch(err => {
      ToastDanger("Incorrect username and or password");
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
