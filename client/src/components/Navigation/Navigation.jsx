import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { SocketContext } from 'context/socket';

import './Navigation.scss';

Navigation.propTypes = {
  className: PropTypes.string,
  routes: PropTypes.array.isRequired,
};

Navigation.defaultProps = {
  className: '',
};

export default function Navigation({ routes, className, ...props }) {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState(0);
  const location = useLocation();
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    socket.on('private message', ({ message, from }) => {
      console.log(from, message);
    });
  }, []);

  const highlight = (link) => {
    if (link.root && pathname.includes(link.root)) {
      return `navigation__link--active`;
    }

    if (link.nested && pathname.includes(link.path)) {
      return `navigation__link--active`;
    }

    if (pathname === `/${link.path}` && !search) return `navigation__link--active`;
    return '';
  };

  return (
    <nav className={`navigation ${className}`}>
      <ul className="navigation__list">
        {routes.map((link) => {
          return (
            <li className="navigation__list-item" key={link.path}>
              <Link to={link.path} className={`navigation__link ${highlight(link)}`}>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
