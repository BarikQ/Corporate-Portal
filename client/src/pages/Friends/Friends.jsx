import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { Users } from 'pages';

import './Friends.scss';

function Friends() {
  const [searchParams] = useSearchParams();

  return <Users isFriendsList className="friends" targetUserId={searchParams.get('id')} />;
}

export default Friends;
