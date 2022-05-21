import userReducer from './userSlice';
import friendReducer from './friendSlice';
import notificationReducer from './notificationSlice';

export const reducerSlices = {
    user: userReducer,
    friend: friendReducer,
    notification: notificationReducer,
};