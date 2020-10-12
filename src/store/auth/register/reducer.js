import { REGISTER_USER, REGISTER_USER_SUCCESSFUL, REGISTER_USER_FAILED } from './actionTypes';

const initialState = {
    registrationError: null, message: null, loading: false
}

const account = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            state = {
                ...state,
                user: null,
                loading: true,
                registrationError: null
            }
            break;
        case REGISTER_USER_SUCCESSFUL:
            state = {
                ...state,
                loading: false,
                user: action.payload,
                registrationError: null
            }
            break;
        case REGISTER_USER_FAILED:
            state = {
                ...state,
                user: null,
                loading: false,
                registrationError: action.payload
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default account;