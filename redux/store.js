import { createStore, combineReducers, applyMiddleware } from "redux";
import affirmation from './affirmations';
import thunk from 'redux-thunk';


const reducer = combineReducers({
    affirmation
})
const store = createStore(reducer, applyMiddleware(thunk))
export default store;