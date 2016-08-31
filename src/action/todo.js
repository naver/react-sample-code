
// action type
export const ADD_TODO = 'ADD_TODO'


// action creators
export function addTodo(txt) {
  return { type: ADD_TODO,  txt};
}
