import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../components/SessionState/sessionSlice';
import { history } from '../../components/History';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const handleSessionExpiry = (json) => {
    if (json?.sessionexpired) {
      dispatch(logout());
      history.navigate(json.navigate || '/login');
    }
  };

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const contentType = response.headers.get('content-type');
        let data = {};

        if (contentType && contentType.includes('application/json')) {
          data = await response.clone().json();
        }

        if (response.status === 401 && data.sessionexpired) {
          handleSessionExpiry(data);
          // window.dispatchEvent(new CustomEvent('sessionExpiry', { detail: data }));
        }
        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [dispatch, history.navigate]);

  return <AuthContext.Provider value={{ handleSessionExpiry }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;