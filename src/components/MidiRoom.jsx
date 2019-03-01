import React, { Component } from 'react';
import data from '../data.json';

class MidiRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {overlay: true};
  }

  componentDidMount () {

    this.initMidi();

    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    import('../visualisations/' + room.script)
      .then(module => {
        this.visualisation = module;
        this.visualisation.init();
      })

    document.querySelector('body').addEventListener('click', this.handleClick);

  }

  initMidi () {
    navigator.requestMIDIAccess()
    .then((access) => {
      console.log('access', access);
      const midiDevice = Array.from(access.inputs.values())[0];
      console.log('midiDevice', midiDevice);
      this.connectToMidiDevice(midiDevice);
    })
  }

  connectToMidiDevice (midiDevice) {
    console.log('Connecting to midi device', midiDevice);
    midiDevice.onmidimessage = (m) => {
      this.visualisation.midiDataReceived(m.data)
    }
  }

  handleClick = () => {
    
    this.setState({overlay: !this.state.overlay});
    
  }

  render() {
    const slug = this.props.match.params.slug;
    const room = data.rooms.filter(r => r.slug === slug)[0];

    const overlayCn = `Room__Overlay ${this.state.overlay ? 'visible' : ''}`;

    return (
      <div className="Room">
        <div className={overlayCn}> 
          <div className="Room__OverlayContainer">
            <p className="Room__OverlayText">click anywhere to start playing with midi</p> 
            {room.credits &&
              <p className="Room__OverlayCredits"> {room.credits} </p>
            }
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount () {
    if (document.querySelector('canvas')) {
      document.body.removeChild(document.querySelector('canvas'));
    }
    document.querySelector('body').removeEventListener('click', this.handleClick);
    // this.visualisation.stop();
  }

}

export default MidiRoom;
