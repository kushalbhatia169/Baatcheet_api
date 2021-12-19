import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Link, withRouter } from 'react-router-dom';
import { context } from '../../store/store';
import ChatDashboard from './chat_dashboard';
import { List, Avatar } from 'antd';
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
    <ChatDashboard active="contacts">
      <Box className="m-3 w-100">
        <List
          className="p-3"
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
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />}
        />
      </Box>
    </ChatDashboard>
  );
};

export default withRouter(Contacts);
