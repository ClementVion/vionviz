import React, { Component } from 'react';

class Room extends Component {

  componentDidMount () {
    const id = this.props.match.params.id;

    const three = document.createElement('script');
    three.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.js";
    document.body.appendChild(three);

    three.addEventListener('load', () => {
      const script = document.createElement("script");
      script.src = "/js/" + id + ".js";
      document.body.appendChild(script);
    })
  }

  render() {
    const id = this.props.match.params.id;

    return (
      <div className="Room">
        <audio className="audio" id="audio" src={'/audio/' + id + '.mp3'} controls autoPlay></audio>
      </div>
    );
  }
}

export default Room;
