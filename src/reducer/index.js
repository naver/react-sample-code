import todos from "./todos";
import { combineReducers } from "redux";

export default combineReducers({
  todos
});

// export default (state = {}, action) => {
//   return {
//      todos: todos( 
//       state.todos,
//       action
//     )
//   };
// };
