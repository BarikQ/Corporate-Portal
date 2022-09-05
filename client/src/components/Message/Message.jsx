import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FilePresentIcon from '@mui/icons-material/FilePresent';

import { Attachments } from 'components';
import { filterAttachments } from 'utils';

import './Message.scss';

Message.propTypes = {
  className: PropTypes.string,
  message: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
};

Message.defaultProps = {
  className: '',
};

function Message({
  className,
  message: {
    senderId,
    date,
    content: { attachments, text },
  },
  sender: { profileImage, firstName, surname },
  ...props
}) {
  const { graphics, audio, files } = useMemo(() => filterAttachments(attachments), [attachments]);

  return (
    <div className={`message ${className}`} {...props}>
      <Link to={`/${senderId}`} className="message__photo">
        <img className="message__image" src={profileImage} />
      </Link>

      <div className="message__content">
        <div className="message__top">
          <Link className="message__sender" to={`/${senderId}`}>
            {`${firstName} ${surname}`}
          </Link>
          <span className="message__date">{new Date(date).toLocaleString('en-US')}</span>
        </div>

        <div className="message__body">
          <span className="message__text">{text}</span>
          {Boolean(attachments.length) && (
            <Attachments
              graphics={graphics}
              audio={audio}
              files={files}
              className="post__attachments"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
