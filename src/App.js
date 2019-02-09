import React, { Component } from 'react';
import AppRouter from './Router.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="FuckYourSmartphoneIDontHaveTimeForThat">
          <p> The visualisations are not available on smartphone for now (or forever), please go on your laptop. </p>
        </div>
        <AppRouter />
      </div>
    );
  }
}

export default App;
