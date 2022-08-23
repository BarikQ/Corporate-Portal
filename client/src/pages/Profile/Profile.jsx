import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { User, LabeledItem, Post, EditableForm, Preloader } from 'components';
import { getUserData, addUserFriend, deleteUserFriend, createUserPost } from 'api';
import { setAlert, removeAlert } from 'store/actions';
import { USER_TYPES } from 'constants';
import { calculateAge } from 'utils';
import { useToken } from 'hooks';

import './Profile.scss';

import { ReactComponent as AttachmentIcon } from 'assets/images/attachment.svg';

// const postsList2 = [
//   {
//     author: {
//       name: 'Kek Yaroslavov',
//       image: baseFriendImage,
//     },
//     text: 'Rofl post text',
//     date: '01.01.2022',
//     id: 1,
//   },
//   {
//     author: {
//       name: 'Kek Yaroslavov',
//       image: baseFriendImage,
//     },
//     text: 'Rofl post image',
//     attachments: {
//       images: [baseFriendImage],
//       videos: [],
//     },
//     date: '01.03.2022',
//     id: 2,
//   },
//   {
//     author: {
//       name: 'Kek Yaroslavov',
//       image: baseFriendImage,
//     },
//     text: 'Rofl post text',
//     id: 3,
//   },
//   {
//     author: {
//       name: 'Kek Yaroslavov',
//       image: baseFriendImage,
//     },
//     text: 'Rofl post text',
//     date: '12.15.2021',
//     id: 4,
//   },
// ];
const postsList = null;

function Profile() {
  const { profileId } = useParams();
  const { token } = useToken();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);
  // console.log(userData);
  const [friends, setFriends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [friendsRequest, setFriendsRequest] = useState(null);

  useEffect(() => {
    getProfileData(profileId);
  }, [profileId]);

  async function getProfileData(id) {
    try {
      const { profileData, friends, posts } = await getUserData(profileId);
      setUserData(profileData);
      setFriends(friends);
      console.log(posts);
      setPosts(posts);
      setIsLoading(false);
      console.log(
        Object.keys(posts).sort((keyA, keyB) => {
          console.log(
            new Date(posts[keyB].date),
            new Date(posts[keyA].date),
            new Date(posts[keyB].date) - new Date(posts[keyA].date)
          );
          return new Date(posts[keyB].date) - new Date(posts[keyA].date);
        })
      );
    } catch ({ response }) {
      setIsLoading(false);
      dispatch(
        setAlert({
          message: `${response.status}: ${response.data.message}`,
          type: 'error',
        })
      );
    }
  }

  async function handlePostSubmit(event, data) {
    event.preventDefault();
    console.log(data);
    try {
      const {
        data: { posts },
      } = await createUserPost(token, data);
      console.log(posts);
      setPosts();
    } catch (error) {
      console.error(error);
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
      setFriends([...friends, currentUser]);
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
      setFriends(friends.filter(({ _id }) => _id !== token));
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
      return (
        <>
          <Link
            to={`/im/${profileId}`}
            className="profile__actions-button profile__actions-button--message button--default">
            Send message
          </Link>
          {friends ? (
            friends.some(({ _id }) => {
              return _id === token;
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

  return userData ? (
    <div className="profile">
      <div className="profile__column profile__column--narrow">
        <div className="profile__photo page__block">
          <div className="profile__photo-wrapper border--bottom--grey">
            <img className="profile__photo-image" src={userData?.profileImage} />
          </div>

          <div className="profile__actions">{sortUserAvailableActions()}</div>
        </div>

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
                  <Link className="friends__item" key={friend._id} to={`/${friend._id}`}>
                    <User
                      prefix="friends"
                      user={friend}
                      key={friend._id}
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
      </div>

      <div className="profile__column profile__column--wide">
        <div className="profile__info page__block">
          <div className="profile__info-up border--bottom--grey">
            <h1 className="profile__info-name">{`${userData.firstName} ${userData.surname}`}</h1>
            <span className="profile__info-status">{userData.status}</span>
          </div>
          <div className="profile__info-down info border--bottom--grey">
            {userData.city ? <LabeledItem label="City" value={userData.city} /> : null}
            <LabeledItem
              label="Birth Date"
              value={`${userData.birthDate}, ${calculateAge(userData.birthDate)} y.o.`}
            />
            {userData.technologies.length ? (
              <LabeledItem label="Stack" value={userData.technologies.join(', ')} />
            ) : null}
          </div>
          {/* <div className="profile__stats"></div> */}
        </div>

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
              Object.keys(posts)
                .sort((keyA, keyB) => new Date(posts[keyB].date) - new Date(posts[keyA].date))
                .map((key) => <Post postData={posts[key]} key={key} />)
            ) : (
              <span>No posts here</span>
            )}
          </div>
        </div>
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
