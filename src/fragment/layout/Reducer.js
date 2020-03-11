export const ACTIONS = {
    LOAD: 'LOAD_INIT_MENU',
    MODIFIED_OPEN_IDS: 'OPEN_MENU_FOLDER',
    SIZE_CHNGE: 'CHANGE_DRAWER_SIZE',
};

const modifiedOpenIds = (state, id) => {
    const openIds = state.openIds;
    const idx = openIds.findIndex(x => x === id);
    if (idx < 0) {
        return { ...state, openIds: [...openIds, id] };
    }

    return { ...state, openIds: openIds.filter(x => x !== id) };
};

const modifiedHideMenu = state => {
    const newHideMenu = !state.hideMenu;
    return { ...state, openIds: [], hideMenu: newHideMenu };
};

const Reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOAD:
            return action.payload;
        case ACTIONS.MODIFIED_OPEN_IDS:
            return modifiedOpenIds(state, action.id);
        case ACTIONS.SIZE_CHNGE:
            return modifiedHideMenu(state);
        default:
            return state;
    }
};

export default Reducer;
