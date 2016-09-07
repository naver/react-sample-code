
// action type
export const ADD_TODO = 'ADD_TODO'


// action creators
export function addTodo(text) {
	return { type: ADD_TODO,  text};
}

export function addTodo2(text) {
  return function (dispatch) {
	return fetch("api/add.json").then(
		res => res.json().then( data => dispatch(addTodo(data.status)))
	);
  };
}
