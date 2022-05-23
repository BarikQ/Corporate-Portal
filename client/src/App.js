/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, withRouter, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Welcome, Profile, Settings, ProfileSettings } from './pages';
import { Header, Navigation, ProtectedRoute } from './components';
import { setAccess, getAccess } from 'store/access/accessSlice';

import { authRequest } from 'api';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.scss';

import { buttonBackgroundLightGray } from 'constants/colors';

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

function Home() {
  return <div>Home</div>;
}

function Messages() {
  return <div>Messages</div>;
}

function Friends() {
  return <div>Friends</div>;
}

function People() {
  return <div>People</div>;
}

function UnknownPage() {
  return <h2>Page not found </h2>;
}

function App() {
  const [access, setAccess] = useState(false);
  const mainLinks = [
    {
      path: `/${localStorage.getItem('x-token') || undefined}`,
      title: 'Profile',
    },
    {
      path: '/home',
      title: 'Home',
    },
    {
      path: '/messages',
      title: 'Messages',
    },
    {
      path: '/friends',
      title: 'Friends',
    },
    {
      path: '/people',
      title: 'People',
    },
    {
      path: '/settings',
      title: 'Settings',
    },
  ];
  const accessValue = useSelector((state) => state.access.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await authRequest();
        setAccess(true);
      } catch (error) {
        setAccess(false);
        localStorage.clear('x-token');
        currentPath === '/' ? null : navigate('/');
      }
    };

    getData();
  }, [useLocation().pathname]);

  return (
    <ThemeProvider theme={theme}>
      <div className={`app ${useLocation().pathname === '/' ? 'app--welcome' : ''}`}>
        <Header />
        <main className="main">
          {useLocation().pathname === '/' ? null : (
            <div className="main__nav sidebar">
              <Navigation routes={mainLinks} />
            </div>
          )}
          <div className="main__body" key={'gdfg'}>
            <Routes key={'routes'}>
              <Route exact path="messages" element={<Messages />} />
              <Route exact path="/" element={<Welcome />} />
              <Route exact path="/:profileId" element={<Profile />} />
              <Route exact path="home" element={<Home />} />
              <Route exact path="friends" element={<Friends />} />
              <Route exact path="people" element={<People />} />
              <Route exact path="settings" element={<Settings />}>
                <Route exact path="profile" element={<ProfileSettings />} />
              </Route>
              <Route path="*" element={<UnknownPage />} />
            </Routes>
          </div>
        </main>
        <footer className="footer">Footer</footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
