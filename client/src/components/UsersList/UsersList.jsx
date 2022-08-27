/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, Button } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { Form, Preloader } from 'components';

import styles from './UsersList.module.scss';

export default function UsersList({
  users,
  isLoading,
  formTemplate,
  DefaultActionComponent,
  SecondaryActionComponent,
  defaultActionParams,
  secondaryActionParams,
  className,
  listClassName,
  isTwoListed,
  includedUsers = [],
  onListUpdate,
  ...props
}) {
  const [{ searchQuery }, setFilters] = useReducer(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {}
  );
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    if (users) {
      let filtered = Object.entries(users);

      if (searchQuery) {
        filtered = filtered.filter(([key, { firstName, surname }]) =>
          `${firstName} ${surname}`.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      setFilteredUsers(
        filtered.reduce((current, [id, value]) => {
          return { ...current, [id]: value };
        }, {})
      );
    }
  }, [searchQuery]);

  const updateFilters = ({ searchQuery }) => {
    setFilters({ searchQuery });
  };

  const defaultHandler = (userId) => {
    onListUpdate(defaultActionParams, userId);
  };

  const secondaryHandler = (userId) => {
    onListUpdate(secondaryActionParams, userId);
  };

  return (
    <div className={`${styles.usersContainer} ${className}`}>
      <div>
        <Form
          className="searchbar__form"
          prefixClass="searchbar__form"
          onFormChange={updateFilters}
          formTemplate={formTemplate}
        />
      </div>
      <div className={listClassName}>
        {isLoading ? (
          <Preloader isLoading />
        ) : (
          <>
            {isTwoListed ? (
              <>
                <ul className={styles.users}>
                  {filteredUsers && Boolean(Object.keys(filteredUsers).length) ? (
                    <>
                      {includedUsers && (
                        <>
                          <div className={styles.blockHead}>
                            <span className={styles.blockName}>Choosen users</span>
                            {!isLoading && includedUsers && (
                              <span className={styles.blockedCounter}>
                                {Object.keys(includedUsers).length}
                              </span>
                            )}
                          </div>
                          <div className={styles.usersDivider} />
                        </>
                      )}
                      {includedUsers &&
                        Object.entries(filteredUsers).map(
                          ([key, { profileImage, firstName, surname }], index) =>
                            includedUsers.includes(key) ? (
                              <React.Fragment key={key}>
                                <li className={styles.user}>
                                  <Link className={styles.userInfo} to={`/${key}`}>
                                    <Avatar className={styles.userImage} src={profileImage} />
                                    <span className={styles.userName}>
                                      {firstName} {surname}
                                    </span>
                                  </Link>

                                  <SecondaryActionComponent onClick={() => secondaryHandler(key)} />
                                </li>
                                {index !== Object.keys(filteredUsers).length - 1 && (
                                  <div className={styles.usersDivider} />
                                )}
                              </React.Fragment>
                            ) : null
                        )}

                      <span className={styles.listHeader}>Choose users</span>

                      <div className={styles.usersDivider} />

                      {Object.entries(filteredUsers).map(
                        ([key, { profileImage, firstName, surname }], index) =>
                          !includedUsers.includes(key) ? (
                            <React.Fragment key={key}>
                              <li className={styles.user}>
                                <Link className={styles.userInfo} to={`/${key}`}>
                                  <Avatar className={styles.userImage} src={profileImage} />
                                  <span className={styles.userName}>
                                    {firstName} {surname}
                                  </span>
                                </Link>

                                {<DefaultActionComponent onClick={() => defaultHandler(key)} />}
                              </li>
                              {index !== Object.keys(filteredUsers).length - 1 && (
                                <div className={styles.usersDivider} />
                              )}
                            </React.Fragment>
                          ) : null
                      )}
                    </>
                  ) : (
                    <>
                      {users && Boolean(Object.keys(users).length) ? (
                        <span>
                          No users found for{' '}
                          <span className={styles.filter}>{searchQuery.value}</span>
                        </span>
                      ) : (
                        <span> No users in black list </span>
                      )}
                    </>
                  )}
                </ul>
              </>
            ) : (
              <ul className={styles.users}>
                {filteredUsers && Boolean(Object.keys(filteredUsers).length) ? (
                  <>
                    {Object.entries(filteredUsers).map(
                      ([key, { profileImage, firstName, surname }], index) => (
                        <React.Fragment key={key}>
                          <li className={styles.user}>
                            <Link className={styles.userInfo} to={`/${key}`}>
                              <Avatar className={styles.userImage} src={profileImage} />
                              <span className={styles.userName}>
                                {firstName} {surname}
                              </span>
                            </Link>

                            <DefaultActionComponent onClick={() => defaultHandler(key)} />
                          </li>
                          {index !== Object.keys(filteredUsers).length - 1 && (
                            <div className={styles.usersDivider} />
                          )}
                        </React.Fragment>
                      )
                    )}
                  </>
                ) : (
                  <>
                    {users && Boolean(Object.keys(users).length) ? (
                      <span>
                        No users found for{' '}
                        <span className={styles.filter}>{searchQuery.value}</span>
                      </span>
                    ) : (
                      <span> No users in black list </span>
                    )}
                  </>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
