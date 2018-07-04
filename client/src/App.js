import React, { Component } from 'react';
import Navigation from './components/navbar';
import Jumbo from './components/jumbo';
import Photos from './components/photos';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Jumbo />
        <Photos />
      </div>
    );
  }
}

export default App;
