/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useLocation, Link, withRouter, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert, Button, Stack } from '@mui/material';

import {
  Welcome,
  Profile,
  Settings,
  ProfileSettings,
  AccountSettings,
  PrivacySettings,
  Friends,
  Messenger,
  Chat,
  Users,
  Unknown,
  AdminHome,
  ProtectedRoute,
} from './pages';
import { Header, Navigation } from './components';
import { setAlert, removeAlert } from 'store/actions';
import { authRequest } from 'api';
import { AuthProvider, useAuth } from 'hooks';
import { buttonBackgroundLightGray } from 'constants/colors';
import { SocketContext } from 'context/socket';
import { getToken, setToken } from 'utils';

import './App.scss';

const AuthContext = createContext(null);
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: buttonBackgroundLightGray,
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});

function App() {
  const [access, setAccess] = useState(false);
  const mainLinks = [
    {
      path: `${getToken() || undefined}`,
      title: 'Profile',
    },
    {
      path: 'im',
      title: 'Messages',
    },
    {
      path: 'friends',
      title: 'Friends',
    },
    {
      path: 'users',
      title: 'Users',
    },
    {
      root: 'settings',
      path: 'settings/profile',
      title: 'Settings',
    },
    {
      root: 'admin',
      path: 'admin',
      title: 'Admin',
    },
  ];
  const accessValue = useSelector((state) => state.access.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthed, setIsAuthed } = useAuth();
  const socket = useContext(SocketContext);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const alert = useSelector((state) => state.alert.value);

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    dispatch(removeAlert());
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackbarOpen(false);
  };

  // useEffect(async () => {
  //   try {
  //     const response = await authRequest();
  //     if (currentPath === '/') navigate('/im');
  //     console.log('new one', response);
  //   } catch (error) {
  //     console.log('new', error.message);
  //     dispatch(
  //       setAlert({
  //         message: `You are logged out`,
  //         type: 'error',
  //       })
  //     );
  //     navigate('');
  //   }
  // }, [currentPath]);

  useEffect(() => {
    socket.auth = { userId: getToken() };
    socket.connect();
    socket.emit('join', { id: getToken() });
  }, [getToken()]);

  useEffect(() => {
    if (alert) openSnackbar();
  }, [alert]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className={`app ${location.pathname === '/' ? 'app--welcome' : ''}`}>
          <Header />
          <main className={`main ${location.pathname.includes('/admin') ? 'main--admin' : ''}`}>
            {location.pathname === '/' || location.pathname.includes('/admin') ? null : (
              <div className="main__nav sidebar">
                <Navigation routes={mainLinks} />
              </div>
            )}
            <Routes key={'routes'}>
              <Route element={<ProtectedRoute />}>
                <Route path="im" element={<Messenger />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/:profileId" element={<Profile />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="friends" element={<Friends />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="users" element={<Users />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="settings" element={<Settings />}>
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="account" element={<AccountSettings />} />
                  <Route path="privacy" element={<PrivacySettings />} />
                </Route>
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminHome />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="im/:chatId" element={<Chat />} />
              </Route>
              <Route path="/" element={<Welcome />} />
              <Route path="*" element={<Unknown />} />
            </Routes>
          </main>
          <footer className="footer">Footer</footer>
          {alert ? (
            <Snackbar
              open={isSnackbarOpen}
              autoHideDuration={50000}
              onClose={closeSnackbar}
              key={alert}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}>
              <Alert onClose={closeSnackbar} severity={alert.type} sx={{ width: '100%' }}>
                {alert.message}
              </Alert>
            </Snackbar>
          ) : null}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
