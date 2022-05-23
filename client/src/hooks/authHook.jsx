/* eslint-disable react/prop-types */
// /src/hooks/useAuth.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';

import { authRequest } from 'api';

const AuthContext = createContext(null);
// const authRrrr = authRequest();

const AuthProvider = ({ children }) => {
  const [isAuthed, setIsAuthed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // authRrrr
    //   .then((res) => {
    //     console.log('ky', res);
    //     setIsAuthed(true);
    //   })
    //   .catch((error) => {
    //     console.log('err', error.message);
    //     setIsAuthed(false);
    //   });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // auth();
  }, []);

  const auth = async () => {
    try {
      // const result = await authRequest();
      setIsAuthed(true);
      setIsLoading(false);
    } catch (error) {
      setIsAuthed(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthed, setIsAuthed, auth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
