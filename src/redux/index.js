import { createStore, combineReducers } from 'redux';

import MasterReducer from './MasterRedux';
import FormReducer from './FormRedux';

const rootReducer = combineReducers({
    master: MasterReducer,
    form: FormReducer,
});

const store = createStore(rootReducer);

export default store;
