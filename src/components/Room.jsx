import React, { Component } from 'react';
import data from '../data.json';

class Room extends Component {

  constructor(props) {
    super(props);

    this.state = {overlay: true};
  }

  componentDidMount () {
    this.appendScripts();
    this.listenClickEvent();
  }

  componentWillUnmount () {
    document.body.removeChild(this.three);
    document.body.removeChild(this.script);
    document.body.removeChild(document.querySelector('canvas'));
  }

  appendScripts() {
    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    this.three = document.createElement('script');
    this.three.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.js";
    document.body.appendChild(this.three);

    this.three.addEventListener('load', () => {
      this.script = document.createElement("script");
      this.script.src = "/js/" + room.script;
      document.body.appendChild(this.script);
    })
  }

  listenClickEvent() {
    document.querySelector('body').addEventListener('click', () => {
      this.setState({overlay: !this.state.overlay});
    })
  }

  render() {
    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    const overlayCn = `Room__Overlay ${this.state.overlay ? 'visible' : ''}`;

    return (
      <div className="Room">
        <div className={overlayCn}> <p>Click anywhere to play / pause</p> </div>
        <audio className="audio" id="audio" src={'/audio/' + room.audio} controls></audio>
      </div>
    );
  }
}

export default Room;
