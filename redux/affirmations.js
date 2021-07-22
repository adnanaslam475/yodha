import * as Action from './actions'
const initialState = {
    affirmations: [],
}

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case Action.GET_AFFIRMATIONS:
            // console.log('in reducer', action.data)
            return {
                ...state,
            }
        case Action.PUSH_AFFIRMATIONS:
            console.log('in reducer------.>', action.data)
            return {
                ...state,
                affirmations: action.data
            }
        case Action.SAVE_SETTINGS:
            return {
                ...state,
            }

        default:
            return state;
    }
}