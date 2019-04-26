export const FLOOR_ACTIONS = {
    INIT_DATA : 'FLOOR_LOAD_ITEMS',
    CREATE_NEW : 'FLOOR_CREATE_NEW',
    MODIFIED : 'FLOOR_MODIFIED',
    REMOVE : 'FLOOR_REMOVE',
    BY_ROLE : 'FLOOR_BY_ROLE'
}

const FloorReducer = (state = [], action) => {
    switch(action.type){
        case FLOOR_ACTIONS.INIT_DATA:
            return action.data;
        case FLOOR_ACTIONS.CREATE_NEW:
            return [action.floor, state];
        case FLOOR_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.floor : t);
        case FLOOR_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        case FLOOR_ACTIONS.BY_ROLE:
            return action.data;
        default: return state;
    }
}
export default FloorReducer;