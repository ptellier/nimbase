// REFERENCE: https://redux.js.org/tutorials/essentials/part-1-overview-concepts
//            followed the basic structure of this tutorial

import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { userSlice } from "./state/userSlice";
import { currentProjectSlice } from './state/currentProjectSlice';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from "redux-persist";

const reducer = combineReducers({
  user: userSlice.reducer,
  currentProject: currentProjectSlice.reducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);


//export default configureStore({reducer});