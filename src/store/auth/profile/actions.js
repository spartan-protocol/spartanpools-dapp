import { PROFILE_ERROR,PROFILE_SUCCESS,EDIT_PROFILE } from './actionTypes';

export const editProfile = (user) => {
    console.log(user);
    return {
        type: EDIT_PROFILE,
        payload: { user }
    }
}

export const profileSuccess = (msg) => {
    return {
        type: PROFILE_SUCCESS,
        payload: msg
    }
}

export const profileError = (error) => {
    return {
        type: PROFILE_ERROR,
        payload: error
    }
}
