import React, { Component } from 'react';
import { connect } from 'react-redux';
import { complete, complete2 } from '../../action/todo';
// import todoAction from '../../action/index';
// const { complete, complete2 } = todoAction.todo;
import Todo from './TODO';

class TODOList extends Component {
  
  render() {
  	const {todos, onClick} = this.props;
    return (
      <ul>
    		{todos.map(todo =>
    			<Todo 
    			// 엘리먼트를 반복해서 만들때는 key속성에 unique한 값이 지정되어야 한다.
    			// 또한, key은 prop으로 사용할 수 없다.
    			// https://fb.me/react-warning-keys
    				key={todo.id}
    				onClick={onClick}
    				{...todo}
    			/>
    		)}
      </ul>
    );
  }
}


const todolistStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const todolistDispatchToProps = (dispatch) => {
    return {
        onClick(data){
          // dispatch(complete2(data))
          dispatch(complete(data))
        }
    }
}
export default connect(todolistStateToProps,todolistDispatchToProps)(TODOList);
