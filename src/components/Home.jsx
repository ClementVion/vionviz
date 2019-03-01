import React, { Component } from 'react';
import { Link } from "react-router-dom";
import data from '../data.json';

class Home extends Component {
  render() {
    return (
      <div className="Home">

        <div className="Rooms">
          {data.rooms && data.rooms.map(room => {
            if (room.isMidiRoom) {
              return (
                <Link 
                  className="Rooms__Link" 
                  to={'/mr/' + room.slug}
                  key={room.slug}
                > 
                    {room.name}
                </Link>
              )
            } else {   
              return (
                <Link 
                  className="Rooms__Link" 
                  to={'/r/' + room.slug}
                  key={room.slug}
                > 
                    {room.name} 
                </Link>
              )
            }
          })}
        </div>

      </div>
    );
  }
}

export default Home;
