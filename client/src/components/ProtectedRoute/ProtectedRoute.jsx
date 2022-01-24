import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authRequest } from 'api';

function ProtectedRoute() {
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    try {
      const response = authRequest();
      setAuth(true);
    } catch (error) {
      setAuth(false);
    }
  }, []);

  return auth ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
