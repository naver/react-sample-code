

import React, { Component } from 'react';

// class TODO extends Component {
//   render() {
//   	const {id, todo, complete, onClick} = this.props;
//     return (
//       <li id={id} 
//       	onClick={() => onClick({
//       		id : id, 
//       		complete : !complete
//       	})}
//       	className={!!complete ? 'completed' : ''}
//       >{todo}</li>
//     );
//   }
// }

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


class TODO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                backgroundColor: getRandomColor(),
                "userSelect": "none"
            }
        };
        this.changeColor = this.changeColor.bind(this);
        // console.log(window.iii);
        // if(window.iii == undefined){
        //   window.setTimeout(_ => {
        //   console.log("timmer");
        //     this.changeColor();
        //   },2000);  
        //   window.iii = 1;
        // }else{
        //   window.iii++;
        // }
        
    }
    changeColor(){
        console.trace("test");
        // debugger;
        this.setState({
            style: {
                backgroundColor: getRandomColor()
            }
        });
    }
    render() {
        const {id, todo, complete} = this.props;
        return (
          <li id={id} 
            onClick={this.changeColor}
            style={this.state.style}
          >{todo}</li>
        );
    }
}



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
