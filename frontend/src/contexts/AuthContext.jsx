import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, saveAuthToken, removeAuthToken, getAuthToken, setAuthToken } from '../services/api';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  VERIFY_START: 'VERIFY_START',
  VERIFY_SUCCESS: 'VERIFY_SUCCESS',
  VERIFY_FAILURE: 'VERIFY_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
      
    case AUTH_ACTIONS.VERIFY_START:
      return {
        ...state,
        loading: true,
      };
      
    case AUTH_ACTIONS.VERIFY_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
      
    case AUTH_ACTIONS.VERIFY_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null, // Don't show error for failed verification
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
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

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken();
      
      if (token) {
        dispatch({ type: AUTH_ACTIONS.VERIFY_START });
        
        try {
          const response = await authAPI.verify(token);
          
          if (response.data.success && response.data.data.valid) {
            dispatch({
              type: AUTH_ACTIONS.VERIFY_SUCCESS,
              payload: {
                user: {
                  userid: response.data.data.userid,
                  role: response.data.data.role,
                },
              },
            });
            
            setAuthToken(token); // Ensure token is set in axios headers
          } else {
            // Invalid token
            removeAuthToken();
            dispatch({ type: AUTH_ACTIONS.VERIFY_FAILURE });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          removeAuthToken();
          dispatch({ type: AUTH_ACTIONS.VERIFY_FAILURE });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.VERIFY_FAILURE });
      }
    };

    verifyToken();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { token, userid, role } = response.data.data;
        
        // Save token
        saveAuthToken(token);
        
        // Update state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: { userid, role },
            token,
          },
        });
        
        console.log('Login successful');
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.data.error || 'Login failed',
        });
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log('Logout successful');
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
