import * as actionTypes from '../Constants/setRole';

export function setRole(data) {
    // console.log('dispatch login data:', data);
    return {
        type: actionTypes.SETROLE,
        data
    }
}
