export const BOOKING_ACTIONS = {
    INIT_DATA : 'BOOKING_LOAD_ITEMS',
    CREATE_NEW : 'BOOKING_CREATE_NEW',
    MODIFIED : 'BOOKING_MODIFIED',
    REMOVE : 'BOOKING_REMOVE',
}

const BookingReducer = (state = [], action) => {
    switch(action.type){
        case BOOKING_ACTIONS.INIT_DATA:
            return action.data;
        case BOOKING_ACTIONS.CREATE_NEW:
            return [action.booking, state];
        case BOOKING_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.booking : t);
        case BOOKING_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default: return state;
    }
}
export default BookingReducer;