import { UserActionTypes, UserActions } from './user.actions';
import { UserState } from '.';


const initialState: UserState = {
    maskUserName: true,
    currentUser: null
};

export function reducer(state: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {

        case UserActionTypes.MaskUserName:
            return {
                ...state,
                maskUserName: action.payload
            };

        default:
            return state;
    }
}
