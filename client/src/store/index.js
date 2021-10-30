import { createStore, applyMiddleware } from "redux";

import rootReducer from '../reducer';
import thunkMiddleware from "redux-thunk";

export const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware),
);
