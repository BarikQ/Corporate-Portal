/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';

import { Welcome, Profile, Settings } from './pages';
import { Header, Navigation } from './components';
import './App.scss';

const mainLinks = [
  {
    path: '/myPage',
    title: 'My page',
  },
  {
    path: '/randProfileId',
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

const settingsLinks = [
  {
    path: '/settings',
    title: 'Main settings',
  },
  {
    path: 'setting/profile',
    title: 'Profile settings',
  },
];

function Home() {
  return <div>Home</div>;
}

function MyPage() {
  return <div>My page</div>;
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

function ProfileSettings() {
  return <div>Profile Settings</div>;
}

function UnknownPage() {
  return <h2>Page not found </h2>;
}

function App() {
  console.log(useLocation());
  return (
    <div className={`app ${useLocation().pathname === '/' ? 'app--welcome' : ''}`}>
      <Header />
      <main className="main">
        {useLocation().pathname === '/' ? null : (
          <div className="main__nav sidebar">
            <Navigation routes={mainLinks} />
          </div>
        )}
        <div className="main__body">
          <Routes>
            hdfslghjsld;kjgs;
            <Route exact path="/" element={<Welcome />} />
            <Route exact path="/myPage" element={<MyPage />} />
            <Route exact path="/:profileId" element={<Profile />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/messages" element={<Messages />} />
            <Route exact path="/friends" element={<Friends />} />
            <Route exact path="/people" element={<People />} />
            <Route exact path="/settings">
              <Route
                index={true}
                element={
                  <>
                    <Settings />
                    <Navigation routes={settingsLinks} />
                  </>
                }
              />
              <Route
                index={false}
                exact
                path="profile"
                element={
                  <>
                    <ProfileSettings />
                    <Navigation routes={settingsLinks} />
                  </>
                }
              />
            </Route>
            <Route exact path="*" element={<UnknownPage />} />
          </Routes>
        </div>
      </main>
      <footer className="footer">Footer</footer>
    </div>
  );
}

export default App;
