import React, { Component } from 'react';
import Navigation from './components/navbar';
import Jumbo from './components/jumbo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Jumbo />
      </div>
    );
  }
}

export default App;
