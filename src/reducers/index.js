import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  ADD_TO_MY_MOVIES_SUCCESS,
  REMOVE_FROM_MY_MOVIES_SUCCESS,
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
  loggedIn: false,
  user: { name: '', email: '', movies: [] },
  userInfo: JSON.parse(localStorage.getItem('app_user'))
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
    case ADD_TO_MY_MOVIES_SUCCESS: {
      return Object.assign({}, state, {
        user: action.user,
        loading: false
      });
    }
    // Remove movie
    case REMOVE_FROM_MY_MOVIES_SUCCESS: {
      return Object.assign({}, state, {
        user: action.user,
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
