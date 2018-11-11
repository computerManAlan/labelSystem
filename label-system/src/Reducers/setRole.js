import * as modalTypes from '../Constants/setRole'

const initialState = {};

export default function setRole(state = initialState, action) {
    switch (action.type) {
        case modalTypes.SETROLE: {
            return action.data
        }

        default:
            return state
    }
}
