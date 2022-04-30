import { isEmpty, cloneDeep } from 'lodash';

const isIterable = (value) => {
  return Symbol.iterator in Object(value);
};

const Reducer = (state, action) => {
  switch (action.type) {
    case 'userData':
      return {
        ...state,
        userData: action.payload,
      };

    case 'ADD_FRIEND':
      if (isEmpty(state.friends)) {
        const iterable = isIterable(action.payload);
        if (iterable) {
          return {
            ...state,
            friends: [...action.payload],
          };
        }
        return {
          ...state,
          friends: [action.payload],
        };
      }
      else {
        const isFriend = state.friends.find(e => e._id === action.payload._id);
        const iterable = isIterable(action.payload);
        if (iterable) {
          return { ...state };
        }
        if (isFriend) {
          const filterFriend = cloneDeep(state.friends.filter(e => e._id !== action.payload._id));
          return {
            ...state,
            friends: [...filterFriend, action.payload],
          };
        }
        return {
          ...state,
          friends: [...state.friends, action.payload],
        };
      }

    case 'ADD_DATA':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case 'LOGOUT':
      return {
        ...state,
        userData: {},
        friends: [],
      };

    default:
      break;
  }
};

export default Reducer;
