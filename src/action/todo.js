
// action type
export const ADD_TODO = 'ADD_TODO'


// action creators
export function addTodo(text) {
  return { type: ADD_TODO,  text};
}
