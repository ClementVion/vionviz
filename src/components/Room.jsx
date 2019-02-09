import React, { Component } from 'react';
import data from '../data.json';

class Room extends Component {

  constructor(props) {
    super(props);

    this.state = {overlay: true};
    this.audio = React.createRef();
  }

  componentDidMount () {

    this.initAudio();

    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    import('../visualisations/' + room.script)
      .then(module => {
        this.visualisation = module;
        this.visualisation.init(this.analyser, this.frequencyData);
      })

      document.querySelector('body').addEventListener('click', this.handleClick);

  }

  initAudio () {
    this.ctx = new AudioContext();
    this.audioSrc = this.ctx.createMediaElementSource(this.audio.current);
    this.analyser = this.ctx.createAnalyser();
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.ctx.destination);
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  } 

  handleClick = () => {
    
    this.setState({overlay: !this.state.overlay});
    
    if (this.audio.current.paused) {
      this.audio.current.play();
      this.ctx.resume();
    } else {
      this.audio.current.pause();
    }
    
  }

  render() {
    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    const overlayCn = `Room__Overlay ${this.state.overlay ? 'visible' : ''}`;

    return (
      <div className="Room">
        <div className={overlayCn}> <p>Click anywhere to play / pause</p> </div>
        <audio ref={this.audio} className="audio" id="audio" src={'/audio/' + room.audio} controls></audio>
      </div>
    );
  }

  componentWillUnmount () {
    if (document.querySelector('canvas')) {
      document.body.removeChild(document.querySelector('canvas'));
    }
    document.querySelector('body').removeEventListener('click', this.handleClick);
    this.visualisation.stop();
  }

}

export default Room;
