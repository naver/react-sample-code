
// action type
export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'

// action creators
function addTodo(text) {
	return { type: ADD_TODO,  text};
}

export function addTodo2(text) {
  return (dispatch) => {
	return fetch("api/add.json").then(
		res => res.json().then(data => dispatch(addTodo(data.status)))
	);
  };
}


function complete({complete, id}) {
	return { type: COMPLETE_TODO,  complete, id};
}

export function complete2(data2) {
  return (dispatch) => {
	return fetch("api/add.json").then(
		res => res.json().then(data => dispatch(complete(data2)))
	);
  };
}