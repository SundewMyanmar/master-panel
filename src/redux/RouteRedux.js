export const ROUTE_ACTIONS = {
    INIT_DATA: 'ROUTE_LOAD_ITEMS',
    CREATE_NEW: 'ROUTE_CREATE_NEW',
    MODIFIED: 'ROUTE_MODIFIED',
    REMOVE: 'ROUTE_REMOVE',
}

const RouteReducer = (state = [], action) => {
    switch (action.type) {
        case ROUTE_ACTIONS.INIT_DATA:
            return action.data || [];
        case ROUTE_ACTIONS.CREATE_NEW:
            return [action.route, ...state];
        case ROUTE_ACTIONS.MODIFIED:
            return state.map(t => (t.id === action.id) ? action.route : t);
        case ROUTE_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default: return state;
    }
}
export default RouteReducer;