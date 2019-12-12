export const ROLE_ACTIONS = {
    INIT_DATA: 'ROLE_LOAD_ITEMS',
    CREATE_NEW: 'ROLE_CREATE_NEW',
    MODIFIED: 'ROLE_MODIFIED',
    REMOVE: 'ROLE_REMOVE',
};

const RoleReducer = (state = [], action) => {
    switch (action.type) {
        case ROLE_ACTIONS.INIT_DATA:
            return action.data;
        case ROLE_ACTIONS.CREATE_NEW:
            return [action.role, state];
        case ROLE_ACTIONS.MODIFIED:
            return state.map(t => (t.id === action.id ? action.role : t));
        case ROLE_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default:
            return state;
    }
};
export default RoleReducer;
