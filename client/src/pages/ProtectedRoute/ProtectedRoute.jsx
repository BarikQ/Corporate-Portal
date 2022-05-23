import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';

import { authRequest } from 'api';
import { useAuth } from 'hooks';
import { Preloader } from 'components';

export default function ProtectedRoute() {
  const { isAuthed, isLoading } = useAuth();
  const location = useLocation();

  console.log('protected', isAuthed);
  return <Outlet />;

  // if (!isAuthed && !isLoading && isAuthed !== null) {
  //   return <Navigate to="/" state={{ from: location }} />;
  // }

  // if (isAuthed && !isLoading) {
  //   console.log('zdarova');
  //   return <Outlet />;
  // }

  // return <Preloader isLoading />;
}
