import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="Home">

        <div className="Rooms">
          <Link className="Rooms__Link" to="/r/17"> n°17 </Link>
        </div>

      </div>
    );
  }
}

export default Home;
