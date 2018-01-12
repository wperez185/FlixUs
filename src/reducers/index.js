import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  ADD_TO_MY_MOVIES,
  REMOVE_FROM_MY_MOVIES,
  USER_REGISTER,
  USER_LOGIN,
  USER_LOGOUT,
  DELETE_USER,
  UPDATE_USER
} from '../actions';

const initialState = {
  error: null,
  loading: false,
  movies: [],
  updateProfileData: false,
  featuredTop: { full_backdrop_path: null, title: null, overview: null },
  featuredBottom: { full_backdrop_path: null, title: null, overview: null },
  myMovies: [],
  user: JSON.parse(localStorage.getItem('app_user'))
};



export function movieReducer(state=initialState, action) {
  switch (action.type) {
    // Loading
    case REQUEST_MOVIES: {
      return Object.assign({}, state, {
        loading: true
      });
    // Home / Just Released
    }
    case RECEIVE_MOVIES: {
      return Object.assign({}, state, {
        featuredTop: action.featuredTop,
        featuredBottom: action.featuredBottom,
        movies: action.movies,
        loading: false
      });
    // My Movies: Add movie
    }
    case ADD_TO_MY_MOVIES: {
      let myMovies = state.myMovies;

      // Only add movie if it isn't already
      if (myMovies.map(m => m.title).indexOf(action.movie.title) < 0) {
        console.log('add!');
        myMovies = myMovies.concat(action.movie);
        // TODO: Save myMovies to user database
        // callDatabase().then(return new state object);
      }

      return Object.assign({}, state, {
        myMovies: myMovies,
        loading: false
      });
    }
    // My Movies: Remove movie
    case REMOVE_FROM_MY_MOVIES: {
      let myMovies = state.myMovies.filter(m => m.title !== action.movie.title);
      // TODO: Save myMovies to user database
      return Object.assign({}, state, {
        myMovies: myMovies,
        loading: false
      });
    }
    case USER_LOGOUT: {
      return Object.assign({}, state, {
        user: null
      });
    }
    case USER_LOGIN:
    case USER_REGISTER: {
      const user = action.user;
      return Object.assign({}, state, { user });
    }
    case DELETE_USER: {
      return Object.assign({}, state, { user: null });
    }
    case UPDATE_USER: {
      return Object.assign({}, state, { updateProfileData: true });
    }
    default:
      break;
  }

  return state;
}
