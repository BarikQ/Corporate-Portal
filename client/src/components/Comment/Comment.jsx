/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useReducer, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';

import { filterAttachments } from 'utils';
import { useToken } from 'hooks';
import { Attachments, EditableForm, Prompt, User } from 'components';
import { USER_TYPES } from 'constants';
import { setAlert } from 'store/actions';

import './Comment.scss';

Comment.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  attachments: PropTypes.array,
  comments: PropTypes.array,
  date: PropTypes.any,
  commentData: PropTypes.object,
};

Comment.defaultProps = {
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
      Are you sure you want to delete this comment?
      <br /> <span className="post__delete-text">This action is irreversible.</span>
    </span>
  );
}

export default function Comment({ commentData, onCommentUpdade, className, ...props }) {
  const { token } = useToken();

  const [
    {
      author,
      content: { text, attachments },
      likes,
      date,
      id,
    },
    setCommentData,
  ] = useReducer((currentValues, newValues) => ({ ...currentValues, ...newValues }), commentData);

  const { graphics, audio, files } = useMemo(() => filterAttachments(attachments), [attachments]);
  const [isLiked, setIsLiked] = useState(() => likes.includes(token));
  const dispatch = useDispatch();

  const likeComment = async (event) => {
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
      setCommentData({ likes: newLikes });

      await onCommentUpdade({ likes: newLikes }, id);
    } catch (error) {
      setIsLiked(state.isLiked);
      setCommentData({ likes: state.likes });
      console.error(error);
    }
  };

  const handleCommentUpdateSubmit = async (event, data) => {
    event.preventDefault();

    try {
      const comment = await onCommentUpdade({ content: data }, id);
      console.log('ZALUPA', comment);
      setCommentData({ ...comment });
      return comment;
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

  const handleCommentDelete = async ({ id }, closeModal) => {
    try {
      await onCommentUpdade(null, id);
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

  return (
    <div className="comment border--bottom--grey">
      {author.id === token && (
        <div className="comment__controls">
          <Prompt
            data={commentData}
            dialogTitle={`Edit comment`}
            Handler={EditHandler}
            DialogPromptComponent={EditableForm}
            cancelText={'Cancel'}
            isConfirmButton={false}
            DialogPromptComponentParams={{
              type: 'comment-edit',
              classPrefix: 'editor',
              submitHandler: handleCommentUpdateSubmit,
              withAttachment: true,
              initialState: { text, attachments },
              id: `comment-${id}`,
            }}
          />
          <Prompt
            data={commentData}
            dialogTitle={`Delete comment`}
            Handler={DeleteHandler}
            DialogPromptText={DeletePromptContent}
            onConfirm={handleCommentDelete}
            returnCloseHandler
            cancelText={'No'}
            confirmText={'Yes'}
          />
        </div>
      )}

      <div className="comment__author">
        <User
          className="comment__user"
          user={{ profileData: author, id: author.id }}
          userType={USER_TYPES.commentAuthor}
          date={date}
        />
      </div>

      <div className="comment__content">
        <span className="comment__text">{text}</span>
        {attachments && (
          <Attachments
            graphics={graphics}
            audio={audio}
            files={files}
            className="post__attachments"
          />
        )}
      </div>

      <div className="comment__actions">
        <span className="comment__date">{moment(date, 'LLLL').format('LLLL')}</span>
        <div className="comment__action-container">
          <span className="comment__likes-counter">{likes.length ? likes.length : null}</span>
          <button
            onClick={likeComment}
            className={`comment__action comment__like ${isLiked ? 'comment__like--liked' : ''}`}>
            <FavoriteTwoToneIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
