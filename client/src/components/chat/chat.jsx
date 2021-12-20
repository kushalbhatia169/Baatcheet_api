import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import io from 'socket.io-client';
import { Box, Button } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { withRouter } from 'react-router-dom';
// import { useStyles } from '../../style_jsx/styles';
import { Card, Avatar, Input, Typography, message } from 'antd';
import { context } from '../../store/store';
import ChatDashboard from './chat_dashboard';
import APICallManager from '../../services/api_manager';
import config from '../../config.json';

const { TextArea } = Input;
const { Text } = Typography;
const { Meta } = Card;
//const client = new W3CWebSocket('ws://127.0.0.1:8000');
// const SERVER = 'ws://127.0.0.1:8080';
const SERVER = config.wsServer;


const Chat = (props) => {
  // console.log('chat props', props);
  const [chatState, setChatState] = useState({
    messages: [],
  });
  const { match: { params: { id } }, location: { from } } = props;
  const { state/* , dispatch */ } = useContext(context);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(createRef());

  const onButtonClicked = (value) => {
    if (!value) {
      message.error('Please enter a message');
      return;
    }
    const friend = state.friends.find(friend => friend.username === id);
    socket.emit('chat message', {
      msg: value,
      user: state.userData.username,
      senderId: state.userData._id,
      recieverId: friend.userId,
      isRead: false,
    });
    setChatState(prevState => ({ ...prevState, searchVal: '' }));
  };

  const scrollIntoView = () => {
    messageRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setSocket(io(SERVER));
    if (from === 'chatDashboard') {
      const friend = state.friends.find(friend => friend.username === id);
      const obj = { url: state.config.baseUrl + state.config.getChats };
      const data = { clientId: state.userData._id, userId: friend.userId };
      APICallManager.postCall(obj, data, async (res) => {
        const { data } = res;
        data.map((dataFromServer) => {
          setChatState(prevState => ({ ...prevState, messages: [
            ...prevState.messages,
            {
              id: dataFromServer.chats._id,
              msg: dataFromServer.chats.msg,
              user: dataFromServer.senderId === state.userData._id ? state.userData.username : id,
              senderId: dataFromServer.senderId,
              recieverId: dataFromServer.recieverId,
              isRead: dataFromServer.isRead,
            },
          ] }));
        });
        scrollIntoView();
      });
    }
  }, []);

  useEffect(() => {
    socket?.on('message', message => {
      // eslint-disable-next-line no-console
      console.log(message);
    });

    socket?.on('chat message', dataFromServer => {
      setChatState(prevState => ({ ...prevState, messages: [
        ...prevState.messages,
        {
          id: dataFromServer.msgId,
          msg: dataFromServer.message,
          user: dataFromServer.user,
          senderId: dataFromServer.senderId,
          recieverId: dataFromServer.recieverId,
          isRead: dataFromServer.isRead,
        },
      ] }));
    });
  }, [socket]);

  return (
    <ChatDashboard active="chats">
      <Box className="w-100 ms-3 mt-3 h-100">
        <Box className="me-5" style={{ borderBottom: '1px solid #e6e6e6' }}>
          {state.friends && state.friends.map(friend => {
            if (friend.username === id) {
              return <Text id="main-heading" type="secondary" className="ms-3"
                style={{ fontSize: '30px', textTransform: 'capitalize' }}>
                {friend.username}
              </Text>;
            }
          })}
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages"
          className="w-100 main-chat__chatBox">
          {chatState.messages && chatState.messages.map(message =>
            <Card ref={messageRef[id]} key={message.id} style={{ width: 300, margin: '16px 16px 0 4px',
              backgroundColor: state.userData.username === message.user ? '#f7f7f7' : '#fde3cf',
              alignSelf: state.userData.username === message.user ? 'flex-end' : 'flex-start' }} loading={false}>
              <Meta
                avatar={
                  <Avatar style={{ color: '#f56a00',
                    backgroundColor: state.userData.username === message.user ? '#fde3cf' : '#f7f7f7' }}>
                    {message.user && message.user[0].toUpperCase() || 'U'}
                  </Avatar>
                }
                title={message.user + ':'}
                description={message.msg}
              />
            </Card>,
          )}
          <div ref={messageRef}></div>,
        </Box>
        <Box className="bottom d-flex justify-content-between p-3" style={{ bottom: 0 }}>
          <TextArea
            rows={3}
            className="m-4 ms-3"
            placeholder="Enter message"
            value={chatState.searchVal}
            size="large"
            onChange={(e) => setChatState(prevState => ({ ...prevState, searchVal: e.target.value }))}
          />
          <Box className="d-flex flex-columns align-items-center">
            <Button variant="outlined" className="send-button icon rounded-circle"
              onClick={() => onButtonClicked(chatState.searchVal)}
              title="Send">
              <SendRoundedIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </ChatDashboard>
  );
};

export default withRouter(Chat);