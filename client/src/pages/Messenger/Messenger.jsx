import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Preloader } from 'components';
import { getUserChats } from 'api';
import { setAlert } from 'store/actions';

import './Messenger.scss';

function Messenger() {
  const [chatsList, setChatsList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(async () => {
    try {
      const { data } = await getUserChats(localStorage.getItem('x-token'));

      setChatsList(data);
      console.log(data);
      setIsLoading(false);
    } catch ({ response }) {
      setIsLoading(false);

      dispatch(
        setAlert({
          message: `${response.status}: ${response.data.message}`,
          type: 'error',
        })
      );
    }
  }, []);

  return (
    <div className="messenger page__block">
      {chatsList?.length ? (
        chatsList.map((chat) => {
          return (
            <Link
              className="messenger__dialog dialog border--bottom--grey"
              key={chat.id}
              to={`${chat.id}`}>
              <div className="dialog__content">
                <div className="messenger__user dialog__photo">
                  <img className="dialog__image" src={chat.users[chat.id].profileImage} />
                </div>

                <div className="dialog__title">
                  <span className="dialog__name">{`${chat.users[chat.id].firstName}  ${
                    chat.users[chat.id].surname
                  }`}</span>
                  <div className="dialog__preview">
                    <div className="dialog__preview-photo">
                      <img
                        className="dialog__preview-image"
                        src={chat.users[chat.lastMessage.senderId].profileImage}
                      />
                    </div>
                    <span className="dialog__preview-text">{chat.lastMessage.content.text}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : isLoading ? (
        <Preloader prefix="messenger" isLoading text={null} />
      ) : (
        <div className="messenger__not-found">
          404 <br /> Chats not found
        </div>
      )}
    </div>
  );
}

export default Messenger;
