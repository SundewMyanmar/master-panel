export const ROOMPLAN_ACTIONS = {
    INIT_DATA : 'ROOMPLAN_LOAD_ITEMS',
    CREATE_NEW : 'ROOMPLAN_CREATE_NEW',
    MODIFIED : 'ROOMPLAN_MODIFIED',
    REMOVE : 'ROOMPLAN_REMOVE',
}

const RoomPlanReducer = (state = [], action) => {
    switch(action.type){
        case ROOMPLAN_ACTIONS.INIT_DATA:
            return action.data;
        case ROOMPLAN_ACTIONS.CREATE_NEW:
            return [action.roomplan, state];
        case ROOMPLAN_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.roomplan : t);
        case ROOMPLAN_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default: return state;
    }
}
export default RoomPlanReducer;