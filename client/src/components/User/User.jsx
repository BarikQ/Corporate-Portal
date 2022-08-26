import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { calculateAge } from 'utils';
import { USER_TYPES } from 'constants';

import './User.scss';
import moment from 'moment';

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
    id,
  },
  date,
  href,
  userType,
  children,
  ...props
}) {
  const switchUserType = () => {
    switch (userType) {
      case USER_TYPES.profilePage:
        return (
          <div className={`user ${className} ${prefix ? `${prefix}-user` : ''}`}>
            <Link to={`/${id}`} className={`user__photo ${prefix ? `${prefix}-user__photo` : ''}`}>
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
                  to={`/${id}`}
                  className={`user__name ${prefix ? `${prefix}-user__name` : ''} link--default`}>
                  {firstName} {surname}
                </Link>
              </div>
            </div>
          </div>
        );
      case USER_TYPES.commentAuthor:
        return (
          <div className={`user user--comment ${className} ${prefix ? `${prefix}-user` : ''}`}>
            <Link to={`/${id}`} className={`user__photo ${prefix ? `${prefix}-user__photo` : ''}`}>
              <img
                className={`user__image ${prefix ? prefix + '-user__image' : ''}`}
                src={profileImage}
              />
            </Link>

            <div
              className={`user__body border--bottom--grey ${prefix ? `${prefix}-user__body` : ''}`}>
              <div className={`user__info--top ${prefix ? `${prefix}-info--top` : ''}`}>
                <Link
                  to={`/${id}`}
                  className={`user__name ${prefix ? `${prefix}-user__name` : ''} link--default`}>
                  {firstName} {surname}
                </Link>
              </div>
            </div>
          </div>
        );
      case USER_TYPES.postAuthor:
        return (
          <div className={`user ${className} ${prefix ? `${prefix}-user` : ''}`}>
            <Link to={`/${id}`} className={`user__photo ${prefix ? `${prefix}-user__photo` : ''}`}>
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
                  to={`/${id}`}
                  className={`user__name ${prefix ? `${prefix}-user__name` : ''} link--default`}>
                  {firstName} {surname}
                </Link>
              </div>

              <div className={`user__info--bottom ${prefix ? `${prefix}-user__info--bottom` : ''}`}>
                <span className={`user__birth-date ${prefix ? `${prefix}-user__birth-date` : ''}`}>
                  {moment(date, 'LLLL').format('LLLL')}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={`user ${className} ${prefix ? `${prefix}-user` : ''}`}>
            <Link to={`/${id}`} className={`user__photo ${prefix ? `${prefix}-user__photo` : ''}`}>
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
                  to={`/${id}`}
                  className={`user__name ${prefix ? `${prefix}-user__name` : ''} link--default`}>
                  {firstName} {surname}
                </Link>
              </div>

              <div className={`user__info--bottom ${prefix ? `${prefix}-user__info--bottom` : ''}`}>
                <span className={`user__city ${prefix ? `${prefix}-user__city` : ''}`}>{city}</span>
                <span className={`user__birth-date ${prefix ? `${prefix}-user__birth-date` : ''}`}>
                  {birthDate}, {calculateAge(birthDate, 'MM/DD/YYYY')} y.o.
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  return <>{switchUserType()}</>;
}

export default User;
