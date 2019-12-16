export const MASTER_ACTIONS = {
    INIT_DATA: 'LOAD_ITEMS',
    CREATE_NEW: 'CREATE_NEW',
    MODIFIED: 'MODIFIED_ITEM',
    REMOVE: 'REMOVE_ITEM',
};

const UserReducer = (state = [], action) => {
    switch (action.type) {
        case MASTER_ACTIONS.INIT_DATA:
            return action.data;
        case MASTER_ACTIONS.CREATE_NEW:
            return [action.user, state];
        case MASTER_ACTIONS.MODIFIED:
            return state.map(t => (t.id === action.id ? action.item : t));
        case MASTER_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default:
            return state;
    }
};
export default UserReducer;
