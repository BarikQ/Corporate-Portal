import React from 'react';
import { Routes, Route, useLocation, Link, Outlet } from 'react-router-dom';

import Navigation from 'components/Navigation/Navigation';

import './Settings.scss';

const settingsLinks = [
  {
    path: 'profile',
    title: 'Profile settings',
    nested: true,
  },
  {
    path: 'account',
    title: 'Account settings',
    nested: true,
  },
  {
    path: 'privacy',
    title: 'Privacy settings',
    nested: true,
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
