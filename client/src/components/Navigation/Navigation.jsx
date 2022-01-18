import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Navigation.scss';

Navigation.propTypes = {
  className: PropTypes.string,
  routes: PropTypes.array.isRequired,
};

Navigation.defaultProps = {
  className: '',
};

export default function Navigation({ routes, className, ...props }) {
  return (
    <nav className={`navigation ${className}`}>
      <ul className="navigation__list">
        {routes.map((link) => (
          <li className="navigation__link" key={link.path}>
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
