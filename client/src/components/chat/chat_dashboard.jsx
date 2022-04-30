import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { withRouter, useHistory } from 'react-router-dom';

// import { useStyles } from '../../style_jsx/styles';
import { Menu, Dropdown, message, Space, Avatar, Typography, PageHeader, AutoComplete } from 'antd';
import { DownOutlined, SettingOutlined, LogoutOutlined, PushpinTwoTone,
  GiftOutlined, SearchOutlined } from '@ant-design/icons';
import { context } from '../../store/store';
import './chat.scss';
import 'antd/dist/antd.css';
import APICallManager from '../../services/api_manager';
import config from '../../config.json';
import {useSelector, useDispatch} from 'react-redux';

const { Text } = Typography;
const SERVER = config.wsServer;

const ChatDashboard = (props) => {
  const [options, setOptions] = useState([]);
  const { state: stateContext, dispatch: dispatchContext } = useContext(context);
  const user_Data = useSelector(state => state.user.value);
  const { children, active } = props;
  const history = useHistory();
  //classes = useStyles();

  const handleMenuClick = (e) => {
    e.key === '3' && message.info({content: 'User successfully logged out.', duration: 1});
    if (e.key === '3') {
      dispatchContext({ type: 'LOGOUT' });
      history.push('/login');
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
      if (dataFromServer.user !== stateContext.userData.username && dataFromServer.user !== '') {
        setOptions([{ value: dataFromServer.user, _id: dataFromServer._id }]);
      }
    });
  }, [socket]);

  const onSearch = (searchText) => {
    if (searchText.length > 0) {
      if (stateContext.userData.username !== searchText) {
        socket.emit('getUser', { searchText: searchText, user: { ...stateContext.userData } });
      }
    }
    else {
      setOptions([]);
    }
  };

  const onSelect = (userData) => {
    const friend = {
      clientId: stateContext.userData._id,
      username: userData,
      userId: options[0]._id,
      chats: [],
    };
    const obj = { url: stateContext.config.baseUrl + stateContext.config.addContact };
    const data = { ...friend };
    APICallManager.postCall(obj, data, async (res) => {
      dispatchContext({ type: 'ADD_FRIEND', payload: { ...res.data } });
      history.push({
        pathname: '/chat/' + userData,
        from: 'chatDashboard',
      });
    });
  };

  const routeActivePage = (activeClass) => {
    history.push(activeClass);
  };
console.log(user_Data, stateContext.userData);
  return (
    <Box className="main-chat" id="wrapper">
      <PageHeader className="main-chat__header title">
          <Button id="main-heading" type="secondary" className="ms-3 mb-3"
            style={{ fontSize: '24px', textTransform: 'capitalize' }}>
            <SearchOutlined className="me-2" size={40} style={{fontSize:18, fontWeight:700}}/>
            <span style={{fontSize: 16}}>Search User</span>

          </Button>
        <AutoComplete
          className="w-50"
          placeholder="Enter an user name to search and add in your contacts"
          onSelect={onSelect}
          onSearch={onSearch}
          onBlur={() => setOptions([])}
          options={options} />
           <Text  id="main-heading" type="secondary" className="ms-3 mb-3"
            style={{ fontSize: '24px', textTransform: 'capitalize', color:'black' }}>
            ChatBot!
          </Text>
        <Space wrap className="mb-3">
          <NotificationsIcon className="icon me-2" />
          <Dropdown overlay={menu}>
            <Button>
            <Avatar style={{ color: '#000', backgroundColor: 'rgb(185, 245, 208)', border: '1px solid darkgreen' }}>
            {stateContext.userData.username && stateContext.userData.username[0].toUpperCase() || 'U'}
          </Avatar> <DownOutlined className="ms-2" />
            </Button>
          </Dropdown>
        </Space>
      </PageHeader>
      <Box className="d-flex h-100">
        {children}
      </Box>
      {/* } */}
    </Box>
  );
};

export default withRouter(ChatDashboard);
