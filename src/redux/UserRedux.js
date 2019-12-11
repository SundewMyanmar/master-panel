export const USER_ACTIONS = {
    INIT_DATA: 'USER_LOAD_ITEMS',
    CREATE_NEW: 'USER_CREATE_NEW',
    MODIFIED: 'USER_MODIFIED',
    REMOVE: 'USER_REMOVE',
    BY_ROLE: 'USER_BY_ROLE'
}

const UserReducer = (state = [], action) => {
    switch (action.type) {
        case USER_ACTIONS.INIT_DATA:
            return action.data;
        case USER_ACTIONS.CREATE_NEW:
            return [action.user, state];
        case USER_ACTIONS.MODIFIED:
            return state.map(t => (t.id === action.id) ? action.user : t);
        case USER_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        case USER_ACTIONS.BY_ROLE:
            return action.data;
        default: return state;
    }
}
export default UserReducer;