/* eslint-disable react/prop-types */
import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Avatar, Button, Collapse, MenuItem, Select } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { Form, Preloader } from 'components';
import { getUserData, getUsers, updateUserData, updateUserPrivacy } from 'api';
import { setAlert, removeError } from 'store/actions';

import styles from './PrivacySettings.module.scss';
import { useToken } from 'hooks';
import UsersList from 'components/UsersList/UsersList';

const searchFormTemplate = {
  fields: [
    {
      placeholder: 'Search',
      name: 'searchQuery',
      id: 'searchQuery',
      type: 'text',
      value: '',
    },
  ],
};

const selectOptions = {
  every: {
    placeholder: 'Everybody',
    key: 'every',
  },
  everyExcept: {
    placeholder: 'Everybody except: ...',
    key: 'everyExcept',
  },
  friends: {
    placeholder: 'Friends',
    key: 'friends',
  },
  nobody: {
    placeholder: 'Nobody',
    key: 'nobody',
  },
  nobodyExcept: {
    placeholder: 'Nobody except: ...',
    key: 'nobodyExcept',
  },
};

const privacyInitialState = {
  blackList: [],
  messages: {
    allow: [],
    deny: [],
  },
  profile: {
    allow: [],
    deny: [],
  },
};

const RemoveUser = ({ onClick }) => (
  <button onClick={onClick} className={`${styles.userControl} ${styles.userControlRemove}`}>
    <CancelOutlinedIcon />
  </button>
);

const AddUser = ({ onClick }) => (
  <button onClick={onClick} className={`${styles.userControl} ${styles.userControlAdd}`}>
    <AddCircleOutlineIcon />
  </button>
);

