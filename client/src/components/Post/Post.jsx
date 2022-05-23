import React from 'react';
import PropTypes from 'prop-types';

import { User } from 'components';

import './Post.scss';

import baseFriendImage from 'assets/images/baseFriendImage.png';
import baseProfileImage from 'assets/images/baseProfileImage.png';
import { ReactComponent as LikeIcon } from 'assets/images/likeIcon.svg';
import { ReactComponent as CommentIcon } from 'assets/images/commentIcon.svg';

Post.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  attachments: PropTypes.array,
  author: PropTypes.object.isRequired,
  comments: PropTypes.array,
  date: PropTypes.string,
};

Post.defaultProps = {
  className: '',
  text: null,
  attachments: null,
  comments: null,
  date: new Date(),
};

export default function Post({ author, text, attachments, comments, date, className, ...props }) {
  return (
    <div className="post page__block">
      <div className="post__author">
        <User className="post__user" name={author.name} image={author.image} date={date} />
      </div>

      <div className="post__content">
        <span className="post__text">Rofl post text</span>
        {attachments && (
          <div className="post__attachments">
            {attachments.images && attachments.videos && (
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
            )}
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

            <img className="post__image" src={attachments} />
          </div>
        )}
      </div>

      <div className="post__actions border--bottom--grey">
        <LikeIcon />
        <CommentIcon />
      </div>

      <div className="post__comments">
        <div className="post__coment">Hello world</div>
      </div>
    </div>
  );
}
