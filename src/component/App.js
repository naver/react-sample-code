import React, { Component } from 'react';

import Header from './header/Header';
import TODOList from './todolist/TODOList';
import Footer from './footer/Footer';

class App extends Component {
  render() {
    return (
        <div>
          <Header/>
          <TODOList/>
          <Footer/>
        </div>
    );
  }
}

export default App;
