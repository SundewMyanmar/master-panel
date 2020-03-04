export const FORM_ACTIONS = {
    INIT: 'INIT_FORM',
    SET: 'SET_FORM_VALUE',
    CLEAR: 'CLEAR_FORM_VALUES',
};

export default function FormReducer(state = {}, action) {
    switch (action.type) {
        case FORM_ACTIONS.INIT:
            return action.payload;
        case FORM_ACTIONS.SET:
            return { ...state, ...action.payload };
        case FORM_ACTIONS.CLEAR:
            return {};
        default:
            return state;
    }
}
