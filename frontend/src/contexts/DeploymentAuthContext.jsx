import React, { createContext, useContext, useState, useEffect } from 'react';

const DeploymentAuthContext = createContext(null);

export const useDeploymentAuth = () => {
  const context = useContext(DeploymentAuthContext);
  if (!context) {
    throw new Error('useDeploymentAuth must be used within a DeploymentAuthProvider');
  }
  return context;
};

export const DeploymentAuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    roleType: null,
    keyName: null,
    accessKey: null,
    loading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('deployment_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        // Validate that the session isn't expired (optional)
        setAuthState({
          ...parsedAuth,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to parse deployment auth:', error);
        localStorage.removeItem('deployment_auth');
        setAuthState({ isAuthenticated: false, roleType: null, keyName: null, accessKey: null, loading: false });
      }
    } else {
      setAuthState({ isAuthenticated: false, roleType: null, keyName: null, accessKey: null, loading: false });
    }
  }, []);

  const login = (roleType, keyName, accessKey, additionalData = {}) => {
    const newAuthState = {
      isAuthenticated: true,
      roleType,
      keyName,
      accessKey,
      ...additionalData,
      loading: false,
    };
    setAuthState(newAuthState);
    localStorage.setItem('deployment_auth', JSON.stringify(newAuthState));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      roleType: null,
      keyName: null,
      accessKey: null,
      loading: false,
    });
    localStorage.removeItem('deployment_auth');
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return (
    <DeploymentAuthContext.Provider value={value}>
      {children}
    </DeploymentAuthContext.Provider>
  );
};

export default DeploymentAuthContext;




