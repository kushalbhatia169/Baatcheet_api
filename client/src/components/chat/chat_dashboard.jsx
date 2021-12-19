import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { Box, Button } from '@mui/material';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import AnimationTwoToneIcon from '@mui/icons-material/AnimationTwoTone';
import { withRouter, useHistory } from 'react-router-dom';

// import { useStyles } from '../../style_jsx/styles';
import { Menu, Dropdown, message, Space, Avatar, Typography, PageHeader, AutoComplete } from 'antd';
import { DownOutlined, SettingOutlined, LogoutOutlined, PushpinTwoTone,
  GiftOutlined } from '@ant-design/icons';
import { context } from '../../store/store';
import './chat.scss';
import 'antd/dist/antd.css';
import APICallManager from '../../services/api_manager';

const { Text } = Typography;
const SERVER = 'ws://127.0.0.1:8080';

const ChatDashboard = (props) => {
  const [options, setOptions] = useState([]);
  const { state, dispatch } = useContext(context);
  const { children, active } = props;
  const history = useHistory();
  //classes = useStyles();

  const handleMenuClick = (e) => {
    e.key === '3' && message.info('User successfully logged out.');
    if (e.key === '3') {
      dispatch({ type: 'LOGOUT' });
      history.push('/home');
      //window.location.reload();
    }
  };
  const [socket, setSocket] = useState(null);
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" className="icon" icon={<SettingOutlined spin />}>
        Settings
      </Menu.Item>
      <Menu.Item key="2" className="icon" icon={<GiftOutlined />}>
        Invite A Friend
      </Menu.Item>
      <Menu.Item key="3" className="icon" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    setSocket(io(SERVER));
  }, []);

  useEffect(() => {
    socket?.on('message', message => {
      // eslint-disable-next-line no-console
      console.log(message);
    });

    socket?.on('getUser', dataFromServer => {
      if (dataFromServer.user !== state.userData.username && dataFromServer.user !== '') {
        setOptions([{ value: dataFromServer.user, _id: dataFromServer._id }]);
      }
    });
  }, [socket]);

  const onSearch = (searchText) => {
    if (searchText.length > 0) {
      if (state.userData.username !== searchText) {
        socket.emit('getUser', { searchText: searchText, user: { ...state.userData } });
      }
    }
    else {
      setOptions([]);
    }
  };

  const onSelect = (userData) => {
    const friend = {
      clientId: state.userData._id,
      username: userData,
      userId: options[0]._id,
      chats: [],
    };
    const obj = { url: state.config.baseUrl + state.config.addContact };
    const data = { ...friend };
    APICallManager.postCall(obj, data, async (res) => {
      dispatch({ type: 'ADD_FRIEND', payload: { ...res.data } });
      history.push({
        pathname: '/chat/' + userData,
        from: 'chatDashboard',
      });
    });
  };

  const routeActivePage = (activeClass) => {
    history.push(activeClass);
  };

  return (
    <Box className="main-chat" id="wrapper">
      {/* {state.userData.isLoggedIn && */}
      <Box className="d-flex flex-column w-100">
        <PageHeader className="main-chat__header title">
          <Box>
            <Avatar style={{ color: '#f56a00', backgroundColor: 'plum', border: '1px solid purple' }}>
              {state.userData.username && state.userData.username[0].toUpperCase() || 'U'}
            </Avatar>
            <Text id="main-heading" type="secondary" className="ms-3"
              style={{ fontSize: '24px', textTransform: 'capitalize' }}>
              {state.userData.username}
            </Text>
          </Box>
          <AutoComplete
            className="w-50"
            placeholder="Enter an user name to search and add in your contacts"
            onSelect={onSelect}
            onSearch={onSearch}
            onBlur={() => setOptions([])}
            options={options} />
          <Space wrap className="mb-3">
            <Dropdown overlay={menu}>
              <Button>
                Menu <DownOutlined className="ms-2 mt-1" />
              </Button>
            </Dropdown>
          </Space>
        </PageHeader>
        <Box className="d-flex h-100">
          <Box className="main-chat__sidebar">
            <Box className={`p-3 icon ${active === 'contacts' && 'main-chat__active'}`}
              onClick={() => routeActivePage('/contacts')}>
              <PeopleAltTwoToneIcon title="Contacts" />
            </Box>
            <Box className={`p-3 icon ${active === 'chats' && 'main-chat__active'}`}
              onClick={() => routeActivePage('/chats')}>
              <ChatTwoToneIcon title="Recent Chat" />
            </Box>
            <Box className={`p-3 icon ${active === 'favourites' && 'main-chat__active'}`}
              onClick={() => routeActivePage('/favourites')}>
              <StarTwoToneIcon title="Favourites" />
            </Box>
            <Box className={`p-3 icon ${active === 'pinnedMessages' && 'main-chat__active'}`}
              onClick={() => routeActivePage('/pinnedMessages')}>
              <PushpinTwoTone title="Pinned Messages" size="2" twoToneColor="rgb(128, 0, 128)" />
            </Box>
            <Box className={`p-3 icon ${active === `status/id` && 'main-chat__active'}`}
              onClick={() => routeActivePage(`status/id`)}>
              <AnimationTwoToneIcon title="Status" />
            </Box>
          </Box>
          {children}
        </Box>
      </Box>
      {/* } */}
    </Box>
  );
};

export default withRouter(ChatDashboard);
