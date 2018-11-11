import * as modalTypes from '../Constants/authority'

const initialState = {};

export default function showModal(state = initialState, action) {
    switch (action.type) {
        case modalTypes.COMMON_ROLE: {
            return action.data
        }

        case modalTypes.INSPECT_ROLE: {
            return {}
        }

        default:
            return state
    }
}
