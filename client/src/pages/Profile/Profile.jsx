/* eslint-disable no-debugger */
import React, { useEffect, useState, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { User, LabeledItem, Post, EditableForm, Preloader } from 'components';
import { getUserData, addUserFriend, deleteUserFriend, createUserPost } from 'api';
import { setAlert, removeAlert } from 'store/actions';
import { USER_TYPES } from 'constants';
import { calculateAge } from 'utils';
import { useToken } from 'hooks';

import './Profile.scss';

const initialState = {
  profileData: null,
  posts: null,
  friends: null,
};

function Profile() {
  const { profileId } = useParams();
  const { token } = useToken();
  const [{ profileData, posts, friends, access }, setUserData] = useReducer(
    (currentValues, newValues) => ({ ...currentValues, ...newValues }),
    initialState
  );
  const [friendsRequest, setFriendsRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { profileData, friends, posts, access } = await getUserData(profileId);
        console.log(access);
        setUserData({ profileData, friends, posts, access });
        setIsLoading(false);
      } catch (error) {
        const { response } = error;
        setIsLoading(false);
        dispatch(
          setAlert({
            message: response ? `${response.status}: ${response.data.message}` : error.message,
            type: 'error',
          })
        );
      }
    };

    fetchData();

    return () => {
      setIsLoading(true);
      setUserData(initialState);
    };
  }, [profileId]);

  async function handlePostSubmit(event, data) {
    event.preventDefault();

    try {
      const {
        data: { post },
      } = await createUserPost(token, profileId, data);
      setUserData({ posts: { ...posts, [post.id]: { ...post } } });
    } catch (error) {
      const { response } = error;
      console.error(error);
      dispatch(
        setAlert({
          message: response ? `${response.status}: ${response.data.message}` : error.message,
          type: 'error',
        })
      );
    }
  }

  function isCurrentUserPage() {
    return token === profileId;
  }

  async function addToFriendsHandler(event) {
    try {
      const { currentUser, friend } = await addUserFriend(token, profileId);
      dispatch(
        setAlert({
          message: 'Friend request sended',
          type: 'success',
        })
      );
      setFriendsRequest('Friend request sended');
      setUserData({ friends: [...friends, currentUser] });
    } catch ({ response }) {
      dispatch(
        setAlert({
          message: `${response.status}: ${response.data.message}`,
          type: 'error',
        })
      );
    }
  }

  async function removeFromFriendsHandler(event) {
    try {
      const response = await deleteUserFriend(token, profileId);
      dispatch(
        setAlert({
          message: 'User removed from friends list',
          type: 'success',
        })
      );
      setFriendsRequest('User removed from friends list');
      setUserData({ friends: friends.filter(({ id }) => id !== token) });
    } catch ({ response }) {
      dispatch(
        setAlert({
          message: `${response.status}: ${response.data.message}`,
          type: 'error',
        })
      );
    }
  }

  function sortUserAvailableActions() {
    if (isCurrentUserPage()) {
      return (
        <Link
          to="/settings/profile"
          className="profile__actions-button profile__actions-button--edit button--default">
          Edit
        </Link>
      );
    } else {
      console.log(friends);
      return (
        <>
          <Link
            to={`/im/${profileId}`}
            className="profile__actions-button profile__actions-button--message button--default">
            Send message
          </Link>
          {friends ? (
            friends.some(({ id }) => {
              return id === token;
            }) ? (
              <button
                className="profile__actions-button profile__actions-button--friends button--default"
                onClick={removeFromFriendsHandler}>
                Remove from friends
              </button>
            ) : (
              <button
                className="profile__actions-button profile__actions-button--friends button--default"
                onClick={addToFriendsHandler}>
                Add to friends
              </button>
            )
          ) : null}
        </>
      );
    }
  }

  function handlePostUpdate(data, id) {
    console.log('UPDAGE', { ...posts, ...{ [id]: { ...posts[id], ...data } } });
    if (data)
      return setUserData({
        posts: { ...posts, ...{ [id]: { ...posts[id], ...data } } },
      });

    setUserData({
      posts: Object.keys(posts).reduce((current, key) => {
        return key !== id ? { ...current, [key]: posts[key] } : current;
      }, {}),
    });
  }

  return profileData ? (
    <div className="profile">
      <div className="profile__column profile__column--narrow">
        <div className="profile__photo page__block">
          <div className="profile__photo-wrapper">
            <img className="profile__photo-image" src={profileData?.profileImage} />
          </div>

          {!access.messages && !access.profile ? null : (
            <>{access.messages && <div className="line-divider" />}</>
          )}

          {!access.messages && !access.profile ? null : (
            <>
              {access.messages && (
                <div className="profile__actions">{sortUserAvailableActions()}</div>
              )}
            </>
          )}
        </div>

        {access.profile && (
          <div className="profile__friends friends page__block">
            {friends && friends.length ? (
              <>
                <Link
                  className="friends__title link--default"
                  to={isCurrentUserPage() ? '/friends' : `/friends?id=${profileId}`}>
                  Friends
                </Link>
                <div className="friends__list">
                  {friends.map((friend) => (
                    <Link className="friends__item" key={friend.id} to={`/${friend.id}`}>
                      <User
                        prefix="friends"
                        user={friend}
                        key={friend.id}
                        userType={USER_TYPES.profilePage}
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <span className="profile__friends-title">This user has no friends (KEKW)</span>
            )}
          </div>
        )}
      </div>

      <div className="profile__column profile__column--wide">
        <div
          className={`profile__info page__block ${access.profile ? '' : 'profile__info--denied'}`}>
          <div className="profile__info-up border--bottom--grey">
            <h1 className="profile__info-name">{`${profileData.firstName} ${profileData.surname}`}</h1>
            <span className="profile__info-status">{profileData.status}</span>
          </div>

          <div className="profile__info-down info border--bottom--grey">
            {profileData.city ? <LabeledItem label="City" value={profileData.city} /> : null}
            {profileData.birthDate && (
              <LabeledItem
                label="Birth Date"
                value={`${profileData.birthDate}, ${calculateAge(profileData.birthDate)} y.o.`}
              />
            )}
            {profileData.technologies && profileData.technologies.length ? (
              <LabeledItem label="Stack" value={profileData.technologies.join(', ')} />
            ) : null}
          </div>
          {!access.profile && (
            <div className="profile__access">
              <span className="profile__access-message">
                {profileData.firstName} {profileData.surname} restricted access to his page
              </span>
            </div>
          )}
        </div>

        {access.profile && (
          <div className="profile__posts posts">
            <div className="posts__header page__block">
              <div className="posts__editor editor">
                <EditableForm
                  type="post"
                  classPrefix="editor"
                  submitHandler={handlePostSubmit}
                  withAttachment
                  id={profileId}
                />
              </div>
            </div>

            <div className="posts__list">
              {posts ? (
                Object.entries(posts)
                  .sort(
                    ([keyA, valueA], [keyB, valueB]) =>
                      new Date(valueB.date) - new Date(valueA.date)
                  )
                  .map(([key, value]) => (
                    <Post postData={value} key={key} onPostUpdade={handlePostUpdate} />
                  ))
              ) : (
                <span>No posts here</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : isLoading ? (
    <Preloader isLoading />
  ) : (
    <div className="profile__not-found">
      404 <br /> User not found
    </div>
  );
}

export default Profile;
