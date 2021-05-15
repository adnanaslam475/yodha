import { USERS, DEVICE_ID } from "./userActions"


const initialstate = {
    users: null,
    device_id: ''
}
export default reducer = (state = initialstate, action) => {
    switch (action.type) {
        case USERS:
            return {
                ...state,
                users: action.payload
            }
        case DEVICE_ID:
            return {
                ...state,
                device_id: action.device_id
            }
        default:
            return state
    }
}