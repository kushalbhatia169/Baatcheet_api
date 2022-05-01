import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = {
    _id: "", username: "", clientId: ""
}

const friendSlice = createSlice({
    name: 'friend',
    initialState: [{ ...initialStateValue }],
    reducers: {
        setFriend: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.splice(0, state.length, ...action.payload);
            }
            else {
                const isNotExist = state.findIndex(friend => friend._id === action.payload._id) === -1;
                if (isNotExist) {
                    state.push({ ...action.payload });
                }
            }
        },
        removeFriend: (state, action) => {
            const index = state.findIndex(friend => friend._id === action.payload._id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

export const { setFriend, removeFriend } = friendSlice.actions;

export default friendSlice.reducer;