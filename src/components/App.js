import React from 'react';
import io from 'socket.io-client';
import { Subscribe } from 'unstated';
import Soundfont from 'soundfont-player';

import './App.css';
import Piano from './Piano/Piano';
import { getRandomName, getRandomColor } from '../tools/Random';
import KeysContainer, { keysContainer } from '../containers/Keys';
import RoomContainer, { roomContainer } from '../containers/Room';
import { getNoteForKey } from '../tools/Marker';

const nameDynamicStyle = color => ({
  textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}`
});

export default class App extends React.Component {
  state = { player: null, socket: null, modal: false };

  toggle = (note, state, emit) => {
    if (note) {
      keysContainer.toggleNote(note, state);

      const socket = this.state.socket;
      if (emit && socket) {
        socket.emit(state ? 'noteOn' : 'noteOff', note);
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
            socket.on('noteOn', note => this.toggle(note, true, false));
            socket.on('noteOff', note => this.toggle(note, false, false));
          }
        }
      );
    });
  }

  componentDidMount() {
    this.setState({ modal: true });
    roomContainer.setState({ user: getRandomName(), color: getRandomColor() });
  }

  render() {
    return (
      <div
        tabIndex={1}
        className="App"
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
      >
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
