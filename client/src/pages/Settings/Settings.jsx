import React from 'react';
import { Routes, Route, useLocation, Link, Outlet } from 'react-router-dom';

import Navigation from 'components/Navigation/Navigation';

import './Settings.scss';

const settingsLinks = [
  {
    path: 'profile',
    title: 'Profile settings',
  },
];

export default function Settings() {
  return (
    <div className="settings">
      <Outlet className="page__block" />
      <Navigation className="settings__nav page__block" routes={settingsLinks} />
    </div>
  );
}
