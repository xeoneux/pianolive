import React from 'react';
import io from 'socket.io-client';
import { Subscribe } from 'unstated';
import Soundfont from 'soundfont-player';

import './App.css';
import Piano from './Piano/Piano';
import { getRandomName, getRandomColor, hexToRgb } from '../tools/Random';
import KeysContainer, { keysContainer } from '../containers/Keys';
import RoomContainer, { roomContainer } from '../containers/Room';
import { getNoteForKey } from '../tools/Marker';
import { firework } from '../tools/Canvas';

const nameDynamicStyle = color => ({
  textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}`
});

export default class App extends React.Component {
  state = { player: null, socket: null, modal: false };

  toggle = (note, state, emit, rgb) => {
    const color = rgb || roomContainer.state.rgb;
    if (note) {
      keysContainer.toggleNote(note, color, state);

      const socket = this.state.socket;
      if (emit && socket) {
        const data = {
          note,
          user: roomContainer.state.user,
          color: roomContainer.state.rgb
        };
        socket.emit(state ? 'noteOn' : 'noteOff', JSON.stringify(data));
      }

      const player = this.state.player;
      if (note.includes('s')) note = note[0] + '#';
      if (state && player) player.play(note.toUpperCase() + '4');
    }
  };

  handleKeyUp = event => {
    let note = getNoteForKey(event.key);
    this.toggle(note, false, true);
  };

  handleKeyDown = event => {
    let note = getNoteForKey(event.key);
    this.toggle(note, true, true);
  };

  componentWillMount() {
    const AC = window.AudioContext || window.webkitAudioContext;
    Soundfont.instrument(new AC(), 'acoustic_grand_piano').then(piano => {
      this.setState(
        { player: piano, socket: io('http://localhost:4000/') },
        () => {
          const socket = this.state.socket;
          if (socket) {
            socket.on('noteOn', data => {
              data = JSON.parse(data);
              this.toggle(data.note, true, false, data.color);
            });
            socket.on('noteOff', data => {
              data = JSON.parse(data);
              this.toggle(data.note, false, false, data.color);
            });
          }
        }
      );
    });
  }

  componentDidMount() {
    // firework(this.canvas);
    this.setState({ modal: true });
    const color = getRandomColor();
    roomContainer.setState({
      color,
      rgb: hexToRgb(color),
      user: getRandomName()
    });
  }

  render() {
    return (
      <div
        tabIndex={1}
        className="App"
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
      >
        <canvas className="Canvas" ref={el => (this.canvas = el)} />
        <Subscribe to={[KeysContainer, RoomContainer]}>
          {(keys, room) => (
            <Piano keys={keys} room={room} toggle={this.toggle} />
          )}
        </Subscribe>
        <Subscribe to={[RoomContainer]}>
          {room => (
            <form>
              <input
                className="Name"
                style={nameDynamicStyle(room.state.color)}
                value={room.state.user}
                onChange={event => {
                  roomContainer.setState({ user: event.target.value });
                }}
              />
            </form>
          )}
        </Subscribe>
      </div>
    );
  }
}
