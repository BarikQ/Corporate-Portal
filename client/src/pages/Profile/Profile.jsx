import React from 'react';

import { Person, LabeledItem, Post } from 'components';

import './Profile.scss';

import baseProfileImage from 'assets/images/baseProfileImage.png';
import baseFriendImage from 'assets/images/baseFriendImage.png';
import { ReactComponent as AttachmentIcon } from 'assets/images/attachment.svg';

const user = {
  name: 'Yaraslau Barkouski',
  birthDate: '15.12.1999',
  sex: 'male',
  stack: ['React', 'JS', 'HTML', 'CSS', 'SCSS', 'NodeJS', 'Express'],
  image: baseProfileImage,
  status: "Just chillin'",
  city: 'Minsk',
};

const postsList = [
  {
    author: {
      name: 'Kek Yaroslavov',
      image: baseFriendImage,
    },
    text: 'Rofl post text',
    date: '01.01.2022',
    id: 1,
  },
  {
    author: {
      name: 'Kek Yaroslavov',
      image: baseFriendImage,
    },
    text: 'Rofl post image',
    attachments: {
      images: [baseFriendImage],
      videos: [],
    },
    date: '01.03.2022',
    id: 2,
  },
  {
    author: {
      name: 'Kek Yaroslavov',
      image: baseFriendImage,
    },
    text: 'Rofl post text',
    id: 3,
  },
  {
    author: {
      name: 'Kek Yaroslavov',
      image: baseFriendImage,
    },
    text: 'Rofl post text',
    date: '12.15.2021',
    id: 4,
  },
];

function Profile() {
  function handleInputChange(event) {
    console.log(event);
  }

  return (
    <div className="profile">
      <div className="profile__column profile__column--narrow">
        <div className="profile__photo page__block">
          <div className="profile__photo-wrapper">
            <img className="profile__photo-image" src={user.image} />
          </div>

          <div className="profile__actions">
            <button className="profile__actions-edit button--default">Edit</button>
          </div>
        </div>

        <div className="profile__friends page__block">
          <a href="/friends">Friends</a>
          <div className="profile__friends-list">
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
            <a className="profile__friends-item">
              <Person className="profile__friend" name="Alex Kirillov" image={baseFriendImage} />
            </a>
          </div>
        </div>
      </div>

      <div className="profile__column profile__column--wide">
        <div className="profile__info page__block">
          <div className="profile__info-up">
            <h1 className="profile__info-name">{user.name}</h1>
            <span className="profile__info-status">{user.status}</span>
          </div>
          <div className="profile__info-down info">
            <LabeledItem label="City" value={user.city} />
            <LabeledItem label="Birth Date" value={user.birthDate} />
            <LabeledItem label="Sex" value={user.sex} />
            <LabeledItem label="Stack" value={user.stack} />
          </div>
          {/* <div className="profile__stats"></div> */}
        </div>

        <div className="profile__posts posts">
          <div className="posts__header page__block">
            <div className="posts__editor editor">
              <form className="editor__form">
                <div
                  className="editor__text"
                  contentEditable
                  data-text="What's new?"
                  onInput={(event) => handleInputChange(event)}></div>

                <input
                  className="editor__attachment"
                  type="file"
                  id="editorAttachment"
                  onChange={(event) => handleInputChange(event)}
                />
                <label className="editor__attachment-label" htmlFor="editorAttachment">
                  <AttachmentIcon className="editor__icon" />
                </label>

                <button className="editor__form-button button--default">Publish</button>
              </form>
            </div>
          </div>

          <div className="posts__list">
            {postsList ? (
              postsList.map((post) => (
                <Post
                  author={post.author}
                  text={post.text}
                  comments={post.comments}
                  attachments={post.attachments}
                  date={post.date}
                  key={post.id}
                />
              ))
            ) : (
              <span>No posts here</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
