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

const headerDispatchToProps = (dispatch) => {
    return {
        onClick(txt){
          dispatch(addTodo2(txt))
        }
    }
}

export default connect(undefined, headerDispatchToProps)(Header);
