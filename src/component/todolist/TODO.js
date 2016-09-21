

import React, { Component } from 'react';

class TODO extends Component {
  render() {
  	const {id, todo, complete, onClick} = this.props;
    return (
      <li id={id} 
      	onClick={() => onClick({
      		id : id, 
      		complete : !complete
      	})}
      	className={!!complete ? 'completed' : ''}
      >{todo}</li>
    );
  }
}

// class TODO extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             style: {
//                 backgroundColor: getRandomColor()
//             }
//         };
//         this.changeColor = this.changeColor.bind(this);
//     }
//     changeColor(){
//         this.setState({
//             style: {
//                 backgroundColor: getRandomColor()
//             }
//         });
//     }
//     render() {
//         const {id, todo, complete} = this.props;
//         return (
//           <li id={id} 
//             onClick={this.changeColor}
//             style={this.state.style}
//           >{todo}</li>
//         );
//     }
// }


// import React from 'react';
// const TODO  = ({id, todo, complete, onClick}) => {
//     return (
//       <li id={id} 
//       	onClick={() => onClick({
//       		id : id, 
//       		complete : !complete
//       	})}
//       	className={!!complete ? 'completed' : ''}
//       >{todo}</li>
//     )
// }

export default TODO;
