import { applyMiddleware, combineReducers, createStore } from 'redux';
import User from './userReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    user: User
})
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;