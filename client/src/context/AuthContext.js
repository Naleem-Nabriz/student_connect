import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id || null,
  };
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: normalizeUser(action.payload.user),
        token: action.payload.token,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set token in API headers
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      localStorage.removeItem('token');
      delete authAPI.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await authAPI.get('/me');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data,
              token,
            },
          });
        } catch (error) {
          dispatch({
            type: AUTH_FAILURE,
            payload: 'Session expired. Please login again.',
          });
        }
      } else {
        dispatch({ type: AUTH_SUCCESS, payload: { user: null, token: null } });
      }
    };

    checkAuth();
  }, []);

  // Actions
  const login = async (credentials) => {
    dispatch({ type: AUTH_START });
    try {
      const response = await authAPI.post('/login', credentials);
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_START });
    try {
      const response = await authAPI.post('/register', userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
