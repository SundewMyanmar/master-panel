export const MENU_ACTIONS = {
    INIT_DATA : 'MENU_LOAD_ITEMS',
    CREATE_NEW : 'MENU_CREATE_NEW',
    MODIFIED : 'MENU_MODIFIED',
    REMOVE : 'MENU_REMOVE',
    BY_ROLE : 'MENU_BY_ROLE',
}

const MenuReducer = (state = [], action) => {
    switch(action.type){
        case MENU_ACTIONS.INIT_DATA:
            return action.data;
        case MENU_ACTIONS.CREATE_NEW:
            return [action.menu, state];
        case MENU_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.menu : t);
        case MENU_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        case MENU_ACTIONS.BY_ROLE:
            return action.data;
        default: return state;
    }
}
export default MenuReducer;