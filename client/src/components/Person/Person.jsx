import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import './Person.scss';

Person.propTypes = {
  className: PropTypes.string,
  image: PropTypes.node,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  date: PropTypes.string,
};

Person.defaultProps = {
  className: '',
  image: null,
  children: null,
  date: null,
};

function Person({ image, name, className, date, children, ...props }) {
  return (
    <div className={`person ${className}`} {...props}>
      <img className={`person__photo ${className ? className + '__photo' : ''}`} src={image} />
      <div className={`person__text ${className ? className + '__text' : ''}`}>
        <a className={`person__link ${className ? className + '__link' : ''}`}>{name}</a>
        {date && (
          <span className={`person__date ${className ? className + '__date' : ''}`}>
            <Moment format="DD/MM/YYYY">{date}</Moment>
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default Person;
