import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import io from 'socket.io-client';
import Box from '@mui/material/Box';
import { withRouter } from 'react-router-dom';
// import { useStyles } from '../../style_jsx/styles';
import { Card, Avatar, Input, Typography, message, Spin } from 'antd';
import { context } from '../../store/store';
import ChatDashboard from './chat_dashboard';
import APICallManager from '../../services/api_manager';
import config from '../../config.json';
import Contacts from './contacts';
import usePrevious from '../../hooks/usePrevious';

const { TextArea } = Input;
const { Text } = Typography;
const { Meta } = Card;
//const client = new W3CWebSocket('ws://127.0.0.1:8000');
// const SERVER = 'ws://127.0.0.1:8080';
const SERVER = config.wsServer;
 let socket = null;

const Chat = (props) => {
  // console.log('chat props', props);
  const [chatState, setChatState] = useState({
    messages: [],
  });
  const { match: { params: { id: userId } }, location: { from, username: id, friend_Id } } = props;
  const { state, dispatch } = useContext(context);
  const [socketConnected, setSocketConnected] = useState(false);
  const [canShowLoader, setCanShowLoader] = useState(true);
  const messageRef = useRef(createRef());
  let prevUserId = usePrevious({userId, id});
// console.log(userId, id, canShowLoader, from, prevUserId);
  const onButtonClicked = (value) => {
    console.log(value)
    if (!value.trim()) {
      message.error({content: 'Please enter a message', duration: 2});
      return;
    }
    else {
      try {
        const obj = {url: state.config.baseUrl + '/setMessages' };
        const data = { senderId: state.userData._id, recieverId: friend_Id, message: value?.trim(), isRead: false };
        APICallManager.putCall(obj, data, (res) => {
          const { data } = res;
          console.log(data);
          socket.emit('new message', {
            message: data.message,
            user: state.userData.username,
            id: data.msgId,
            senderId: data.senderId,
            recieverId: data.recieverId,
            isRead: data.isRead,
            roomId: data.recieverId+'|'+data.senderId,
            chatId: data.chatId,
          });
          setChatState(prevState => ({ ...prevState, searchVal: '' }));
          setChatState(prevState => ({ ...prevState, messages: [
            ...prevState.messages,
            {
              id: data.msgId,
              msg: data.message,
              user: data.senderId === state.userData._id ? state.userData.username : id,
              senderId: data.senderId,
              recieverId: data.recieverId,
              isRead: data.isRead,
            },
          ] }));
          scrollIntoView();
          })
      }
      catch (error) {
        message.error({content: 'Failed to send the Message', duration: 2});
      }


    }
  };

  const scrollIntoView = () => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if(prevUserId !== userId) {
      setCanShowLoader(true);
      prevUserId = userId;
    }
  },[userId]);

  useEffect(() => {
    // setSocket(io(SERVER));
    socket = io(SERVER);
    socket.emit("setup", state?.userData?._id);
    socket.on("connected", () => setSocketConnected(true));
    if (from === 'chatDashboard' && canShowLoader) {
      const obj = { url: state.config.baseUrl + state.config.getChats };
      const data = { clientId: state.userData._id, userId: friend_Id };
      APICallManager.postCall(obj, data, async (res) => {
        const { data } = res;
        const chatData = [];
        data.map((dataFromServer) => {
          chatData.push({
            id: dataFromServer.chats._id,
            msg: dataFromServer.chats.msg,
            user: dataFromServer.senderId === state.userData._id ? state.userData.username : id,
            senderId: dataFromServer.senderId,
            recieverId: dataFromServer.recieverId,
            isRead: dataFromServer.isRead,
          });
        });
        setChatState(prevState => ({ ...prevState, messages: [ ...chatData ] }));
        let room_Id = state.userData._id+'|'+friend_Id;
        socket.emit("join chat", room_Id);
        setCanShowLoader(false);
        scrollIntoView();
      });
    }
  }, [canShowLoader]);
console.log(state.friends, props);
  useEffect(() => {
    // socket?.on('message', message => {
    //   // eslint-disable-next-line no-console
    //   console.log(message);
    // });
    socket?.on('message received', dataFromServer => {
      console.log(userId, dataFromServer.chatId, dataFromServer, window.location.href);
      if(window.location.href.indexOf(dataFromServer.chatId) === -1) {
        dispatch({ type: 'ADD_DATA', payload: { key:'notifications', value: [
          ...state.notifications,
          {
            id: dataFromServer.msgId,
            msg: dataFromServer.message,
            user: dataFromServer.user,
            senderId: dataFromServer.senderId,
            recieverId: dataFromServer.recieverId,
            isRead: dataFromServer.isRead,
          }
        ] } });
        return;
      }
      else {
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
      }

      // scrollIntoView();
    });

  }, []);

  return (
    <ChatDashboard active="chats">
      <Contacts userId={userId}/>
      <Box className="m-3 main-chat__chats">
        <Box className="d-flex justify-content-start w-100 mb-3 mt-2">
          <Text id="main-heading" type="secondary" className="ms-3" key={id}
            style={{ fontSize: '30px', textTransform: 'capitalize' }}>
            {id}
          </Text>
        </Box>
        {!canShowLoader ? <Box id="messages"
          className="w-100 main-chat__chatBox">
          <Box className="w-100 main-chat__chatBox__messageDiv">
            {chatState.messages && chatState.messages.map(message =>
            <Card ref={messageRef[id]} key={message.id} style={{ width: 300, margin: '16px 16px 0 16px',
              backgroundColor: state.userData.username === message.user ? '#BEE3F8' : '#fde3cf',
              alignSelf: state.userData.username === message.user ? 'flex-end' : 'flex-start',
              borderRadius: '.5rem' }} loading={false}>
              <Meta
                avatar={
                  <Avatar style={{ color: '#f56a00',
                    backgroundColor: state.userData.username === message.user ? '#fde3cf' : '#BEE3F8' }}>
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
          <TextArea
            rows={1}
            className="m-2"
            defaultValue={!chatState.searchVal ? '' : chatState.searchVal}
            style={{backgroundColor: '#E0E0E0', width: '98%', borderRadius: '0.5rem'}}
            placeholder="Enter a message"
            value={chatState.searchVal}
            size="large"
            onChange={(e) => {
              if (e.key === 'Enter') {
                console.log('enter pressed');
                setChatState(prevState => ({ ...prevState, searchVal: prevState.searchVal }));
                return;
              }
              setChatState(prevState => ({ ...prevState, searchVal: e.target.value }))}
            }
            onKeyPress={event => {
              if (event.key === 'Enter') {
                console.log('enter pressed');
                event.preventDefault();
                onButtonClicked(chatState.searchVal);
                return;
              }
            }}
          />
        </Box>:
        <div className="example">
        <Spin />
      </div>}
      </Box>
    </ChatDashboard>
  );
};

export default withRouter(Chat);