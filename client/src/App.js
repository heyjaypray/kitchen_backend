import React, { Component } from 'react';
import Navigation from './components/navbar';
import Jumbo from './components/jumbo';
import Photos from './components/photos';
import Blog from './components/blog';
import Welcome from './components/welcome';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
     
        <Navigation />
        <Jumbo />

       
          <Switch>
            <Route exact path="/"  component={Welcome} />
            <Route path="/photo" component={Photos} />
            <Route path="/blogs" component={Blog} />
          </Switch>
        
    
        


      </div>
      </Router>
    );
  }
}

export default App;
