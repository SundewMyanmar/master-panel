export const FILE_ACTIONS = {
    INIT_DATA : 'FILE_LOAD_ITEMS',
    CREATE_NEW : 'FILE_CREATE_NEW',
    MODIFIED : 'FILE_MODIFIED',
    REMOVE : 'FILE_REMOVE',
}

const FileReducer = (state = [], action) => {
    switch(action.type){
        case FILE_ACTIONS.INIT_DATA:
            return action.data || null;
        case FILE_ACTIONS.CREATE_NEW:
            return [action.file, ...state];
        case FILE_ACTIONS.MODIFIED:
            return state.map(t=> (t.id === action.id) ? action.file : t);
        case FILE_ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.id);
        default: return state;
    }
}
export default FileReducer;