// REFERENCE: https://redux.js.org/tutorials/essentials/part-1-overview-concepts
//            followed the basic structure of this tutorial

import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { userSlice } from "./state/userSlice";

const reducer = combineReducers({
  user: userSlice.reducer,
})

export default configureStore({reducer});