import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Link, withRouter } from 'react-router-dom';
import { context } from '../../store/store';
import AddIcon from '@mui/icons-material/Add';
import { List, Avatar, Button } from 'antd';
import APICallManager from '../../services/api_manager';

const Contacts = () => {
  const { state, dispatch } = useContext(context);
  const [_isMounted, _setIsMounted] = useState(true);
  useEffect(() => {
    if (_isMounted) {
      const obj = { url: state.config.baseUrl + state.config.getContacts + state.userData._id };
      APICallManager.getCall(obj, '', async (res) => {
        res.data.length > 0 && dispatch({ type: 'ADD_FRIEND', payload: [...res.data] });
      });
    }
    return () => {
      _setIsMounted(false);
    };
  }, [state]);

  return (
    // <ChatDashboard active="contacts">
      <Box className="m-3 main-chat__contacts">
        <Box className="d-flex justify-content-between">
          <h2>
            My Chats
          </h2>
          <Button className="btn d-flex justify-content-center" style={{height: 40, width: 160}}>
            <span className="mb-3 ms-3"style={{fontSize: 17}}>New Group Chat</span>
            <AddIcon className="me-2 mb-2"/>
          </Button>
        </Box>
        <Box className="main-chat__contacts__lists">
          <List
            className=""
            size="large"
            itemLayout="horizontal"
            bordered
            dataSource={state?.friends}
            renderItem={item => <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<Link to={{ pathname: `/chat/${item.username}`, from: 'chatDashboard' }}
                style={{ textTransform: 'capitalize', color: 'purple' }}>
                {item.username}
              </Link>}
              description="Ant Design, a design language for background applications"
            />}
          />
        </Box>
      </Box>
    // </ChatDashboard>
  );
};

export default withRouter(Contacts);
