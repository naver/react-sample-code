import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTodo2 } from '../../action/todo';

class Header extends Component {

  render() {
    let input;
    const {onClick} = this.props;

    return (
      <div>
          <input ref={node => {
            input = node;
          }}/>

          <button onClick={() =>{
            onClick(input.value);
            input.value = "";
          }}>Add</button>
      </div>
    );
  }
}

let headerDispatchToProps = (dispatch) => {
    return {
        onClick(txt){
          dispatch(addTodo2(txt))
        }
    }
}
// connect는 prop으로 연결하는 부분은 container component에 사용한다.
export default connect(undefined, headerDispatchToProps)(Header);