export default function PrivacySettings() {
  const { token } = useToken();

  const [privacySettings, setPrivacySettings] = useReducer(
    (currentState, newState) => ({
      ...currentState,
      ...newState,
    }),
    privacyInitialState
  );
  const [selectsStates, setSelectsStates] = useReducer(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      messages: 'every',
      profile: 'every',
    }
  );
  const [showPrivacyUsersList, setShowPrivacyUsersList] = useReducer(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      messages: false,
      profile: false,
    }
  );
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [{ initialPrivacy, userFriends }, setUserData] = useReducer(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      initialPrivacy: privacyInitialState,
      userFriends: [],
    }
  );
  const [initialSelectStates, setInitialSelectStates] = useState({});
  const [select_1, setSelect_1] = useState(false);
  const [select_2, setSelect_2] = useState(false);
  const currentUserId = localStorage.getItem('x-token');
  const dispatch = useDispatch();

  const closeSelects = () => {
    setSelect_1(false);
    setSelect_2(false);
  };

  const defineSelectState = ({ allow, deny }, friends) => {
    if (allow.length > 0 && allow.length === friends.length) {
      let flag = true;
      friends.sort();
      allow.sort();

      for (let i = 0; i < friends; i++)
        if (friends[i] != allow[i]) {
          flag = false;
          break;
        }

      if (flag) return 'friends';
    }
    if (deny.length === 0) return 'every';
    if (allow.length === 0) return 'nobody';
    if (allow.length >= deny.length) return 'everyExcept';
    return 'nobodyExcept';
  };

  useEffect(async () => {
    try {
      let { privacy, friends } = await getUserData(token);
      const data = await getUsers();
      privacy = {
        ...privacyInitialState,
        ...privacy,
      };
      const initialSelects = {
        messages: defineSelectState(
          privacy.messages,
          friends.map((friend) => friend.id)
        ),
        profile: defineSelectState(
          privacy.profile,
          friends.map((friend) => friend.id)
        ),
      };

      setUserData({ initialPrivacy: privacy, userFriends: friends.map((friend) => friend.id) });

      const refactoredUsers = (users) =>
        users.reduce(
          (current, user) =>
            user.id === token ? current : { ...current, [user.id]: user.profileData },
          {}
        );

      window.addEventListener('scroll', closeSelects);

      setUsers(refactoredUsers(data));
      setPrivacySettings(privacy);
      setInitialSelectStates(initialSelects);
      setSelectsStates(initialSelects);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    return () => window.removeEventListener('scroll', closeSelects);
  }, []);

  async function handlePrivacySubmit(event) {
    event.preventDefault();

    try {
      const newPrivacySettings = {
        messages: privacySettings.messages,
        profile: privacySettings.profile,
      };
      const response = await updateUserData(
        {
          privacy: { ...newPrivacySettings },
        },
        token
      );

      const initialSelects = {
        messages: defineSelectState(
          newPrivacySettings.messages,
          userFriends.map((friend) => friend.id)
        ),
        profile: defineSelectState(
          newPrivacySettings.profile,
          userFriends.map((friend) => friend.id)
        ),
      };

      setUserData({
        initialPrivacy: {
          ...privacySettings,
          ...newPrivacySettings,
        },
      });
      setPrivacySettings({
        ...privacySettings,
        ...newPrivacySettings,
      });
      setInitialSelectStates(initialSelects);
      setSelectsStates(initialSelects);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleBlackListSubmit(event) {
    event.preventDefault();

    try {
      const newPrivacySettings = {
        blackList: privacySettings.blackList,
      };

      const response = await updateUserData(
        {
          privacy: { ...newPrivacySettings },
        },
        token
      );

      setUserData({
        initialPrivacy: {
          ...privacySettings,
          ...newPrivacySettings,
        },
      });
      setPrivacySettings({
        ...privacySettings,
        ...newPrivacySettings,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const selectUpdate = ({ target: { name, value } }) => {
    const newSelectsState = { [name]: value.key };

    switch (value.key) {
      case 'every':
        setPrivacySettings({
          [name]: { deny: [], allow: Object.entries(users).map(([key, value]) => key) },
        });
        break;
      case 'nobody':
        setPrivacySettings({
          [name]: { allow: [], deny: Object.entries(users).map(([key, value]) => key) },
        });
        break;
      case 'friends':
        setPrivacySettings({
          [name]: {
            deny: Object.entries(users)
              .map(([key, value]) => key)
              .filter((id) => !userFriends.includes(id)),
            allow: userFriends,
          },
        });
        break;
      case 'nobodyExcept': {
        if (initialSelectStates[name] === 'nobodyExcept')
          setPrivacySettings({
            [name]: {
              deny: Object.entries(users)
                .map(([key, value]) => key)
                .filter((key) => !initialPrivacy[name].allow.includes(key)),
              allow: initialPrivacy[name].allow,
            },
          });
        else
          setPrivacySettings({
            [name]: {
              deny: Object.entries(users).map(([key, value]) => key),
              allow: [],
            },
          });

        break;
      }
      case 'everyExcept': {
        if (initialSelectStates[name] === 'everyExcept')
          setPrivacySettings({
            [name]: {
              deny: initialPrivacy[name].deny,
              allow: Object.entries(users)
                .map(([key, value]) => key)
                .filter((key) => !initialPrivacy[name].deny.includes(key)),
            },
          });
        else
          setPrivacySettings({
            [name]: {
              deny: [],
              allow: Object.entries(users).map(([key, value]) => key),
            },
          });

        break;
      }
    }

    setSelectsStates(newSelectsState);
  };

  const switchPrivacyUsersDisplay = ({ currentTarget: { name } }) => {
    setShowPrivacyUsersList({ [name]: !showPrivacyUsersList[name] });
  };

  const handeListUpdate = ({ actionType, listName }, userId) => {
    const listState = privacySettings[listName];

    if (Array.isArray(listState)) {
      if (actionType === 'add') return setPrivacySettings({ [listName]: [...listState, userId] });

      return setPrivacySettings({ [listName]: listState.filter((item) => item !== userId) });
    }

    if (actionType === 'add') {
      switch (selectsStates[listName]) {
        case 'nobodyExcept':
          setPrivacySettings({
            [listName]: {
              deny: privacySettings[listName].deny.filter((key) => key !== userId),
              allow: [...privacySettings[listName].allow, userId],
            },
          });
          break;
        case 'everyExcept':
          setPrivacySettings({
            [listName]: {
              deny: [...privacySettings[listName].deny, userId],
              allow: privacySettings[listName].allow.filter((key) => key !== userId),
            },
          });
          break;
      }
    } else {
      switch (selectsStates[listName]) {
        case 'nobodyExcept':
          setPrivacySettings({
            [listName]: {
              deny: [...privacySettings[listName].deny, userId],
              allow: privacySettings[listName].allow.filter((key) => key !== userId),
            },
          });
          break;
        case 'everyExcept':
          setPrivacySettings({
            [listName]: {
              deny: privacySettings[listName].deny.filter((key) => key !== userId),
              allow: [...privacySettings[listName].allow, userId],
            },
          });
          break;
      }
    }
  };

  return (
    <div className={`settings__block ${styles.privacy}`}>
      <div className={styles.block}>
        <h3 className={styles.pageTitle}>Privacy Settings</h3>
      </div>
      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockName}>Privacy</span>
        </div>
        <div className={styles.privacyContainer}>
          <div className={styles.usersDivider} />
          <div className={styles.privacySetting}>
            <span>Who can see my profile?</span>
            <Select
              MenuProps={{
                disableScrollLock: true,
                PaperProps: {
                  onScroll: () => {
                    setSelect_1(!select_1);
                  },
                },
              }}
              open={select_1}
              onClose={() => setSelect_1(!select_1)}
              onOpen={() => setSelect_1(!select_1)}
              value={selectOptions[selectsStates.profile]}
              options={Object.entries(selectOptions)}
              placeholder={'Select'}
              onChange={selectUpdate}
              className={styles.select}
              id="profile"
              name="profile">
              {Object.entries(selectOptions).map(([key, value]) => (
                <MenuItem value={value} key={key}>
                  {value.placeholder}
                </MenuItem>
              ))}
            </Select>

            {(selectsStates.profile === 'everyExcept' ||
              selectsStates.profile === 'nobodyExcept') && (
              <>
                <button
                  onClick={switchPrivacyUsersDisplay}
                  name="profile"
                  className={styles.addPerson}>
                  <PersonAddIcon />
                </button>
                <Collapse in={showPrivacyUsersList.profile} className={styles.collapse}>
                  <UsersList
                    users={users}
                    className={styles.privacyUsers}
                    listClassName={styles.privacyList}
                    formTemplate={searchFormTemplate}
                    isLoading={isLoading}
                    isTwoListed
                    includedUsers={
                      selectsStates.profile === 'nobodyExcept'
                        ? privacySettings.profile.allow
                        : privacySettings.profile.deny
                    }
                    onListUpdate={handeListUpdate}
                    DefaultActionComponent={AddUser}
                    SecondaryActionComponent={RemoveUser}
                    defaultActionParams={{ actionType: 'add', listName: 'profile' }}
                    secondaryActionParams={{ actionType: 'remove', listName: 'profile' }}
                  />
                </Collapse>
              </>
            )}
          </div>
          <div className={styles.usersDivider} />
          <div className={styles.privacySetting}>
            <span>Who can send me messages?</span>
            <Select
              MenuProps={{
                disableScrollLock: true,
                PaperProps: {
                  onScroll: () => {
                    setSelect_2(!select_2);
                  },
                },
              }}
              open={select_2}
              onClose={() => setSelect_2(!select_2)}
              onOpen={() => setSelect_2(!select_2)}
              value={selectOptions[selectsStates.messages]}
              options={Object.entries(selectOptions)}
              placeholder={'Select'}
              onChange={selectUpdate}
              className={styles.select}
              id="messages"
              name="messages">
              {Object.entries(selectOptions).map(([key, value]) => (
                <MenuItem value={value} key={key}>
                  {value.placeholder}
                </MenuItem>
              ))}
            </Select>
            {(selectsStates.messages === 'everyExcept' ||
              selectsStates.messages === 'nobodyExcept') && (
              <>
                <button
                  onClick={switchPrivacyUsersDisplay}
                  name="messages"
                  className={styles.addPerson}>
                  <PersonAddIcon />
                </button>
                <Collapse in={showPrivacyUsersList.messages} className={styles.collapse}>
                  <UsersList
                    users={users}
                    className={styles.privacyUsers}
                    listClassName={styles.privacyList}
                    formTemplate={searchFormTemplate}
                    isLoading={isLoading}
                    isTwoListed
                    includedUsers={
                      selectsStates.messages === 'nobodyExcept'
                        ? privacySettings.messages.allow
                        : privacySettings.messages.deny
                    }
                    onListUpdate={handeListUpdate}
                    DefaultActionComponent={AddUser}
                    SecondaryActionComponent={RemoveUser}
                    defaultActionParams={{ actionType: 'add', listName: 'messages' }}
                    secondaryActionParams={{ actionType: 'remove', listName: 'messages' }}
                  />
                </Collapse>
              </>
            )}
          </div>
          <div className={styles.usersDivider} />
        </div>
        <div className={styles.controls}>
          <Button
            onClick={handlePrivacySubmit}
            variant="contained"
            color="primary"
            className={styles.saveButton}
            type="submit">
            Update Privacy Settings
          </Button>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockName}>Black list</span>
          {!isLoading && privacySettings.blackList && (
            <span className={styles.blockedCounter}>{privacySettings.blackList.length}</span>
          )}
        </div>
        <UsersList
          users={users}
          formTemplate={searchFormTemplate}
          listClassName={styles.blackList}
          isLoading={isLoading}
          isTwoListed
          includedUsers={privacySettings.blackList}
          onListUpdate={handeListUpdate}
          DefaultActionComponent={AddUser}
          SecondaryActionComponent={RemoveUser}
          defaultActionParams={{ actionType: 'add', listName: 'blackList' }}
          secondaryActionParams={{ actionType: 'remove', listName: 'blackList' }}
        />
        <div className={styles.controls}>
          <Button
            onClick={handleBlackListSubmit}
            variant="contained"
            color="primary"
            className={styles.saveButton}
            type="submit">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
