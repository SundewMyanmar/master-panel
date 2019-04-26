export const ROOM_ACTIONS = {
    INIT_DATA : 'ROOM_LOAD_ITEMS',
    CREATE_NEW : 'ROOM_CREATE_NEW',
    MODIFIED : 'ROOM_MODIFIED',
    REMOVE : 'ROOM_REMOVE',
    BY_ROLE : 'ROOM_BY_ROLE'
}

const RoomReducer = (state = [], action) => {
    switch(action.type){
        case ROOM_ACTIONS.INIT_DATA:
            return action.data;
        case ROOM_ACTIONS.CREATE_NEW:
            return [action.room, state];
        case ROOM_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.room : t);
        case ROOM_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        case ROOM_ACTIONS.BY_ROLE:
            return action.data;
        default: return state;
    }
}
export default RoomReducer;