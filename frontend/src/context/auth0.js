// context/AuthTokenContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthTokenContext = createContext(null);

export const AuthTokenProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setToken(token);
        } catch (err) {
          console.error("Error getting token:", err);
        }
      }
    };
    loadToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AuthTokenContext.Provider value={token}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = () => useContext(AuthTokenContext);
