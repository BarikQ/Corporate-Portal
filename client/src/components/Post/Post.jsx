/* eslint-disable no-fallthrough */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useReducer, useMemo } from 'react';
import { Collapse, ImageList, ImageListItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useToken } from 'hooks';
import {
  createPostComment,
  deletePostComment,
  deleteUserPost,
  updatePostComment,
  updateUserPost,
} from 'api';
import { Attachments, Comment, EditableForm, Prompt, User } from 'components';
import { USER_TYPES } from 'constants';
import { setAlert } from 'store/actions';
import { filterAttachments } from 'utils';

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
  const dispatch = useDispatch();

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

  const { graphics, audio, files } = useMemo(() => filterAttachments(attachments), [attachments]);
  const [isLiked, setIsLiked] = useState(() => likes.includes(token));
  const [displayComments, setDisplayComments] = useState(false);

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
      } = await updateUserPost(token, profileId, id, { likes: newLikes });

      setIsLiked(() => post.likes.includes(token));
      setPostData({ likes: post.likes });
      onPostUpdade(post, id);
    } catch (error) {
      setIsLiked(state.isLiked);
      setPostData({ likes: state.likes });
      console.error(error);
    }
  };

  const handlePostUpdateSubmit = async (event, data) => {
    event.preventDefault();

    try {
      return await updateUserPost(token, profileId, id, { content: data });
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
      post: { comments, content, likes, id },
    },
  }) => {
    dispatch(
      setAlert({
        message: 'Post was updated successfully',
        type: 'success',
      })
    );
    setPostData({ comments, content, likes });
    onPostUpdade({ comments, content, likes }, id);
  };

  const handlePostDelete = async ({ id }, closeModal) => {
    try {
      await deleteUserPost(token, profileId, id);
      closeModal();
      onPostUpdade(null, id);
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
  };

  const showComments = () => {
    setDisplayComments(!displayComments);
  };

  const handleCommentSubmit = async (event, data) => {
    event.preventDefault();

    try {
      const { data: comments } = await createPostComment(token, profileId, id, data);

      setPostData({ ...comments });
      onPostUpdade({ comments }, id);
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
  };

  const handleCommentUpdate = async (data, commentId) => {
    if (data) {
      const response = await updatePostComment(profileId, token, id, commentId, data);
      console.log('UFDHDSFHSD', { ...comments, ...{ [commentId]: { ...response.data.comment } } });
      onPostUpdade(
        { comments: { ...comments, ...{ [commentId]: { ...response.data.comment } } } },
        id
      );
      setPostData({ comments: { ...comments, ...{ [commentId]: { ...response.data.comment } } } });
      return response.data.comment;
    }

    await deletePostComment(profileId, token, id, commentId);
    const newComments = { ...comments };
    delete newComments[commentId];
    onPostUpdade({ ...postData, comments: newComments }, id);
    setPostData({ comments: newComments });
  };

  return (
    <div className="post page__block">
      {author.id === token && (
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
              initialState: { text, attachments: attachments },
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
        <User
          className="post__user"
          user={{ profileData: author, id: author.id }}
          userType={USER_TYPES.postAuthor}
          date={date}
        />
      </div>

      <div className="post__content border--bottom--grey">
        <span className="post__text">{text}</span>
        {Boolean(attachments.length) && (
          <Attachments
            graphics={graphics}
            audio={audio}
            files={files}
            className="post__attachments"
          />
        )}
      </div>

      <div
        className={`post__actions ${
          displayComments ? 'border--bottom--grey' : 'post__actions--no-comments'
        }`}>
        <div className="post__action-container">
          <span className="post__likes-counter">{likes.length ? likes.length : null}</span>
          <button
            onClick={likePost}
            className={`post__action post__like ${isLiked ? 'post__like--liked' : ''}`}>
            <FavoriteTwoToneIcon />
          </button>
        </div>
        <div className="post__action-container">
          <span className="post__comments-counter">
            {Object.keys(comments).length ? Object.keys(comments).length : null}
          </span>
          <button onClick={showComments} className="post__action post__comment-icon">
            <CommentIcon />
          </button>
        </div>
      </div>

      <Collapse in={displayComments}>
        <div className="post__comments-container comments-section">
          <div className="post__coments comments">
            {Object.entries(comments).map(([key, value]) => (
              <Comment commentData={value} key={key} onCommentUpdade={handleCommentUpdate} />
            ))}
          </div>
          <div className="comment-section__add">
            <EditableForm
              type="post"
              classPrefix="editor"
              submitHandler={handleCommentSubmit}
              withAttachment
              id={`comment-${id}`}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
}
