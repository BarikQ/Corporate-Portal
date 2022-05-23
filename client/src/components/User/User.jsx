import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { calculateAge } from 'utils';
import { UserTypes } from './../../constants/enum.ts';

import './User.scss';

User.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  date: PropTypes.string,
  user: PropTypes.object.isRequired,
  userType: PropTypes.any,
};

User.defaultProps = {
  className: '',
  prefix: '',
  children: null,
  date: null,
  href: '#',
  userType: null,
};

function User({
  className,
  prefix,
  user: {
    profileData: { profileImage, firstName, surname, city, birthDate },
    _id,
  },
  date,
  href,
  userType,
  children,
  ...props
}) {
  const switchUserType = () => {
    switch (userType) {
      case UserTypes.profilePage:
        return null;
      default:
        return (
          <div className={`user__info--bottom ${prefix ? `${prefix}-user__info--bottom` : ''}`}>
            <span className={`user__city ${prefix ? `${prefix}-user__city` : ''}`}>{city}</span>
            <span className={`user__birth-date ${prefix ? `${prefix}-user__birth-date` : ''}`}>
              {birthDate}, {calculateAge(birthDate, 'MM/DD/YYYY')} y.o.
            </span>
          </div>
        );
    }
  };

  return (
    <>
      <div className={`user ${className} ${prefix ? `${prefix}-user` : ''}`}>
        <Link to={`/${_id}`} className={`user__photo ${prefix ? `${prefix}-user__photo` : ''}`}>
          <img
            className={`user__image ${prefix ? prefix + '-user__image' : ''}`}
            src={profileImage}
          />
        </Link>

        <div className={`user__body ${prefix ? `${prefix}-user__body` : ''}`}>
          <div
            className={`user__info--top border--bottom--grey ${
              prefix ? `${prefix}-info--top` : ''
            }`}>
            <Link
              to={`/${_id}`}
              className={`user__name ${prefix ? `${prefix}-user__name` : ''} link--default`}>
              {firstName} {surname}
            </Link>
          </div>

          {switchUserType()}
        </div>
      </div>
    </>
  );
}

export default User;
