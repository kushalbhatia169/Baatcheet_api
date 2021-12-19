import React from 'react';
import ChatDashboard from './chat_dashboard';

const Status = () => {
  const id = 'id';
  return (
    <ChatDashboard {...{ active: `status/${id}`, id: id }}>
    </ChatDashboard>
  );
};

export default Status;
