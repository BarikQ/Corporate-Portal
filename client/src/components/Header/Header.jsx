import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logoutRequest } from 'api';

import './Header.scss';

export default function Header() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await logoutRequest();
      localStorage.clear('x-token');
      navigate('/');
    } catch (error) {
      localStorage.clear('x-token');
      navigate('/');
    }
  }

  return (
    <header className="header">
      <h1 className="header__head">iTechArt Corporate Portal</h1>

      <Link className="header__link" to="/" onClick={handleLogout}>
        <span className="header__logout">Log out</span>
      </Link>
    </header>
  );
}
