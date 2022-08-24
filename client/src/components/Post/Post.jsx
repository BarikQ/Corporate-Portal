/* eslint-disable react/prop-types */
import React, { useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';

import { useToken } from 'hooks';
import { deleteUserPost, updateUserPost } from 'api';
import { EditableForm, Prompt, User } from 'components';
import { USER_TYPES } from 'constants';
import { setAlert } from 'store/actions';

import { ReactComponent as CommentIcon } from 'assets/images/commentIcon.svg';

import './Post.scss';

Post.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  attachments: PropTypes.array,
  comments: PropTypes.array,
  date: PropTypes.any,
  postData: PropTypes.object,
};

Post.defaultProps = {
  className: '',
  text: null,
  attachments: null,
  comments: null,
};

function EditHandler({ onClick }) {
  return (
    <button onClick={onClick} className="post__edit">
      <EditIcon />
    </button>
  );
}

function DeleteHandler({ onClick }) {
  return (
    <button onClick={onClick} className="post__delete">
      <DeleteIcon />
    </button>
  );
}

function DeletePromptContent() {
  return (
    <span className="post__delete-prompt">
      Are you sure you want to delete this post?
      <br /> <span className="post__delete-text">This action is irreversible.</span>
    </span>
  );
}

export default function Post({ postData, onPostUpdade, className, ...props }) {
  const { profileId } = useParams();
  const { token } = useToken();

  const [
    {
      author,
      content: { text, attachments },
      likes,
      comments,
      date,
      id,
    },
    setPostData,
  ] = useReducer((currentValues, newValues) => ({ ...currentValues, ...newValues }), postData);

  const [isLiked, setIsLiked] = useState(() => likes.includes(token));
  const dispatch = useDispatch();
  const { profileData } = author;

  const handleAttachmentType = ({ name, type, url }) => {
    switch (type) {
      case 'image':
        return <img className="post__attachments-image" src={url} key={name} />;
      case 'video':
        return <video className="post__attachments-video" src={url} key={name} controls />;
    }
  };

  const likePost = async (event) => {
    event.preventDefault();
    const state = {
      likes,
      isLiked,
    };

    try {
      const newLikes = isLiked
        ? likes.filter((like) => like !== token)
        : likes.includes(token)
        ? likes
        : [...likes, token];

      setIsLiked(() => !isLiked);
      setPostData({ likes: newLikes });

      const {
        data: { post },
      } = await updateUserPost(profileId, token, id, { likes: newLikes });

      setIsLiked(() => post.likes.includes(token));
      setPostData({ likes: post.likes });
      onPostUpdade();
    } catch (error) {
      setIsLiked(state.isLiked);
      setPostData({ likes: state.likes });
      console.error(error);
    }
  };

  const handlePostUpdateSubmit = async (event, data) => {
    event.preventDefault();

    try {
      return await updateUserPost(profileId, token, id, { content: data });
    } catch (error) {
      console.error(error);
      dispatch(
        setAlert({
          message: error.message,
          type: 'error',
        })
      );
    }
  };

  const handlePostUpdate = async ({
    data: {
      post: { comments, content, likes, _id },
    },
  }) => {
    dispatch(
      setAlert({
        message: 'Post was updated successfully',
        type: 'success',
      })
    );
    setPostData({ comments, content, likes });
    onPostUpdade({ comments, content, likes, id: _id });
  };

  const handlePostDelete = async ({ id }, closeModal) => {
    try {
      console.log(postData);
      await deleteUserPost(profileId, token, id);
      closeModal();
      console.log('delete');
      onPostUpdade({ id });
    } catch (error) {
      const { response } = error;
      closeModal();
      dispatch(
        setAlert({
          message: response ? `${response.status}: ${response.data.message}` : error.message,
          type: 'error',
        })
      );
    }
    // onPostUpdade(id);
  };

  return (
    <div className="post page__block">
      {profileData.id === token && (
        <div className="post__controls">
          <Prompt
            data={postData}
            dialogTitle={`Edit post`}
            Handler={EditHandler}
            DialogPromptComponent={EditableForm}
            onConfirm={handlePostUpdate}
            cancelText={'Cancel'}
            isConfirmButton={false}
            DialogPromptComponentParams={{
              type: 'post-edit',
              classPrefix: 'editor',
              submitHandler: handlePostUpdateSubmit,
              withAttachment: true,
              initialState: { text, attachments },
              id,
            }}
          />
          <Prompt
            data={postData}
            dialogTitle={`Delete post`}
            Handler={DeleteHandler}
            DialogPromptText={DeletePromptContent}
            onConfirm={handlePostDelete}
            returnCloseHandler
            cancelText={'No'}
            confirmText={'Yes'}
          />
        </div>
      )}

      <div className="post__author">
        <User className="post__user" user={author} userType={USER_TYPES.postAuthor} date={date} />
      </div>

      <div className="post__content">
        <span className="post__text">{text}</span>
        {attachments && (
          <div className="post__attachments">
            {attachments.map((attachment) => handleAttachmentType(attachment))}
            {/* {attachments.images && attachments.videos && (
              <div className="post__attachments-media">
                {attachments.images.map((image) => (
                  <img className="post__attachments-image" src={image.src} key={image.id} />
                ))}
                {attachments.videos.map((video) => (
                  <video className="post__attachments-video" src={video.src} key={video.id} />
                ))}
              </div>
            )}
            {attachments.audio && (
              <div className="post__attachments-musics">
                {attachments.audio.map((audio) => (
                  <audio
                    className="post__attachments-audio"
                    src={audio.src}
                    key={audio.id}
                    controls
                  />
                ))}
              </div>
            )} */}
            {/* {attachments.files && (
              <div className="post__attachments-files">
                {attachments.files.map((file) => (
                  <audio
                    className="post__attachments-video"
                    src={file.src}
                    key={file.id}
                    controls
                  />
                ))}
              </div>
            )} */}
          </div>
        )}
      </div>

      <div className="post__actions border--bottom--grey">
        <div className="post__likes-container">
          <span className="post__likes-counter">{likes.length ? likes.length : null}</span>
          <button
            onClick={likePost}
            className={`post__action post__like ${isLiked ? 'post__like--liked' : ''}`}>
            <FavoriteTwoToneIcon />
          </button>
        </div>
        <CommentIcon />
      </div>

      <div className="post__comments">
        <div className="post__coment">Hello world</div>
      </div>
    </div>
  );
}
