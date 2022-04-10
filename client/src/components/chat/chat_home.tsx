import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box } from '@mui/material';
import { withRouter } from 'react-router-dom';
// import { useStyles } from '../../style_jsx/styles';
import ChatDashboard from './chat_dashboard';
import Contacts from './contacts';


const Chat = () => {

    return (
        <ChatDashboard active="chats">
            <Contacts />
            <Box className="main-chat__contacts__chats m-3">
                <span>
                    Click on a user to start chatting
                </span>
            </Box>
        </ChatDashboard>
    );
};

export default withRouter(Chat);