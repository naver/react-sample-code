import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../../action/todo';

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
          dispatch(addTodo(txt))
        }
    }
}

export default connect(undefined, headerDispatchToProps)(Header);
