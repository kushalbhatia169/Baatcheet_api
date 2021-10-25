const {
    useContext,
    createContext,
    useReducer,
    useState,
    useEffect
  } = require("react");
  
  const context = createContext();
  
  const { Provider, Consumer } = context;
  
  const reducer1 = (state, action) => {
    switch (action.type) {
      case "INSERT_X":
        return { ...state, x: action.data };
      case "DELETE_X":
        return { ...state, x: null };
      default:
        return { ...state };
    }
  };
  
  const reducer2 = (state, action) => {
    switch (action.type) {
      case "INSERT_Y":
        return { ...state, y: action.data };
      case "DELETE_Y":
        return { ...state, y: null };
      default:
        return { ...state };
    }
  };
  
  const zip = (list1, list2) => {
    var obj = {};
    for (let i = 0; i < list1.length; i++) {
      obj[list1[i]] = list2[i];
    }
    return obj;
  };
  
  const combineReducers = (reducers) => {
    return (state, action) => {
      const _reducers = Object.keys(reducers);
      const _state = Object.keys(reducers).map((reducer) => {
        return reducers[reducer](state[reducer], action);
      });
  
      return zip(_reducers, _state);
    };
  };
  
  const Store = ({ children }) => {
    const rootReducer = combineReducers({ reducer1, reducer2 });
  
    const [state, dispatch] = useReducer(rootReducer, {});
  
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
  };
  
  export const connect = (mapStateTopProps, mapDispatchToProps) => {
    return (Component) => (props) => {
      return (
        <Consumer>
          {({ state, dispatch }) => {
            const dispatchProps = mapDispatchToProps(dispatch);
            const stateProps = mapStateTopProps(state);
            return <Component {...props} {...stateProps} {...dispatchProps} />;
          }}
        </Consumer>
      );
    };
  };
  
  export const useSelector = (fn) => {
    const { state } = useContext(context);
    return fn(state);
  };
  
  export const useDispatch = (fn) => {
    const { dispatch } = useContext(context);
  
    return dispatch;
  };
  
  export default Store;