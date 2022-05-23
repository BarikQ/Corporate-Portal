import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { User, Preloader, Form } from 'components';
import { getUserData, getUsers } from 'api';
import { setAlert } from 'store/actions';
import { calculateAge } from 'utils';
import { useToken } from 'hooks';

import './Users.scss';

Users.propTypes = {
  className: PropTypes.string,
  isFriendsList: PropTypes.bool,
  targetUserId: PropTypes.string,
};

Users.defaultProps = {
  className: '',
  isFriendsList: false,
  targetUserId: null,
};

function Users({ isFriendsList, className, targetUserId }) {
  const { token } = useToken();
  const dispatch = useDispatch();
  const { profileId } = useParams();
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(null);
  const [searchForm, setSearchForm] = useState({
    fields: [
      {
        placeholder: 'Search',
        name: 'searchQuery',
        id: 'searchQuery',
        type: 'text',
        value: '',
      },
      {
        placeholder: 'City',
        name: 'searchCity',
        id: 'searchCity',
        type: 'multi',
        value: [],
        options: ['Minsk'],
      },
      {
        placeholder: 'Age',
        name: 'ageRange',
        id: 'ageRange',
        type: 'range',
        value: [16, 70],
        min: 16,
        max: 70,
      },
    ],
  });

  useEffect(async () => {
    try {
      let data = null;

      if (isFriendsList) {
        const { friends } = await getUserData(targetUserId || token);
        data = friends;
      } else {
        data = await getUsers();
      }

      setUsers(data);

      const updatedForm = JSON.parse(JSON.stringify(searchForm));

      updatedForm.fields[updatedForm.fields.length - 1].max = Math.max.apply(
        Math,
        data.map((user) => calculateAge(user.profileData.birthDate, 'MM/DD/YYYY'))
      );
      updatedForm.fields[updatedForm.fields.length - 1].min = Math.min.apply(
        Math,
        data.map((user) => calculateAge(user.profileData.birthDate, 'MM/DD/YYYY'))
      );
      updatedForm.fields[updatedForm.fields.length - 1].value = [
        updatedForm.fields[updatedForm.fields.length - 1].min,
        updatedForm.fields[updatedForm.fields.length - 1].max,
      ];
      updatedForm.fields[1].options = Array.from(
        new Set(
          data
            .filter((user) => user.profileData.city.length > 0)
            .map((user) => user.profileData.city)
        )
      );

      setSearchForm(updatedForm);
      setIsLoading(false);
    } catch (error) {
      dispatch(
        setAlert({
          message: `Error: ${error.message}`,
          type: 'error',
        })
      );
      console.log(error);
      setIsLoading(false);
    }
  }, []);

  const updateFilters = (formData) => {
    if (users) {
      let { ageRange, searchCity, searchQuery } = formData;
      ageRange = ageRange.value;
      searchCity = searchCity.value;
      searchQuery = searchQuery.value;
      setSearchFilters({ ageRange, searchCity, searchQuery });
    }
  };

  const filterUsers = ({ profileData: { firstName, surname, city, birthDate } }) => {
    if (!searchFilters) return true;

    const age = calculateAge(birthDate);
    const userName = `${firstName} ${surname}`;

    if (!(searchFilters.ageRange[0] <= age && age <= searchFilters.ageRange[1])) {
      return false;
    }

    if (
      searchFilters.searchQuery.length &&
      !userName.toLowerCase().includes(searchFilters.searchQuery.toLowerCase()) &&
      !city.toLowerCase().includes(searchFilters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (searchFilters.searchCity.length && !searchFilters.searchCity.includes(city)) {
      return false;
    }

    return true;
  };

  return (
    <div
      className={`users page__block ${users ? '' : 'users--empty'} ${
        isFriendsList ? `friends` : ''
      } ${className}`}>
      <div className="users__searchbar searchbar">
        <Form
          className="searchbar__form"
          prefixClass="searchbar__form"
          onFormChange={updateFilters}
          formTemplate={searchForm}
        />
      </div>
      {users ? (
        <div className="users__list">
          {users
            .filter((user) => filterUsers(user))
            .map((user) => (
              <User prefix="users" user={user} key={user._id} />
            ))}
        </div>
      ) : isLoading ? (
        <Preloader prefix="users" isLoading text={null} />
      ) : (
        <div className="users__not-found">
          404 <br /> Users not found
        </div>
      )}
    </div>
  );
}

export default Users;
