import * as Action from './actions'




const initialState = {
    affirmations: [],
}

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case Action.GET_AFFIRMATIONS:
            return {
                ...state,
            }
        case Action.PUSH_AFFIRMATIONS:
            const v = [...state.affirmations]
            // console.log('this------>', state.affirmations.filter(v => v.name))
            return {
                ...state,
                affirmations: [...v, action.data]
            }
        case Action.SAVE_SETTINGS:
            return {
                ...state,
            }
        default:
            return state;
    }
}