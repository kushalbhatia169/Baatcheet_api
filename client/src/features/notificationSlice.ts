import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = [
    { id: "", msg: "", user: "", senderId: "", recieverId: "", isRead: "" }
];

const notificationSlice = createSlice({
    name: 'notification',
    initialState: [...initialStateValue],
    reducers: {
        setNotification: (state, action) => {
            const isNotExist = state.findIndex(notification => notification.id === action.payload.id) === -1;
            if (isNotExist) {
                const isEmpty = Object.values(state[0]).every(x => (x === null || x === ''));
                if (isEmpty) {
                    state.pop();
                }
                state.push({ ...action.payload });
            }
        },
        removeNotification: (state, action) => {
            const index = state.findIndex(notification => notification.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    },
});

export const { setNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
