import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Message, EditableForm, Preloader } from 'components';
import { ReactComponent as BackArrowIcon } from 'assets/images/back-arrow.svg';
import { getChatMessages } from 'api';
import { SocketContext } from 'context/socket';
import { useToken } from 'hooks';
import { setAlert, removeError } from 'store/actions';

import './Chat.scss';

function Chat() {
  const messagesEndRef = useRef(null);
  const { chatId } = useParams();
  const profileId = localStorage.getItem('x-token');
  const { token } = useToken();
  const [messages, setMessages] = useState(null);
  const [usersList, setUsersList] = useState({});
  const [chatName, setChatName] = useState('');
  const [{ blackList, messages: messagesPrivacy }, setPrivacy] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messages && isLoading) {
      getChatData();
    }

    socket.on('private message', ({ message, from }) => {
      updateMessages(message);
      scrollToBottom(messagesEndRef);
    });

    return () => {
      socket.off('private message');
    };
  }, [messages]);

  function updateMessages(message) {
    setMessages([...messages, message]);
  }

  async function getChatData() {
    try {
      const { data } = await getChatMessages(token, chatId);

      const { messages, users, id, name, privacy } = data;
      console.log(data);
      if (privacy) setPrivacy(privacy);
      setUsersList(users);

      for (const [key, value] of Object.entries(users)) {
        if (key !== token) {
          setChatName(`${value.firstName} ${value.surname}`);
          break;
        }
      }

      setMessages(messages);
      scrollToBottom(messagesEndRef);
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
  }

  function handleFormSubmit(event, data) {
    event.preventDefault();

    try {
      const newMessage = {
        content: data,
        date: new Date(),
      };

      socket.emit(
        'private message',
        {
          message: newMessage,
          to: chatId,
        },
        function ({ message }) {
          updateMessages(message);
          scrollToBottom(messagesEndRef);
        }
      );
    } catch (error) {
      dispatch(setAlert({ message: error.message, type: 'error' }));
      console.log(error);
    }
  }

  const scrollToBottom = (targetRef) => {
    targetRef.current?.scrollIntoView();
  };

  return (
    <div className="chat page__block">
      <div className="chat__header">
        <div className="chat__header-aside">
          <Link className="chat__back-link" to="/im">
            <BackArrowIcon /> Back
          </Link>
        </div>

        <div className="chat__header-box chat__header-box--middle">
          <Link className="chat__companion-name link--default" to={`/${chatId}`}>
            {chatName}
          </Link>
        </div>

        <div className="chat__header-box">
          <Link to={`/${chatId}`}>
            <div className="chat__companion-photo">
              <img className="chat__companion-image" src={usersList[chatId]?.profileImage} />
            </div>
          </Link>
        </div>
      </div>

      <div className="chat__body custom-scrollbar" style={{ height: 100 }}>
        <div className="chat__messages-container">
          {messages ? (
            messages.length && Object.keys(usersList).length ? (
              <>
                {messages.map((message) => {
                  return (
                    <Message
                      className="chat__message"
                      message={message}
                      sender={usersList[message.senderId]}
                      key={message._id || message.senderId + message.date}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : null
          ) : (
            <Preloader isLoading />
          )}
        </div>
      </div>

      <div className="chat__input">
        {(blackList && blackList.includes(token)) ||
        (messagesPrivacy && messagesPrivacy.deny && messagesPrivacy.deny.includes(token)) ? (
          <span className="chat__deny">
            You cannot send a message to this user because he limits the circle of people who can
            send messages to him
          </span>
        ) : (
          <EditableForm submitHandler={handleFormSubmit} withAttachment type="send" />
        )}
      </div>
    </div>
  );
}

export default Chat;
