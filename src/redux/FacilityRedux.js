export const FACILITY_ACTIONS = {
    INIT_DATA : 'FACILITY_LOAD_ITEMS',
    CREATE_NEW : 'FACILITY_CREATE_NEW',
    MODIFIED : 'FACILITY_MODIFIED',
    REMOVE : 'FACILITY_REMOVE',
}

const FacilityReducer = (state = [], action) => {
    switch(action.type){
        case FACILITY_ACTIONS.INIT_DATA:
            return action.data;
        case FACILITY_ACTIONS.CREATE_NEW:
            return [action.facility, state];
        case FACILITY_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.facility : t);
        case FACILITY_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default: return state;
    }
}
export default FacilityReducer;