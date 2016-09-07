// middleware 설정
// 초기값 설정
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export default function configureStore(reducer, initialState = {}) {

  const storeEnhancers = compose(
    applyMiddleware(thunk)
  );

  return createStore(reducer, initialState, storeEnhancers);
}