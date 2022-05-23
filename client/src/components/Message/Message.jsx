import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FilePresentIcon from '@mui/icons-material/FilePresent';

import './Message.scss';

Message.propTypes = {
  className: PropTypes.string,
  message: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
};

Message.defaultProps = {
  className: '',
};

function Message({ className, message, sender: { profileImage, firstName, surname }, ...props }) {
  function handleAttachment(attachments) {
    const image = 'image';
    const video = 'video';
    const imagesList = [];
    const videosList = [];
    const filesList = [];

    attachments.forEach((file) => {
      switch (file.type) {
        case image: {
          imagesList.push(file);
          return;
        }
        case video: {
          videosList.push(file);
          return;
        }
        default: {
          filesList.push(file);
          return;
        }
      }
    });

    return (
      <>
        {imagesList.length ? (
          <div>
            {imagesList.map((image) => (
              <img src={image.url} key={image.url} />
            ))}
          </div>
        ) : null}
        {videosList.length ? (
          <div>
            {videosList.map((video) => (
              <video src={video.url} controls key={video.url} />
            ))}
          </div>
        ) : null}
        {filesList.length ? (
          <div>
            {filesList.map((file) => (
              <>
                <FilePresentIcon />
                <a href={file.url} key={file.url}>
                  {file.name}
                </a>
              </>
            ))}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className={`message ${className}`} {...props}>
      <Link to={`/${message.senderId}`} className="message__photo">
        <img className="message__image" src={profileImage} />
      </Link>

      <div className="message__content">
        <div className="message__top">
          <Link className="message__sender" to={`/${message.senderId}`}>
            {`${firstName} ${surname}`}
          </Link>
          <span className="message__date">{new Date(message.date).toLocaleString('en-US')}</span>
        </div>

        <div className="message__body">
          <div className="message__text">{message.content.text}</div>
          {message.content.attachments ? (
            <div className="message__attachments">
              {handleAttachment(message.content.attachments)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Message;
