import React, { Component } from 'react';

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
    this.removeScripts();
  }

  appendScripts() {
    const id = this.props.match.params.id;

    this.three = document.createElement('script');
    this.three.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.js";
    document.body.appendChild(this.three);

    this.three.addEventListener('load', () => {
      this.script = document.createElement("script");
      this.script.src = "/js/" + id + ".js";
      document.body.appendChild(this.script);
    })
  }

  removeScripts() {
    document.body.removeChild(this.three);
    document.body.removeChild(this.script);
    document.body.removeChild(document.querySelector('canvas'));
  }

  listenClickEvent() {
    document.querySelector('body').addEventListener('click', () => {
      this.setState({overlay: !this.state.overlay});
    })
  }

  render() {
    const id = this.props.match.params.id;

    const overlayCn = `Room__Overlay ${this.state.overlay ? 'visible' : ''}`;

    return (
      <div className="Room">
        <div className={overlayCn}> <p>Click anywhere to play / pause</p> </div>
        <audio className="audio" id="audio" src={'/audio/' + id + '.mp3'} controls></audio>
      </div>
    );
  }
}

export default Room;
